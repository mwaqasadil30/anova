import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableGroupedRow from 'components/tables/components/TableGroupedRow';
import BoldPrimaryText from 'components/typography/BoldPrimaryText';
import PageCount from 'components/typography/PageCount';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Cell, Column, useExpanded, useGroupBy, useTable } from 'react-table';
import styled from 'styled-components';
import {
  buildAssetTypeTextMapping,
  buildDataChannelTypeTextMapping,
} from 'utils/i18n/enum-to-text';
import {
  AssetGroupLoadAssetSummaryOptions,
  AssetSummaryRecord,
  EvolveRetrieveAssetSummaryFromAssetGroupLoadByOptionsRequest,
} from '../../../api/admin/api';
import CircularProgress from '../../../components/CircularProgress';
import MessageBlock from '../../../components/MessageBlock';
import TableBody from '../../../components/tables/components/TableBody';
import TableHead from '../../../components/tables/components/TableHead';
import { selectActiveDomain } from '../../../redux-app/modules/app/selectors';
import { selectUser } from '../../../redux-app/modules/user/selectors';
import {
  callApiForSelectedAssets,
  GroupedCell,
  PaddedHeadCell,
  ResponsePayload,
  SelectedAssetsTable,
  SelectedAssetsTableContainer,
  StyledGroupedRowText,
} from '../constants';
import EmptyContent from './EmptyContent';
import {
  columnIdToAriaLabel,
  SelectedAssetsColumnId,
} from './SelectedAssets.helpers';

const Wrapper = styled.div`
  position: relative;
  height: 100%;
`;

const groupByColumnAccessor: keyof AssetSummaryRecord = 'customerName';
const defaultOptions = {
  showDataChannelTypes: null,
  isCountRequired: true,
  itemsPerPage: 100,
  pageIndex: 0,
  filterText: '',
  sortColumnName: 'AssetTitle',
  sortDirection: 0,
  areDataChannelTypesRequired: true,
  assetSearchExpression: null,
  filterBy: 0,
  groupBy: 0,
  groupBySortDirection: 0,
  searchCriteria: null,
  groupBySortDirectionAsText: '',
} as AssetGroupLoadAssetSummaryOptions;

