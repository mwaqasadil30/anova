import { ProblemReportDetailDto } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

export interface Request {
  problemReport: ProblemReportDetailDto;
  dataChannelId: string;
}

type Response = boolean;

const createNewProblemReport = (request: Request) => {
  return ApiService.ProblemReportService.problemReport_CreateManualProblemReport(
    request.problemReport,
    request.dataChannelId
  );
};

export const useCreateNewProblemReport = (
  mutationOptions?: UseMutationOptions<Response, unknown, Request, unknown>
) => {
  return useMutation(
    (request: Request) => createNewProblemReport(request),
    mutationOptions
  );
};
