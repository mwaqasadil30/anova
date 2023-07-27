import { DataChannelEventRulesDTO } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

interface Request {
  dataChannelId: string;
  eventRules: DataChannelEventRulesDTO;
}
type Response = boolean;

const saveEventRules = (request: Request) => {
  return ApiService.DataChannelEventRuleService.dataChannelEventRule_SaveEventRulesForDataChennel(
    request.dataChannelId,
    request.eventRules
  );
};

export const useSaveEventRules = (
  mutationOptions?: UseMutationOptions<Response, unknown, Request, unknown>
) => {
  return useMutation(
    (request: Request) => saveEventRules(request),
    mutationOptions
  );
};
