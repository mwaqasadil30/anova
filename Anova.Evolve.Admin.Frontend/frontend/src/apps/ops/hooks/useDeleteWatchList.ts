import { UserWatchListDto } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = UserWatchListDto;
type ResponseObj = boolean;

const deleteWatchList = (request: RequestObj) => {
  return ApiService.UserWatchListService.userWatchList_DeleteUserWatchListItem(
    request
  );
};

export const useDeleteWatchList = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (request: RequestObj) => deleteWatchList(request),
    mutationOptions
  );
};
