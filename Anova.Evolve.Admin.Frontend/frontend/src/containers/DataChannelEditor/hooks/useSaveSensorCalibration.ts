import { DataChannelSensorInfoDTO } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = DataChannelSensorInfoDTO;

type ResponseObj = boolean;

const saveSensorCalibration = (request: RequestObj) => {
  return ApiService.DataChannelService.dataChannel_SaveSensorInfo(request);
};

export const useSaveSensorCalibration = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (request: RequestObj) => saveSensorCalibration(request),
    mutationOptions
  );
};
