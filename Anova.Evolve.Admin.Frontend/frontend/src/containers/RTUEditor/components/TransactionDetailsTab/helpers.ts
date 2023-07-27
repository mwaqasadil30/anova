import { GeoCsvFormat } from 'types';
import {
  formatValueForCsv,
  TableDataForDownload,
} from 'utils/format/dataExport';

export const formatTableDataForCsv = (
  tableData: TableDataForDownload<any> | null,
  geoFormat?: GeoCsvFormat | null
) => {
  if (!tableData?.visibleColumns?.length || !tableData?.rows?.length) {
    return null;
  }

  const visibleColumnsForCsv = tableData.visibleColumns;
  const headerRow = visibleColumnsForCsv.map((column) => column.Header);

  const dataRows = tableData.rows
    .filter((row) => !row.isGrouped)
    .map((row) => {
      const rowData = visibleColumnsForCsv.map((column) => {
        const rawValue = row.values[column.id];

        return formatValueForCsv(rawValue, geoFormat);
      });
      return rowData;
    });
  return [headerRow].concat(dataRows);
};

export enum TransactionJournalTableColumnId {
  Icon = 'icon',
  BatchTime = 'batchTime',
  Pin = 'pin',
  StartTime = 'startTime',
  StartPressure = 'startPressure',
  StartTankPressure = 'startTankPressure',
  StartTankTemperature = 'startTankTemperature',
  Product = 'product',
  EndTime = 'endTime',
  EndPressure = 'endPressure',
  Flow = 'flow',
  CommunicationType = 'communicationType',
  ShutdownReasonCode = 'shutdownReasonCode',
  Duration = 'duration',
  FuelTemperature = 'fuelTemperature',
  EndTankPressure = 'endTankPressure',
  EndTankTemperature = 'endTankTemperature',
  FillCounter = 'fillCounter',
  NonResettingFlowTotal = 'nonResettingFlowTotal',
}
export const TransactionJournalTableColumnIdToAriaLabel = (
  columnId: string
) => {
  switch (columnId) {
    case TransactionJournalTableColumnId.Icon:
      return 'Icon';
    case TransactionJournalTableColumnId.BatchTime:
      return 'Batch Time';
    case TransactionJournalTableColumnId.Pin:
      return 'Pin';
    case TransactionJournalTableColumnId.StartTime:
      return 'Start Time';
    case TransactionJournalTableColumnId.StartPressure:
      return 'Start Pressure';
    case TransactionJournalTableColumnId.StartTankPressure:
      return 'Start Tank Pressure';
    case TransactionJournalTableColumnId.StartTankTemperature:
      return 'Start Tank Temperature';
    case TransactionJournalTableColumnId.Product:
      return 'Product';
    case TransactionJournalTableColumnId.EndTime:
      return 'End Time';
    case TransactionJournalTableColumnId.EndPressure:
      return 'End Pressure';
    case TransactionJournalTableColumnId.Flow:
      return 'Flow';
    case TransactionJournalTableColumnId.CommunicationType:
      return 'Communication Type';
    case TransactionJournalTableColumnId.ShutdownReasonCode:
      return 'Shutdown Reason Code';
    case TransactionJournalTableColumnId.Duration:
      return 'Duration';
    case TransactionJournalTableColumnId.FuelTemperature:
      return 'Fuel Temperature';
    case TransactionJournalTableColumnId.EndTankPressure:
      return 'End Tank Pressure';
    case TransactionJournalTableColumnId.EndTankTemperature:
      return 'End Tank Temperature';
    case TransactionJournalTableColumnId.FillCounter:
      return 'Fill Counter';
    case TransactionJournalTableColumnId.NonResettingFlowTotal:
      return 'Non Resetting Flow Total';
    default:
      return '';
  }
};
export enum TransactionDetailsJournalTableColumnId {
  BatchTime = 'batchTime',
  Running = 'running',
  ReadingTime = 'readingTime',
  TrailerPressure = 'trailerPressure',
  CompressorStatus = 'compressorStatus',
  CompressorSuctionPressure = 'compressorSuctionPressure',
  CompressorDischargePressure = 'compressorDischargePressure',
  BankbPressure = 'bankbPressure',
  BankcPressure = 'bankcPressure',
  BankdPressure = 'bankdPressure',
  Interstage = 'interstage',
  Bootstrap = 'bootstrap',
  Ti = 'ti',
  RuntimeThisStart = 'runtimeThisStart',
  RuntimeTotal = 'runtimeTotal',
  RuntimeThisDay = 'runtimeThisDay',
  StorageTubebNormalCycles = 'storageTubebNormalCycles',
  StorageTubecNormalCycles = 'storageTubecNormalCycles',
  StorageTubedNormalCycles = 'storageTubedNormalCycles',
  StorageTubebPurgeCycles = 'storageTubebPurgeCycles',
  StorageTubecPurgeCycles = 'storageTubecPurgeCycles',
  StorageTubedPurgeCycles = 'storageTubedPurgeCycles',
  TailorGroundStorage = 'tailorGroundStorage',
  StorageTubebOverPCycles = 'storageTubebOverPCycles',
  StorageTubecOverPCycles = 'storageTubecOverPCycles',
  StorageTubedOverPCycles = 'storageTubedOverPCycles',
}
export const TransactionDetailsJournalTableColumnIdToAriaLabel = (
  columnId: string
) => {
  switch (columnId) {
    case TransactionDetailsJournalTableColumnId.BatchTime:
      return 'Batch Time';
    case TransactionDetailsJournalTableColumnId.Running:
      return 'Running';
    case TransactionDetailsJournalTableColumnId.ReadingTime:
      return 'Reading Time';
    case TransactionDetailsJournalTableColumnId.TrailerPressure:
      return 'Trailer Pressure';
    case TransactionDetailsJournalTableColumnId.CompressorStatus:
      return 'Compressor Status';
    case TransactionDetailsJournalTableColumnId.CompressorSuctionPressure:
      return 'Compressor Suction Pressure';
    case TransactionDetailsJournalTableColumnId.CompressorDischargePressure:
      return 'Compressor Discharge Pressure';
    case TransactionDetailsJournalTableColumnId.BankbPressure:
      return 'Bank B Pressure';
    case TransactionDetailsJournalTableColumnId.BankcPressure:
      return 'Bank C Pressure';
    case TransactionDetailsJournalTableColumnId.BankdPressure:
      return 'Bank D Pressure';
    case TransactionDetailsJournalTableColumnId.Interstage:
      return 'Interstage';
    case TransactionDetailsJournalTableColumnId.Bootstrap:
      return 'Bootstrap';
    case TransactionDetailsJournalTableColumnId.RuntimeThisStart:
      return 'Runtime This Start';
    case TransactionDetailsJournalTableColumnId.RuntimeTotal:
      return 'Runtime Total';
    case TransactionDetailsJournalTableColumnId.RuntimeThisDay:
      return 'Runtime This Day';
    case TransactionDetailsJournalTableColumnId.StorageTubebNormalCycles:
      return 'Storage Tube B Normal Cycles';
    case TransactionDetailsJournalTableColumnId.StorageTubecNormalCycles:
      return 'Storage Tube C Normal Cycles';
    case TransactionDetailsJournalTableColumnId.StorageTubedNormalCycles:
      return 'Storage Tube D Normal Cycles';
    case TransactionDetailsJournalTableColumnId.StorageTubebPurgeCycles:
      return 'Storage Tube B Purge Cycles';
    case TransactionDetailsJournalTableColumnId.StorageTubecPurgeCycles:
      return 'Storage Tube C Purge Cycles';
    case TransactionDetailsJournalTableColumnId.StorageTubedPurgeCycles:
      return 'Storage Tube D Purge Cycles';
    default:
      return '';
  }
};