export default function SelectedAssets({
  values,
}: {
  values: ResponsePayload;
}) {
  const { t } = useTranslation();
  const [assetRecords, setAssetRecords] = useState<AssetSummaryRecord[]>([]);
  const activeDomain = useSelector(selectActiveDomain);
  const domainId = activeDomain?.domainId;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const user = useSelector(selectUser);
  const userId =
    user.data?.authenticateAndRetrieveApplicationInfoResult?.userInfo?.userId;

  const dataChannelTypeTextMapping = buildDataChannelTypeTextMapping(t);
  const assetTypeTextMapping = buildAssetTypeTextMapping(t);

  useEffect(() => {
    callApiForSelectedAssets({
      assetGroupSearchCriteria: values.assetGroupSearchCriteria,
      options: {
        ...defaultOptions,
        domainId,
        userId,
        assetGroupDomainId:
          values.retrieveAssetGroupEditComponentsByIdResult?.editObject
            ?.domainId,
      } as AssetGroupLoadAssetSummaryOptions,
    } as EvolveRetrieveAssetSummaryFromAssetGroupLoadByOptionsRequest).then(
      (response) => {
        setIsLoading(false);
        setAssetRecords(
          response.retrieveAssetSummaryFromAssetGroupLoadByOptionsResult
            ?.records || []
        );
      }
    );
  }, []);

  const columns = React.useMemo(
    (): Column[] => [
      {
        id: SelectedAssetsColumnId.AssetDescription,
        Header: (
          <PaddedHeadCell key="assetDescription" width={180}>
            {t('ui.datachannel.assetdescription', 'Asset Description')}
          </PaddedHeadCell>
        ),
        accessor: 'assetDescription',
        Cell: ({ value }: Cell<AssetSummaryRecord>) => {
          return <BoldPrimaryText variant="body2">{value}</BoldPrimaryText>;
        },
      },
      {
        id: SelectedAssetsColumnId.AssetTitle,
        Header: (
          <PaddedHeadCell key="assetTitle" width={230}>
            {t('ui.datachannel.assettitle', 'Asset Title')}
          </PaddedHeadCell>
        ),
        accessor: 'assetTitle',
      },
      {
        id: SelectedAssetsColumnId.DataChannelDescription,
        Header: (
          <PaddedHeadCell key="dataChannelDescription" width={280}>
            {t(
              'ui.datachannel.datachanneldescription',
              'Data Channel Description'
            )}
          </PaddedHeadCell>
        ),
        accessor: 'dataChannelDescription',
      },
      {
        id: SelectedAssetsColumnId.DataChannelType,
        Header: (
          <PaddedHeadCell key="dataChannelType" width={200}>
            {t('ui.datachannel.datachanneltype', 'Data Channel Type')}
          </PaddedHeadCell>
        ),
        // @ts-ignore
        accessor: (row: AssetSummaryRecord) => {
          if (row.dataChannelType) {
            return dataChannelTypeTextMapping[row.dataChannelType];
          }
          return '';
        },
      },
      {
        id: SelectedAssetsColumnId.ProductDescription,
        Header: (
          <PaddedHeadCell key="productDescription" width={220}>
            {t('ui.rtu400series.productdescription', 'Product Description')}
          </PaddedHeadCell>
        ),
        accessor: 'productDescription',
      },
      {
        id: SelectedAssetsColumnId.AssetType,
        Header: (
          <PaddedHeadCell key="assetType" width={220}>
            {t('ui.asset.assettype', 'Asset Type')}
          </PaddedHeadCell>
        ),
        // @ts-ignore
        accessor: (row: AssetSummaryRecord) => {
          if (row.assetType) {
            return assetTypeTextMapping[row.assetType];
          }
          return '';
        },
      },
      {
        id: SelectedAssetsColumnId.RtuDeviceId,
        Header: (
          <PaddedHeadCell key="rtuDeviceId" width={220}>
            {t('ui.rturequest.rtudeviceid', 'RTU Device Id')}
          </PaddedHeadCell>
        ),
        accessor: 'rtuDeviceId',
      },
      {
        id: SelectedAssetsColumnId.ChannelNumber,
        Header: (
          <PaddedHeadCell key="channelNumber" width={220}>
            {t('ui.assetgroup.ChannelNumber', 'Channel Number')}
          </PaddedHeadCell>
        ),
        accessor: 'channelNumber',
      },
      {
        id: SelectedAssetsColumnId.GroupedColumn,
        Header: (
          <PaddedHeadCell key="customerName" width={220}>
            {t('ui.common.customername', 'Customer Name')}
          </PaddedHeadCell>
        ),
        accessor: groupByColumnAccessor,
      },
    ],
    [t]
  );

  const expanded = React.useMemo(
    () =>
      assetRecords.reduce((prev, current) => {
        prev[
          `${groupByColumnAccessor}:${current[groupByColumnAccessor]}`
        ] = true;
        return prev;
      }, {} as Record<string, boolean>),
    [assetRecords, groupByColumnAccessor]
  );

  const {
    getTableProps,
    getTableBodyProps,
    rows,
    prepareRow,
    headerGroups,
  } = useTable<AssetSummaryRecord>(
    {
      // @ts-ignore-line
      columns,
      data: assetRecords,
      initialState: {
        groupBy: [groupByColumnAccessor],
        expanded,
      },
    },
    useGroupBy,
    useExpanded
  );

  return (
    <Wrapper>
      <Grid container direction="column" alignItems="stretch">
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={6} />
            <Grid item xs={6}>
              <PageCount style={{ display: isLoading ? 'none' : 'inherit' }}>
                {t('ui.common.itemCount', '{{count}} items', {
                  count: assetRecords?.length,
                })}
              </PageCount>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ minHeight: 330 }}>
          {isLoading ? (
            <MessageBlock>
              <CircularProgress />
            </MessageBlock>
          ) : (
            <SelectedAssetsTableContainer>
              {headerGroups.map((hg) => (
                <SelectedAssetsTable
                  {...hg.getHeaderGroupProps()}
                  aria-label="asset group selected assets table"
                  stickyHeader
                  {...getTableProps()}
                >
                  <TableHead>
                    <TableRow {...hg.getHeaderGroupProps()}>
                      {hg.headers.map(
                        (header) => !header.isGrouped && header.render('Header')
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody {...getTableBodyProps()}>
                    {(() => {
                      if (rows?.length) {
                        return rows.map((row) => {
                          prepareRow(row);

                          if (row.isGrouped) {
                            const groupedCell = row.cells.find(
                              (cell) => cell.isGrouped
                            );
                            return (
                              <TableGroupedRow {...row.getRowProps()}>
                                {groupedCell && (
                                  <GroupedCell
                                    colSpan={hg.headers.length}
                                    {...groupedCell.getCellProps()}
                                  >
                                    <Grid container spacing={1}>
                                      <Grid item>
                                        <StyledGroupedRowText>
                                          {row.groupByVal} ({row.subRows.length}
                                          )
                                        </StyledGroupedRowText>
                                      </Grid>
                                    </Grid>
                                  </GroupedCell>
                                )}
                              </TableGroupedRow>
                            );
                          }
                          return (
                            <TableRow {...row.getRowProps()}>
                              {row.cells
                                .filter((cell) => !cell.isPlaceholder)
                                .map((cell) => {
                                  return (
                                    <TableCell
                                      {...cell.getCellProps()}
                                      aria-label={columnIdToAriaLabel(
                                        cell.column.id
                                      )}
                                    >
                                      {cell.render('Cell')}
                                    </TableCell>
                                  );
                                })}
                            </TableRow>
                          );
                        });
                      }
                      return (
                        <TableRow>
                          <TableCell colSpan={hg.headers.length}>
                            <EmptyContent>
                              {t(
                                'ui.assetgroup.noassetsselected',
                                'No assets selected'
                              )}
                            </EmptyContent>
                          </TableCell>
                        </TableRow>
                      );
                    })()}
                  </TableBody>
                </SelectedAssetsTable>
              ))}
            </SelectedAssetsTableContainer>
          )}
        </Grid>
      </Grid>
    </Wrapper>
  );
}
