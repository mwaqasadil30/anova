import { ProblemReportActivityLogDto } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

export interface Request {
  problemReportId: number;
  problemReportActivityLog: ProblemReportActivityLogDto;
}

type Response = boolean;

const saveProblemReportActivityLog = (request: Request) => {
  return ApiService.ProblemReportService.problemReport_SaveActivityLog(
    request.problemReportId,
    request.problemReportActivityLog
  );
};

export const useSaveProblemReportActivityLog = (
  mutationOptions?: UseMutationOptions<Response, unknown, Request, unknown>
) => {
  return useMutation(
    (request: Request) => saveProblemReportActivityLog(request),
    mutationOptions
  );
};
