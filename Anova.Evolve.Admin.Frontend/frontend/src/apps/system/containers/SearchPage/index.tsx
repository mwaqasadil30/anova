import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import { usePagination as useMuiPagination } from '@material-ui/lab/Pagination';
import {
  DomainDetailDto,
  ListSortDirection2,
  RtuDeviceCategory,
  RTUSearchInfoListFilterOptionsEnum,
  RtuSearchResultDTO,
  RtuSearchResultSetDTO,
} from 'api/admin/api';
import adminRoutes from 'apps/admin/routes';
import opsRoutes from 'apps/ops/routes';
import BoxWithOverflowHidden from 'components/BoxWithOverflowHidden';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import DarkFadeOverlay from 'components/DarkFadeOverlay';
import TableCellCheckbox from 'components/forms/styled-fields/TableCellCheckbox';
import GenericPageWrapper from 'components/GenericPageWrapper';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import MessageBlock from 'components/MessageBlock';
import PageHeader from 'components/PageHeader';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import { getRtuTabName } from 'containers/RTUManagerList/helpers';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { generatePath, useHistory, useLocation } from 'react-router-dom';

// import TableActionsAndPagination from './components/TableActionsAndPagination';
import {
  Cell,
  Column,
  Hooks,
  Row,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import { setActiveDomainById } from 'redux-app/modules/app/actions';
import {
  selectActiveDomain,
  selectTopOffset,
} from 'redux-app/modules/app/selectors';
import { formatSearchText } from 'utils/api/helpers';
import { formatBooleanToYesOrNoString } from 'utils/format/boolean';
import { formatModifiedDatetime } from 'utils/format/dates';
import SystemSearchDataTable from './components/SystemSearchDataTable';
import TableActionsAndPagination from './components/TableActionsAndPagination';
import TableOptions from './components/TableOptions';
import { columnIdToAriaLabel, getColumnWidth } from './helpers';
import { useSearchRtuRecords } from './hooks/useRtuSearchApi';
import {
  FilterByData,
  NavigateToOptions,
  RouteState,
  RowIdentifier,
  RtuSearchResultDTOColumnId,
} from './types';

const SearchPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation<RouteState | undefined>();

  const dispatch = useDispatch();
  const activeDomain = useSelector(selectActiveDomain);
  const topOffset = useSelector(selectTopOffset);

  const [searchSubmitted, setSearchSubmitted] = useState(
    () => !!location.state?.searchSubmitted
  );
  const [filterTextValue, setFilterTextValue] = useState(
    location?.state?.filterTextValue || ''
  );
  const [pageSize] = useState(50);

  const [totalRows, setTotalRows] = useState<number>(0);

  const [pageNumber, setPageNumber] = useState(
    location.state?.clickedRowIdentifier?.pageIndex || 0
  );
  const [pageCount, setPageCount] = useState<number | undefined>();
  const [apiResponse, setApiResponse] = useState<RtuSearchResultSetDTO | null>(
    null
  );
  const [includeSubDomain, setIncludeSubDomain] = useState(
    location.state?.includeSubDomain || false
  );
  const [showDeletedRTU, setShowDeletedRTU] = useState(
    location.state?.showDeleted || false
  );

  const [includeSubDomainFilterData, setIncludeSubDomainFilterData] = useState(
    false
  );
  const [showDeletedRtuFilterData, setShowDeletedRtuFilterData] = useState(
    false
  );

  const [startDate, setStartDate] = useState(
    location.state?.startDate || new Date()
  );
  const [endDate, setEndDate] = useState(location.state?.endDate || new Date());

  const [filterByColumn, setFilterByColumn] = useState(
    location.state?.filterByColumn || RTUSearchInfoListFilterOptionsEnum.RTU
  );

  const records =
    apiResponse?.results && searchSubmitted ? apiResponse?.results : [];

  const [filterBySelectedDomainId, setFilterBySelectedDomainId] = useState<
    string | undefined | null
  >(location.state?.selectedDomain?.domainId || null);
  const [selectedDomain, setSelectedDomain] = useState<
    DomainDetailDto | undefined | null
  >(location.state?.selectedDomain || null);
  const [selectedRows, setSelectedRows] = useState<
    Record<string, RtuSearchResultDTO>
  >({});

  const [
    clickedRowIdentifier,
    setClickedRowIdentifier,
  ] = useState<RowIdentifier | null>(
    location.state?.clickedRowIdentifier || null
  );

  const handleFilterFormSubmit = (filterData: FilterByData) => {
    if (filterData.startDate) setStartDate(filterData.startDate);
    if (filterData.endDate) setEndDate(filterData.endDate);
    setSearchSubmitted(true);
    setClickedRowIdentifier(null);
    setFilterBySelectedDomainId(filterData.domainId);
    setFilterByColumn(filterData.filterByColumn);
    setFilterTextValue(filterData.filterTextValue);
    setIncludeSubDomainFilterData(filterData.includeSubDomain);
    setShowDeletedRtuFilterData(filterData.showDeleted);
    setPageNumber(0);
  };

  const handleDomainChange = (domainOrNull?: DomainDetailDto | null) => {
    setSelectedDomain(domainOrNull);
  };

  const data: RtuSearchResultDTO[] | [] = React.useMemo(() => [...records], [
    records,
    selectedRows,
  ]);

  const columns: Column<RtuSearchResultDTO>[] | [] = React.useMemo(
    () => [
      {
        id: RtuSearchResultDTOColumnId.DeviceId,
        Header: t('ui.common.deviceid', 'Device Id') as string,
        accessor: RtuSearchResultDTOColumnId.DeviceId,
      },
      {
        id: RtuSearchResultDTOColumnId.DomainName,
        Header: t('ui.rtu.domainname', 'Domain') as string,
        accessor: RtuSearchResultDTOColumnId.DomainName,
      },
      {
        id: RtuSearchResultDTOColumnId.CarrierName,
        Header: t('ui.common.carrier', 'Carrier') as string,
        accessor: RtuSearchResultDTOColumnId.CarrierName,
      },
      {
        id: RtuSearchResultDTOColumnId.DeviceNetworkAddress,
        Header: t('ui.rtu.networkaddress', 'Network Address') as string,
        accessor: RtuSearchResultDTOColumnId.DeviceNetworkAddress,
      },
      // {
      //   Header: t('ui.common.assetid', 'Asset Id'),
      //   accessor: RtuSearchResultDTOColumnId.AssetId,
      // },
      {
        id: RtuSearchResultDTOColumnId.RtuChannelCount,
        Header: t('ui.rtu.rtuchannels', 'RTU Channels') as string,
        accessor: RtuSearchResultDTOColumnId.RtuChannelCount,
      },
      {
        id: 'latestPacketTimeStamp',
        Header: t('ui.rtu.lastcommdate', 'Last Comm Date') as string,
        accessor: (row: RtuSearchResultDTO) => {
          if (row.latestPacketTimeStamp) {
            return formatModifiedDatetime(row.latestPacketTimeStamp);
          }
          return '';
        },
      },
      {
        Header: t('ui.common.datachannels', 'Data Channels') as string,
        accessor: RtuSearchResultDTOColumnId.DataChannelCount,
      },
      {
        Header: t('ui.common.siteinformation', 'Site Title') as string,
        accessor: RtuSearchResultDTOColumnId.SiteTitle,
      },
      {
        Header: t('ui.common.assetitle', 'Asset') as string,
        accessor: RtuSearchResultDTOColumnId.AssetTitle,
      },
      {
        Header: t(
          'ui.common.lastbatteryvoltage',
          'Last Battery Volts'
        ) as string,
        accessor: RtuSearchResultDTOColumnId.LastBatteryVoltage,
      },
      // {
      //   Header: t('ui.common.lastbatteryvoltage', 'Last Battery Volts Date'),
      //   accessor: RtuSearchResultDTOColumnId.LastBatteryVoltageTimestamp,
      // },
      {
        id: 'lastBatteryVoltageTimestamp',
        Header: t(
          'ui.common.lastbatteryvoltage',
          'Last Battery Volts Date'
        ) as string,
        accessor: (row: RtuSearchResultDTO) => {
          if (row.lastBatteryVoltageTimestamp) {
            return formatModifiedDatetime(row.lastBatteryVoltageTimestamp);
          }
          return '';
        },
      },
      {
        id: RtuSearchResultDTOColumnId.IsDeleted,
        Header: t('ui.common.deleted', 'Deleted') as string,
        accessor: (row: RtuSearchResultDTO) =>
          formatBooleanToYesOrNoString(row.isDeleted, t),
      },
    ],
    [t, selectedDomain]
  );
  const handleChangePage = (event: any, newPage: any) => {
    setPageNumber(newPage - 1);
  };
  const [sortByColumn, setSortByColumn] = useState<
    string | RtuSearchResultDTOColumnId
  >(RtuSearchResultDTOColumnId.DeviceId);

  const { items } = useMuiPagination({
    showFirstButton: true,
    showLastButton: true,
    count: pageCount,
    page: pageNumber + 1,
    onChange: handleChangePage,
  });

  const tableInstance = useTable<RtuSearchResultDTO>(
    {
      columns,
      data,
      initialState: {
        sortBy: [
          {
            id: sortByColumn,
            desc: false,
          },
        ],
        // Pagination
        pageSize,
        pageIndex: pageNumber,
      },
      disableMultiSort: true,
      manualSortBy: true,
      // Pagination
      autoResetPage: true,
      pageIndex: pageNumber,
      manualPagination: true,
    },
    useSortBy,
    usePagination,
    (hooks: Hooks<RtuSearchResultDTO>) => {
      hooks.visibleColumns.push((hookColumns: any) => [
        {
          id: 'selection',
          Header: ({ rows: _rows }) => {
            const selectableRows = _rows.filter((row) => row.original?.id);
            const areAllRowsSelected =
              !!selectableRows.length &&
              selectableRows.every((row) => selectedRows[row.original.id!]);
            return (
              <TableCellCheckbox
                onChange={() => {
                  if (areAllRowsSelected) {
                    setSelectedRows({});
                  } else {
                    setSelectedRows(
                      selectableRows.reduce<Record<string, RtuSearchResultDTO>>(
                        (mem, row) => {
                          mem[row.original.id!] = row.original;
                          return mem;
                        },
                        {}
                      )
                    );
                  }
                }}
                checked={areAllRowsSelected}
                disabled={!selectableRows.length}
                style={{ paddingTop: 0, paddingBottom: 0 }}
              />
            );
          },
          Cell: ({ row }: { row: Row<RtuSearchResultDTO> }) => (
            <TableCellCheckbox
              onChange={() =>
                setSelectedRows((prevSelectedRows) => {
                  const newSelectedRows = { ...prevSelectedRows };

                  const isChecked = newSelectedRows[row.original.id!];
                  if (isChecked) {
                    delete newSelectedRows[row.original.id!];
                  } else {
                    newSelectedRows[row.original.id!] = row.original;
                  }
                  return newSelectedRows;
                })
              }
            />
          ),
          defaultCanSort: false,
          disableSortBy: true,
        },
        ...hookColumns,
      ]);
    }
  );

  const { rows } = tableInstance;

  const [sortByColumnDirection, setSortByColumnDirection] = useState(
    ListSortDirection2.Ascending
  );

  const handleSortByColumnIdChange = (columnId: string) => {
    if (columnId !== RtuSearchResultDTOColumnId.Selection) {
      if (columnId === sortByColumn) {
        switch (sortByColumnDirection) {
          case ListSortDirection2.Descending:
            setSortByColumnDirection(ListSortDirection2.Ascending);
            break;
          default:
            setSortByColumnDirection(ListSortDirection2.Descending);
        }
      }
      setSortByColumn(columnId);
    }
  };

  const routeState: RouteState = {
    searchSubmitted,
    filterByColumn,
    filterTextValue,
    selectedDomain,
    includeSubDomain,
    pageNumber,
    clickedRowIdentifier,
    startDate,
    endDate,
    showDeleted: showDeletedRTU,
    domainId: filterBySelectedDomainId,
  };

  const rtuSearchOptions = {
    ...(filterBySelectedDomainId && { domainId: filterBySelectedDomainId }),
    includeSubDomain: includeSubDomainFilterData,
    filterBy: filterByColumn,
    showDeletedRTU: showDeletedRtuFilterData,
    isCountRequired: true,
    pageIndex: pageNumber,
    itemsPerPage: pageSize,
    startDate,
    endDate,
    filterText: formatSearchText(filterTextValue, {
      addWildcardAsterisks: true,
    }),
    sortColumnName: sortByColumn,
    sortDirection: sortByColumnDirection
      ? ListSortDirection2.Descending
      : ListSortDirection2.Ascending,
  };

  // @ts-ignore
  const searchRtuRecordsApi = useSearchRtuRecords(rtuSearchOptions, {
    keepPreviousData: true,
    onSuccess: (apiData) => {
      // Reset selected rows to not carry over to new pages.
      setSelectedRows({});
      if (searchSubmitted) {
        setApiResponse(apiData);
      }
      const totalRecords = apiData.totalCount || 0;
      setTotalRows(totalRecords);
      setPageCount(Math.ceil(totalRecords / pageSize));
    },
  });

  const { isLoading, isError, isFetching } = searchRtuRecordsApi;
  const isLoadingOrFetching = isLoading || isFetching;

  const navigateToRecord = (recordType?: NavigateToOptions) => {
    const doesRtuCategoryHaveEditorAccess = [
      RtuDeviceCategory.FourHundredSeries,
      RtuDeviceCategory.Modbus,
      RtuDeviceCategory.SMS,
      RtuDeviceCategory.File,
      RtuDeviceCategory.Metron2,
      RtuDeviceCategory.Horner,
    ].includes(clickedRowIdentifier?.rtuCategoryId!);

    if (
      !!doesRtuCategoryHaveEditorAccess &&
      !!clickedRowIdentifier?.deviceId &&
      !!clickedRowIdentifier?.rtuCategoryId
    ) {
      if (activeDomain?.domainId !== clickedRowIdentifier?.domainId) {
        dispatch(setActiveDomainById(clickedRowIdentifier?.domainId));
      }
      if (recordType === NavigateToOptions.Asset) {
        history.push(
          generatePath(opsRoutes.assetSummary.detail, {
            assetId: clickedRowIdentifier?.cellAssetId,
          })
        );
      } else {
        history.push(
          generatePath(adminRoutes.rtuManager.edit, {
            rtuDeviceId: clickedRowIdentifier?.deviceId,
            tabName: getRtuTabName(clickedRowIdentifier?.rtuCategoryId!),
          })
        );
      }
    }
  };

  const handleRowOrCellClick = (
    row: Row<RtuSearchResultDTO>,
    cell?: Cell<RtuSearchResultDTO>
  ) => {
    setClickedRowIdentifier({
      naviagteTo: cell ? NavigateToOptions.Asset : NavigateToOptions.Rtu,
      rowIndex: row.id,
      pageIndex: pageNumber,
      domainId: row.original.domainId,
      deviceId: row.original.deviceId,
      rtuCategoryId: row.original.rtuCategoryId,
      /* eslint-disable indent */
      ...(cell &&
        cell.row.original.assetId && {
          cellAssetId: cell.row.original.assetId,
        }),
    });
    /* eslint-enable indent */
  };

  useUpdateEffect(() => {
    history.replace(location.pathname, routeState);
    if (clickedRowIdentifier) {
      navigateToRecord(clickedRowIdentifier.naviagteTo);
    }
  }, [
    filterBySelectedDomainId,
    filterByColumn,
    filterTextValue,
    startDate,
    clickedRowIdentifier,
  ]);

  return (
    <div>
      <GenericPageWrapper $topOffset={topOffset} $isFullPageHeight>
        <PageIntroWrapper>
          <PageHeader dense>{t('ui.systemApp.search', 'Search')}</PageHeader>
        </PageIntroWrapper>

        <Box pb={1}>
          <TableOptions
            routeState={routeState}
            isLoadingOrFetching={isLoadingOrFetching}
            handleFilterFormSubmit={handleFilterFormSubmit}
            selectedDomain={selectedDomain}
            includeSubDomain={includeSubDomain}
            setIncludeSubDomain={setIncludeSubDomain}
            showDeleted={showDeletedRTU}
            setShowDeletedRTU={setShowDeletedRTU}
            onSelectDomain={handleDomainChange}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </Box>

        <BoxWithOverflowHidden pt={0} pb={8}>
          <TransitionLoadingSpinner
            in={isLoading || (rows.length === 0 && isFetching)}
          />
          <TransitionErrorMessage in={!isLoading && !!isError} />

          <Fade
            in={!isLoading && !isError && !isFetching && rows.length === 0}
            unmountOnExit
          >
            <div>
              {!isLoading &&
                !isError &&
                !isFetching &&
                rows.length === 0 &&
                (searchSubmitted ? (
                  <MessageBlock>
                    <Box m={2}>
                      <SearchCloudIcon />
                    </Box>
                    <LargeBoldDarkText>
                      {t('ui.rtu.rtumanager.empty', 'No RTUs found')}
                    </LargeBoldDarkText>
                  </MessageBlock>
                ) : (
                  <MessageBlock>
                    <Box m={2}>
                      <SearchCloudIcon />
                    </Box>
                    <LargeBoldDarkText>
                      {t(
                        'ui.system.search.getstarted',
                        'Enter a Search To Get Started'
                      )}
                    </LargeBoldDarkText>
                  </MessageBlock>
                ))}
            </div>
          </Fade>

          <Fade
            in={!isLoading && !isError && rows.length > 0}
            style={{ height: '100%' }}
          >
            <Box height="100%" display="flex" flexDirection="column">
              <Box>
                <TableActionsAndPagination
                  // TODO: Implement actions when task is scoped
                  // shouldShowActions={shouldShowActionsCondition}
                  // shouldDisableActions={
                  //   shouldDisableActionsCondition
                  // }
                  // actions={{
                  //   transferRtu={handleTransferRtu}
                  //   transferRtuAndCreateTank={handleTransferRtuAndCreateTank}
                  //   requestAdditionalConfig={handleRequestAdditionalConfig}
                  // }}
                  totalRows={totalRows}
                  pageIndex={pageNumber}
                  pageSize={pageSize}
                  align="center"
                  items={items}
                />
              </Box>
              <Box py={1} height="100%">
                <DarkFadeOverlay darken={isFetching} height="100%">
                  <SystemSearchDataTable<RtuSearchResultDTO>
                    tableInstance={tableInstance}
                    disableActions={isFetching}
                    sortByColumn={sortByColumn}
                    sortByColumnDirection={sortByColumnDirection}
                    tableAriaLabelText="rtu search table"
                    isRecordDisabled={() => false}
                    columnIdToAriaLabel={columnIdToAriaLabel}
                    getColumnWidth={getColumnWidth}
                    handleRowOrCellClick={handleRowOrCellClick}
                    handleSortByColumnIdChange={handleSortByColumnIdChange}
                    clickedRowIdentifier={clickedRowIdentifier}
                    pageNumber={pageNumber}
                    TableProps={{ stickyHeader: true }}
                    TableContainerProps={{
                      style: {
                        maxHeight: '100%',
                      },
                    }}
                  />
                </DarkFadeOverlay>
              </Box>
            </Box>
          </Fade>
        </BoxWithOverflowHidden>
      </GenericPageWrapper>
    </div>
  );
};

export default SearchPage;
