/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import MuiLink from '@material-ui/core/Link';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { usePagination as useMuiPagination } from '@material-ui/lab/Pagination';
import {
  AssetInfoRecord,
  AssetListFilterOptions,
  AssetListGroupingOptions,
  EvolveRetrieveAssetInfoRecordsByOptionsRequest,
  EvolveRetrieveAssetInfoRecordsByOptionsResponse,
  ListSortDirection,
} from 'api/admin/api';
import routes from 'apps/admin/routes';
import { stringifyAssetTransferQuery } from 'apps/admin/utils/routes';
import { ReactComponent as EllipsisIcon } from 'assets/icons/ellipsis.svg';
import BoxWithOverflowHidden from 'components/BoxWithOverflowHidden';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import DarkFadeOverlay from 'components/DarkFadeOverlay';
import DeletionWarningDialog from 'components/DeletionWarningDialog';
import {
  DeleteListItem,
  DeleteUnorderedList,
} from 'components/DeletionWarningDialog/styles';
import TableCellCheckbox from 'components/forms/styled-fields/TableCellCheckbox';
import GenericDataTable from 'components/GenericDataTable';
import GenericPageWrapper from 'components/GenericPageWrapper';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import Menu from 'components/Menu';
import MessageBlock from 'components/MessageBlock';
import BoldPrimaryText from 'components/typography/BoldPrimaryText';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath, Link, useHistory, useLocation } from 'react-router-dom';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import {
  Hooks,
  Row,
  useExpanded,
  useGroupBy,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table';
import {
  selectActiveDomainId,
  selectTopOffset,
} from 'redux-app/modules/app/selectors';
import { selectUserId } from 'redux-app/modules/user/selectors';
import { formatSearchText } from 'utils/api/helpers';
import { formatAssetRecordSiteInformation } from 'utils/format/address';
import AssetManagerPagination from './components/AssetManagerPagination';
import PageIntro from './components/PageIntro';
import TableOptions from './components/TableOptions';
import {
  AssetManagerColumnId,
  columnIdToAriaLabel,
  getColumnWidth,
  getHiddenColumnsForGroupedColumn,
  isRecordDisabled,
} from './helpers';
import { useDeleteRecords } from './hooks/useDeleteRecord';
import { useRetrieveAssetInfoRecords } from './hooks/useRetrieveAssetInfoRecords';
import { RowIdentifier, RouteState } from './types';

interface FilterByData {
  filterByColumn: AssetListFilterOptions;
  filterTextValue: string;
}

const enumToAccessorMap = {
  [AssetListGroupingOptions.None]: '',
  [AssetListGroupingOptions.Asset]: 'assetTitle',
  [AssetListGroupingOptions.CustomerName]: 'customerName',
};
const defaultRecordList: AssetInfoRecord[] = [];

const AssetSummaryRecords = () => {
  const history = useHistory();
  const location = useLocation<RouteState | undefined>();
  const topOffset = useSelector(selectTopOffset);

  const userId = useSelector(selectUserId);
  const domainId = useSelector(selectActiveDomainId);

  const [selectedRows, setSelectedRows] = useState<
    Record<string, AssetInfoRecord>
  >({});

  const [
    assetManagerRecords,
    setAssetManagerRecords,
  ] = useState<EvolveRetrieveAssetInfoRecordsByOptionsResponse | null>(null);

  const [filterByColumn, setFilterByColumn] = useState(
    AssetListFilterOptions.Asset
  );
  const [
    clickedRowIdentifier,
    setClickedRowIdentifier,
  ] = useState<RowIdentifier | null>(
    location.state?.clickedRowIdentifier || null
  );
  const [filterTextValue, setFilterTextValue] = useState('');
  const [groupByColumn, setGroupByColumn] = useState(
    AssetListGroupingOptions.CustomerName
  );
  const [groupByColumnAccessor, setGroupByColumnAccessor] = useState(
    enumToAccessorMap[groupByColumn]
  );

  // Pagination
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [pageSize] = useState(50);
  const [pageNumber, setPageNumber] = useState(location.state?.pageNumber || 0);
  const [pageCount, setPageCount] = useState<number | undefined>();
  const [totalRows, setTotalRows] = useState<number>(0);

  // Deletion
  const deleteRecordsApi = useDeleteRecords();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordsToBeDeleted, setRecordsToBeDeleted] = useState<
    AssetInfoRecord[]
  >([]);

  const records =
    (assetManagerRecords &&
      assetManagerRecords.retrieveAssetInfoRecordsByOptionsResult?.records) ||
    defaultRecordList;
  const { t } = useTranslation();
  const data = React.useMemo(() => [...records], [records, selectedRows]);
  const columns = React.useMemo(
    () => [
      {
        id: AssetManagerColumnId.AssetDescription,
        Header: t('ui.common.description', 'Description'),
        accessor: AssetManagerColumnId.AssetDescription,
        Cell: ({
          value,
          row,
        }: {
          value: AssetInfoRecord['assetDescription'];
          row: any;
        }) => {
          return (
            <BoldPrimaryText variant="body2">
              <MuiLink
                component={Link}
                to={generatePath(routes.assetManager.edit, {
                  assetId: row.original.assetId,
                })}
                color="inherit"
                underline="none"
              >
                {value}
              </MuiLink>
            </BoldPrimaryText>
          );
        },
      },
      {
        id: AssetManagerColumnId.AssetTitle,
        Header: t('ui.common.assettitle', 'Asset Title'),
        accessor: AssetManagerColumnId.AssetTitle,
      },
      {
        id: AssetManagerColumnId.CustomerName,
        Header: t('ui.common.customername', 'Customer Name'),
        accessor: AssetManagerColumnId.CustomerName,
      },
      {
        id: AssetManagerColumnId.DeviceId,
        Header: t('ui.common.rtu', 'RTU'),
        accessor: AssetManagerColumnId.DeviceId,
      },
      {
        id: AssetManagerColumnId.SiteInformation,
        Header: t('ui.common.siteinformation', 'Site Information'),
        accessor: (assetRecord: AssetInfoRecord) => {
          return formatAssetRecordSiteInformation(assetRecord);
        },
        disableSortBy: true,
      },
      {
        id: AssetManagerColumnId.ProductName,
        Header: t('ui.common.product', 'Product'),
        accessor: AssetManagerColumnId.ProductName,
      },
      {
        id: AssetManagerColumnId.DataChannelCount,
        Header: t('ui.common.datachannels', 'Data Channels'),
        accessor: AssetManagerColumnId.DataChannelCount,
        sortType: 'basic',
      },
      {
        id: AssetManagerColumnId.Action,
        Header: '',
        accessor: '_',
        defaultCanSort: false,
        disableSortBy: true,
        Cell: ({ row }: { row: Row<AssetInfoRecord> }) => {
          const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(
            null
          );

          const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget);
          };

          const handleClose = () => {
            setAnchorEl(null);
          };

          const handleDelete = () => {
            if (row.original.assetId) {
              setRecordsToBeDeleted([row.original]);
              setIsDeleteDialogOpen(true);
            }
            handleClose();
          };

          const transferRoutePath = stringifyAssetTransferQuery([
            row.original.assetId,
          ]);

          return (
            <>
              <Button
                aria-controls="asset options"
                aria-haspopup="true"
                onClick={handleClick}
                style={{ width: 50, minWidth: 0, borderRadius: 0, height: 50 }}
              >
                <EllipsisIcon />
              </Button>
              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                <MenuItem
                  disabled
                  onClick={handleClose}
                  component={Link}
                  to={generatePath(routes.assetManager.copy, {
                    assetId: row.original.assetId,
                  })}
                >
                  {t('ui.common.copy', 'Copy')}
                </MenuItem>
                <MenuItem
                  disabled
                  onClick={handleClose}
                  component={Link}
                  to={transferRoutePath}
                >
                  {t('ui.common.transfer', 'Transfer')}
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                  {t('ui.common.delete', 'Delete')}
                </MenuItem>
              </Menu>
            </>
          );
        },
      },
    ],
    [t]
  );
  const expandedRows = React.useMemo(
    () =>
      records.reduce((prev, current) => {
        /* eslint-disable-next-line no-param-reassign */
        prev[
          // @ts-ignore
          `${groupByColumnAccessor}:${current[groupByColumnAccessor]}`
        ] = true;
        return prev;
      }, {} as Record<string, boolean>),
    [records, groupByColumnAccessor]
  );

  const tableInstance = useTable<AssetInfoRecord>(
    {
      // @ts-ignore
      columns,
      // @ts-ignore
      data,
      initialState: {
        groupBy: [groupByColumnAccessor],
        expanded: expandedRows,
        // NOTE: May need to hide certain columns when grouping by other fields
        hiddenColumns: getHiddenColumnsForGroupedColumn(groupByColumn),
        // Pagination
        pageSize,
        sortBy: [{ id: AssetManagerColumnId.AssetDescription, desc: false }],
        pageIndex: pageNumber,
      },
      // Grouping
      expandSubRows: true,
      // Sorting
      disableMultiSort: true,
      manualSortBy: true,
      // Pagination
      pageIndex: pageNumber,
      manualPagination: true,
      autoResetPage: false,
    },
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    (hooks: Hooks<AssetInfoRecord>) => {
      hooks.visibleColumns.push((hookColumns: any) => [
        // Let's make a column for selection
        {
          id: AssetManagerColumnId.Selection,
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ rows: _rows }) => {
            const selectableRows = _rows.filter(
              (row) => row.original?.assetId
            ) as Row<AssetInfoRecord>[];
            const areAllRowsSelected =
              !!selectableRows.length &&
              selectableRows.every(
                (row) => selectedRows[row.original.assetId!]
              );
            return (
              <TableCellCheckbox
                onChange={() => {
                  if (areAllRowsSelected) {
                    setSelectedRows({});
                  } else {
                    setSelectedRows(
                      selectableRows.reduce<Record<string, AssetInfoRecord>>(
                        (mem, row) => {
                          mem[row.original.assetId!] = row.original;
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
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }: { row: Row<AssetInfoRecord> }) => {
            return (
              <TableCellCheckbox
                onChange={() =>
                  setSelectedRows((prevSelectedRows) => {
                    const newSelectedRows = { ...prevSelectedRows };
                    const isChecked = newSelectedRows[row.original.assetId!];
                    if (isChecked) {
                      delete newSelectedRows[row.original.assetId!];
                    } else {
                      newSelectedRows[row.original.assetId!] = row.original;
                    }

                    return newSelectedRows;
                  })
                }
                checked={!!selectedRows[row.original.assetId!] || false}
              />
            );
          },
          defaultCanSort: false,
          disableSortBy: true,
        },
        ...hookColumns,
      ]);
    }
  );

  const {
    rows,
    state: { sortBy },
    setHiddenColumns,
    setGroupBy,
    toggleAllRowsExpanded,
  } = tableInstance;

  const sortByColumnId = sortBy?.[0]?.id;
  const sortByColumnDirection = sortBy?.[0]?.desc;

  const assetInfoRecordsApiOptions = {
    // Whether totalRecords is returned or not. If false, totalRecords will
    // be null. If true, it'll return the total amount of records in the
    // table
    isCountRequired: true,
    userId,
    domainId,
    pageIndex: pageNumber,
    itemsPerPage: pageSize,
    // TODO: Look into having this helper run in the generated API code
    // file from NSwagStudio?
    filterText: formatSearchText(filterTextValue, {
      addWildcardAsterisks: true,
    }),
    filterBy: filterByColumn,
    sortColumnName: sortByColumnId,
    sortDirection: sortByColumnDirection
      ? ListSortDirection.Descending
      : ListSortDirection.Ascending,
    groupBy: groupByColumn,
  };

  const retrieveAssetInfoRecordsApi = useRetrieveAssetInfoRecords(
    {
      options: assetInfoRecordsApiOptions,
    } as EvolveRetrieveAssetInfoRecordsByOptionsRequest,
    {
      // We use keepPreviousData so the <TransitionLoadingSpinner /> doesnt
      // appear when a user selects a new page that they haven't accessed before.
      // see: (rows.length === 0 && isFetching) in the <TransitionLoadingSpinner />
      keepPreviousData: true,
      onSuccess: (apiData) => {
        // Reset selected rows to not carry over to new pages.
        setSelectedRows({});
        setAssetManagerRecords(apiData);
        toggleAllRowsExpanded(true);

        const totalRecords =
          apiData.retrieveAssetInfoRecordsByOptionsResult?.totalRecords || 0;
        setTotalRows(totalRecords);

        setPageCount(Math.ceil(totalRecords / pageSize));

        const newTableGroupBy =
          (groupByColumn as AssetListGroupingOptions) ===
          AssetListGroupingOptions.CustomerName
            ? [AssetManagerColumnId.CustomerName]
            : [];
        setGroupBy(newTableGroupBy);

        // To prevent newly shown columns from appearing while the API is in
        // progress, we delay updating the grouped column accessor until we
        // get the API response here
        setGroupByColumnAccessor(
          enumToAccessorMap[groupByColumn as AssetListGroupingOptions]
        );

        const hiddenColumns = getHiddenColumnsForGroupedColumn(groupByColumn);
        setHiddenColumns(hiddenColumns);
      },
    }
  );

  const handleChangePage = (event: any, newPage: any) => {
    setPageNumber(newPage - 1);
  };

  const handleGroupByColumnChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const column = event.target.value as AssetListGroupingOptions;
    // NOTE: We only set groupByColumn here instead of also setting
    // groupByColumnAccessor to prevent a FOUC before the API response comes
    // back and the "Asset Title" and "Customer Name" columns are added/removed
    setGroupByColumn(column);
  };

  const handleFilterFormSubmit = (filterData: FilterByData) => {
    setFilterByColumn(filterData.filterByColumn);
    setFilterTextValue(filterData.filterTextValue);
    setPageNumber(0);
  };

  const deleteRecords = () => {
    return deleteRecordsApi
      .makeRequest({
        assetIds: recordsToBeDeleted
          .filter((record) => record.assetId)
          .map((record) => record.assetId!),
      })
      .then(() => {
        setSelectedRows({});
        setRecordsToBeDeleted([]);
        setIsDeleteDialogOpen(false);
        return void retrieveAssetInfoRecordsApi.refetch();
      })
      .catch(() => {});
  };

  const handleConfirmDelete = () => {
    deleteRecords();
  };
  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  const { items } = useMuiPagination({
    showFirstButton: true,
    showLastButton: true,
    count: pageCount,
    page: pageNumber + 1,
    onChange: handleChangePage,
  });

  const handleRowClick = (row: Row<AssetInfoRecord>) => {
    setClickedRowIdentifier({
      rowIndex: row.id,
      pageIndex: pageNumber,
      assetId: row.original.assetId,
    });
  };

  const handleDeleteOne = (asset: AssetInfoRecord) => {
    if (asset.assetId) {
      setRecordsToBeDeleted([asset]);
      setIsDeleteDialogOpen(true);
    }
  };

  const { isLoading, isError, isFetching } = retrieveAssetInfoRecordsApi;

  const routeState: RouteState = {
    clickedRowIdentifier,
    pageNumber,
  };

  useUpdateEffect(() => {
    history.replace(location.pathname, routeState);
    if (clickedRowIdentifier) {
      history.push(
        generatePath(routes.assetManager.edit, {
          assetId: clickedRowIdentifier.assetId,
        })
      );
    }
  }, [clickedRowIdentifier]);

  return (
    <GenericPageWrapper $topOffset={topOffset} $isFullPageHeight>
      <PageIntroWrapper>
        <PageIntro
          refetchAssetManagerRecords={retrieveAssetInfoRecordsApi.refetch}
        />
      </PageIntroWrapper>

      <Box pb={1}>
        <TableOptions
          handleFilterFormSubmit={handleFilterFormSubmit}
          handleGroupByColumnChange={handleGroupByColumnChange}
          groupByColumn={groupByColumn}
        />
      </Box>

      <DeletionWarningDialog
        open={isDeleteDialogOpen}
        handleConfirm={handleConfirmDelete}
        handleCancel={handleCancelDelete}
        isDeleting={deleteRecordsApi.isFetching}
        hasError={!!deleteRecordsApi.error}
        recordCount={recordsToBeDeleted.length}
      >
        {!recordsToBeDeleted.length ? (
          <Typography>{t('ui.assetlist.empty', 'No assets found')}</Typography>
        ) : (
          <DeleteUnorderedList>
            {recordsToBeDeleted.map((record) => (
              <DeleteListItem key={record.assetId}>
                {record.assetDescription}
              </DeleteListItem>
            ))}
          </DeleteUnorderedList>
        )}
      </DeletionWarningDialog>

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
            {!isLoading && !isError && !isFetching && rows.length === 0 && (
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
          in={!isLoading && !isError && rows.length > 0}
          style={{ height: '100%' }}
        >
          <Box height="100%" display="flex" flexDirection="column">
            <Box>
              <AssetManagerPagination
                showBulkActions
                actions={{
                  deleteSelected: () => {
                    setRecordsToBeDeleted(Object.values(selectedRows));
                    setIsDeleteDialogOpen(true);
                  },
                  copySelected: () => {
                    const filteredRowIds = Object.keys(selectedRows).filter(
                      (rowId) => selectedRows[rowId]
                    );

                    if (filteredRowIds.length === 1) {
                      const copyAssetRoutePath = generatePath(
                        routes.assetManager.copy,
                        {
                          assetId: filteredRowIds[0],
                        }
                      );

                      history.push(copyAssetRoutePath);
                    }
                  },
                  isCopyDisabled:
                    Object.keys(selectedRows).filter(
                      (rowId) => selectedRows[rowId]
                    ).length !== 1,
                  transferSelected: () => {
                    const filteredRowIds = Object.keys(selectedRows).filter(
                      (rowId) => selectedRows[rowId]
                    );

                    if (filteredRowIds.length > 0) {
                      const transferRoutePath = stringifyAssetTransferQuery(
                        filteredRowIds
                      );

                      history.push(transferRoutePath);
                    }
                  },
                }}
                disableBulkActions={!Object.values(selectedRows).some((_) => _)}
                totalRows={totalRows}
                pageIndex={pageNumber}
                pageSize={pageSize}
                align="center"
                items={items}
              />
            </Box>
            <Box py={1} height="100%">
              <DarkFadeOverlay darken={isFetching} height="100%">
                <GenericDataTable<AssetInfoRecord>
                  tableInstance={tableInstance}
                  disableActions={isFetching}
                  pageNumber={pageNumber}
                  clickedRowIdentifier={clickedRowIdentifier}
                  tableAriaLabelText="asset manager table"
                  isRecordDisabled={isRecordDisabled}
                  columnIdToAriaLabel={columnIdToAriaLabel}
                  getColumnWidth={getColumnWidth}
                  handleDeleteOne={handleDeleteOne}
                  handleRowClick={handleRowClick}
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
  );
};

export default AssetSummaryRecords;
