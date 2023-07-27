import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type Request = string;

const deleteB2cUser = (userId?: Request) => {
  if (!userId) {
    return null;
  }

  return ApiService.B2CUsersService.b2CUsers_DeleteB2CUser(userId);
};

export const useDeleteB2cUser = (
  mutationOptions?: UseMutationOptions<unknown, unknown, Request, unknown>
) => {
  return useMutation(
    // TODO: Figure out why this needs ts-ignore
    // @ts-ignore
    (userId: Request) => deleteB2cUser(userId),
    mutationOptions
  );
};
