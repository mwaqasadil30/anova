/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import { lighten } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import { usePagination as useMuiPagination } from '@material-ui/lab/Pagination';
import {
  AssetSummaryGroupingOptions,
  DataChannelType,
  EvolveAssetSummaryDto,
  EvolveGetAssetSummaryRecordsByOptionsResponse,
  UserPermissionType,
} from 'api/admin/api';
import routes from 'apps/ops/routes';
import { ReactComponent as ChevronIcon } from 'assets/icons/single-chevron.svg';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import FormatDateTime from 'components/FormatDateTime';
import FullPageLoadingOverlay from 'components/FullPageLoadingOverlay';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import MessageBlock from 'components/MessageBlock';
import ScrollbarSync from 'components/ScrollbarSync';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableContainer from 'components/tables/components/TableContainer';
import TableGroupedRow from 'components/tables/components/TableGroupedRow';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import round from 'lodash/round';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath, useHistory } from 'react-router';
import {
  Cell,
  Cell as ReactTableCell,
  ColumnInstance,
  useBlockLayout,
  useExpanded,
  useGroupBy,
  useSortBy,
  useTable,
} from 'react-table';
import useDebounce from 'react-use/lib/useDebounce';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';
import { FixedSizeList } from 'react-window';
import {
  selectActiveDomain,
  selectDefaultEventStateDescription,
  selectIsActiveDomainApciEnabled,
} from 'redux-app/modules/app/selectors';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import styled, { css } from 'styled-components';
import { UnitDisplayType } from 'types';
import { formatBooleanToYesOrNoString } from 'utils/format/boolean';
import { isNumber } from 'utils/format/numbers';
import {
  buildDataChannelTypeTextMapping,
  buildImportanceLevelTextMapping,
} from 'utils/i18n/enum-to-text';
import { getRowColour, getScrollbarWidth } from 'utils/ui/helpers';
import { enumToAccessorMap } from '../../helpers';
import { TableDataForDownload, UpdateRouteStateParams } from '../../types';
import ImportanceCell from '../ImportanceCell';
import NameCell from '../NameCell';
import TableActionsAndPagination from '../TableActionsAndPagination';
import {
  AssetSummaryColumnId,
  columnIdToApiProperty,
  columnIdToAriaLabel,
  getColumnWidth,
  getValidUnitDisplayType,
} from './helpers';

const ROW_HEIGHT = 35;

// Used inside customer name cell. BoldPrimaryText causes unwanted side-effects
const BoldTextBlock = styled.div`
  color: ${(props) => props.theme.palette.text.primary};
  font-weight: 500;
`;

const StyledTableContainer = styled(TableContainer)`
  overflow-x: auto;
  overflow-y: hidden;
`;

const StyledText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

const StyledModificationText = styled(Typography)`
  color: ${(props) => props.theme.palette.text.secondary};
  && {
    font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
    font-weight: 500;
    line-height: 19px;
  }
`;
const StyledChevronIcon = styled(ChevronIcon)`
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
`;

// Hide one of the scrollbars since we have two of them set up:
// 1. One of them is the default scrollbar (which appears all the way on the
//    right side of wide tables). This is the one that is hidden by this styled
//    component.
// 2. The other is the sync scrollbar added to make sure it's always visible no
//    matter the width of the table (the user doesn't need to scroll all the
//    way to the right to see it)
const StyledFixedSizeList = styled(FixedSizeList)`
  /* Chrome + Safari + Edge Chromium */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Firefox */
  scrollbar-width: none;
`;

const StyledTableRow = styled(
  ({ rowOriginalData, isClickable, theme, highlight, ...props }) => (
    <TableRow {...props} />
  )
)`
  height: ${ROW_HEIGHT}px;
  cursor: ${(props) => (props.isClickable ? 'pointer' : 'inherit')};
  ${(props) =>
    props.highlight &&
    `background-color: ${
      props.theme.palette.type === 'light'
        ? lighten(props.theme.custom.domainColor, 0.83)
        : props.theme.custom.palette.table.rowHoverColor
    };`}

  ${(props) => {
    const { rowOriginalData, theme } = props;
    const {
      eventInventoryStatusId: eventInventoryStatus,
      [AssetSummaryColumnId.EventImportanceLevel]: eventImportanceLevel,
      hasMissingData,
    } = rowOriginalData;
    const themeType = theme?.palette?.type;
    const rowColour = getRowColour({
      eventInventoryStatus,
      eventImportanceLevel,
      hasMissingData,
      themeType,
    });
    return rowColour
      ? `> td, > td *,
         > .MuiTableCell-body, > .MuiTableCell-body *
       {color: ${rowColour}; font-weight: bold;}
       `
      : '';
  }}
`;

const StyledTableGroupedRow = styled(TableGroupedRow)<{
  $highlight: boolean;
}>`
  ${(props) =>
    props.$highlight &&
    `background: ${
      props.theme.palette.type === 'light'
        ? lighten(props.theme.custom.domainColor, 0.83)
        : props.theme.custom.palette.table.rowHoverColor
    };`}
`;

const StyledTableSortLabel = styled(TableSortLabel)`
  width: 100%;
`;

const sharedTextOverflowStyles = css`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const OverflowText = styled.span`
  ${sharedTextOverflowStyles}
`;

const StyledTableHeadCell = styled(({ columnId, ...props }) => (
  <TableHeadCell {...props} />
))`
  ${sharedTextOverflowStyles}
  padding: 4px 8px;
  line-height: 24px;
`;

const StyledTableCell = styled(TableCell)`
  ${sharedTextOverflowStyles}
  padding: 4px 8px;
  font-size: ${(props) => props.theme.custom.fontSize?.tableCells};
  line-height: ${(props) => props.theme.custom.fontSize?.uniqueLineHeight};
