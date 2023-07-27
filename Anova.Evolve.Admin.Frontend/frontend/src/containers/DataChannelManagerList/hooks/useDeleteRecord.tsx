import {
  EvolveDeleteDataChannelsByIdListRequest,
  EvolveDeleteDataChannelsByIdListResponse,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = { dataChannelIds: string[] };
type ResponseObj = EvolveDeleteDataChannelsByIdListResponse;

const deleteDataChannels = (request: RequestObj) => {
  return ApiService.DataChannelService.deleteDataChannelsByIdList_DeleteDataChannelsByIdList(
    EvolveDeleteDataChannelsByIdListRequest.fromJS(request)
  );
};

export const useDeleteDataChannels = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (request: RequestObj) => deleteDataChannels(request),
    mutationOptions
  );
};
