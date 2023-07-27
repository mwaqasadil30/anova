export interface ReadingForForecastTable {
  logTime?: Date;
  estimatedScaledValue?: string | number | null;
  highScaledValue?: string | number | null;
  lowScaledValue?: string | number | null;
}

export enum ForecastReadingType {
  High = 'high',
  Low = 'low',
  Normal = 'normal',
}
