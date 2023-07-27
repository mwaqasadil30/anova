/* eslint-disable indent */
import {
  DomainEventsDto,
  EventInfoRecord,
  EventRuleType as EventRuleCategory,
  EventRecordStatus,
} from 'api/admin/api';
import { Column, Row } from 'react-table';
import { GeoCsvFormat } from 'types';
import { formatBooleanToYesOrNoString } from 'utils/format/boolean';
import {
  formatStringNumValueForCsv,
  formatValueForCsv,
  TableDataForDownload,
} from 'utils/format/dataExport';
import { isNumber } from 'utils/format/numbers';
import { EventSummaryListColumnId } from './helpers';
import { GetDisplayableValueOptions } from './types';

export const getInactiveEventsColumnCustomDisplayableValue = (
  rawValue: any,
  column: Column<EventInfoRecord>,
  row: Row<EventInfoRecord>,
  options: GetDisplayableValueOptions,
  geoFormat?: GeoCsvFormat | null
) => {
  const { importanceLevelTextMapping, eventRuleTypeTextMapping } = options;

  switch (column.id) {
    case EventSummaryListColumnId.ReadingScaledValue: {
      if (isNumber(row.original.readingDisplayValue)) {
        const formattedReadingValue = formatStringNumValueForCsv(
          row.original.readingDisplayValue,
          geoFormat
        );
        return `${formattedReadingValue} ${row.original.readingDisplayUnit}`;
      }
      return '-';
    }
    case EventSummaryListColumnId.EventImportanceLevel: {
      if (isNumber(row.original.eventImportanceLevel)) {
        return importanceLevelTextMapping[row.original.eventImportanceLevel!];
      }
      return '';
    }
    case EventSummaryListColumnId.EventRuleType:
      return eventRuleTypeTextMapping[rawValue as EventRuleCategory] || '';
    default:
      return null;
  }
};

export const getActiveEventsColumnCustomDisplayableValue = (
  rawValue: any,
  column: Column<DomainEventsDto>,
  row: Row<DomainEventsDto>,
  options: GetDisplayableValueOptions,
  geoFormat?: GeoCsvFormat | null
) => {
  const { importanceLevelTextMapping, eventRuleTypeTextMapping, t } = options;

  switch (column.id) {
    case EventSummaryListColumnId.Acknowledge: {
      const isAcknowledged = !!row.values.acknowledgedOn;
      return formatBooleanToYesOrNoString(isAcknowledged, t);
    }
    case EventSummaryListColumnId.ReadingScaledValue: {
      if (isNumber(row.original.readingValue)) {
        const formattedReadingValue = formatStringNumValueForCsv(
          row.original.readingValue,
          geoFormat
        );
        return `${formattedReadingValue} ${row.original.readingUnit}`;
      }
      return '-';
    }
    case EventSummaryListColumnId.EventImportanceLevel: {
      if (isNumber(row.original.eventImportanceLevel)) {
        return importanceLevelTextMapping[row.original.eventImportanceLevel!];
      }
      return '';
    }
    case EventSummaryListColumnId.EventRuleType:
      return eventRuleTypeTextMapping[rawValue as EventRuleCategory] || '';
    default:
      return null;
  }
};

export function formatEventValueForCsv(
  rawValue: any,
  column: Column<DomainEventsDto | EventInfoRecord>,
  row: Row<DomainEventsDto | EventInfoRecord>,
  options: GetDisplayableValueOptions,
  geoFormat?: GeoCsvFormat | null
) {
  const customDisplayValue =
    options.selectedEventStatus === EventRecordStatus.Active
      ? getActiveEventsColumnCustomDisplayableValue(
          rawValue,
          column as Column<DomainEventsDto>,
          row as Row<DomainEventsDto>,
          options,
          geoFormat
        )
      : getInactiveEventsColumnCustomDisplayableValue(
          rawValue,
          column as Column<EventInfoRecord>,
          row as Row<EventInfoRecord>,
          options,
          geoFormat
        );
  if (customDisplayValue) {
    return customDisplayValue;
  }

  return formatValueForCsv(rawValue, geoFormat);
}

export const formatTableDataForCsv = (
  tableData: TableDataForDownload<any> | null,
  options: GetDisplayableValueOptions,
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

        return formatEventValueForCsv(
          rawValue,
          column,
          row,
          options,
          geoFormat
        );
      });
      return rowData;
    });
  return [headerRow].concat(dataRows);
};
