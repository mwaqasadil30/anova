import {
  UpdateB2cUserDomainRolesAndAssetGroupsRequest,
  UpdateB2cUserDomainRolesAndAssetGroupsResponse,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

export type RequestObj = {
  userId: string;
  updateRequest: UpdateB2cUserDomainRolesAndAssetGroupsRequest;
};
type ResponseObj = UpdateB2cUserDomainRolesAndAssetGroupsResponse;

const updateUserDomainRolesAndAssetGroups = (request: RequestObj) => {
  return ApiService.B2CUsersService.b2CUsers_UpdateUserDomainRolesAndAssetGroups(
    request.userId,
    request.updateRequest
  );
};

export const useUpdateUserDomainRolesAndAssetGroups = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (request: RequestObj) => updateUserDomainRolesAndAssetGroups(request),
    mutationOptions
  );
};
