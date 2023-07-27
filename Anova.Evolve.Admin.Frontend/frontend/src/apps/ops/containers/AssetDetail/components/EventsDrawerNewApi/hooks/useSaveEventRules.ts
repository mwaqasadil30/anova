import { QuickEditEventsDto } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

interface Request {
  assetId: string;
  eventRules: QuickEditEventsDto[];
}
type Response = QuickEditEventsDto[];

const saveEventRules = (request: Request) => {
  return ApiService.DataChannelEventRuleService.dataChannelEventRule_SaveEventRulesForAsset(
    request.assetId,
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