`;

// map sorting ids from table to api request
const formatSortIdToTableId = (value: any) => {
  return value || AssetSummaryColumnId.AssetTitle;
};

// basically the backwards version of `formatSortIdToTableId`
// Handles cases when favourites may have old filter settings and adjusts them
// to be the updated version
const formatSortIdToApiId = (value: any) => {
  switch (value) {
    case 'levelEventSortOrderIndex':
      return AssetSummaryColumnId.InventoryState;
    case 'readingValue':
      return AssetSummaryColumnId.Reading;
    case 'eventImportanceLevelReverse':
      return AssetSummaryColumnId.EventImportanceLevel;
    case 'ftpId1':
      return AssetSummaryColumnId.FtpId;
    case 'readingTime':
      return AssetSummaryColumnId.ReadingTime;
    case 'eventStatus':
      return AssetSummaryColumnId.Status;
    case 'StreetAddress':
      return AssetSummaryColumnId.StreetAddress;
    case 'AssetTitle':
      return AssetSummaryColumnId.AssetTitle;
    default:
      return value || AssetSummaryColumnId.AssetTitle;
  }
};

const recordsDefault: EvolveAssetSummaryDto[] = [];

interface FilterFormProps {
  groupByColumn: AssetSummaryGroupingOptions;
}

interface Props extends FilterFormProps {
  lastRefreshDate?: Date;
  isLoadingInitial?: boolean;
  isFetching?: boolean;
  responseError?: any | null;
  apiResponse?: EvolveGetAssetSummaryRecordsByOptionsResponse | null;
  allDataApiResponse?: EvolveGetAssetSummaryRecordsByOptionsResponse | null;
  pageCount?: number;
  totalRows: number;
  pageSize: number;
  pageNumber: number;
  sortByColumnId?: string | null;
  sortByIsDescending?: boolean | null;
  unitDisplayType: UnitDisplayType;
  selectedAssetId?: string;
  selectedDataChannelId?: string;
  setPageNumber: (pageNumber: number) => void;
  setSortColumnId: (columnId: string) => void;
  setIsSortDescending: (isDescending: boolean) => void;
  updateRouteState: (ids: UpdateRouteStateParams) => void;
  setTableStateForDownload: (tableData: TableDataForDownload) => void;
}

const AssetSummaryTable = ({
  isLoadingInitial,
  isFetching,
  responseError,
  apiResponse,
  allDataApiResponse,
  pageNumber,
  pageSize,
  pageCount,
  totalRows,
  groupByColumn,
  sortByColumnId,
  sortByIsDescending,
  unitDisplayType,
  selectedAssetId,
  selectedDataChannelId,
  setPageNumber,
  setSortColumnId,
  setIsSortDescending,
  updateRouteState,
  setTableStateForDownload,
}: Props) => {
  const { t } = useTranslation();
  const customerNameHeaderText = t('ui.common.customername', 'Customer Name');
  const assetTitleHeaderText = t('ui.datachannel.assettitle', 'Asset Title');
  const history = useHistory();

  const isAirProductsEnabledDomain = useSelector(
    selectIsActiveDomainApciEnabled
  );

  // #region Sort by warning dialog/modal
  const [isSortByWarningDialogOpen, setIsSortByWarningDialogOpen] = useState(
    false
  );
  const openSortByWarningDialog = () => {
    setIsSortByWarningDialogOpen(true);
  };
  const closeSortByWarningDialog = () => {
    setIsSortByWarningDialogOpen(false);
  };
  // #endregion Sort by warning dialog/modal

  const hasPermission = useSelector(selectHasPermission);
  const canViewAssetDetails = hasPermission(
    UserPermissionType.ViewTabAssetSummary
  );
  const isSortByDisabled = groupByColumn !== AssetSummaryGroupingOptions.None;
  const groupByColumnAccessor = enumToAccessorMap[groupByColumn];

  const importanceLevelTextMapping = buildImportanceLevelTextMapping(t);
  const dataChannelTypeTextMapping = buildDataChannelTypeTextMapping(t);
  const records = apiResponse?.records || recordsDefault;
  const allRecords = allDataApiResponse?.records || recordsDefault;

  const activeDomain = useSelector(selectActiveDomain);
  const defaultEventStateDescription = useSelector(
    selectDefaultEventStateDescription
  );

  const domainAssetTemplates =
    activeDomain?.assetSummaryTemplateFields?.field || [];

  const expandedRows = React.useMemo(
    () =>
      records.reduce((prev, current) => {
        prev[
          // @ts-ignore
          `${groupByColumnAccessor}:${current[groupByColumnAccessor]}`
        ] = true;
        return prev;
      }, {} as Record<string, boolean>),
    [records, groupByColumnAccessor]
  );

  const expandedRowsForAllRecords = React.useMemo(
    () =>
      allRecords.reduce((prev, current) => {
        prev[
          // @ts-ignore
          `${groupByColumnAccessor}:${current[groupByColumnAccessor]}`
        ] = true;
        return prev;
      }, {} as Record<string, boolean>),
    [allRecords, groupByColumnAccessor]
  );

  // todo update frontend to backend map
  // map -> values that come in from the domain asset template api
  // id -> values that need to be returned to the api for sorting and etc.
  const tableColumnsWithoutWidth = [
    {
      id: 'AlarmLevel',
      apiProperty: 'AlarmLevels',
      Header: t('ui.assetSummary.alarmLevel', 'Alarm Level'),
      // @ts-ignore
      accessor: (row: EvolveAssetSummaryDto) => {
        const unitType = getValidUnitDisplayType({
          unitDisplayType,
          dataChannelType: row.dataChannelType,
          hasValidDisplayValue: !!row.displayAlarmLevels,
        });
        switch (unitType) {
          case UnitDisplayType.Scaled:
            return row.scaledAlarmLevels;
          case UnitDisplayType.Display:
            return row.displayAlarmLevels;
          case UnitDisplayType.PercentFull:
            return row.percentFullAlarmLevels;
          default:
            return '';
        }
      },
      disableSortBy: true,
    },
    {
      id: AssetSummaryColumnId.AssetDescription,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.AssetDescription],
      Header: t('ui.datachannel.assetdescription', 'Asset Description'),
      accessor: 'assetDescription',
      Cell: (props: ReactTableCell<EvolveAssetSummaryDto>) => (
        <NameCell
          {...props}
          onClick={(assetId) => updateRouteState({ assetId })}
          isRegularCell
        />
      ),
    },
    {
      id: AssetSummaryColumnId.AssetTitle,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.AssetTitle],
      Header: assetTitleHeaderText,
      accessor: 'assetTitle',
      Cell: (props: ReactTableCell<EvolveAssetSummaryDto>) => (
        <NameCell
          {...props}
          onClick={(assetId) => updateRouteState({ assetId })}
        />
      ),
    },
    {
      id: AssetSummaryColumnId.AssetType,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.AssetType],
      Header: t('ui.asset.assettype', 'Asset Type'),
      accessor: (row: EvolveAssetSummaryDto) => {
        if (row.assetType) {
          return row.assetType;
        }
        return '';
      },
    },
    {
      id: AssetSummaryColumnId.ChannelNumber,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.ChannelNumber],
      Header: t('ui.assetgroup.ChannelNumber', 'Channel Number'),
      accessor: 'channelNumber',
    },
    {
      id: AssetSummaryColumnId.City,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.City],
      Header: t('ui.common.city', 'City'),
      accessor: 'city',
    },
    {
      id: AssetSummaryColumnId.Country,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.Country],
      Header: t('ui.common.country', 'Country'),
      accessor: 'country',
    },
    {
      id: AssetSummaryColumnId.CustomerName,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.CustomerName],
      Header: customerNameHeaderText,
      accessor: 'customerName',
    },
    {
      id: AssetSummaryColumnId.DataAge,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.DataAge],
      Header: t('ui.common.dataAge', 'Data Age'),
      // @ts-ignore
      accessor: (row: EvolveAssetSummaryDto) => {
        if (row.readingTime) {
          const start = moment(new Date());
          const end = moment(row.readingTime as any);
          // TODO: should this include 'day(s)' by the number
          return Math.round(moment.duration(start.diff(end)).asHours() / 24);
        }
        return '';
      },
    },

    {
      id: AssetSummaryColumnId.DataChannelDescription,
      apiProperty:
        columnIdToApiProperty[AssetSummaryColumnId.DataChannelDescription],
      Header: t('ui.common.datachanneldescription', 'Data Channel Description'),
      accessor: 'dataChannelDescription',
    },
    {
      id: AssetSummaryColumnId.DataChannelTypeColumn,
      apiProperty:
        columnIdToApiProperty[AssetSummaryColumnId.DataChannelTypeColumn],
      Header: t('ui.datachannel.datachanneltype', 'Data Channel Type'),
      accessor: (row: EvolveAssetSummaryDto) => {
        if (row.dataChannelType) {
          return dataChannelTypeTextMapping[row.dataChannelType];
        }
        return '';
      },
    },
    {
      id: 'deliverable',
      apiProperty: 'Deliverable',
      Header: t('ui.assetSummary.deliverable', 'Deliverable'),
      accessor: (row: EvolveAssetSummaryDto) => {
        const unitType = getValidUnitDisplayType({
          unitDisplayType,
          dataChannelType: row.dataChannelType,
          hasValidDisplayValue:
            isNumber(row.displayDeliverable) && !!row.displayUnits,
        });
        switch (unitType) {
          case UnitDisplayType.Scaled:
            return isNumber(row.scaledDeliverable) && row.scaledUnits
              ? `${row.scaledDeliverable} ${row.scaledUnits}`
              : '';
          case UnitDisplayType.Display:
            return isNumber(row.displayDeliverable) && row.displayUnits
              ? `${row.displayDeliverable} ${row.displayUnits}`
              : '';
          case UnitDisplayType.PercentFull:
            return isNumber(row.percentFullDeliverable)
              ? `${row.percentFullDeliverable} %`
              : '';
          default:
            return '';
        }
      },
      disableSortBy: true,
    },
    {
      id: AssetSummaryColumnId.DomainName,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.DomainName],
      Header: t('ui.common.domainName', 'Domain Name'),
      accessor: 'domainName',
    },
    {
      id: AssetSummaryColumnId.ForecastEstimate,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.ForecastEstimate],
      Header: t('ui.datachannel.forecastEstimate', 'Forecast Estimate'),
      accessor: 'forecastEstimate',
      disableSortBy: true,
    },
    {
      id: AssetSummaryColumnId.FtpDomain,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.FtpDomain],
      Header: t('ui.datachannel.ftpdomain', 'FTP Domain'),
      accessor: 'ftpDomain',
    },
    {
      id: AssetSummaryColumnId.FtpEnabled,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.FtpEnabled],
      Header: t('ui.common.FTPEnabled', 'FTP Enabled'),
      accessor: (row: EvolveAssetSummaryDto) => {
        if (typeof row.ftpEnabled === 'boolean') {
          return formatBooleanToYesOrNoString(row?.ftpEnabled, t);
        }
        return '';
      },
    },
    {
      id: AssetSummaryColumnId.FtpId,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.FtpId],
      Header: t('ui.ftpreadings.ftpid', 'FTP ID'),
      accessor: 'ftpId',
    },

    {
      id: AssetSummaryColumnId.EventImportanceLevel,
      apiProperty:
        columnIdToApiProperty[AssetSummaryColumnId.EventImportanceLevel],
      Header: t('ui.events.importance', 'Importance'),
      accessor: (row: EvolveAssetSummaryDto) => {
        if (isNumber(row.eventImportanceLevel)) {
          return importanceLevelTextMapping[row.eventImportanceLevel!];
        }
        return '';
      },
      Cell: ImportanceCell,
    },
    {
      id: AssetSummaryColumnId.InstalledTechName,
      apiProperty:
        columnIdToApiProperty[AssetSummaryColumnId.InstalledTechName],
      Header: t('ui.asset.technician', 'Technician'),
      accessor: 'installedTechName',
    },
    {
      id: AssetSummaryColumnId.InventoryState,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.InventoryState],
      Header: t('ui.common.inventoryState', 'Inventory State'),
      accessor: (row: EvolveAssetSummaryDto) => {
        if (
          row.dataChannelType !== DataChannelType.Level &&
          row.dataChannelType !== DataChannelType.TotalizedLevel
        ) {
          return '';
        }
        if (!row.inventoryState) {
          return defaultEventStateDescription || '';
        }
        return row.inventoryState || defaultEventStateDescription;
      },
    },
    {
      id: AssetSummaryColumnId.PercentFull,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.PercentFull],
      Header: t('ui.assetsummary.percentfull', '%Full'),
      accessor: (row: EvolveAssetSummaryDto) => {
        if (isNumber(row.percentFull)) {
          return `${round(Number(row.percentFull), 1)} %`;
        }
        return 'N/A';
      },
    },
    {
      id: AssetSummaryColumnId.ProductDescription,
      apiProperty:
        columnIdToApiProperty[AssetSummaryColumnId.ProductDescription],
      Header: t('ui.common.product', 'Product'),
      accessor: 'productDescription',
    },
    {
      id: AssetSummaryColumnId.Reading,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.Reading],
      Header: t('ui.common.reading', 'Reading'),
      accessor: (row: EvolveAssetSummaryDto) => {
        // if data channel Gps or DigitalInput
        // reading is in the reading column
        // use the enum from the dto
        switch (row.dataChannelType) {
          case DataChannelType.Gps:
          case DataChannelType.DigitalInput:
            return row.reading;
          default:
            break;
        }

        const unitType = getValidUnitDisplayType({
          unitDisplayType,
          dataChannelType: row.dataChannelType,
          hasValidDisplayValue:
            isNumber(row.displayReading) && !!row.displayUnits,
        });
        switch (unitType) {
          case UnitDisplayType.Scaled:
            return isNumber(row.scaledReading) && row.scaledUnits
              ? `${row.scaledReading} ${row.scaledUnits}`
              : '';
          case UnitDisplayType.Display:
            return isNumber(row.displayReading) && row.displayUnits
              ? `${row.displayReading} ${row.displayUnits}`
              : '';
          case UnitDisplayType.PercentFull:
            return isNumber(row.percentFull) ? `${row.percentFull} %` : '';
          default:
            return '';
        }
      },
    },
    {
      id: AssetSummaryColumnId.ReadingTime,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.ReadingTime],
      Header: t('ui.assetsummary.readingtime', 'Reading Time'),
      accessor: AssetSummaryColumnId.ReadingTime,
      Cell: (cell: Cell<EvolveAssetSummaryDto>) => {
        if (cell.value) {
          return <FormatDateTime date={cell.value} />;
        }
        return '-';
      },
    },
    {
      id: AssetSummaryColumnId.RTUDeviceId,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.RTUDeviceId],
      Header: t('ui.common.rtu', 'RTU'),
      accessor: 'rtuDeviceId',
    },

    {
      id: AssetSummaryColumnId.ScheduledRefill,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.ScheduledRefill],
      Header: t('ui.common.scheduledRefill', 'Scheduled Refill'),
      accessor: (row: EvolveAssetSummaryDto) => {
        if (row.scheduledRefill) {
          return <FormatDateTime date={row.scheduledRefill} />;
        }
        return '-';
      },
    },
    {
      id: AssetSummaryColumnId.SiteTimeZoneName,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.SiteTimeZoneName],
      Header: t('ui.common.siteTimeZone', ' Site Time Zone'),
      accessor: 'timeZoneDisplayName',
      disableSortBy: true,
    },
    {
      id: AssetSummaryColumnId.State,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.State],
      Header: t('ui.common.state', 'State'),
      accessor: 'state',
    },
    {
      id: AssetSummaryColumnId.Status,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.Status],
      Header: t('ui.common.status', 'Status'),
      accessor: (row: EvolveAssetSummaryDto) => {
        if (!row.status) {
          return defaultEventStateDescription || '';
        }
        return row.status;
      },
    },
    {
      id: AssetSummaryColumnId.StreetAddress,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.StreetAddress],
      Header: t('ui.assetsummary.streetaddress', 'Street Address'),
      accessor: 'streetAddress',
    },
    {
      id: AssetSummaryColumnId.AssetSiteNumber,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.AssetSiteNumber],
      Header: t('ui.assetsummary.assetSiteNumber', 'Asset Site Number'),
      accessor: AssetSummaryColumnId.AssetSiteNumber,
    },

    {
      id: AssetSummaryColumnId.DataChannelSiteNumber,
      apiProperty:
        columnIdToApiProperty[AssetSummaryColumnId.DataChannelSiteNumber],
      Header: t(
        'ui.assetsummary.dataChannelSiteNumber',
        'Data Channel Site Number'
      ),
      accessor: AssetSummaryColumnId.DataChannelSiteNumber,
    },
    // Custom Properties without default headers, that are unique to the domain
    {
      id: AssetSummaryColumnId.CustomField1,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.CustomField1],
      accessor: AssetSummaryColumnId.CustomField1,
    },
    {
      id: AssetSummaryColumnId.CustomField2,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.CustomField2],
      accessor: AssetSummaryColumnId.CustomField2,
    },
    {
      id: AssetSummaryColumnId.CustomField3,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.CustomField3],
      accessor: AssetSummaryColumnId.CustomField3,
    },
    {
      id: AssetSummaryColumnId.CustomField4,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.CustomField4],
      accessor: AssetSummaryColumnId.CustomField4,
    },
    {
      id: AssetSummaryColumnId.CustomField5,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.CustomField5],
      accessor: AssetSummaryColumnId.CustomField5,
    },
    {
      id: AssetSummaryColumnId.CustomField6,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.CustomField6],
      accessor: AssetSummaryColumnId.CustomField6,
    },
    {
      id: AssetSummaryColumnId.CustomField7,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.CustomField7],
      accessor: AssetSummaryColumnId.CustomField7,
    },
    {
      id: AssetSummaryColumnId.CustomField8,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.CustomField8],
      accessor: AssetSummaryColumnId.CustomField8,
    },
    {
      id: AssetSummaryColumnId.CustomField9,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.CustomField9],
      accessor: AssetSummaryColumnId.CustomField9,
    },
    {
      id: AssetSummaryColumnId.CustomField10,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.CustomField10],
      accessor: AssetSummaryColumnId.CustomField10,
    },
    // displayPriority was added as a column so that react-table can sort
    // by it
    {
      id: AssetSummaryColumnId.DisplayPriority,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.DisplayPriority],
      accessor: AssetSummaryColumnId.DisplayPriority,
    },
    // assetId was added as a column so that react-table can group by it
    {
      id: AssetSummaryColumnId.AssetId,
      apiProperty: columnIdToApiProperty[AssetSummaryColumnId.AssetId],
      accessor: AssetSummaryColumnId.AssetId,
      Cell: (props: ReactTableCell<EvolveAssetSummaryDto>) => {
        // Since this is a grouped row, the asset title would be the same
        // across all subrows (not sure if there's a way to access it
        // otherwise)
        const { row } = props;
        const assetTitle = row?.subRows?.[0]?.original?.assetTitle || '';
        return (
          <NameCell
            {...props}
            value={assetTitle}
            onClick={(assetId) => updateRouteState({ assetId })}
            isGroupedRow
          />
        );
      },
    },
  ];
  const tableColumns = tableColumnsWithoutWidth.map((column) => ({
    ...column,
    width: getColumnWidth(column.id, isAirProductsEnabledDomain),
  }));

  // headers come in and they change based on domain.
  // it can only happen once

  // remap keys for react table. Headers need to be "Header"
  function renameHeaders(row: any) {
    return { apiProperty: row.name, Header: row.title };
  }
  const renamedColumns = domainAssetTemplates.map((column) =>
    renameHeaders(column)
  );

  // add defaults for grouping and table options. If the domain doesn't have a
  // column specific for grouping in its Asset Summary Template, we add it here
  // so that they can still group by those columns.
  function mapCustomerName(
    columns: {
      apiProperty: any;
      Header: any;
    }[]
  ) {
    const customerNameApiProperty =
      columnIdToApiProperty[AssetSummaryColumnId.CustomerName];
    const assetTitleApiProperty =
      columnIdToApiProperty[AssetSummaryColumnId.AssetTitle];
    const displayPriorityApiProperty =
      columnIdToApiProperty[AssetSummaryColumnId.DisplayPriority];
    const assetIdApiProperty =
      columnIdToApiProperty[AssetSummaryColumnId.AssetId];
    const hasCustomerNameColumn = columns.some(
      (column: any) => column.apiProperty === customerNameApiProperty
    );
    const hasAssetTitleColumn = columns.some(
      (column: any) => column.apiProperty === assetTitleApiProperty
    );
    const hasDisplayPriorityColumn = columns.some(
      (column: any) => column.apiProperty === displayPriorityApiProperty
    );
    const hasAssetIdColumn = columns.some(
      (column: any) => column.apiProperty === assetIdApiProperty
    );
    if (
      !hasCustomerNameColumn &&
      groupByColumn === AssetSummaryGroupingOptions.CustomerName
    ) {
      columns.push({
        Header: customerNameHeaderText,
        apiProperty: customerNameApiProperty,
      });
    }
    if (
      !hasAssetTitleColumn &&
      groupByColumn === AssetSummaryGroupingOptions.Asset
    ) {
      columns.push({
        Header: assetTitleHeaderText,
        apiProperty: assetTitleApiProperty,
      });
    }
    // displayPriority should always be present as a column so react-table can
    // sort by it
    if (!hasDisplayPriorityColumn) {
      columns.push({
        Header: t('ui.asset.displayPriority', 'Display Priority'),
        apiProperty: displayPriorityApiProperty,
      });
    }

    // assetId is required as a column so react-table can group by it
    if (!hasAssetIdColumn) {
      columns.push({
        Header: t('ui.asset.assetId', 'Asset ID'),
        apiProperty: assetIdApiProperty,
      });
    }

    return columns;
  }

  const mapDefaults = mapCustomerName(renamedColumns);

  // get accessors for react table. Templates only provide header names and a row id.
  function getAccessor(column: any) {
    const tableValuesObj = tableColumns.find(
      (obj) => obj.apiProperty === column.apiProperty
    );

    if (tableValuesObj) {
      const {
        apiProperty,
        Header,
        ...propertiesToKeepFromReactTableColumn
      } = tableValuesObj;

      const returnValue = {
        ...column,
        ...propertiesToKeepFromReactTableColumn,
        ...(propertiesToKeepFromReactTableColumn.Cell && {
          Cell: propertiesToKeepFromReactTableColumn.Cell,
        }),
      };
      return returnValue;
    }
    return { ...column };
  }
  const columnsMap = mapDefaults.map((column: any) => getAccessor(column));

  const data = React.useMemo(() => [...records], [records]);
  const allRecordsData = React.useMemo(() => [...allRecords], [allRecords]);
  const columns = React.useMemo(() => columnsMap, [
    records,
    unitDisplayType,
    canViewAssetDetails,
  ]);

  // react table does all its internal functions based off id. id must be consistent throughtout all data going in and out of the table.
  const {
    headerGroups,
    rows,
    state: { sortBy },
    getTableProps,
    getTableBodyProps,
    prepareRow,
    toggleSortBy,
  } = useTable(
    {
      // @ts-ignore
      columns,
      initialState: {
        // displayPriority was added as a column so that react-table can sort
        // by it even when it's hidden. We don't want it appearing as a column
        // which is why we hide it here.
        // AssetTitle is hidden when grouping by asset since we're grouping by
        // and showing the asset ID table cell instead (since there's a
        // possibility of assets having the same asset title, but a different
        // asset ID).
        // AssetId is hidden when not grouping by asset since it's a column
        // that shouldn't typically be visible to users. It's only shown when
        // grouping by asset (and we render the asset title instead of the
        // asset ID).
        hiddenColumns:
          groupByColumn === AssetSummaryGroupingOptions.Asset
            ? [
                AssetSummaryColumnId.DisplayPriority,
                AssetSummaryColumnId.AssetTitle,
              ]
            : [
                AssetSummaryColumnId.DisplayPriority,
                AssetSummaryColumnId.AssetId,
              ],
        groupBy: [groupByColumnAccessor],
        sortBy: isSortByDisabled
          ? [
              {
                id: AssetSummaryColumnId.DisplayPriority,
                desc: false,
              },
            ]
          : sortByColumnId &&
            // Check if the column exists before attempting to sort. This
            // prevents the react-table error:
            // TypeError: Cannot read property 'sortDescFirst' of undefined
            columns.find((column: any) => column?.id === sortByColumnId)
          ? [
              {
                id: sortByColumnId,
                desc: !!sortByIsDescending,
              },
            ]
          : [],
        expanded: expandedRows,
        pageSize,
        pageIndex: pageNumber,
      },
      data,
      disableMultiSort: true,
      // We sort on the client side by `displayPriority` only when assets have
      // been grouped (denoed by `isSortByDisabled`). Otherwise, we let the
      // back-end do the sorting.
      manualSortBy: !isSortByDisabled,
      pageIndex: pageNumber,
      expandSubRows: true,
      disableSortBy: isSortByDisabled,
    },
    useGroupBy,
    useSortBy,
    useExpanded,
    // useBlockLayout is necesssary when virtualizing the table
    useBlockLayout
  );

  // The table instance used to generate data for a CSV download/export
  const allDataTableInstance = useTable(
    {
      // @ts-ignore
      columns,
      initialState: {
        // displayPriority was added as a column so that react-table can sort
        // by it even when it's hidden. We don't want it appearing as a column
        // which is why we hide it here.
        // AssetTitle is hidden when grouping by asset since we're grouping by
        // and showing the asset ID table cell instead (since there's a
        // possibility of assets having the same asset title, but a different
        // asset ID).
        // AssetId is hidden when not grouping by asset since it's a column
        // that shouldn't typically be visible to users. It's only shown when
        // grouping by asset (and we render the asset title instead of the
        // asset ID).
        hiddenColumns:
          groupByColumn === AssetSummaryGroupingOptions.Asset
            ? [
                AssetSummaryColumnId.DisplayPriority,
                AssetSummaryColumnId.AssetTitle,
              ]
            : [
                AssetSummaryColumnId.DisplayPriority,
                AssetSummaryColumnId.AssetId,
              ],
        groupBy: [groupByColumnAccessor],
        sortBy: isSortByDisabled
          ? [
              {
                id: AssetSummaryColumnId.DisplayPriority,
                desc: false,
              },
            ]
          : sortByColumnId &&
            // Check if the column exists before attempting to sort. This
            // prevents the react-table error:
            // TypeError: Cannot read property 'sortDescFirst' of undefined
            columns.find((column: any) => column?.id === sortByColumnId)
          ? [
              {
                id: sortByColumnId,
                desc: !!sortByIsDescending,
              },
            ]
          : [],
        expanded: expandedRowsForAllRecords,
        pageSize,
        pageIndex: pageNumber,
      },
      data: allRecordsData,
      disableMultiSort: true,
      // We sort on the client side by `displayPriority` only when assets have
      // been grouped (denoed by `isSortByDisabled`). Otherwise, we let the
      // back-end do the sorting.
      manualSortBy: !isSortByDisabled,
      pageIndex: pageNumber,
      expandSubRows: true,
      disableSortBy: isSortByDisabled,
    },
    useGroupBy,
    useSortBy,
    useExpanded,
    // useBlockLayout is necesssary when virtualizing the table
    useBlockLayout
  );

  const tableSortByColumnId = formatSortIdToTableId(sortBy?.[0]?.id);
  const tableSortByColumnIsDescending = sortBy?.[0]?.desc;

  // Sort records via the API when clicking on a table column
  useUpdateEffect(() => {
    setSortColumnId(tableSortByColumnId);
    setIsSortDescending(!!tableSortByColumnIsDescending);
  }, [tableSortByColumnId, tableSortByColumnIsDescending]);

  // Set the table's sort state when the sorting values are changed outside the
  // table
  useUpdateEffect(() => {
    if (sortByColumnId) {
      const sortColumnId = formatSortIdToApiId(sortByColumnId);

      // Check if the column exists before attempting to sort. This
      // prevents the react-table error:
      // TypeError: Cannot read property 'sortDescFirst' of undefined
      const doesColumnExist = columns.find(
        (column: any) => column?.id === sortColumnId
      );
      if (doesColumnExist) {
        toggleSortBy(sortColumnId, !!sortByIsDescending, false);
      }
    }
  }, [sortByColumnId, sortByIsDescending]);

  // Set the data to be used when exporting the table data to a CSV.
  // useDebounce is used since the table was being updated quickly (only twice)
  // which was causing the CSV file to be downloaded multiple times.
  useDebounce(
    () => {
      // Grouped columns should be inlcuded in the CSV. This will include the
      // Asset Title column in the CSV when we group by Asset ID
      const groupedColumnsToBeIncluded: ColumnInstance<EvolveAssetSummaryDto>[] =
        groupByColumn === AssetSummaryGroupingOptions.Asset
          ? allDataTableInstance.columns.filter(
              (column) => column.id === AssetSummaryColumnId.AssetTitle
            )
          : [];
      const visibleColumnsWithGroupedColumn = groupedColumnsToBeIncluded.concat(
        allDataTableInstance.visibleColumns
      );
      setTableStateForDownload({
        rows: allDataTableInstance.rows,
        visibleColumns: visibleColumnsWithGroupedColumn,
      });
    },
    200,
    [allDataTableInstance.rows]
  );

  const handleChangePage = (event: any, newPage: any) => {
    setPageNumber(newPage - 1);
  };

  const { items } = useMuiPagination({
    showFirstButton: true,
    showLastButton: true,
    count: pageCount,
    page: pageNumber + 1,
    onChange: handleChangePage,
  });

  // Syncing scroll between the virtualized table and a fake scrollbar
  // overlapping the table's scrollbar. This was needed b/c the virtualized
  // table's vertical scrollbar was only visible when scrolling all the way to
  // the right.
  const scrollBarSize = React.useMemo(() => getScrollbarWidth(), []);
  const syncScrollbarRef = useRef<HTMLDivElement>(null);
  const virtualizedListRef = useRef<FixedSizeList>(null);
  useEffect(() => {
    if (!isLoadingInitial && !responseError && rows.length > 0) {
      const syncScrollbarListener = () => {
        if (isNumber(syncScrollbarRef.current?.scrollTop)) {
          virtualizedListRef.current?.scrollTo(
            syncScrollbarRef.current?.scrollTop!
          );
        }
      };

      syncScrollbarRef.current?.addEventListener(
        'scroll',
        syncScrollbarListener
      );

      return () => {
        syncScrollbarRef.current?.removeEventListener(
          'scroll',
          syncScrollbarListener
        );
      };
    }

    return () => {};
  }, [isLoadingInitial, responseError, rows.length]);

  const globalHeaderGroupWidth = headerGroups.reduce(
    (globalGroupWidth, headerGroup) => {
      const headerGroupWidth = headerGroup.headers
        .filter((column) => !column.isGrouped)
        .reduce(
          (prevWidth, column) => prevWidth + ((column.width as number) || 0),
          0
        );

      return headerGroupWidth + globalGroupWidth;
    },
    0
  );

  const memoizedGlobalHeaderGroupWidth = React.useMemo(
    () => globalHeaderGroupWidth,
    [globalHeaderGroupWidth]
  );

  const RenderRow = useCallback(
    ({ index, style, data: itemData }) => {
      const row = rows[index];
      prepareRow(row);

      if (row.isGrouped) {
        const groupedCell = row.cells.find((cell: any) => cell.isGrouped);

        return (
          <StyledTableGroupedRow
            {...row.getRowProps({
              style: { ...style },
            })}
            // @ts-ignore
            component="div"
            // NOTE: values isnt typed correctly(?)
            $highlight={row.values?.assetId === selectedAssetId}
          >
            {groupedCell && (
              <TableCell
                {...groupedCell.getCellProps()}
                component="div"
                style={{
                  width: '100%',
                  padding: '7px 8px',
                  verticalAlign: 'middle',
                }}
              >
                <Box display="inline-block" position="sticky" left={12}>
                  <Box display="inline-block" mr="10px">
                    <StyledChevronIcon
                      {...row.getToggleRowExpandedProps()}
                      {...(row.isExpanded && {
                        style: {
                          transform: 'rotate(90deg)',
                        },
                      })}
                    />
                  </Box>
                  <Box display="inline-block" mr={2}>
                    <BoldTextBlock
                      aria-label={columnIdToAriaLabel(
                        // When grouping by Asset ID, we actually display the
                        // asset title, so we adjust the aria label to be
                        // "Asset Title" instead
                        groupedCell.column.id === AssetSummaryColumnId.AssetId
                          ? AssetSummaryColumnId.AssetTitle
                          : groupedCell.column.id
                      )}
                    >
                      {groupedCell.render('Cell')}
                      <StyledModificationText display="inline">
                        &nbsp;
                        {groupedCell.row.subRows[0].values.username} (
                        {row.subRows.length})
                      </StyledModificationText>
                    </BoldTextBlock>
                  </Box>
                </Box>
              </TableCell>
            )}
          </StyledTableGroupedRow>
        );
      }

      return (
        <StyledTableRow
          {...row.getRowProps({
            style: {
              ...style,
            },
          })}
          component="div"
          {...(canViewAssetDetails && {
            onClick: () => {
              updateRouteState({
                dataChannelId: row.original.dataChannelId,
              });
              history.push(
                generatePath(routes.assetSummary.detail, {
                  assetId: row.original.assetId,
                })
              );
            },
          })}
          rowOriginalData={row.original}
          highlight={row.original?.dataChannelId === selectedDataChannelId}
          isClickable={canViewAssetDetails}
        >
          {row.cells
            .filter((cell) => !cell.column.isGrouped)
            .map((cell) => {
              const cellProps = cell.getCellProps();

              // Adjust the widths of the columns if they don't add up to the
              // full width of the page.
              let columnWidth = Number(cell.column.width);
              if (
                itemData.fullPageWidth >
                memoizedGlobalHeaderGroupWidth + scrollBarSize
              ) {
                columnWidth =
                  (columnWidth /
                    (memoizedGlobalHeaderGroupWidth + scrollBarSize)) *
                  itemData.fullPageWidth;
              }

              return (
                <StyledTableCell
                  {...cellProps}
                  style={{
                    ...cellProps.style,
                    width: columnWidth,
                    padding: '7px 8px',
                  }}
                  component="div"
                  aria-label={columnIdToAriaLabel(cell.column.id)}
                  title={
                    // Prevent cases when cell.value is an object (ex: a date)
                    typeof cell.value === 'string' ? cell.value : undefined
                  }
                >
                  {cell.render('Cell')}
                </StyledTableCell>
              );
            })}
        </StyledTableRow>
      );
    },
    // NOTE: Do we need to add selectedDataChannelId to the list of dependencies?
    // It seems to be correctly highlighting the row without it
    [prepareRow, rows, memoizedGlobalHeaderGroupWidth]
  );

  // #region Preserve table scroll state
  // Scroll to previously selected row
  useEffect(() => {
    if (
      (selectedAssetId || selectedDataChannelId) &&
      !isFetching &&
      !responseError &&
      records.length
    ) {
      const selectedAssetRecordIndex = rows.findIndex(
        (row) => selectedAssetId && row.original?.assetId === selectedAssetId
      );
      const selectedDataChannelRecordIndex = rows.findIndex(
        (row) =>
          selectedDataChannelId &&
          row.original?.dataChannelId === selectedDataChannelId
      );

      if (virtualizedListRef.current && selectedAssetRecordIndex >= 0) {
        virtualizedListRef.current.scrollToItem(
          selectedAssetRecordIndex,
          'center'
        );
      } else if (
        virtualizedListRef.current &&
        selectedDataChannelRecordIndex >= 0
      ) {
        virtualizedListRef.current.scrollToItem(
          selectedDataChannelRecordIndex,
          'center'
        );
      }
    }
  }, [
    isFetching,
    responseError,
    records.length,
    selectedAssetId,
    selectedDataChannelId,
    virtualizedListRef.current,
  ]);
  // #endregion Preserve table scroll state

  const isEmptyCase =
    !isLoadingInitial && !responseError && !isFetching && rows.length === 0;
  const isNonEmptyCase = !isLoadingInitial && !responseError && rows.length > 0;

  return (
    <div style={{ height: '100%' }}>
      <UpdatedConfirmationDialog
        maxWidth="xs"
        open={isSortByWarningDialogOpen}
        onConfirm={closeSortByWarningDialog}
        mainTitle={t('ui.assetsummary.unableToSortTitle', 'Unable to sort')}
        content={
          <StyledText align="center">
            {t(
              'ui.assetsummary.unableToSortMessageContent',
              'Sorting not available when assets are grouped'
            )}
          </StyledText>
        }
        hideCancelButton
      />

      {/*
        NOTE: For some reason using the <DarkFadeOverlay /> component causes
        virtualization performance issues. Not sure how the issue is happening.
      */}
      {isFetching && <FullPageLoadingOverlay />}
      <Fade in={!isLoadingInitial && !!responseError} unmountOnExit>
        <div>
          {responseError && (
            <MessageBlock>
              <Typography variant="body2" color="error">
                {t('ui.assetlist.error', 'Unable to retrieve assets')}
              </Typography>
            </MessageBlock>
          )}
        </div>
      </Fade>
      <Fade in={isEmptyCase} unmountOnExit>
        <div>
          {isEmptyCase && (
            <MessageBlock>
              <Box m={2}>
                <SearchCloudIcon />
              </Box>
              <LargeBoldDarkText>
                {t('ui.assetlist.empty', 'No assets found')}
              </LargeBoldDarkText>
            </MessageBlock>
          )}
        </div>
      </Fade>

      <Fade
        in={isNonEmptyCase}
        // Only apply full-height styles when there are records to show.
        // Otherwise, this non-empty content will make the page scrollable.
        style={isNonEmptyCase ? { height: '100%' } : {}}
      >
        <div
          style={
            isNonEmptyCase
              ? {
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }
              : {}
          }
        >
          {isNonEmptyCase && (
            <>
              <Box paddingBottom={1}>
                <TableActionsAndPagination
                  totalRows={totalRows}
                  pageIndex={pageNumber}
                  pageSize={pageSize}
                  items={items}
                  align="center"
                />
              </Box>
              <Box my={1} height="100%" position="relative">
                {/*
                NOTE: Need to set an explicit height on AutoSizer, otherwise,
                the height defaults to 0 and the table borders dont get
                displayed
              */}
                <AutoSizer style={{ height: 30 }}>
                  {({ height, width }) => {
                    // All rows + 1 for the header, + scrollBarSize for the
                    // bottom horizontal scrollbar
                    const calculatedTableHeight =
                      (rows.length + 1) * ROW_HEIGHT;

                    const isHorizontalScrollbarHidden =
                      width > globalHeaderGroupWidth + scrollBarSize;
                    const horizontalScrollbarSize = isHorizontalScrollbarHidden
                      ? 0
                      : scrollBarSize;
                    const tableWrapperHeight =
                      height >
                      rows.length * ROW_HEIGHT + horizontalScrollbarSize
                        ? calculatedTableHeight + horizontalScrollbarSize
                        : height + horizontalScrollbarSize;
                    return (
                      <StyledTableContainer
                        style={{
                          height: tableWrapperHeight,
                          width,
                        }}
                      >
                        <Table
                          // @ts-ignore
                          component="div"
                          {...getTableProps()}
                          aria-label="asset summary table"
                          size="small"
                          stickyHeader
                          style={{ borderTop: 0, width }}
                        >
                          <TableHead
                            // @ts-ignore
                            component="div"
                          >
                            {headerGroups.map((headerGroup) => {
                              const headerGroupProps = headerGroup.getHeaderGroupProps();
                              return (
                                <TableRow
                                  component="div"
                                  {...headerGroupProps}
                                  style={{
                                    ...headerGroupProps.style,
                                    width: isHorizontalScrollbarHidden
                                      ? width
                                      : globalHeaderGroupWidth + scrollBarSize,
                                  }}
                                >
                                  {headerGroup.headers
                                    .filter((column) => !column.isGrouped)
                                    .map((column) => {
                                      const columnProps = column.getHeaderProps(
                                        column.getSortByToggleProps()
                                      );
                                      const sortDirection = column.isSorted
                                        ? column.isSortedDesc
                                          ? 'desc'
                                          : 'asc'
                                        : undefined;

                                      let columnWidth = Number(column.width);
                                      if (isHorizontalScrollbarHidden) {
                                        columnWidth =
                                          (columnWidth /
                                            (globalHeaderGroupWidth +
                                              scrollBarSize)) *
                                          width;
                                      }

                                      return (
                                        <StyledTableHeadCell
                                          component="div"
                                          {...columnProps}
                                          style={{
                                            ...columnProps.style,
                                            width: columnWidth,
                                          }}
                                          sortDirection={sortDirection}
                                          aria-label={columnIdToAriaLabel(
                                            column.id
                                          )}
                                          title={column.Header}
                                          columnId={column.id}
                                          {...(isSortByDisabled && {
                                            onClick: openSortByWarningDialog,
                                          })}
                                        >
                                          <StyledTableSortLabel
                                            active={
                                              column.canSort && column.isSorted
                                            }
                                            direction={sortDirection}
                                            hideSortIcon={!column.canSort}
                                          >
                                            <OverflowText>
                                              {column.render('Header')}
                                            </OverflowText>
                                          </StyledTableSortLabel>
                                        </StyledTableHeadCell>
                                      );
                                    })}
                                </TableRow>
                              );
                            })}
                          </TableHead>

                          <TableBody
                            // @ts-ignore
                            component="div"
                            {...getTableBodyProps()}
                          >
                            <StyledFixedSizeList
                              ref={virtualizedListRef}
                              // The table body should take up the remaining height
                              // of the page (height) minus one row height for the
                              // TableHead and minus the horizontal scrollbar on
                              // the bottom
                              height={height - ROW_HEIGHT - scrollBarSize}
                              itemCount={rows.length}
                              itemSize={ROW_HEIGHT}
                              itemData={{
                                fullPageWidth: width,
                              }}
                              // If the width of the table is less than the full
                              // width of the page, we need to extend the width of
                              // the table and cells to match the full page's width.
                              width={
                                width > globalHeaderGroupWidth + scrollBarSize
                                  ? width
                                  : globalHeaderGroupWidth + scrollBarSize
                              }
                              // TODO: May want to find a good default value for this
                              overscanCount={1}
                              onScroll={(scrollDetails) => {
                                if (syncScrollbarRef.current) {
                                  syncScrollbarRef.current.scrollTop =
                                    scrollDetails.scrollOffset;
                                }
                              }}
                            >
                              {RenderRow}
                            </StyledFixedSizeList>
                          </TableBody>
                        </Table>
                      </StyledTableContainer>
                    );
                  }}
                </AutoSizer>
                <ScrollbarSync
                  syncScrollbarRef={syncScrollbarRef}
                  width={scrollBarSize}
                  height={(rows.length + 1) * ROW_HEIGHT + scrollBarSize}
                />
              </Box>
            </>
          )}
        </div>
      </Fade>
    </div>
  );
};

export default AssetSummaryTable;
