import moment from 'moment';
import { Row, ColumnInstance } from 'react-table';
import { GeoCsvFormat } from 'types';

export interface TableDataForDownload<T extends object> {
  rows: Row<T>[];
  visibleColumns: ColumnInstance<T>[];
}

export const formatCsvSeparator = (geoFormat?: GeoCsvFormat | null) => {
  return geoFormat === GeoCsvFormat.Europe ? ';' : ',';
};

export const formatStringNumValueForCsv = (
  value: any,
  geoFormat?: GeoCsvFormat | null
) => {
  if (typeof value === 'number' && geoFormat === GeoCsvFormat.Europe) {
    return value.toString().replace('.', ',');
  }

  if (typeof value === 'string') {
    let valueString = value;
    if (geoFormat === GeoCsvFormat.Europe) {
      const regexp = new RegExp(/([\d]+(\.[\d]*)(e[+-][\d]+)?)/);
      if (regexp.test(value)) {
        valueString = valueString.replace('.', ',');
      }
    }
    // NOTE:
    // String values that have double quotes " force another column to be created
    // the fix below stops new empty columns from being created at the end of a
    // csv table when exported
    // SEE:
    // https://github.com/react-csv/react-csv/issues/249#issuecomment-763299972
    return valueString.replace(/"/g, '""');
  }

  return value;
};

/**
 * Return a string formatted date to be used in exports (CSVs).
 * @param input Any input supported by moment to be converted to a date.
 * @returns A string formatted date.
 */
const formatDateForExport = (
  value: moment.MomentInput,
  type?: GeoCsvFormat | null
) => {
  if (type === GeoCsvFormat.NorthAmerica) {
    return moment(value).format('YYYY-MM-DD h:mm A');
  }
  return moment(value).format('YYYY-MM-DD HH:mm');
};

/**
 * Return a formatted value to be used in a CSV export.
 * @param value Any value that is being exported.
 * @returns A formatted value to be exported to the CSV.
 */
export const formatValueForCsv = (
  value: any,
  geoFormat?: GeoCsvFormat | null
) => {
  if (value instanceof Date) {
    return formatDateForExport(value, geoFormat);
  }
  if (typeof value === 'number' || typeof value === 'string') {
    return formatStringNumValueForCsv(value, geoFormat);
  }

  return value;
};

const getDatetimeStringForFilename = () => {
  return moment().format();
};

const getExportFilename = (filenamePrefix: string, extension: string) => {
  const datetimeString = getDatetimeStringForFilename();
  return `${filenamePrefix} ${datetimeString}.${extension}`;
};

export const getExportFilenameWithDatetime = (filenamePrefix: string) => {
  return getExportFilename(filenamePrefix, 'csv');
};

export const getExportFilenameForPDFWithDatetime = (filenamePrefix: string) => {
  return getExportFilename(filenamePrefix, 'pdf');
};

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
