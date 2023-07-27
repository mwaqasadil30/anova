import { ProblemReport_SummaryDto } from 'api/admin/api';
import { Column } from 'react-table';
import { formatValueForCsv } from 'utils/format/dataExport';
import { TableDataForDownload } from './types';

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const getIsColumnVisibleInCsv = (column: Column<ProblemReport_SummaryDto>) => {
  return true;
};

export const formatTableDataForCsv = (
  tableData: TableDataForDownload | null
) => {
  if (!tableData?.visibleColumns?.length || !tableData?.rows?.length) {
    return null;
  }

  const visibleColumnsForCsv = tableData.visibleColumns.filter(
    getIsColumnVisibleInCsv
  );

  const headerRow = visibleColumnsForCsv.map((column) => column.Header);

  const dataRows = tableData.rows
    .filter((row) => !row.isGrouped)
    .map((row) => {
      const rowData = visibleColumnsForCsv.map((column) => {
        const rawValue = row.values[column.id];

        return formatValueForCsv(rawValue);
      });
      return rowData;
    });
  return [headerRow].concat(dataRows);
};
