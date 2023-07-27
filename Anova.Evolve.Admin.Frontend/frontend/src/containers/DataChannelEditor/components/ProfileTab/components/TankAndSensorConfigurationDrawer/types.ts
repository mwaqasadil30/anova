import {
  RtuChannelSetpointsSyncTypeEnum,
  ScalingModeTypeEnum,
  TankTypeEnum,
  UnitConversionModeEnum,
} from 'api/admin/api';
import { ValueTupleOfDoubleAndDoubleWithKey } from 'apps/ops/types';

// Back-end team said these options are hard-coded in silverlight's front-end
export enum GenerateFunctionType {
  Manual = 'manual',
  HorizontalTankWithFlatEnds = 'horizontalTankWithFlatEnds',
}

export interface Values {
  scalingModeId: ScalingModeTypeEnum | '';
  scaledUnitsAsText?: string;
  scaledUnitsId: number | '';
  scaledMin: number | '';
  scaledMax: number | '';
  // Prescaled & Linear Sensor Modes
  useLimits: boolean;
  rawUnitsAtUnderRange: number | '';
  rawUnitsAtOverRange: number | '';
  // Linear & Mapped Sensor Modes (Prescaling-related fields)
  usePrescaling: boolean;
  rawUnitsAtZero: number | '';
  rawUnitsAtFullScale: number | '';
  // Mapped Sensor Mode
  scalingdMap: ValueTupleOfDoubleAndDoubleWithKey[] | null;
  // Linear & Mapped Sensor Modes (Raw units (min/max) fields)
  rawUnits: string; // NOTE: will be removed in api eventually
  rawUnitsAsText: string;
  rawUnitsAtScaleMin: number | '';
  rawUnitsAtScaleMax: number | '';
  isRawDataInverted: boolean;
  isPrimary: boolean;
  matchRtuChannel?: boolean;
  // from  general info / tank setup
  tankTypeId: TankTypeEnum | '';
  tankDimensionId: string;
  productId: string;
  // Tank setup-related properties
  unitConversionModeId: UnitConversionModeEnum | '';
  // basic tank & simplified volumetric tank
  maxProductCapacity: number | '';
  // simplified volumetric & volumetric tank
  // Back-end allows a string to be sent ever since an api call was implemented
  // to get a custom list of selectable units (see: dataChannel_GetDisplayUnits)
  // and its type DataChannelDisplayUnitDTO (name and id are strings), but
  // the retrieve api is still typed as UnitTypeEnum
  displayUnitsId: number | '';
  displayMaxProductCapacity: number | '';
  graphMin: number | '';
  graphMax: number | '';
  graphMinInScaled: number | '';
  graphMaxInScaled: number | '';
  // From Forecast/Delivery panel
  minFillThreshold?: number | ''; // Used for conversion api
  maxTruckCapacity?: number | ''; // Used for conversion api
  displayMinFillThreshold?: number | '';
  displayMaxTruckCapacity?: number | '';
  // Linear Sensor Mode
  // sensorPosition: number | '';

  // volumetric tank
  calculatedMaxProductHeight?: number | ''; // temporarily removed from form

  // misc
  // Back-end does not care about generateWithFunction, purely front-end.
  generateWithFunction?: GenerateFunctionType;
  rtuChannelSetpointsSyncTypeId?: RtuChannelSetpointsSyncTypeEnum | null;
}
