import { UpdateB2cUserRequest, UpdateB2cUserResponse } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = UpdateB2cUserRequest;
type ResponseObj = UpdateB2cUserResponse;

const updateB2cUser = (request: RequestObj) => {
  return ApiService.B2CUsersService.b2CUsers_UpdateUser(request);
};

export const useUpdateB2cUser = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (request: RequestObj) => updateB2cUser(request),
    mutationOptions
  );
};
