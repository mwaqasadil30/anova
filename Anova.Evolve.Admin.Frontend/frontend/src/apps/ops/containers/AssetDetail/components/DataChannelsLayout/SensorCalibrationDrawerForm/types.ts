import { DataChannelCategory, ScalingModeType } from 'api/admin/api';

export interface SensorCalibrationMappedValue {
  raw?: number | '';
  scaled?: number | '';
}

export interface SensorCalibrationValues {
  // Basic Information
  description: string; // Read only
  dataChannelType: DataChannelCategory | null; // Read only

  dataChannelTemplateId: string;
  isVolumetric: boolean;
  scaledUnits: string; // TODO: What should this type actually be?

  // Basic Information > Advanced Settings
  scalingMode: ScalingModeType | '';
  rawUnits: string; // TODO: What should this type actually be?
  // Basic Information > Advanced Settings > Prescaling
  enablePrescaling: boolean;
  zeroScale: number | '';
  fullScale: number | '';
  // Basic Information > Advanced Settings > Filter
  enableLimits: boolean;
  lowLimit: number | '';
  highLimit: number | '';

  // Scaling Mode > Linear
  rawParametersSensorMin?: number | '';
  rawParametersSensorMax?: number | '';
  scaledParametersSensorMin?: number | '';
  scaledParametersSensorMax?: number | '';

  // Scaling Mode > Mapped
  // Array of up to 20 items
  mappedValues?: SensorCalibrationMappedValue[];
}
