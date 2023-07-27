import { DataChannelSaveTankSetupInfoDTO } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = DataChannelSaveTankSetupInfoDTO;

type ResponseObj = boolean;

const saveTankSetupInfo = (request: RequestObj) => {
  return ApiService.DataChannelService.dataChannel_SaveTankSetupInfo(request);
};

export const useSaveTankSetupInfo = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (request: RequestObj) => saveTankSetupInfo(request),
    mutationOptions
  );
};
