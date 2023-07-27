import { MessageTemplateDto } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

export interface SendProblemReportEmailRequest {
  problemReportId: number;
  messageTemplate: MessageTemplateDto;
}

export type Response = boolean;

const sendProblemReportEmail = (request: SendProblemReportEmailRequest) => {
  return ApiService.ProblemReportService.problemReport_SendProblemReportEmail(
    request.problemReportId,
    request.messageTemplate
  );
};

export const useSendProblemReportEmail = (
  mutationOptions?: UseMutationOptions<
    Response,
    unknown,
    SendProblemReportEmailRequest,
    unknown
  >
) => {
  return useMutation(
    (request: SendProblemReportEmailRequest) => sendProblemReportEmail(request),
    mutationOptions
  );
};
