import { DataChannelSaveIntegrationProfileCollectionDTO } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = DataChannelSaveIntegrationProfileCollectionDTO;

type Response = boolean;

const saveIntegrationProfileInfo = (request: RequestObj) => {
  return ApiService.DataChannelService.dataChannel_SaveIntegrationProfileInfo(
    request
  );
};

export const useSaveIntegrationProfileInfo = (
  mutationOptions?: UseMutationOptions<Response, unknown, RequestObj, unknown>
) => {
  return useMutation(
    (request: RequestObj) => saveIntegrationProfileInfo(request),
    mutationOptions
  );
};
