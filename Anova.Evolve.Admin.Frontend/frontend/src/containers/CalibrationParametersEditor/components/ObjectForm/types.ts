import { ScalingModeType, UnitType } from 'api/admin/api';

export interface Values {
  scalingMode: ScalingModeType;
  rawUnits: UnitType | '';
  rawUnitsAtZero: string; // Number fields, but using string to keep formik happy
  rawUnitsAtFullScale: string; // Number fields, but using string to keep formik happy
  rawUnitsAtScaledMin: string; // Number fields, but using string to keep formik happy
  rawUnitsAtScaledMax: string; // Number fields, but using string to keep formik happy
  isDataInverted: boolean;
  rawUnitsAtUnderRange: string; // Number fields, but using string to keep formik happy
  rawUnitsAtOverRange: string; // Number fields, but using string to keep formik happy
  scaledMin: string; // Number fields, but using string to keep formik happy
  scaledMax: string; // Number fields, but using string to keep formik happy
}
