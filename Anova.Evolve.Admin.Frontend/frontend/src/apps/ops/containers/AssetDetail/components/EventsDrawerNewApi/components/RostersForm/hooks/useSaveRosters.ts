import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type Request = {
  dataChannelEventRuleId: number;
  rosterIds: number[];
};
type Response = string;

const saveRosters = (request: Request) => {
  return ApiService.DataChannelEventRuleService.dataChannelEventRule_SaveRosters(
    request.dataChannelEventRuleId,
    request.rosterIds
  );
};

export const useSaveRosters = (
  mutationOptions?: UseMutationOptions<Response, unknown, Request, unknown>
) => {
  return useMutation(
    (request: Request) => saveRosters(request),
    mutationOptions
  );
};
