import Box from '@material-ui/core/Box';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import GenericDataTable from 'components/GenericDataTable';
import moment from 'moment';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, useTable } from 'react-table';
import {
  TransactionDetailsJournalTableColumnId,
  TransactionDetailsJournalTableColumnIdToAriaLabel,
} from '../../helpers';
import useTransactionDetailsJournal from '../../hook/useTransactionDetailsJournal';

type TransactionDetailsJournalTableInfo = {
  hornerDetailJournalId?: number;
  batchTime?: string;
  running?: number;
  readingTime?: string;
  trailerPressure?: number | null;
  compressorStatus?: number;
  compressorSuctionPressure?: number | null;
  compressorDischargePressure?: number | null;
  bankbPressure?: number | null;
  bankcPressure?: number | null;
  bankdPressure?: number | null;
  interstage?: number | null;
  bootstrap?: number | null;
  ti?: number | null;
  runtimeThisStart?: number | null;
  runtimeTotal?: number | null;
  runtimeThisDay?: number | null;
  storageTubebNormalCycles?: number | null;
  storageTubecNormalCycles?: number | null;
  storageTubedNormalCycles?: number | null;
  storageTubebPurgeCycles?: number | null;
  storageTubecPurgeCycles?: number | null;
  storageTubedPurgeCycles?: number | null;
  tailorGroundStorage?: number | null;
  storageTubebOverPCycles?: number | null;
  storageTubecOverPCycles?: number | null;
  storageTubedOverPCycles?: number | null;
};

type TransactionDetailsJournalTableProps = {
  transactionJournalId?: number;
  startDate?: Date | null;
  endDate?: Date | null;
};

