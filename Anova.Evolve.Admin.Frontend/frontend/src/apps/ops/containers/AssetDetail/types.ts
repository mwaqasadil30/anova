import {
  DataChannelDTO,
  EvolveGetForecastReadingsByDataChannelIdResponse,
  EvolveReading,
  UnitTypeEnum,
} from 'api/admin/api';
import { ReadingsChartZoomLevel } from 'types';
import { UnitOfMeasureCategory } from 'utils/i18n/enum-to-text';
import { ForecastReadingsHookApiData } from './components/AssetGraph/hooks/types';

export type DataChannelForGraph = DataChannelDTO;

export enum AssetDetailTab {
  Details = 'details',
  Readings = 'readings',
  Forecast = 'forecast',
  Map = 'map',
  Events = 'events',
}

export interface CachedDataChannelReadings {
  readings: EvolveReading[];
  fromDate: Date;
  toDate: Date;
  wereReadingsSummarized?: boolean;
  isFetching: boolean;
  hasError: boolean;
  hasCachedData: boolean;
}

export interface GraphProperties {
  zoomLevel: ReadingsChartZoomLevel;
  setZoomLevel: (zoomLevel: ReadingsChartZoomLevel) => void;
  showForecast: boolean;
  setShowForecast: (showForecast: boolean) => void;
  showAllGpsReadings: boolean;
  setShowAllGpsReadings: (showAllGpsReadings: boolean) => void;
  fromDate: Date;
  setFromDate: (date: Date) => void;
  toDate: Date;
  setToDate: (date: Date) => void;
  paddedFromDate: Date;
  paddedToDate: Date;
  graphMinY?: number;
  setGraphMinY: (min?: number) => void;
  graphMaxY?: number;
  setGraphMaxY: (max?: number) => void;
  manyGraphedDataChannels?: DataChannelDTO[];
  setManyGraphedDataChannels: (dataChannels: DataChannelDTO[]) => void;

  // Additional things required for the graph
  initialZoomLevel: ReadingsChartZoomLevel.NotSet | ReadingsChartZoomLevel;
}

export interface ReadingsHookData {
  cachedReadings: Record<string, CachedDataChannelReadings | undefined>;
  cachedForecastReadings: Record<
    string,
    EvolveGetForecastReadingsByDataChannelIdResponse | undefined
  >;
  isCachedReadingsApiFetching: boolean;
  dataChannelForecastsApi: ForecastReadingsHookApiData;
  clearCache: () => void;
}

interface DataForChangingDataChannelUnit {
  dataChannelId: string;
  unit?: UnitTypeEnum | null;
}

export type ChangeDataChannelToUnitMappingFunction = (
  dataChannelIdsWithUnit: DataForChangingDataChannelUnit[]
) => void;

export type ChangeSelectedDataChannelFunction = (
  dataChannel: DataChannelForGraph,
  checked: boolean
) => void;

export interface CommonGraphDataChannelProps {
  dataChannels: DataChannelDTO[];
  isPublishedAsset?: boolean;
  selectedDataChannels: DataChannelForGraph[];
  isFetchingDataChannel?: boolean;
  minimumSelectionCount?: number;
  hideUnitOfMeasureButtons?: boolean;
  canSelectDataChannel?: (dataChannel: DataChannelDTO) => boolean;
  handleChangeSelectedDataChannel: ChangeSelectedDataChannelFunction;
  handleChangeDataChannelToUnitMapping?: (
    dataChannelId: string,
    unit?: UnitTypeEnum | null
  ) => void;
}

export interface AssetDetailDataChannelAction {
  label: React.ReactNode;
  onClick?: (event: React.MouseEvent, record: DataChannelDTO) => void;
}

export interface UOMOption {
  label: string;
  value: any;
  type: UnitOfMeasureCategory;
}
