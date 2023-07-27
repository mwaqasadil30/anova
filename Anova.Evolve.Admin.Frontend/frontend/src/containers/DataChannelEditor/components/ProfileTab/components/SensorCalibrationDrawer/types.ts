import {
  ScalingModeTypeEnum,
  UnitTypeEnum,
  ValueTupleOfDoubleAndDouble,
} from 'api/admin/api';

export interface Values {
  scalingModeId: ScalingModeTypeEnum | '';
  scaledUnitsId: UnitTypeEnum | '';
  scaledUnitsAsText?: string;
  scaledMin: number | '';
  scaledMax: number | '';
  // Linear Sensor Mode
  sensorPosition: number | '';

  // Mapped Sensor Mode
  scalingdMap: ValueTupleOfDoubleAndDouble[] | null;

  // Prescaled & Linear Sensor Modes
  useLimits: boolean;
  rawUnitsAtUnderRange: number | '';
  rawUnitsAtOverRange: number | '';

  // Linear & Mapped Sensor Modes (Prescaling-related fields)
  usePrescaling: boolean;
  rawUnitsAtZero: number | '';
  rawUnitsAtFullScale: number | '';

  // Linear & Mapped Sensor Modes (Raw units (min/max) fields)
  rawUnits: string; // NOTE: will be removed in api eventually
  rawUnitsAsText: string;
  rawUnitsAtScaleMin: number | '';
  rawUnitsAtScaleMax: number | '';
  isRawDataInverted: boolean;
}
