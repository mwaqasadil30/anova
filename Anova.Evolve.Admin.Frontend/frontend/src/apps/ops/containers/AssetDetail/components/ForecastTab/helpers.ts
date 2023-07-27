import { DataChannelDTO, EvolveForecastReadingResponse } from 'api/admin/api';
import { TFunction } from 'i18next';
import round from 'lodash/round';
import {
  formatValueForCsv,
  TableDataForDownload,
} from 'utils/format/dataExport';
import { isNumber } from 'utils/format/numbers';
import { getDataChannelDTODescription } from 'utils/ui/helpers';
import { GeoCsvFormat } from 'types';
import { ForecastReadingType, ReadingForForecastTable } from './types';

export const getDataChannelKey = (dataChannelId?: string) =>
  `data-channel-${dataChannelId}`;

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

// NOTE: This helper was used to rename a couple properties when the APIs were
// being updated.
export const filterAndFormatForecastForTable = (
  regularForecast: EvolveForecastReadingResponse[] | null | undefined
): ReadingForForecastTable[] | undefined => {
  return regularForecast?.map<ReadingForForecastTable>((forecast) => ({
    logTime: forecast.logTime,
    estimatedScaledValue: forecast.estimateScaledValue,
    highScaledValue: forecast.highScaledValue,
    lowScaledValue: forecast.lowScaledValue,
  }));
};

const getColumnId = (
  forecastReadingType: ForecastReadingType | undefined,
  prefix: string
) => {
  switch (forecastReadingType) {
    case ForecastReadingType.High:
      return `${prefix}-high`;
    case ForecastReadingType.Low:
      return `${prefix}-low`;
    default:
      return `${prefix}-normal`;
  }
};

const getHeaderText = (
  t: TFunction,
  forecastReadingType: ForecastReadingType | undefined,
  label: string
) => {
  switch (forecastReadingType) {
    case ForecastReadingType.High:
      return `${t('ui.assetdetail.high', 'High')} ${label}`;
    case ForecastReadingType.Low:
      return `${t('ui.assetdetail.low', 'Low')} ${label}`;
    default:
      return label;
  }
};

const getReadingValue = (
  forecastReadingType: ForecastReadingType | undefined,
  reading: any
) => {
  switch (forecastReadingType) {
    case ForecastReadingType.High:
      return reading?.highScaledValue;
    case ForecastReadingType.Low:
      return reading?.lowScaledValue;
    default:
      return reading?.estimatedScaledValue;
  }
};

export const buildForecastTableColumn = (
  t: TFunction,
  dataChannel: DataChannelDTO,
  forecastReadingType?: ForecastReadingType
) => {
  const dataChannelKey = getDataChannelKey(dataChannel.dataChannelId);
  const description = getDataChannelDTODescription(dataChannel);
  const formattedUnits = dataChannel.uomParams?.unit
    ? `(${dataChannel.uomParams?.unit})`
    : '';
  const label = [description, formattedUnits].filter(Boolean).join(' ');

  const columnId = getColumnId(forecastReadingType, dataChannelKey);
  const headerText = getHeaderText(t, forecastReadingType, label);

  return {
    id: columnId,
    Header: headerText,
    // We format the value in the accessor instead of the Cell so when
    // the data's exported to a CSV, the value matches what the table
    // shows. It also removes the need to have a separate set of columns
    // when exporting to a CSV.

    // NOTE: needs proper type
    accessor: (record: any) => {
      const value = record[dataChannelKey];
      const readingValue = getReadingValue(forecastReadingType, value);

      return isNumber(readingValue)
        ? round(readingValue, dataChannel.uomParams?.decimalPlaces || 0)
        : '';
    },
    sortType: 'number',
  };
};
