import { DataChannelReadingDTO, FreezerTimeSeriesModel } from 'api/admin/api';
import { QueryObserverSuccessResult } from 'react-query';

export enum TimeSeriesAggregationMode {
  Min = 'min',
  Max = 'max',
  StandardDeviation = 'std-dev',
  Mean = 'mean',
  Mode = 'mode',
  Median = 'median',
  Sum = 'sum',
  Delta = 'delta',
}

export type TagNameToTimeSeriesDataMapping = Record<
  string,
  FreezerTimeSeriesModel
>;

interface TagReadingsInformation {
  api: QueryObserverSuccessResult<DataChannelReadingDTO, unknown>;
  description?: string | null;
}

export type TagIdToHistoricalReadingsApiMapping = Record<
  string,
  TagReadingsInformation
>;

export type DataChannelIdToColorMapping = Record<string, string> | undefined;

export interface LocationState {
  startDate?: string;
  endDate?: string;
}

export enum AssetSubTypeEnum {
  CompactSpiral = 1,
  SuperContact = 2,
  Cryowave = 3,
  ModularTunnel = 4,
}

export enum OptionsTimeValue {
  NotSet = 0,
  Custom = -1,
  OneWeek = 168,
  OneDay = 24,
  TwoHours = 2,
  OneHour = 1,
  Now = 0.5,
}
