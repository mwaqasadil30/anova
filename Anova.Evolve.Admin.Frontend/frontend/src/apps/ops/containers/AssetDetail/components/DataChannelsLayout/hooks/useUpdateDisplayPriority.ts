import { AssetDataChannelsDisplayPriorityDto } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = {
  assetId: string;
  displayPriorityList: AssetDataChannelsDisplayPriorityDto['dataChannelsDisplayPriority'];
};

type ResponseObj = boolean;

const updateDisplayPriority = (request: RequestObj) => {
  return ApiService.AssetService.asset_UpdateDataChannelsDisplayPriority(
    request.assetId,
    AssetDataChannelsDisplayPriorityDto.fromJS({
      dataChannelsDisplayPriority: request.displayPriorityList,
    })
  );
};

export const useUpdateDisplayPriority = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (request: RequestObj) => updateDisplayPriority(request),
    mutationOptions
  );
};
