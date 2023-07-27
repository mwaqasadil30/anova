import { DigitalInputSensorCalibrationInfoDTO } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = DigitalInputSensorCalibrationInfoDTO;

type ResponseObj = boolean;

const saveDigitalSetupInfo = (request: RequestObj) => {
  return ApiService.DataChannelService.dataChannel_SaveDigitalSetupInfo(
    request
  );
};

export const useSaveDigitalSetupInfo = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (request: RequestObj) => saveDigitalSetupInfo(request),
    mutationOptions
  );
};
