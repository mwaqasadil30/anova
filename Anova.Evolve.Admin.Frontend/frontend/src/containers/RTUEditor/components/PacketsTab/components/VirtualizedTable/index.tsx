/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import { RtuPacketDTO } from 'api/admin/api';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import FormatDateTime from 'components/FormatDateTime';
import ScrollbarSync from 'components/ScrollbarSync';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Cell,
  Column,
  Hooks,
  useBlockLayout,
  useSortBy,
  useTable,
} from 'react-table';
import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';
import { FixedSizeList } from 'react-window';
import styled, { css } from 'styled-components';
import { isNumber } from 'utils/format/numbers';
import {
  buildCommunicationMethodGroupTextMapping,
  buildPacketStatusTextMapping,
} from 'utils/i18n/enum-to-text';
import { sortNullableDates } from 'utils/tables';
import { getScrollbarWidth } from 'utils/ui/helpers';
import { buildPacketTypeTextMapping } from '../../../../../../utils/i18n/enum-to-text';
import {
  columnIdToAriaLabel,
  getColumnWidth,
  PacketColumnId,
} from '../../helpers';

const MonospacedTypography = styled(Typography)`
  font-family: Monospace;
  font-size: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-decoration: underline;
`;

const StyledDialogDetailsLabel = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize.commonFontSize};
  font-weight: 400;
  color: ${(props) => props.theme.palette.text.secondary};
`;

const StyledDialogDetailsValue = styled(Typography)`
  font-size: 14px;
  font-weight: 600;
  word-break: break-all;
`;

const ROW_HEIGHT = 35;

const StyledTableContainer = styled(TableContainer)`
  overflow-x: auto;
  overflow-y: hidden;
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

const StyledTableRow = styled(({ rowOriginalData, isClickable, ...props }) => (
  <TableRow {...props} />
))`
  height: ${ROW_HEIGHT}px;
  cursor: ${(props) => (props.isClickable ? 'pointer' : 'inherit')};
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
  line-height: 22px;
`;

const StyledTableCell = styled(TableCell)`
  ${sharedTextOverflowStyles}
  padding: 4px 8px;
`;

const recordsDefault: RtuPacketDTO[] = [];

interface DialogDetails {
  label: string;
  value: string;
  packetId: string;
}

interface Props {
  isLoadingInitial?: boolean;
  responseError?: any | null;
  apiResponse?: RtuPacketDTO[] | null;
  // Virtualized table specific props
  overscanCount?: number;
}