const TransactionDetailsJournalTable = ({
  transactionJournalId,
  startDate,
  endDate,
}: TransactionDetailsJournalTableProps) => {
  const { t } = useTranslation();
  const { data, isSuccess, isLoading, isError } = useTransactionDetailsJournal(
    transactionJournalId,
    startDate,
    endDate
  );
  const columns = useMemo<Column<TransactionDetailsJournalTableInfo>[]>(
    () => [
      {
        id: TransactionDetailsJournalTableColumnId.BatchTime,
        Header: t('ui.rtuhorner.batchtime', 'Batch Time') as string,
        accessor: TransactionDetailsJournalTableColumnId.BatchTime, // accessor is the "key" in the data
      },
      {
        id: TransactionDetailsJournalTableColumnId.Running,
        Header: t('ui.rtuhorner.running', 'Running') as string,
        accessor: TransactionDetailsJournalTableColumnId.Running, // accessor is the "key" in the data
      },
      {
        id: TransactionDetailsJournalTableColumnId.ReadingTime,
        Header: t('ui.common.time', 'Time') as string,
        accessor: TransactionDetailsJournalTableColumnId.ReadingTime, // accessor is the "key" in the data
      },
      {
        id: TransactionDetailsJournalTableColumnId.TrailerPressure,
        Header: t(
          'ui.rtuhorner.pttrailerpressure',
          'PT-101A Trailer Pressure'
        ) as string,
        accessor: TransactionDetailsJournalTableColumnId.TrailerPressure, // accessor is the "key" in the data
      },
      {
        id: TransactionDetailsJournalTableColumnId.CompressorStatus,
        Header: t(
          'ui.rtuhorner.compressorstatus',
          'Compressor Status'
        ) as string,
        accessor: TransactionDetailsJournalTableColumnId.CompressorStatus, // accessor is the "key" in the data
      },
      {
        id: TransactionDetailsJournalTableColumnId.CompressorSuctionPressure,
        Header: t(
          'ui.rtuhorner.compressorsuctionpressure',
          'Compressor Suction Pressure'
        ) as string,
        accessor:
          TransactionDetailsJournalTableColumnId.CompressorSuctionPressure, // accessor is the "key" in the data
      },
      {
        id: TransactionDetailsJournalTableColumnId.CompressorDischargePressure,
        Header: t(
          'ui.rtuhorner.compressordischargepressure',
          'Compressor Discharge Pressure'
        ) as string,
        accessor:
          TransactionDetailsJournalTableColumnId.CompressorDischargePressure, // accessor is the "key" in the data
      },
      {
        id: TransactionDetailsJournalTableColumnId.BankbPressure,
        Header: t(
          'ui.rtuhorner.pt101bbankbpressure',
          'PT-101B Bank B Pressure'
        ) as string,
        accessor: TransactionDetailsJournalTableColumnId.BankbPressure, // accessor is the "key" in the data
      },
      {
        id: TransactionDetailsJournalTableColumnId.BankcPressure,
        Header: t(
          'ui.rtuhorner.pt101cbankcpressure',
          'PT-101C Bank C Pressure'
        ) as string,
        accessor: TransactionDetailsJournalTableColumnId.BankcPressure, // accessor is the "key" in the data
      },
      {
        id: TransactionDetailsJournalTableColumnId.BankdPressure,
        Header: t(
          'ui.rtuhorner.pt101dbankdpressure',
          'PT-101D Bank D Pressure'
        ) as string,
        accessor: TransactionDetailsJournalTableColumnId.BankdPressure, // accessor is the "key" in the data
      },
      {
        id: TransactionDetailsJournalTableColumnId.Interstage,
        Header: t(
          'ui.rtuhorner.pt206interstage',
          'PT-206 Interstage'
        ) as string,
        accessor: TransactionDetailsJournalTableColumnId.Interstage, // accessor is the "key" in the data
      },
      {
        id: TransactionDetailsJournalTableColumnId.Bootstrap,
        Header: t('ui.rtuhorner.pt508bootstrap', 'PT-508 Bootstrap') as string,
        accessor: TransactionDetailsJournalTableColumnId.Bootstrap, // accessor is the "key" in the data
      },
      {
        id: TransactionDetailsJournalTableColumnId.Ti,
        Header: t('ui.rtuhorner.ti203', 'TI-203') as string,
        accessor: TransactionDetailsJournalTableColumnId.Ti, // accessor is the "key" in the data
      },
      {
        id: TransactionDetailsJournalTableColumnId.RuntimeThisStart,
        Header: t(
          'ui.rtuhorner.runtimethisstart',
          'Runtime This Start'
        ) as string,
        accessor: TransactionDetailsJournalTableColumnId.RuntimeThisStart, // accessor is the "key" in the data
      },
      {
        id: TransactionDetailsJournalTableColumnId.RuntimeTotal,
        Header: t('ui.rtuhorner.runtimetotal', 'Runtime Total') as string,
        accessor: TransactionDetailsJournalTableColumnId.RuntimeTotal, // accessor is the "key" in the data
      },
      {
        id: TransactionDetailsJournalTableColumnId.RuntimeThisDay,
        Header: t('ui.rtuhorner.runtimethisday', 'Runtime This Day') as string,
        accessor: TransactionDetailsJournalTableColumnId.RuntimeThisDay, // accessor is the "key" in the data
      },
      {
        id: TransactionDetailsJournalTableColumnId.StorageTubebNormalCycles,
        Header: t(
          'ui.rtuhorner.storagetubebnormalcycles',
          'Storage Tube B Normal Cycles'
        ) as string,
        accessor:
          TransactionDetailsJournalTableColumnId.StorageTubebNormalCycles, // accessor is the "key" in the data
      },
      {
        id: TransactionDetailsJournalTableColumnId.StorageTubecNormalCycles,
        Header: t(
          'ui.rtuhorner.storagetubecnormalcycles',
          'Storage Tube C Normal Cycles'
        ) as string,
        accessor:
          TransactionDetailsJournalTableColumnId.StorageTubecNormalCycles, // accessor is the "key" in the data
      },
      {
        id: TransactionDetailsJournalTableColumnId.StorageTubedNormalCycles,
        Header: t(
          'ui.rtuhorner.storagetubednormalcycles',
          'Storage Tube D Normal Cycles'
        ) as string,
        accessor:
          TransactionDetailsJournalTableColumnId.StorageTubedNormalCycles, // accessor is the "key" in the data
      },
      {
        id: TransactionDetailsJournalTableColumnId.StorageTubebPurgeCycles,
        Header: t(
          'ui.rtuhorner.storagetubebpurgecycles',
          'Storage Tube B Purge Cycles'
        ) as string,
        accessor:
          TransactionDetailsJournalTableColumnId.StorageTubebPurgeCycles, // accessor is the "key" in the data
      },
      {
        id: TransactionDetailsJournalTableColumnId.StorageTubecPurgeCycles,
        Header: t(
          'ui.rtuhorner.storagetubecpurgecycles',
          'Storage Tube C Purge Cycles'
        ) as string,
        accessor:
          TransactionDetailsJournalTableColumnId.StorageTubecPurgeCycles, // accessor is the "key" in the data
      },
      {
        id: TransactionDetailsJournalTableColumnId.StorageTubedPurgeCycles,
        Header: t(
          'ui.rtuhorner.storagetubedpurgecycles',
          'Storage Tube D Purge Cycles'
        ) as string,
        accessor:
          TransactionDetailsJournalTableColumnId.StorageTubedPurgeCycles, // accessor is the "key" in the data
      },
      {
        id: TransactionDetailsJournalTableColumnId.TailorGroundStorage,
        Header: t(
          'ui.rtuhorner.tailorgroundstorage',
          'Tailor/Ground Storage'
        ) as string,
        accessor: TransactionDetailsJournalTableColumnId.TailorGroundStorage, // accessor is the "key" in the data
      },
      {
        id: TransactionDetailsJournalTableColumnId.StorageTubebOverPCycles,
        Header: t(
          'ui.rtuhorner.storagetubeboverpcycles',
          'Storage Tube B Over P Cycles'
        ) as string,
        accessor:
          TransactionDetailsJournalTableColumnId.StorageTubebOverPCycles, // accessor is the "key" in the data
      },
      {
        id: TransactionDetailsJournalTableColumnId.StorageTubecOverPCycles,
        Header: t(
          'ui.rtuhorner.storagetubecoverpcycles',
          'Storage Tube C Over P Cycles'
        ) as string,
        accessor:
          TransactionDetailsJournalTableColumnId.StorageTubecOverPCycles, // accessor is the "key" in the data
      },
      {
        id: TransactionDetailsJournalTableColumnId.StorageTubedOverPCycles,
        Header: t(
          'ui.rtuhorner.storagetubedoverpcycles',
          'Storage Tube D Over P Cycles'
        ) as string,
        accessor:
          TransactionDetailsJournalTableColumnId.StorageTubedOverPCycles, // accessor is the "key" in the data
      },
    ],
    []
  );
  const tableRows: TransactionDetailsJournalTableInfo[] = React.useMemo<
    TransactionDetailsJournalTableInfo[]
  >(() => {
    const result =
      data?.slice(0, 1000).map<TransactionDetailsJournalTableInfo>((item) => ({
        hornerDetailJournalId: item?.hornerDetailJournalId,
        batchTime: moment(item?.batchTime).format('LLL'),
        running: item?.chan1,
        readingTime: moment(item?.readingTime).format('LLL'),
        trailerPressure: item?.chan5,
        compressorStatus: item?.chan2,
        compressorSuctionPressure: item?.chan3,
        compressorDischargePressure: item?.chan4,
        bankbPressure: item?.chan6,
        bankcPressure: item?.chan7,
        bankdPressure: item?.chan8,
        interstage: item?.chan9,
        bootstrap: item?.chan10,
        ti: item?.chan12,
        runtimeThisStart: item?.chan13,
        runtimeTotal: item?.chan14,
        runtimeThisDay: item?.chan15,
        storageTubebNormalCycles: item?.chan16,
        storageTubecNormalCycles: item?.chan17,
        storageTubedNormalCycles: item?.chan18,
        storageTubebPurgeCycles: item?.chan19,
        storageTubecPurgeCycles: item?.chan20,
        storageTubedPurgeCycles: item?.chan21,
        tailorGroundStorage: item?.chan22,
        storageTubebOverPCycles: item?.chan23,
        storageTubecOverPCycles: item?.chan24,
        storageTubedOverPCycles: item?.chan25,
      })) || [];
    return result;
  }, [data]);
  const tableInstance = useTable<TransactionDetailsJournalTableInfo>({
    columns,
    data: tableRows,
  });

  if (isError)
    return (
      <Box mt={3} style={{ height: '300px', width: 'calc(100vw - 100px)' }}>
        <TransitionErrorMessage in />
      </Box>
    );

  if (isLoading)
    return (
      <Box mt={3} style={{ height: '300px', width: 'calc(100vw - 100px)' }}>
        <TransitionLoadingSpinner in />
      </Box>
    );

  if (isSuccess && data)
    return (
      <Box
        style={{
          padding: '30px',
          boxSizing: 'border-box',
          whiteSpace: 'nowrap',
        }}
      >
        <GenericDataTable<TransactionDetailsJournalTableInfo>
          tableInstance={tableInstance}
          disableActions={false}
          tableAriaLabelText="Transaction Details Journal Table"
          isRecordDisabled={() => false}
          columnIdToAriaLabel={
            TransactionDetailsJournalTableColumnIdToAriaLabel
          }
          getColumnWidth={() => 100}
          handleRowClick={() => {}}
          minWidth={1300}
        />
      </Box>
    );

  return null;
};
export default TransactionDetailsJournalTable;
