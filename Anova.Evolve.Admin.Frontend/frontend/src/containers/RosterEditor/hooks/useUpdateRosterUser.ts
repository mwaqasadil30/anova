import { RosterUserDto } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

interface RequestObj {
  roster: RosterUserDto;
  rosterId: number;
}

interface ResponseObj {}

const saveRosterUser = (request: RequestObj) => {
  return ApiService.RosterService.roster_SaveRosterUser(
    request.rosterId,
    request.roster
  );
};

export const useSaveRosterUser = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (request: RequestObj) => saveRosterUser(request),
    mutationOptions
  );
};
