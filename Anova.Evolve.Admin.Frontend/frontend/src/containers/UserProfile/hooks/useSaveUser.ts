import { UserSelfServeDto } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

interface RequestObj {
  userId: string;
  userDTO: UserSelfServeDto;
}

interface ResponseObj {}

const saveUser = (request: RequestObj) => {
  return ApiService.UserService.user_SelfServeUpdate(
    request.userId,
    request.userDTO
  );
};

export const useSaveUser = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (request: RequestObj) => saveUser(request),
    mutationOptions
  );
};
