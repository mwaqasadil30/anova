import { QuickEditEventsDto } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

interface Request {
  dataChannelId: string;
  eventRules: QuickEditEventsDto;
}
type Response = boolean;

const saveEventRules = (request: Request) => {
  return ApiService.DataChannelEventRuleService.dataChannelEventRule_SaveEventRulesForDataChannel(
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
