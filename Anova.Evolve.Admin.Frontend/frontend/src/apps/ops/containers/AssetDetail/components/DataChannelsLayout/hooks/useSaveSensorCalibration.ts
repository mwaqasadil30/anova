// import { ApiService } from 'api/admin/ApiService';
import { ScalingModeType } from 'api/admin/api';
import { useMutation, UseMutationOptions } from 'react-query';
import { SensorCalibrationMappedValue } from '../SensorCalibrationDrawerForm/types';

export interface SaveSensorCalibrationRequest {
  // Basic Information
  dataChannelTemplateId: string | null;
  isVolumetric: boolean;
  scaledUnits: string | null; // TODO: What should this type actually be?

  // Basic Information > Advanced Settings
  scalingMode: ScalingModeType | null;
  rawUnits: string | null; // TODO: What should this type actually be?
  // Basic Information > Advanced Settings > Prescaling
  enablePrescaling: boolean;
  zeroScale: number | null;
  fullScale: number | null;
  // Basic Information > Advanced Settings > Filter
  enableLimits: boolean;
  lowLimit: number | null;
  highLimit: number | null;

  // Scaling Mode > Linear
  rawParametersSensorMin?: number | null;
  rawParametersSensorMax?: number | null;
  scaledParametersSensorMin?: number | null;
  scaledParametersSensorMax?: number | null;

  // Scaling Mode > Mapped
  // Array of up to 20 items
  mappedValues?: SensorCalibrationMappedValue[] | null;
}
export interface SaveSensorCalibrationResponse {}

// request: SaveSensorCalibrationRequest
const saveSensorCalibration = () => {
  return new Promise<SaveSensorCalibrationResponse>((resolve) => {
    setTimeout(() => {
      resolve({} as SaveSensorCalibrationResponse);
    }, 800);
  });
  // return ApiService.RosterService.roster_Save(request);
};

export const useSaveSensorCalibration = (
  mutationOptions?: UseMutationOptions<
    SaveSensorCalibrationResponse,
    unknown,
    SaveSensorCalibrationRequest,
    unknown
  >
) => {
  return useMutation(
    // TODO: Pass in request
    () => saveSensorCalibration(),
    mutationOptions
  );
};
