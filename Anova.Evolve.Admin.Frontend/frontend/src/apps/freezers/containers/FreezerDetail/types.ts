export interface CSVProperties {
  filename: string;
  // react-csv doesn't export the type for the CSV data
  data: object[];
}

export interface ReadingsMappingValue {
  logTime: Date;
  // Data channel IDs will be keys, mapped to the value at the logTime. The
  // value is typed as any from the API.
  [key: string]: any;
}

export interface RouteState {
  startDate: string;
  endDate: string;
}

export enum FreezerChartType {
  Default = 'default',
  User = 'user',
}
