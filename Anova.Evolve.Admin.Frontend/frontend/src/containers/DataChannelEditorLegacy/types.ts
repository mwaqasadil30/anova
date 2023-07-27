import {
  DataChannelProduct,
  DataChannelTankDimension,
  EventRuleType,
  EvolveRetrieveEditLevelDataChannelInfoRequest,
  EvolveRetrieveEditLevelDataChannelInfoResponse,
  EvolveSaveEditLevelDataChannelInfoRequest,
  EvolveSaveEditLevelDataChannelInfoResponse,
  ProductNameInfo,
  TankDimensionDescriptionInfo,
  UnitType,
} from 'api/admin/api';
import { Values } from './components/ObjectForm/types';

export enum DataChannelEditorTabs {
  General = 0,
  Events = 1,
  Publish = 2,
  History = 3,
}

export enum UnitConversionType {
  DisplayUnits = 'displayUnits',
  TankDimension = 'tankDimension',
  Product = 'product',
}

export type DCEditorProductInfo =
  | DataChannelProduct
  | Partial<ProductNameInfo>
  | null;

export type DCEditorTankDimensionInfo =
  | Partial<TankDimensionDescriptionInfo>
  | DataChannelTankDimension
  | null;

export interface UnitConversionDetails {
  productId: string;
  productInfo: DCEditorProductInfo;
  tankDimensionId: string;
  tankDimensionInfo: DCEditorTankDimensionInfo;
  unitConversionType: UnitConversionType | null;
  fromUnit: UnitType | null;
  toUnit: UnitType;
  scaledUnit?: UnitType;
  fromTextValue?: string | null;
  toTextValue: string;
  showUsageRate?: boolean;
  displayDecimalPlaces?: number | string | null;
  // Fields
  displayMaxProductHeight?: number | null;
  graphMin?: number | null;
  graphMax?: number | null;
  maxDeliveryQuantity?: number | null;
  usageRate?: number | null;
  values: Values;
}

export interface UnitConversionDetailsForDialog {
  unitConversionType: UnitConversionType | null;
  productId?: string;
  productInfo?: DCEditorProductInfo;
  tankDimensionId?: string;
  tankDimensionInfo?: DCEditorTankDimensionInfo;
  fromUnit?: UnitType | null;
  toUnit?: UnitType | null;
  fromTextValue?: string | null;
  toTextValue: string;
}

export interface ConfirmedUnitConversions {
  displayMaxProductHeight?: number;
  graphMin?: number;
  graphMax?: number;
  maxDeliveryQuantity?: number;
  usageRate?: number;
  productInfo: DCEditorProductInfo;
  tankDimensionInfo: DCEditorTankDimensionInfo;
  displayUnits: UnitType;
  eventRuleFieldNameValuePairs: { fieldName: string; value: number }[];
}

export enum AccordionEventType {
  Level = 'level',
  UsageRate = 'usageRate',
  ScheduledDelivery = 'scheduledDelivery',
  MissingData = 'missingData',
}

export interface EventRuleConversionValues {
  label: string;
  oldValue: any;
  newValue: number;
  type: EventRuleType | undefined;
}

export type RetrieveRequest = EvolveRetrieveEditLevelDataChannelInfoRequest;
export type RetrieveResponse = EvolveRetrieveEditLevelDataChannelInfoResponse;
export type SaveRequest = EvolveSaveEditLevelDataChannelInfoRequest;
export type SaveResponse = EvolveSaveEditLevelDataChannelInfoResponse;
