import { UserWatchListDto, UserWatchListModel } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = UserWatchListDto;
type ResponseObj = UserWatchListModel;

const saveWatchList = (request: RequestObj) => {
  return ApiService.UserWatchListService.userWatchList_SaveUserWatchListItem(
    request
  );
};

export const useSaveWatchList = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (request: RequestObj) => saveWatchList(request),
    mutationOptions
  );
};