const VirtualizedTable = ({
  isLoadingInitial,
  responseError,
  apiResponse,
  overscanCount,
}: Props) => {
  const { t } = useTranslation();

  const [isAdditionalInfoDialogOpen, setAdditionalInfoDialogOpen] = useState(
    false
  );
  const [dialogDetails, setDialogDetails] = useState<DialogDetails | null>();
  const openAdditionalInfoDialog = (selectedCell: Cell<RtuPacketDTO>) => {
    setDialogDetails({
      label: selectedCell.column.id,
      value: selectedCell.value,
      packetId: selectedCell.row.values.packetId,
    });

    setAdditionalInfoDialogOpen(true);
  };
  const closeAdditionalInfoDialog = () => {
    setAdditionalInfoDialogOpen(false);
    setDialogDetails(null);
  };

  const canReadRtuPacketDetails = true;

  const records = apiResponse || recordsDefault;

  const communicationMethodGroupTextMapping = buildCommunicationMethodGroupTextMapping(
    t
  );
  const packetTypeTextMapping = buildPacketTypeTextMapping(t);

  const packetStatusTextMapping = buildPacketStatusTextMapping(t);

  const rawColumns: Column<RtuPacketDTO>[] = [
    {
      id: PacketColumnId.DeviceId,
      Header: t('ui.common.rtu', 'RTU') as string,
      accessor: PacketColumnId.DeviceId,
    },
    {
      id: PacketColumnId.ChannelNumber,
      Header: t('ui.common.channel', 'Channel') as string,
      accessor: PacketColumnId.ChannelNumber,
    },
    {
      id: PacketColumnId.CommunicationMethod,
      Header: t('ui.packetretrieval.method', 'Method') as string,
      accessor: (row: RtuPacketDTO) => {
        if (row.communicationMethod) {
          return communicationMethodGroupTextMapping[row.communicationMethod];
        }
        return '';
      },
    },
    {
      id: PacketColumnId.Address,
      Header: t('ui.common.address', 'Address') as string,
      accessor: PacketColumnId.Address,
    },
    {
      id: PacketColumnId.ServerTimestamp,
      Header: t(
        'ui.packetretrieval.datesentrcvdbydol',
        'Date Sent/Rcvd by DOL'
      ) as string,
      accessor: PacketColumnId.ServerTimestamp,
      Cell: (cell) => {
        return <FormatDateTime date={cell.value} />;
      },
      sortType: sortNullableDates,
      sortDescFirst: true,
    },
    {
      id: PacketColumnId.RtuTimestamp,
      Header: t(
        'ui.packetretrieval.datesentbyrtu',
        'Date Sent by RTU'
      ) as string,
      accessor: PacketColumnId.RtuTimestamp,
      Cell: (cell) => {
        return <FormatDateTime date={cell.value} />;
      },
      sortType: sortNullableDates,
      sortDescFirst: true,
    },
    {
      id: PacketColumnId.PacketId,
      Header: t('ui.rturequest.packetid', 'Packet Id') as string,
      accessor: PacketColumnId.PacketId,
    },
    {
      id: PacketColumnId.PacketType,
      Header: t('ui.packetretrieval.packettype', 'Packet Type') as string,
      accessor: (row: RtuPacketDTO) => {
        if (row.packetType) {
          return packetTypeTextMapping[row.packetType];
        }
        return '';
      },
    },
    {
      id: PacketColumnId.SequenceNumber,
      Header: t(
        'ui.packetretrieval.sequencenumber',
        'Sequence Number'
      ) as string,
      accessor: PacketColumnId.SequenceNumber,
      sortType: 'number',
    },
    {
      id: PacketColumnId.ProcessState,
      Header: t('ui.packetretrieval.processstate', 'Process State') as string,
      accessor: (row: RtuPacketDTO) => {
        if (row.processState) {
          return packetStatusTextMapping[row.processState];
        }
        return '';
      },
    },
    {
      id: PacketColumnId.Payload,
      Header: t('ui.packetretrieval.originalhex', 'Original Hex') as string,
      accessor: PacketColumnId.Payload,
      Cell: (cell) => {
        return <MonospacedTypography>{cell.value}</MonospacedTypography>;
      },
    },
    {
      id: PacketColumnId.AdditionalInformation,
      Header: t(
        'ui.packetretrieval.additionalinformation',
        'Additional Information'
      ) as string,
      accessor: PacketColumnId.AdditionalInformation,
      Cell: (cell) => {
        return <MonospacedTypography>{cell.value}</MonospacedTypography>;
      },
    },
  ];
  const tableColumns = useMemo(
    () =>
      rawColumns.map((column) => ({
        ...column,
        width: getColumnWidth(column.id!),
      })),
    [rawColumns]
  );

  const data = React.useMemo(() => records, [records]);
  const columns = React.useMemo(() => tableColumns, [
    records,
    canReadRtuPacketDetails,
  ]);

  // react table does all its internal functions based off id. id must be consistent throughtout all data going in and out of the table.
  const tableInstance = useTable<RtuPacketDTO>(
    {
      columns,
      initialState: {
        hiddenColumns: [],
        sortBy: [
          {
            id: PacketColumnId.ServerTimestamp,
            desc: true,
          },
        ],
      },
      data,
      disableMultiSort: true,
    },
    useSortBy,
    // useBlockLayout is necesssary when virtualizing the table
    useBlockLayout,
    (hooks: Hooks<RtuPacketDTO>) => {
      hooks.visibleColumns.push((hookColumns: any) => [...hookColumns]);
    }
  );
  const {
    headerGroups,
    rows,
    getTableProps,
    getTableBodyProps,
    prepareRow,
  } = tableInstance;

  // Syncing scroll between the virtualized table and a fake scrollbar
  // overlapping the table's scrollbar. This was needed b/c the virtualized
  // table's vertical scrollbar was only visible when scrolling all the way to
  // the right.
  const scrollBarSize = React.useMemo(() => getScrollbarWidth(), []);
  const syncScrollbarRef = useRef<HTMLDivElement>(null);
  const defaultVirtualizedListRef = useRef<FixedSizeList>(null);
  const virtualizedListRef = defaultVirtualizedListRef;
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
      // packetId below + onclick needed for the "Reprocess" button / api call.
      // const packetIdString = row.original.packetId?.toString();

      return (
        <StyledTableRow
          {...row.getRowProps({
            style,
          })}
          component="div"
          rowOriginalData={row.original}
          // {...(canReadRtuPacketDetails &&
          //   {
          //     onClick: () => {
          //       // updateRouteState({
          //       //   packetId: packetIdString || '',
          //       // });
          //       history.push(
          //         generatePath(routes.rtuPacketList.edit, {
          //           packetId: row.original.packetId,
          //         })
          //       );
          //     },
          //   })}
          isClickable={canReadRtuPacketDetails}
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

              const isOriginalHexCell = cell.column.id === 'payload';
              const isAdditionalInformationCell =
                cell.column.id === 'additionalInformation';
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
                  onClick={() => {
                    if (isOriginalHexCell || isAdditionalInformationCell) {
                      openAdditionalInfoDialog(cell);
                    }
                  }}
                >
                  {cell.render('Cell')}
                </StyledTableCell>
              );
            })}
        </StyledTableRow>
      );
    },
    [prepareRow, rows, memoizedGlobalHeaderGroupWidth]
  );

  const isAdditionalInformationCell =
    dialogDetails?.label === 'additionalInformation';
  const isOriginalHexCell = dialogDetails?.label === 'payload';

  const formattedDetails = dialogDetails?.value ? dialogDetails?.value : '-';

  return (
    <>
      <UpdatedConfirmationDialog
        maxWidth="xs"
        open={isAdditionalInfoDialogOpen}
        onConfirm={closeAdditionalInfoDialog}
        mainTitle={`${t('ui.rturequest.packetid', 'Packet Id')} ${
          dialogDetails?.packetId
        }`}
        content={
          <>
            {isAdditionalInformationCell && (
              <Grid container justify="flex-start">
                <Grid item xs={12}>
                  <StyledDialogDetailsLabel>
                    {t(
                      'ui.packetretrieval.additionalinformation',
                      'Additional Information'
                    )}
                  </StyledDialogDetailsLabel>
                </Grid>
                <Grid item xs={12}>
                  <StyledDialogDetailsValue>
                    {formattedDetails}
                  </StyledDialogDetailsValue>
                </Grid>
              </Grid>
            )}

            {isOriginalHexCell && (
              <Grid container justify="flex-start">
                <Grid item xs={12}>
                  <StyledDialogDetailsLabel>
                    {t('ui.packetretrieval.originalhex', 'Original Hex')}
                  </StyledDialogDetailsLabel>
                </Grid>
                <Grid item xs={12}>
                  <StyledDialogDetailsValue>
                    {formattedDetails}
                  </StyledDialogDetailsValue>
                </Grid>
              </Grid>
            )}
          </>
        }
        hideCancelButton
      />
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
            const calculatedTableHeight = (rows.length + 1) * ROW_HEIGHT;

            const isHorizontalScrollbarHidden =
              width > globalHeaderGroupWidth + scrollBarSize;
            const horizontalScrollbarSize = isHorizontalScrollbarHidden
              ? 0
              : scrollBarSize;
            const tableWrapperHeight =
              height > rows.length * ROW_HEIGHT + horizontalScrollbarSize
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
                  // TODO: Replace this by using TableProps
                  aria-label="rtu packets table"
                  size="small"
                  stickyHeader
                  style={{ borderTop: 0, width }}
                  // {...TableProps}
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
                                    (globalHeaderGroupWidth + scrollBarSize)) *
                                  width;
                              }

                              return (
                                <StyledTableHeadCell
                                  component="div"
                                  {...columnProps}
                                  align="inherit"
                                  style={{
                                    ...columnProps.style,
                                    width: columnWidth,
                                  }}
                                  sortDirection={sortDirection}
                                  aria-label={columnIdToAriaLabel(column.id)}
                                  title={column.Header}
                                  columnId={column.id}
                                >
                                  <StyledTableSortLabel
                                    active={column.canSort && column.isSorted}
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
                      overscanCount={overscanCount}
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
  );
};

export default VirtualizedTable;
