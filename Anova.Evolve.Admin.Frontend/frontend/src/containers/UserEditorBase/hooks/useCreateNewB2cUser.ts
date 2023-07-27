import { CreateB2cUserRequest, CreateB2cUserResponse } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = CreateB2cUserRequest;
type ResponseObj = CreateB2cUserResponse;

const createNewB2cUser = (request: RequestObj) => {
  return ApiService.B2CUsersService.b2CUsers_CreateUser(request);
};

export const useCreateNewB2cUser = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (request: RequestObj) => createNewB2cUser(request),
    mutationOptions
  );
};
