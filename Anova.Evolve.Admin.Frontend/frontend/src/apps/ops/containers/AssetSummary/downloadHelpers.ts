import { EvolveAssetSummaryDto } from 'api/admin/api';
import { Column } from 'react-table';
import { GeoCsvFormat } from 'types';
import { formatValueForCsv } from 'utils/format/dataExport';
import { AssetSummaryColumnId } from './components/AssetSummaryTable/helpers';
import { TableDataForDownload } from './types';

const getIsColumnVisibleInCsv = (column: Column<EvolveAssetSummaryDto>) => {
  return column.id !== AssetSummaryColumnId.AssetId;
};

export const formatTableDataForCsv = (
  tableData: TableDataForDownload | null,
  geoFormat?: GeoCsvFormat | null
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

        return formatValueForCsv(rawValue, geoFormat);
      });
      return rowData;
    });
  return [headerRow].concat(dataRows);
};
