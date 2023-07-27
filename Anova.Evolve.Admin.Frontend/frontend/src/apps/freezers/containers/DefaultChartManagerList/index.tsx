/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import { ChartDefaultDto } from 'api/admin/api';
import routes from 'apps/freezers/routes';
import { AssetSubTypeEnum } from 'apps/freezers/types';
import BoxWithOverflowHidden from 'components/BoxWithOverflowHidden';
import CircularProgress from 'components/CircularProgress';
import DarkFadeOverlay from 'components/DarkFadeOverlay';
import DeletionWarningDialog from 'components/DeletionWarningDialog';
import {
  DeleteListItem,
  DeleteUnorderedList,
} from 'components/DeletionWarningDialog/styles';
import GenericDataTable from 'components/GenericDataTable';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import MessageBlock from 'components/MessageBlock';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath, useHistory } from 'react-router';
import {
  Column,
  Hooks,
  Row,
  useFilters,
  useGlobalFilter,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table';
import { selectTopOffset } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import { buildFreezerAssetSubTypeMapping } from 'utils/i18n/enum-to-text';
import { caseInsensitive } from 'utils/tables';
import { ChartYAxisPosition } from '../DefaultChartEditor/types';
import PageIntro from './components/PageIntro';
import TableActionCell from './components/TableActionCell';
import {
  columnIdToAriaLabel,
  DefaultChartListColumnId,
  getColumnWidth,
  isRecordDisabled,
} from './helpers';
import { useDeleteDefaultCharts } from './hooks/useDeleteDefaultChart';
import { useGetDefaultCharts } from './hooks/useGetDefaultCharts';

// Styled component to allow setting up overflow: hidden on a parent to prevent
// the table from exceeding the height of the page. The key properties being
// `display: flex` and `height: calc(...)` which allows the overflow: hidden to
// work properly.
const Wrapper = styled(({ topOffset, ...props }) => <div {...props} />)`
  ${(props) =>
    props.topOffset &&
    `
      display: flex;
      flex-direction: column;
      height: calc(100vh - ${props.topOffset}px - 16px);
    `};
`;

const recordsDefault: ChartDefaultDto[] = [];

const DefaultChartManagerList = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const retrieveDefaultChartsApi = useGetDefaultCharts();
  const deleteDefaultChartApi = useDeleteDefaultCharts();

  const topOffset = useSelector(selectTopOffset);

  const isFetching =
    retrieveDefaultChartsApi.isFetching || deleteDefaultChartApi.isLoading;

  const records = retrieveDefaultChartsApi.data || recordsDefault;

  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  // Deletion
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordsToBeDeleted, setRecordsToBeDeleted] = useState<
    ChartDefaultDto[]
  >([]);
  const handleDeleteOne = (defaultChart: ChartDefaultDto) => {
    if (defaultChart.chartDefaultId) {
      setRecordsToBeDeleted([defaultChart]);
      setIsDeleteDialogOpen(true);
    }
  };

  const freezerAssetSubTypeMapping = buildFreezerAssetSubTypeMapping(t);

  const data = React.useMemo(() => [...records], [records, selectedRows]);
  const columns: Column<ChartDefaultDto>[] = React.useMemo(
    () => [
      {
        id: DefaultChartListColumnId.GlobalChartname,
        Header: t(
          'ui.defaultChartManager.globalChartName',
          'Global Chart Name'
        ) as string,
        accessor: DefaultChartListColumnId.GlobalChartname,
      },
      {
        id: DefaultChartListColumnId.FreezerType,
        Header: t(
          'ui.defaultChartManager.freezerType',
          'Freezer Type'
        ) as string,

        accessor: DefaultChartListColumnId.FreezerType,
        Cell: (cell) => {
          return (
            freezerAssetSubTypeMapping[cell.value as AssetSubTypeEnum] || ''
          );
        },
      },
      {
        id: DefaultChartListColumnId.LeftYAxis,
        Header: t('ui.defaultChartManager.leftYAxis', 'Left Y Axis') as string,
        accessor: (row: ChartDefaultDto) => {
          const leftYAxisTags = row?.chartDefaultTags
            ?.filter(
              (tag) => tag.chartYaxisPosition === ChartYAxisPosition.Left
            )
            .map((tags) => {
              return tags.tagName;
            });

          return leftYAxisTags?.filter(Boolean).join(', ') || '';
        },
      },
      {
        id: DefaultChartListColumnId.RightYAxis,
        Header: t(
          'ui.defaultChartManager.rightYAxis',
          'Right Y Axis'
        ) as string,
        accessor: (row: ChartDefaultDto) => {
          const rightYAxisTags = row?.chartDefaultTags
            ?.filter(
              (tag) => tag.chartYaxisPosition === ChartYAxisPosition.Right
            )
            .map((tags) => {
              return tags.tagName;
            });

          return rightYAxisTags?.filter(Boolean).join(', ') || '';
        },
      },
      {
        id: DefaultChartListColumnId.SortIndex,
        Header: t('ui.defaultChartManager.sortIndex', 'Sort Index') as string,
        accessor: DefaultChartListColumnId.SortIndex,
        sortType: 'basic',
      },
    ],
    // NOTE: We need to put selectedRows in the list of dependencies in order
    // to make the select all checkbox in the Header column to work
    // Other pages with client-side searching do the same
    [t, selectedRows]
  );

  const tableInstance = useTable<ChartDefaultDto>(
    {
      // @ts-ignore
      columns,

      // @ts-ignore
      data,
      initialState: {
        hiddenColumns: [],
        sortBy: [
          {
            id: DefaultChartListColumnId.FreezerType,
            desc: false,
          },
        ],
      },
      // Sorting
      disableMultiSort: true,
      disableSortRemove: true,
      sortTypes: {
        alphanumeric: caseInsensitive,
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    useRowSelect,
    (hooks: Hooks<ChartDefaultDto>) => {
      hooks.visibleColumns.push((hookColumns: any) => [
        ...hookColumns,
        {
          id: 'action',
          Header: '',
          defaultCanSort: false,
          disableSortBy: true,
          Cell: TableActionCell,
        },
      ]);
    }
  );

  const refetchRecords = useCallback(() => {
    setSelectedRows({});
    retrieveDefaultChartsApi.refetch();
  }, [retrieveDefaultChartsApi.refetch]);

  const deleteRecords = () => {
    const defaultChartIdsToBeDeleted = recordsToBeDeleted
      .filter((record) => record.chartDefaultId)
      .map((record) => record.chartDefaultId!);

    if (defaultChartIdsToBeDeleted.length > 0) {
      deleteDefaultChartApi
        .mutateAsync(defaultChartIdsToBeDeleted[0])
        .then(() => {
          setSelectedRows({});
          setRecordsToBeDeleted([]);
          setIsDeleteDialogOpen(false);
        })
        .then(() => {
          return void refetchRecords();
        })
        .catch(() => {});
    }
  };

  const handleConfirmDelete = () => {
    deleteRecords();
  };
  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  useEffect(() => {
    refetchRecords();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [refetchRecords]);

  const handleRowClick = (row: Row<ChartDefaultDto>) => {
    history.push(
      generatePath(routes.defaultChartManager.edit, {
        defaultChartId: row.original.chartDefaultId,
      })
    );
  };

  return (
    <Wrapper topOffset={topOffset}>
      <PageIntroWrapper>
        <PageIntro />
      </PageIntroWrapper>

      <DeletionWarningDialog
        open={isDeleteDialogOpen}
        handleConfirm={handleConfirmDelete}
        handleCancel={handleCancelDelete}
        isDeleting={deleteDefaultChartApi.isLoading}
        hasError={!!deleteDefaultChartApi.error}
        recordCount={recordsToBeDeleted.length}
      >
        {!!recordsToBeDeleted.length && (
          <DeleteUnorderedList>
            {recordsToBeDeleted.map((record) => (
              <DeleteListItem key={record.chartDefaultId}>
                {record.name}
              </DeleteListItem>
            ))}
          </DeleteUnorderedList>
        )}
      </DeletionWarningDialog>

      <BoxWithOverflowHidden pt={1} pb={8}>
        <Fade
          in={
            retrieveDefaultChartsApi.isLoading ||
            (tableInstance.rows.length === 0 && isFetching)
          }
          unmountOnExit
        >
          <div>
            {(tableInstance.rows.length === 0 && isFetching) ||
            retrieveDefaultChartsApi.isLoading ? (
              <MessageBlock>
                <CircularProgress />
              </MessageBlock>
            ) : null}
          </div>
        </Fade>
        <Fade
          in={
            !retrieveDefaultChartsApi.isLoading &&
            !!retrieveDefaultChartsApi.error
          }
          unmountOnExit
        >
          <div>
            {retrieveDefaultChartsApi.isError && (
              <MessageBlock>
                <Typography variant="body2" color="error">
                  {t(
                    'ui.defaultChartManager.unableToRetrieveChartList',
                    'Unable to retrieve default chart list'
                  )}
                </Typography>
              </MessageBlock>
            )}
          </div>
        </Fade>
        <Fade
          in={
            !retrieveDefaultChartsApi.isLoading &&
            !retrieveDefaultChartsApi.error &&
            !isFetching &&
            tableInstance.rows.length === 0
          }
          unmountOnExit
        >
          <div>
            {!retrieveDefaultChartsApi.isLoading &&
              !retrieveDefaultChartsApi.error &&
              !isFetching &&
              tableInstance.rows.length === 0 && (
                <MessageBlock>
                  <Box m={2}>
                    <SearchCloudIcon />
                  </Box>
                  <LargeBoldDarkText>
                    {t(
                      'ui.defaultChartManager.noChartsFound',
                      'No default charts found'
                    )}
                  </LargeBoldDarkText>
                </MessageBlock>
              )}
          </div>
        </Fade>
        <Fade
          in={
            !retrieveDefaultChartsApi.isLoading &&
            !retrieveDefaultChartsApi.error &&
            tableInstance.rows.length > 0
          }
          style={{ height: '100%' }}
        >
          <Box height="100%" display="flex" flexDirection="column">
            <Box py={1} height="100%">
              <DarkFadeOverlay darken={isFetching} height="100%">
                <GenericDataTable<ChartDefaultDto>
                  tableInstance={tableInstance}
                  disableActions={isFetching}
                  tableAriaLabelText="default chart manager table"
                  isRecordDisabled={isRecordDisabled}
                  handleDeleteOne={handleDeleteOne}
                  columnIdToAriaLabel={columnIdToAriaLabel}
                  getColumnWidth={getColumnWidth}
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
    </Wrapper>
  );
};

export default DefaultChartManagerList;
