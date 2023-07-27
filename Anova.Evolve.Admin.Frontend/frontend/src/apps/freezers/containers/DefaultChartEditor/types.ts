import { ChartDefaultTagDto } from 'api/admin/api';
import { AssetSubTypeEnum } from 'apps/freezers/types';

export enum ChartYAxisPosition {
  Left = 1,
  Right = 2,
}

export type GraphSeriesId = string;

export interface GraphSeries
  extends Omit<ChartDefaultTagDto, 'init' | 'toJSON'> {
  color?: string;
  units?: string | null;
}

export type GraphSeriesReadings = [number, number][];

// #region drag and drop types
export type GraphSeriesMap = {
  [key: string]: GraphSeries[];
};
// #endregion drag and drop types

// #region form types
export interface Values {
  chartDefaultId?: number | '';
  name: string | null;
  assetSubTypeId: AssetSubTypeEnum;
  sortIndex: number | '';
  leftAxis: GraphSeries[];
  rightAxis: GraphSeries[];
}
// #endregion form types
