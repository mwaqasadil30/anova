import { DataChannelGeneralInfoDTO } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = DataChannelGeneralInfoDTO;

type ResponseObj = boolean;

const saveGeneralInformation = (request: RequestObj) => {
  return ApiService.DataChannelService.dataChannel_SaveGeneralInfo(request);
};

export const useSaveGeneralInformation = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (request: RequestObj) => saveGeneralInformation(request),
    mutationOptions
  );
};
