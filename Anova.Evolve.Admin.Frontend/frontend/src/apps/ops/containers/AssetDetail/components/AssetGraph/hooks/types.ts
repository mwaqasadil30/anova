import {
  DataChannelDTO,
  ForecastDTO,
  ForecastModeType,
  ForecastMode,
  IDataChannelService,
  IGetDataChannelReadingsService,
  TableStorageReadingsRetrievalResponse,
  UnitTypeEnum,
} from 'api/admin/api';

export interface ReadingsHookApiData {
  isFetching: boolean;
  error: any;
  data: TableStorageReadingsRetrievalResponse | null | undefined;
  duration: number | null;
  makeRequest: IGetDataChannelReadingsService['getDataChannelReadings_GetDataChannelReadings'];
}

export interface ForecastReadingsHookApiData {
  isFetching: boolean;
  error: any;
  data: ForecastDTO | null | undefined;
  duration: number | null;
  makeRequest: IDataChannelService['dataChannel_GetForecasts'];
}

export interface UpdateReadingsCacheParams {
  dataChannel?: DataChannelDTO;
  unitType?: UnitTypeEnum | null;
  showSummarizedReadings?: boolean;
}

export interface UpdateForecastReadingsCacheParams {
  dataChannel?: DataChannelDTO;
  forecastMode?: ForecastModeType | ForecastMode;
  unitType?: UnitTypeEnum | null;
}
