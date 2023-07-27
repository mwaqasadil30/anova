import { ChartDataChannelDto } from 'api/admin/api';

export enum ChartYAxisPosition {
  Left = 1,
  Right = 2,
}

export type GraphSeriesId = string;

export interface GraphSeries
  extends Omit<ChartDataChannelDto, 'init' | 'toJSON'> {
  color?: string;
  units?: string | null;
}

export type GraphSeriesReadings = [number, number][];

export type ChartDetails = {
  id: string;
  name: string;
  leftAxis: GraphSeries[];
  rightAxis: GraphSeries[];
};

// #region drag and drop types
export type GraphSeriesMap = {
  [key: string]: GraphSeries[];
};
// #endregion drag and drop types

// #region form types
export interface Values {
  name: string;
  // chartDataChannels: ChartDataChannelDto[];
  leftAxis: GraphSeries[];
  rightAxis: GraphSeries[];
}
// #endregion form types
