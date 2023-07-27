import { CustomSiteIntegration1DataChannelDTO } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = CustomSiteIntegration1DataChannelDTO;

type ResponseObj = boolean;

const saveApciCustomIntegration = (request: RequestObj) => {
  return ApiService.DataChannelService.dataChannel_SaveSiteIntegrationProfile(
    request
  );
};

export const useSaveApciCustomIntegration = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (request: RequestObj) => saveApciCustomIntegration(request),
    mutationOptions
  );
};
