import { RosterDto } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = RosterDto;
type ResponseObj = RosterDto;

const saveRoster = (request: RequestObj) => {
  return ApiService.RosterService.roster_Save(request);
};

export const useSaveRoster = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (request: RequestObj) => saveRoster(request),
    mutationOptions
  );
};
