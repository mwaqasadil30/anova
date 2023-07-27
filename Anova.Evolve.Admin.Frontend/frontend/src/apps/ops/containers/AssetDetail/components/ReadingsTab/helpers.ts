import {
  DataChannelCategory,
  DataChannelDTO,
  EvolveReading,
  GpsLocationDTO,
} from 'api/admin/api';
import { GeoCsvFormat } from 'types';
import {
  formatValueForCsv,
  TableDataForDownload,
} from 'utils/format/dataExport';
import { ReadingForReadingsTable } from './types';

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

interface ReadingWithLogTime {
  logTime?: Date;
}

export const isReadingWithinDateRange = (
  reading: ReadingWithLogTime,
  fromDate: Date,
  toDate: Date
) => {
  return (
    reading?.logTime &&
    reading.logTime >= fromDate &&
    reading?.logTime <= toDate
  );
};

interface FilterAndFormatReadingsForTableInput {
  dataChannel: DataChannelDTO;
  fromDate: Date;
  toDate: Date;
  gpsReadings: GpsLocationDTO[] | null | undefined;
  regularReadings: EvolveReading[] | undefined;
}

export const filterAndFormatReadingsForTable = ({
  dataChannel,
  fromDate,
  toDate,
  gpsReadings,
  regularReadings,
}: FilterAndFormatReadingsForTableInput):
  | ReadingForReadingsTable[]
  | undefined => {
  if (dataChannel.dataChannelTypeId === DataChannelCategory.Gps) {
    return gpsReadings
      ?.filter((reading) => isReadingWithinDateRange(reading, fromDate, toDate))
      .map((reading) => {
        const formattedValue = [reading.latitude, reading.longitude].join(', ');
        return {
          logTime: reading.logTime,
          formattedValue,
        };
      });
  }

  return regularReadings
    ?.filter((reading) => isReadingWithinDateRange(reading, fromDate, toDate))
    .map<ReadingForReadingsTable>((reading) => ({
      logTime: reading.logTime,
      formattedValue: reading.value,
    }));
};
