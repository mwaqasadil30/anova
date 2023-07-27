/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import {
  EvolveRetrieveProductRecordsByDomainRequest,
  EvolveRetrieveProductRecordsByDomainResponse,
  ProductRecord,
  UserPermissionType,
} from 'api/admin/api';
import routes from 'apps/admin/routes';
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
import MessageBlock from 'components/MessageBlock';
import TableActionCell from 'components/TableActionCell';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath, useHistory } from 'react-router';
import {
  Cell,
  Hooks,
  Row,
  useGlobalFilter,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table';
import {
  selectActiveDomainId,
  selectTopOffset,
} from 'redux-app/modules/app/selectors';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import { AccessType } from 'types';
import {
  formatSpecificGravity,
  formatStandardVolumPerCubicMeter,
} from 'utils/format/numbers';
import { caseInsensitive } from 'utils/tables';
import { toggleAllSelectedRows, toggleOneSelectedRow } from 'utils/ui/deletion';
import PageIntro from './components/PageIntro';
import TableActionsAndPagination from './components/TableActionsAndPagination';
import TableOptions from './components/TableOptions';
import {
  columnIdToAriaLabel,
  getColumnWidth,
  isRecordDisabled,
  ProductListColumnId,
} from './helpers';
import { useDeleteProducts } from './hooks/useDeleteProducts';
import { useRetrieveProductRecords } from './hooks/useRetrieveProductRecords';

const recordsDefault: ProductRecord[] = [];

const ProductManagerList = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const topOffset = useSelector(selectTopOffset);

  const domainId = useSelector(selectActiveDomainId);

  const hasPermission = useSelector(selectHasPermission);
  const canDelete = hasPermission(
    UserPermissionType.ProductAccess,
    AccessType.Delete
  );

  const [
    apiResponse,
    setApiResponse,
  ] = useState<EvolveRetrieveProductRecordsByDomainResponse | null>(null);
  const [selectedRows, setSelectedRows] = useState<
    Record<string, ProductRecord>
  >({});

  // Deletion
  const deleteProductsApi = useDeleteProducts();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordsToBeDeleted, setRecordsToBeDeleted] = useState<ProductRecord[]>(
    []
  );
  const handleDeleteOne = (product: ProductRecord) => {
    if (product.productId) {
      setRecordsToBeDeleted([product]);
      setIsDeleteDialogOpen(true);
    }
  };

  // Set up hidden columns
  // IMPORTANT NOTE: To avoid an infinite loop, we need to memoize
  // hiddenColumns.
  const hiddenPermissionColumns = canDelete ? [] : ['selection', 'action'];

  const hiddenColumns = React.useMemo(() => [...hiddenPermissionColumns], [
    hiddenPermissionColumns.join(','),
  ]);

  const records =
    apiResponse?.retrieveProductRecordsByDomainResult || recordsDefault;

  const data = React.useMemo(() => records, [records]);
  const columns = React.useMemo(
    () => [
      {
        Header: t('ui.product.name', 'Name'),
        accessor: ProductListColumnId.Name,
      },
      {
        Header: t('ui.common.description', 'Description'),
        accessor: ProductListColumnId.Description,
      },
      {
        Header: t('ui.product.productgroup', 'Product Group'),
        accessor: ProductListColumnId.ProductGroup,
      },
      {
        Header: t('ui.product.specificgravity', 'Specific Gravity'),
        accessor: ProductListColumnId.SpecificGravity,
        sortType: 'basic',
        disableGlobalFilter: true,
        Cell: ({ value }: Cell<ProductRecord>) => formatSpecificGravity(value),
      },
      {
        Header: t(
          'ui.product.standardvolumepercubicmeter',
          'Standard Volume / Cubic Meter'
        ),
        accessor: ProductListColumnId.StandardVolumePerCubicMeter,
        sortType: 'basic',
        disableGlobalFilter: true,
        Cell: ({ value }: Cell<ProductRecord>) =>
          formatStandardVolumPerCubicMeter(value),
      },
      {
        Header: t('ui.common.datachannelcount', 'Data Channel Count'),
        accessor: ProductListColumnId.DataChannelCount,
        sortType: 'basic',
        disableGlobalFilter: true,
      },
      {
        id: 'action',
        Header: '',
        accessor: '_',
        defaultCanSort: false,
        disableSortBy: true,
        Cell: TableActionCell,
      },
    ],
    [t, selectedRows]
  );

  const tableInstance = useTable<ProductRecord>(
    {
      // @ts-ignore
      columns,
      // @ts-ignore
      data,
      initialState: {
        hiddenColumns,
      },
      // Sortingactions = {},
      disableMultiSort: true,
      sortTypes: {
        alphanumeric: caseInsensitive,
      },
    },
    useGlobalFilter,
    useSortBy,
    useRowSelect,
    (hooks: Hooks<ProductRecord>) => {
      hooks.visibleColumns.push((hookColumns: any) => [
        {
          id: 'selection',
          Header: ({ rows: _rows }) => {
            const selectableRows = _rows.filter(
              (row) =>
                !isRecordDisabled(row.values as ProductRecord) &&
                row?.original?.productId
            );
            const areAllRowsSelected =
              !!selectableRows.length &&
              selectableRows.every(
                (row) => selectedRows[row.original.productId!]
              );
            return (
              <TableCellCheckbox
                onChange={() => {
                  const newSelectedRows = toggleAllSelectedRows(
                    selectedRows,
                    selectableRows,
                    'productId'
                  );
                  setSelectedRows(newSelectedRows);
                }}
                checked={areAllRowsSelected}
                disabled={!selectableRows.length}
                style={{ paddingTop: 0, paddingBottom: 0 }}
              />
            );
          },
          Cell: ({ row }: { row: Row<ProductRecord> }) => (
            <TableCellCheckbox
              onChange={() =>
                setSelectedRows((prevSelectedRows) => {
                  const newSelectedRows = toggleOneSelectedRow(
                    prevSelectedRows,
                    row,
                    'productId'
                  );

                  return newSelectedRows;
                })
              }
              checked={!!selectedRows[row.original.productId!] || false}
              disabled={isRecordDisabled(row.values as ProductRecord)}
            />
          ),
          defaultCanSort: false,
          disableSortBy: true,
        },
        ...hookColumns,
      ]);
    }
  );

  const retrieveProductRecordsApi = useRetrieveProductRecords(
    {
      domainId,
    } as EvolveRetrieveProductRecordsByDomainRequest,
    {
      // We use keepPreviousData so the <TransitionLoadingSpinner /> doesnt
      // appear when a user selects a new page that they haven't accessed before.
      // see: (rows.length === 0 && isFetching) in the <TransitionLoadingSpinner />
      keepPreviousData: true,
      onSuccess: (apiData) => {
        // Reset selected rows to not carry over to new pages.
        setSelectedRows({});
        setApiResponse(apiData);
      },
    }
  );

  const deleteRecords = () => {
    return deleteProductsApi
      .makeRequest({
        productIds: recordsToBeDeleted
          .filter((record) => record.productId)
          .map((record) => record.productId!),
      })
      .then(() => {
        setSelectedRows({});
        setRecordsToBeDeleted([]);
        setIsDeleteDialogOpen(false);
        return void retrieveProductRecordsApi.refetch();
      })
      .catch(() => {});
  };

  const handleConfirmDelete = () => {
    deleteRecords();
  };
  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  useEffect(() => {
    retrieveProductRecordsApi.refetch();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [retrieveProductRecordsApi.refetch]);

  // Reset hidden columns if they change (example: user permissions are updated)
  useEffect(() => {
    tableInstance.setHiddenColumns(hiddenColumns);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [hiddenColumns]);

  const handleRowClick = (row: Row<ProductRecord>) => {
    history.push(
      generatePath(routes.productManager.edit, {
        productId: row.original.productId,
      })
    );
  };

  const { isLoading, isError, isFetching } = retrieveProductRecordsApi;

  return (
    <GenericPageWrapper $topOffset={topOffset} $isFullPageHeight>
      <PageIntroWrapper>
        <PageIntro refetchRecords={retrieveProductRecordsApi.refetch} />
      </PageIntroWrapper>

      <Box pb={1}>
        <TableOptions setGlobalFilter={tableInstance.setGlobalFilter} />
      </Box>

      <DeletionWarningDialog
        open={isDeleteDialogOpen}
        handleConfirm={handleConfirmDelete}
        handleCancel={handleCancelDelete}
        isDeleting={deleteProductsApi.isFetching}
        hasError={!!deleteProductsApi.error}
        recordCount={recordsToBeDeleted.length}
      >
        {!!recordsToBeDeleted.length && (
          <DeleteUnorderedList>
            {recordsToBeDeleted.map((record) => (
              <DeleteListItem key={record.productId}>
                {record.name}
              </DeleteListItem>
            ))}
          </DeleteUnorderedList>
        )}
      </DeletionWarningDialog>

      <BoxWithOverflowHidden pt={0} pb={8}>
        <TransitionLoadingSpinner
          in={isLoading || (tableInstance.rows.length === 0 && isFetching)}
        />
        <TransitionErrorMessage in={!isLoading && !!isError} />

        <Fade
          in={
            !isLoading &&
            !isError &&
            !isFetching &&
            tableInstance.rows.length === 0
          }
          unmountOnExit
        >
          <div>
            {!isLoading &&
              !isError &&
              !isFetching &&
              tableInstance.rows.length === 0 && (
                <MessageBlock>
                  <Box m={2}>
                    <SearchCloudIcon />
                  </Box>
                  <LargeBoldDarkText>
                    {t('ui.product.productmanager.empty', 'No products found')}
                  </LargeBoldDarkText>
                </MessageBlock>
              )}
          </div>
        </Fade>

        <Fade
          in={!isLoading && !isError && tableInstance.rows.length > 0}
          style={{ height: '100%' }}
        >
          <Box height="100%" display="flex" flexDirection="column">
            <Box>
              <TableActionsAndPagination
                showActions={canDelete}
                disableActions={!Object.values(selectedRows).some((_) => _)}
                totalRows={tableInstance.rows.length}
                actions={{
                  deleteSelected: () => {
                    setRecordsToBeDeleted(Object.values(selectedRows));
                    setIsDeleteDialogOpen(true);
                  },
                }}
              />
            </Box>
            <Box py={1} height="100%">
              <DarkFadeOverlay darken={isFetching} height="100%">
                <GenericDataTable<ProductRecord>
                  tableInstance={tableInstance}
                  disableActions={isFetching}
                  tableAriaLabelText="product manager table"
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

export default ProductManagerList;
