import { MessageTemplateDto } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

export interface ProblemReportEmailPreviewRequest {
  problemReportId: number;
  messageTemplate: MessageTemplateDto;
}

export type Response = MessageTemplateDto;

const getPreviewProblemReportEmail = (
  request: ProblemReportEmailPreviewRequest
) => {
  return ApiService.ProblemReportService.problemReport_PreviewProblemReportEmail(
    request.problemReportId,
    request.messageTemplate
  );
};

export const useGetPreviewProblemReportEmail = (
  mutationOptions?: UseMutationOptions<
    Response,
    unknown,
    ProblemReportEmailPreviewRequest,
    unknown
  >
) => {
  return useMutation(
    (request: ProblemReportEmailPreviewRequest) =>
      getPreviewProblemReportEmail(request),
    mutationOptions
  );
};
