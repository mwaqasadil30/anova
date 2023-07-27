/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import {
  AssetType,
  EvolveRetrieveQuickAssetCreateReportRequest,
  QuickAssetCreateReport,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import CircularProgress from 'components/CircularProgress';
import DarkFadeOverlay from 'components/DarkFadeOverlay';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import MessageBlock from 'components/MessageBlock';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import BoldPrimaryText from 'components/typography/BoldPrimaryText';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  HeaderGroup,
  Row,
  useExpanded,
  usePagination,
  useRowSelect,
  useTable,
} from 'react-table';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import { formatModifiedDatetime } from 'utils/format/dates';
import DetailsDialog from './components/DetailsDialog';
import PageIntro from './components/PageIntro';
import TableActionsAndPagination from './components/TableActionsAndPagination';
import TableOptions from './components/TableOptions';
import { QuickAssetReportFilterOption } from './types';
import { QuickAssetReportColumnId, columnIdToAriaLabel } from './helpers';

const StyledTable = styled(Table)`
  min-width: 768px;
`;
interface FilterByData {
  filterColumn: QuickAssetReportFilterOption;
  filterTextValue: string;
}

type Record = QuickAssetCreateReport;

const recordsDefault: Record[] = [];

const QuickAssetCreateReportPage = () => {
  const { t } = useTranslation();
  const activeDomain = useSelector(selectActiveDomain);
  const domainId = activeDomain?.domainId;

  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any | null>(null);
  const [apiRecords, setApiRecords] = useState<Record[] | null | undefined>();

  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // Initial Values
  const now = moment();
  const initialStartDate = moment(now).subtract(1, 'day');
  const initialEndDate = moment(now).endOf('day');

  // Filters
  const [filterByColumn, setFilterByColumn] = useState(
    QuickAssetReportFilterOption.AssetTitle
  );
  const [filterTextValue, setFilterTextValue] = useState('');
  const [assetTypeFilter, setAssetTypeFilter] = useState(AssetType.Tank);
  const [startDate, setStartDate] = useState<moment.Moment | null>(
    initialStartDate
  );
  const [endDate, setEndDate] = useState<moment.Moment | null>(initialEndDate);

  const openDetailsDialog = () => setIsDetailsDialogOpen(true);
  const closeDetailsDialog = () => setIsDetailsDialogOpen(false);
  const handleAssetClick = (event: React.SyntheticEvent, assetId?: string) => {
    event.preventDefault();
    if (assetId) {
      setSelectedAssetId(assetId);
      openDetailsDialog();
    }
  };

  const records = apiRecords || recordsDefault;
  const data = React.useMemo(() => records, [records]);
  const columns = React.useMemo(
    () => [
      {
        id: QuickAssetReportColumnId.CreatedOn,
        Header: t('ui.events.createdon', 'Created On'),
        accessor: (row: Record) => {
          return row.createdOn ? formatModifiedDatetime(row.createdOn) : '';
        },
      },
      {
        id: QuickAssetReportColumnId.CreatedByFullName,
        Header: t('ui.common.username', 'Username'),
        accessor: (row: Record) => {
          return [row.createdByFirstName, row.createdByLastName]
            .filter(Boolean)
            .join(' ');
        },
      },
      {
        id: QuickAssetReportColumnId.AssetTitle,
        accessor: 'assetTitle',
        Header: t('ui.common.assettitle', 'Asset Title'),
        Cell: ({ value, row }: { value: string; row: Row<Record> }) => {
          if (assetTypeFilter !== AssetType.HeliumIsoContainer) {
            return value;
          }

          return (
            <BoldPrimaryText
              variant="body2"
              // @ts-ignore
              component="a"
              href="#"
              onClick={(event: React.SyntheticEvent) => {
                handleAssetClick(event, row.original.assetId);
              }}
            >
              {value}
            </BoldPrimaryText>
          );
        },
      },
      {
        id: QuickAssetReportColumnId.CustomerName,
        accessor: 'customerName',
        Header: t('ui.common.customername', 'Customer Name'),
      },
      {
        id: QuickAssetReportColumnId.Country,
        accessor: 'country',
        Header: t('ui.common.country', 'Country'),
      },
      {
        id: QuickAssetReportColumnId.State,
        accessor: 'state',
        Header: t('ui.common.stateSlashProvince', 'State/Province'),
      },
      {
        id: QuickAssetReportColumnId.City,
        accessor: 'city',
        Header: t('ui.common.city', 'City'),
      },
      {
        id: QuickAssetReportColumnId.Address1,
        accessor: 'address1',
        Header: t('ui.common.address', 'Address'),
      },
      {
        id: QuickAssetReportColumnId.DeviceId,
        accessor: 'deviceId',
        Header: t('ui.common.deviceid', 'Device Id'),
      },
    ],
    [t, assetTypeFilter]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<Record>(
    {
      // @ts-ignore
      columns,
      data,
    },
    useExpanded,
    usePagination,
    useRowSelect
  );

  const fetchRecords = useCallback(
    (request: EvolveRetrieveQuickAssetCreateReportRequest) => {
      setIsFetching(true);

      AdminApiService.ReportService.retrieveQuickAssetCreateReportByOptions_RetrieveQuickAssetCreateReportByOptions(
        request
      )
        .then((response) => {
          setApiRecords(response.quickAssetCreateReport);
        })
        .catch((error) => {
          setResponseError(error);
        })
        .finally(() => {
          setIsFetching(false);
          setIsLoadingInitial(false);
        });
    },
    []
  );

  const refetchRecords = useCallback(() => {
    if (moment(startDate).isValid() && moment(endDate).isValid()) {
      let filterProperty = '';
      if (filterByColumn === QuickAssetReportFilterOption.AssetTitle) {
        filterProperty = 'assetTitle';
      } else if (filterByColumn === QuickAssetReportFilterOption.Username) {
        filterProperty = 'userName';
      } else if (filterByColumn === QuickAssetReportFilterOption.DeviceId) {
        filterProperty = 'deviceId';
      }
      // @ts-ignore
      fetchRecords({
        domainId,
        startDate: moment(startDate).startOf('day').toDate(),
        endDate: moment(endDate).endOf('day').toDate(),
        assetType: assetTypeFilter,
        ...(filterProperty &&
          filterTextValue && {
            [filterProperty]: filterTextValue,
          }),
      });
    }
  }, [
    fetchRecords,
    domainId,
    startDate,
    endDate,
    assetTypeFilter,
    filterTextValue,
    filterByColumn,
  ]);

  useEffect(() => {
    refetchRecords();
  }, [refetchRecords]);

  const handleFilterFormSubmit = (filterData: FilterByData) => {
    setFilterByColumn(filterData.filterColumn);
    setFilterTextValue(filterData.filterTextValue);
  };

  return (
    <div style={{ position: 'relative' }}>
      <PageIntroWrapper>
        <PageIntro refetchRecords={refetchRecords} />
      </PageIntroWrapper>

      <DetailsDialog
        open={isDetailsDialogOpen}
        onClose={closeDetailsDialog}
        onExit={() => setSelectedAssetId('')}
        assetId={selectedAssetId}
      />

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <TableOptions
            isFetching={isFetching}
            assetTypeFilter={assetTypeFilter}
            handleChangeAssetType={(evt) =>
              setAssetTypeFilter(evt.target.value as AssetType)
            }
            handleFilterFormSubmit={handleFilterFormSubmit}
            startDate={startDate}
            endDate={endDate}
            handleChangeStartDate={setStartDate}
            handleChangeEndDate={setEndDate}
          />
        </Grid>
        <Grid item xs={12}>
          <Fade
            in={isLoadingInitial || (rows.length === 0 && isFetching)}
            unmountOnExit
          >
            <div>
              {(rows.length === 0 && isFetching) || isLoadingInitial ? (
                <MessageBlock>
                  <CircularProgress />
                </MessageBlock>
              ) : null}
            </div>
          </Fade>
          <Fade in={!isLoadingInitial && !!responseError} unmountOnExit>
            <div>
              {responseError && (
                <MessageBlock>
                  <Typography variant="body2" color="error">
                    {t(
                      'ui.report.error.unableToRetrieveReport',
                      'Unable to retrieve report'
                    )}
                  </Typography>
                </MessageBlock>
              )}
            </div>
          </Fade>
          <Fade
            in={
              !isLoadingInitial &&
              !responseError &&
              !isFetching &&
              rows.length === 0
            }
            unmountOnExit
          >
            <div>
              {!isLoadingInitial &&
                !responseError &&
                !isFetching &&
                rows.length === 0 && (
                  <MessageBlock>
                    <Box m={2}>
                      <SearchCloudIcon />
                    </Box>
                    <LargeBoldDarkText>
                      {t('ui.common.noDataFound', 'No data found')}
                    </LargeBoldDarkText>
                  </MessageBlock>
                )}
            </div>
          </Fade>
          <Fade in={!isLoadingInitial && !responseError && rows.length > 0}>
            <div>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <TableActionsAndPagination totalRows={rows.length} />
                </Grid>
                <Grid item xs={12}>
                  <DarkFadeOverlay darken={isFetching}>
                    <TableContainer>
                      <StyledTable
                        aria-label="quick asset create report table"
                        {...getTableProps()}
                      >
                        <TableHead>
                          {headerGroups.map(
                            (headerGroup: HeaderGroup<Record>) => (
                              <TableRow {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers
                                  .filter((column) => !column.isGrouped)
                                  .map((column) => {
                                    const isSelectionCell =
                                      column.id === 'selection';
                                    const isActionCell = column.id === 'action';
                                    return (
                                      <TableHeadCell
                                        {...column.getHeaderProps()}
                                        align={
                                          isSelectionCell || isActionCell
                                            ? 'center'
                                            : 'inherit'
                                        }
                                        aria-label={columnIdToAriaLabel(
                                          column.id
                                        )}
                                        style={{
                                          width:
                                            isSelectionCell || isActionCell
                                              ? 50
                                              : 'inherit',
                                          padding:
                                            isSelectionCell || isActionCell
                                              ? 0
                                              : '7px 16px',
                                        }}
                                      >
                                        {column.render('Header')}
                                      </TableHeadCell>
                                    );
                                  })}
                              </TableRow>
                            )
                          )}
                        </TableHead>
                        <TableBody {...getTableBodyProps()}>
                          {rows.map((row: Row<Record>) => {
                            prepareRow(row);

                            return (
                              <TableRow
                                {...row.getRowProps()}
                                style={{ height: 50 }}
                              >
                                {row.cells
                                  .filter((cell) => !cell.isPlaceholder)
                                  .map((cell) => {
                                    const isActionOrSelection =
                                      cell.column.id === 'selection' ||
                                      cell.column.id === 'action';
                                    return (
                                      <TableCell
                                        {...cell.getCellProps()}
                                        aria-label={columnIdToAriaLabel(
                                          cell.column.id
                                        )}
                                        style={{
                                          textAlign: isActionOrSelection
                                            ? 'center'
                                            : 'inherit',
                                          width: isActionOrSelection
                                            ? 50
                                            : 'inherit',
                                          padding: isActionOrSelection
                                            ? 0
                                            : '5px 24px 5px 16px',
                                        }}
                                      >
                                        {cell.render('Cell')}
                                      </TableCell>
                                    );
                                  })}
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </StyledTable>
                    </TableContainer>
                  </DarkFadeOverlay>
                </Grid>
                <Grid item xs={12}>
                  <TableActionsAndPagination totalRows={rows.length} />
                </Grid>
              </Grid>
            </div>
          </Fade>
        </Grid>
      </Grid>
    </div>
  );
};

export default QuickAssetCreateReportPage;
