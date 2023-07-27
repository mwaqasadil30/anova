import {
  DataChannelDataSourceType,
  DataChannelRtuChannel,
  DataChannelTemplateInfo,
  DataChannelType,
  EventComparatorType,
  EventImportanceLevelType,
  EventInventoryStatusType,
  EventRuleType,
  EvolveDataChannelEventRuleRosterInfo,
  ForecastModeType,
  PublishedDataChannelInfo,
  RTUDeviceInfo,
  ScalingModeType,
  TankType,
  UnitType,
} from 'api/admin/api';
import {
  DCEditorProductInfo,
  DCEditorTankDimensionInfo,
} from 'containers/DataChannelEditorLegacy/types';

export interface DCEditorEventRule {
  // Read-only properties on the EvolveDataChannelEventRule
  id?: number;
  sortOrderIndex?: number;
  delayEnabled?: boolean;
  eventRuleId?: number;
  tags?: string[] | null;
  dataChannelId?: string;
  isEventRuleEnabled?: boolean;
  isLinkedToEventRule?: boolean;
  isAutoCloseProblemReport?: boolean;
  isAutoCreateProblemReport?: boolean;
  problemReportImportanceLevel?: number | null;
  descriptionAbbreviation?: string | null;

  // Properties that can be modified via the form
  description: string;
  inventoryStatus?: EventInventoryStatusType;
  eventComparator?: EventComparatorType | null;
  enabled: boolean;
  setPoint: number | string;
  hysteresis: number | string;
  _precise_hysteresis: number | null;
  alwaysTriggered: boolean;
  graphed: boolean;
  summarized: boolean;
  acknowledgment: boolean;
  integrationId: string;
  eventValue: number | string;
  _precise_eventValue: number | null;
  rosters: EvolveDataChannelEventRuleRosterInfo[];
  importanceLevel: EventImportanceLevelType | '';
  delay: number | string;
  eventRuleType?: EventRuleType;
  usageRate: number | string;
  _precise_usageRate: number | null;
  minimumReadingPeriod: number | string;

  // Computed fields
  hours: number;
  minutes: number;
}

export interface Values {
  // #region General Tab
  dataChannelType: DataChannelType | undefined;
  description: string;
  serialNumber: string;
  isTankDimensionsSet: boolean;
  tankType?: TankType;
  tankDimensionInfo: DCEditorTankDimensionInfo;
  tankDimensionId?: string;
  productInfo: DCEditorProductInfo;
  productId?: string;
  dataSource?: DataChannelDataSourceType;

  rtuInfo?: Partial<RTUDeviceInfo> | null;
  rtuId?: string;
  rtuChannelInfo?: DataChannelRtuChannel | null;
  rtuChannelId?: string;
  sourceDataChannelId?: string;
  publishedChannelInfo?: PublishedDataChannelInfo | null;
  publishedComments?: string;
  dataChannelTemplateInfo: DataChannelTemplateInfo | null;
  dataChannelTemplateId?: string;
  scaledUnitsAsText: string;
  scaledUnits?: UnitType | '';
  scaledDecimalPlaces?: number | string;

  scalingMode?: ScalingModeType;
  setReadingDisplayOptions: boolean;
  displayUnits?: UnitType | '';
  scaledMaxProductHeight?: number | string;
  _precise_scaledMaxProductHeight?: number | null;
  displayMaxProductHeight?: number | string;
  _precise_displayMaxProductHeight?: number | null;
  displayDecimalPlaces?: number | string;
  graphYAxisScaleId?: number | string;
  graphMax?: number | string;
  _precise_graphMin?: number | null;
  graphMin?: number | string;
  _precise_graphMax?: number | null;
  isDisplayGapsInGraph?: boolean;
  forecastMode?: ForecastModeType;
  manualUsageRate?: number | string;
  _precise_manualUsageRate?: number | null;
  maxDeliverQuantity?: number | string;
  _precise_maxDeliverQuantity?: number | null;
  showHighLowForecast?: boolean;
  showScheduledDeliveriesInforecast?: boolean;
  autoGenerateIntegration1Id?: boolean;
  enableIntegration1?: boolean;
  integration1DomainId?: string;
  integration1Id: string;
  autoGenerateIntegration2Id?: boolean;
  enableIntegration2?: boolean;
  integration2DomainId?: string;
  integration2Id: string;
  rawUnits?: string;
  rawUnitsAtZero?: number | string;
  rawUnitsAtFullScale?: number | string;
  rawUnitsAtScaledMin?: number | string;
  rawUnitsAtScaledMax?: number | string;
  rawUnitsAtUnderRange?: number | string;
  rawUnitsAtOverRange?: number | string;
  isDataInverted?: boolean;
  scaledMax?: number | string;
  scaledMin?: number | string;
  // #endregion General Tab

  // #region Events Tab
  levelEventRules?: DCEditorEventRule[] | null;
  missingDataEventRules?: DCEditorEventRule[] | null;
  scheduledDeliveryEventRules?: DCEditorEventRule[] | null;
  usageRateEventRules?: DCEditorEventRule[] | null;
  // #endregion Events Tab

  // #region Misc
  lastUpdateUserName?: string | null;
  lastUpdatedDate?: Date | null;
  // #endregion Misc
}
