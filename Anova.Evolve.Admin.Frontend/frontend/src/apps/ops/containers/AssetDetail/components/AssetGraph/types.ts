import { EvolveGetForecastReadingsByDataChannelIdResponse } from 'api/admin/api';
import { CachedDataChannelReadings } from '../../types';

// Mapping of data channel IDs to cached readings
export type CachedReadings = Record<
  string,
  CachedDataChannelReadings | undefined
>;

export type CachedForecastReadings = Record<
  string,
  EvolveGetForecastReadingsByDataChannelIdResponse | undefined
>;

export type GraphPoint = [number, number | null];
export type GraphSeriesData = GraphPoint[];

export interface FormattedForecastReadings {
  low: GraphSeriesData;
  regular: GraphSeriesData;
  high: GraphSeriesData;
}

export interface ForecastReadingRequest {
  dataChannelId: string;
}
