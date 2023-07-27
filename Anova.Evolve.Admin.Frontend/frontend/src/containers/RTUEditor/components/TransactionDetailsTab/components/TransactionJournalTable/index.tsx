import Box from '@material-ui/core/Box';
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@material-ui/icons/IndeterminateCheckBoxOutlined';
import { HornerTransactionJournalDTO } from 'api/admin/api';
import DownloadDialog from 'apps/ops/components/DownloadDialog';
import FormatDateTime from 'components/FormatDateTime';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';
import { Column, Cell, Row, useTable, useSortBy } from 'react-table';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import { GeoCsvFormat } from 'types';
import {
  formatCsvSeparator,
  formatTableDataForCsv,
} from 'utils/format/dataExport';
import {
  TransactionJournalTableColumnId,
  TransactionJournalTableColumnIdToAriaLabel,
} from '../../helpers';
import { TransactionDateRange, TransactionDetailsTableInfo } from '../../types';
import RecursiveGenericDataTable from '../RecursiveGenericDataTable';
import TransactionDetailsJournalTable from '../TransactionDetailsJournalTable';

type TransactionJournalTableProps = {
  closeDownloadDialog: () => void;
  setIsDownloading: Dispatch<SetStateAction<boolean>>;
  isDownloadDialogOpen: boolean;
  isDownloading: boolean;
  csvExportFilename: string;
  data?: HornerTransactionJournalDTO[] | null;
  transactionDate?: TransactionDateRange;
};
const TransactionJournalTable = ({
  closeDownloadDialog,
  isDownloadDialogOpen,
  setIsDownloading,
  isDownloading,
  csvExportFilename,
  data,
  transactionDate,
}: TransactionJournalTableProps) => {
  const { t } = useTranslation();
  const [subtableVisible, setSubtableVisible] = useState<number>(-1);
  const columns = useMemo<Column<TransactionDetailsTableInfo>[]>(
    () => [
      {
        id: TransactionJournalTableColumnId.Icon,
        Header: '',
        Cell: (d: Cell<HornerTransactionJournalDTO>) => {
          return (
            <Box
              onClick={() => {
                const openIndex =
                  subtableVisible !== d.row?.index ? d.row?.index : -1;
                setSubtableVisible(openIndex);
              }}
              style={{ width: '30px' }}
            >
              {d.row.index === subtableVisible ? (
                <IndeterminateCheckBoxOutlinedIcon />
              ) : (
                <AddBoxOutlinedIcon />
              )}
            </Box>
          );
        },
        width: 30,
        maxWidth: 30,
      },
      {
        id: TransactionJournalTableColumnId.BatchTime,
        Header: t('ui.rtuhorner.batchtime', 'Batch Time') as string,
        accessor: TransactionJournalTableColumnId.BatchTime, // accessor is the "key" in the data
        Cell: (cell: Cell<HornerTransactionJournalDTO>) => {
          if (cell.value) {
            return <FormatDateTime date={cell.value} />;
          }
          return '-';
        },
      },
      {
        id: TransactionJournalTableColumnId.Pin,
        Header: t('enum.hornertransactionfeildtype.pin', 'Pin') as string,
        accessor: TransactionJournalTableColumnId.Pin, // accessor is the "key" in the data
      },
      {
        id: TransactionJournalTableColumnId.StartTime,
        Header: t(
          'enum.hornertransactionfeildtype.starttime',
          'Start Time'
        ) as string,
        accessor: TransactionJournalTableColumnId.StartTime, // accessor is the "key" in the data
        Cell: (cell: Cell<HornerTransactionJournalDTO>) => {
          if (cell.value) {
            return <FormatDateTime date={cell.value} />;
          }
          return '-';
        },
      },
      {
        id: TransactionJournalTableColumnId.StartPressure,
        Header: t(
          'enum.hornertransactionfeildtype.startpressure',
          'Start Pressure'
        ) as string,
        accessor: TransactionJournalTableColumnId.StartPressure, // accessor is the "key" in the data
      },
      {
        id: TransactionJournalTableColumnId.StartTankPressure,
        Header: t(
          'enum.hornertransactionfeildtype.starttankpressure',
          'Start Tank Pressure'
        ) as string,
        accessor: TransactionJournalTableColumnId.StartTankPressure, // accessor is the "key" in the data
      },
      {
        id: TransactionJournalTableColumnId.StartTankTemperature,
        Header: t(
          'enum.hornertransactionfeildtype.starttanktemperature',
          'Start Tank Temperature'
        ) as string,
        accessor: TransactionJournalTableColumnId.StartTankTemperature, // accessor is the "key" in the data
      },
      {
        id: TransactionJournalTableColumnId.Product,
        Header: t(
          'enum.hornertransactionfeildtype.product',
          'Product'
        ) as string,
        accessor: TransactionJournalTableColumnId.Product, // accessor is the "key" in the data
      },
      {
        id: TransactionJournalTableColumnId.EndTime,
        Header: t(
          'enum.hornertransactionfeildtype.endtime',
          'End Time'
        ) as string,
        accessor: TransactionJournalTableColumnId.EndTime, // accessor is the "key" in the data
        Cell: (cell: Cell<HornerTransactionJournalDTO>) => {
          if (cell.value) {
            return <FormatDateTime date={cell.value} />;
          }
          return '-';
        },
      },
      {
        id: TransactionJournalTableColumnId.EndPressure,
        Header: t(
          'enum.hornertransactionfeildtype.endpressure',
          'End Pressure'
        ) as string,
        accessor: TransactionJournalTableColumnId.EndPressure, // accessor is the "key" in the data
        Cell: (cell: Cell<HornerTransactionJournalDTO>) => {
          if (cell.value) {
            return <FormatDateTime date={cell.value} />;
          }
          return '-';
        },
      },
      {
        id: TransactionJournalTableColumnId.Flow,
        Header: t('enum.hornertransactionfeildtype.flow', 'Flow') as string,
        accessor: TransactionJournalTableColumnId.Flow, // accessor is the "key" in the data
      },
      {
        id: TransactionJournalTableColumnId.CommunicationType,
        Header: t(
          'enum.hornertransactionfeildtype.commtype',
          'Communication Type'
        ) as string,
        accessor: TransactionJournalTableColumnId.CommunicationType, // accessor is the "key" in the data
      },
      {
        id: TransactionJournalTableColumnId.ShutdownReasonCode,
        Header: t(
          'enum.hornertransactionfeildtype.shutdownreasoncode',
          'Shutdown Reason Code'
        ) as string,
        accessor: TransactionJournalTableColumnId.ShutdownReasonCode, // accessor is the "key" in the data
      },
      {
        id: TransactionJournalTableColumnId.Duration,
        Header: t(
          'enum.hornertransactionfeildtype.duration',
          'Duration'
        ) as string,
        accessor: TransactionJournalTableColumnId.Duration, // accessor is the "key" in the data
      },
      {
        id: TransactionJournalTableColumnId.FuelTemperature,
        Header: t(
          'enum.hornertransactionfeildtype.fueltemperature',
          'Fuel Temperature'
        ) as string,
        accessor: TransactionJournalTableColumnId.FuelTemperature, // accessor is the "key" in the data
      },
      {
        id: TransactionJournalTableColumnId.EndTankPressure,
        Header: t(
          'enum.hornertransactionfeildtype.endtankpressure',
          'End Tank Pressure'
        ) as string,
        accessor: TransactionJournalTableColumnId.EndTankPressure, // accessor is the "key" in the data
      },
      {
        id: TransactionJournalTableColumnId.EndTankTemperature,
        Header: t(
          'enum.hornertransactionfeildtype.endtanktemperature',
          'End Tank Temperature'
        ) as string,
        accessor: TransactionJournalTableColumnId.EndTankTemperature, // accessor is the "key" in the data
      },
      {
        id: TransactionJournalTableColumnId.FillCounter,
        Header: t(
          'enum.hornertransactionfeildtype.fillcounter',
          'Fill Counter'
        ) as string,
        accessor: TransactionJournalTableColumnId.FillCounter, // accessor is the "key" in the data
      },
      {
        id: TransactionJournalTableColumnId.NonResettingFlowTotal,
        Header: t(
          'enum.hornertransactionfeildtype.nonresettingflowtotal',
          'Non-Resetting Flow Total'
        ) as string,
        accessor: TransactionJournalTableColumnId.NonResettingFlowTotal, // accessor is the "key" in the data
      },
    ],
    [subtableVisible]
  );
  const tableRows: TransactionDetailsTableInfo[] = React.useMemo<
    TransactionDetailsTableInfo[]
  >(() => {
    const result =
      data?.slice(0, 1000).map<TransactionDetailsTableInfo>((item) => ({
        hornerTransactionJournalId: item?.hornerTransactionJournalId,
        batchTime: item?.batchTime,
        pin: item?.pin,
        startTime: item?.fillStartTime,
        startPressure: item?.startPressure,
        startTankPressure: item?.startTankPressure,
        startTankTemperature: item?.startTankTemperature,
        product: item?.product,
        endTime: item?.fillEndTime,
        endPressure: item?.endPressure,
        flow: item?.flow,
        communicationType: item?.commType,
        shutdownReasonCode: item?.shutdownReason,
        duration: item?.duration,
        fuelTemperature: item?.fuelTemperature,
        endTankPressure: item?.endTankPressure,
        endTankTemperature: item?.endTankPressure,
        fillCounter: item?.fillCount,
        nonResettingFlowTotal: item?.shutdownReason,
        icon: '',
      })) || [];
    return result;
  }, [data]);

  const tableInstance = useTable<TransactionDetailsTableInfo>(
    {
      columns,
      data: tableRows,
      initialState: {
        sortBy: [
          {
            id: TransactionJournalTableColumnId.BatchTime,
            desc: true,
          },
        ],
      },
      disableSortBy: true,
    },
    useSortBy
  );

  const tableStateForDownload = useMemo(
    () => ({
      rows: tableInstance.rows,
      visibleColumns: tableInstance.visibleColumns,
    }),
    [tableInstance.rows, tableInstance.visibleColumns]
  );

  const csvLinkRef = useRef<HTMLAnchorElement | null>(null);
  const [csvData, setCsvData] = useState<any>();

  const [downloadFormat, setDownloadFormat] = useState<
    GeoCsvFormat | null | undefined
  >(null);

  const downloadData = () => {
    setCsvData(undefined);
    const formattedCsvData = formatTableDataForCsv(
      tableStateForDownload,
      downloadFormat
    );
    setCsvData(formattedCsvData);
  };

  useUpdateEffect(() => {
    if (!isDownloading) {
      setDownloadFormat(null);
    }
  }, [isDownloadDialogOpen]);

  useUpdateEffect(() => {
    if (downloadFormat) {
      downloadData();
    }
  }, [downloadFormat]);

  // Trigger the download of the CSV file when csvData changes
  useEffect(() => {
    // @ts-ignore
    if (csvLinkRef.current?.link && csvData) {
      // On Safari, the file gets downloaded before the CSV data can be set.
      // Adding a timeout seems to get around the issue.
      setTimeout(() => {
        closeDownloadDialog();
        // @ts-ignore
        csvLinkRef.current.link.click();
      });
    }
  }, [csvData]);

  return (
    <Box
      style={{ padding: '10px', boxSizing: 'border-box', whiteSpace: 'nowrap' }}
    >
      <CSVLink
        // @ts-ignore
        ref={csvLinkRef}
        separator={formatCsvSeparator(downloadFormat)}
        data={csvData || []}
        filename={csvExportFilename}
        style={{ display: 'none' }}
      />

      <DownloadDialog
        open={isDownloadDialogOpen}
        handleClose={closeDownloadDialog}
        setDownloadFormat={setDownloadFormat}
        downloadData={downloadData}
        isDownloading={isDownloading}
        setIsDownloading={setIsDownloading}
      />
      <RecursiveGenericDataTable<TransactionDetailsTableInfo>
        tableInstance={tableInstance}
        disableActions={false}
        tableAriaLabelText="Transaction Journal Table"
        isRecordDisabled={() => false}
        columnIdToAriaLabel={TransactionJournalTableColumnIdToAriaLabel}
        getColumnWidth={(colId) =>
          colId === TransactionJournalTableColumnId.Icon ? 30 : 0
        }
        handleRowClick={() => {}}
        minWidth={1300}
        secondLevelComponent={(row: Row<TransactionDetailsTableInfo>) => (
          <tr key={`${row.original.hornerTransactionJournalId}sub`}>
            <td colSpan={19}>
              <TransactionDetailsJournalTable
                transactionJournalId={row.original.hornerTransactionJournalId}
                startDate={transactionDate?.startDate}
                endDate={transactionDate?.endDate}
              />
            </td>
          </tr>
        )}
        visibleSubtableIndex={subtableVisible}
      />
    </Box>
  );
};
export default TransactionJournalTable;
