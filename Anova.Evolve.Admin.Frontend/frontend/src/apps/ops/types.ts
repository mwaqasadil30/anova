import { ValueTupleOfDoubleAndDouble } from 'api/admin/api';
import { ReadingsChartZoomLevel } from 'types';

export enum ProblemReportStatusFilterEnum {
  Open = 0,
  Closed = 1,
  Both = 2,
}

export enum ChartZoomLevelButtonOption {
  Custom = -1,
  // Use a specific value for the `Now` option
  Now = ReadingsChartZoomLevel.TwelveHours,
  TwelveHours = ReadingsChartZoomLevel.TwelveHours,
  OneYear = ReadingsChartZoomLevel.OneYear,
  ThreeMonths = 2160,
  OneMonth = 720,
  TwelveWeeks = ReadingsChartZoomLevel.TwelveWeeks,
  FourWeeks = ReadingsChartZoomLevel.FourWeeks,
  TwoWeeks = ReadingsChartZoomLevel.TwoWeeks,
  OneWeek = ReadingsChartZoomLevel.OneWeek,
  FourDay = ReadingsChartZoomLevel.FourDays,
  TwoDay = ReadingsChartZoomLevel.TwoDays,
  OneDay = ReadingsChartZoomLevel.OneDay,
}

export enum TimeRangeDropdownOptions {
  Custom = -1,
  // Silverlight goes back 2 months when "None" is selected.
  // To not have both TwoMonths and None selected at the same time, None will
  // be one less day in hours.
  None = 1436,
  TwoHours = 2,
  FourHours = 4,
  TwelveHours = 12,
  OneDay = 24,
  TwoDays = 48,
  FourDays = 96,
  OneWeek = 168,
  TwoWeeks = 336,
  FourWeeks = 672,
  TwoMonths = 1460,
  FourMonths = 2920,
  SixMonths = 4380,
  OneYear = 8760,
}

// Import csv-related types
export interface ValueTupleOfDoubleAndDoubleWithKey
  extends ValueTupleOfDoubleAndDouble {
  // We add a key to prevent weird react .map() issues where stale data is shown
  key: string;
}
