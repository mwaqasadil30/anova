import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

interface Request {
  problemReportActivityLogId: number;
  problemReportId: string;
}
type Response = boolean;

const deleteProblemReportActivityLog = (request: Request) => {
  return ApiService.ProblemReportService.problemReport_DeleteActivityLog(
    request.problemReportActivityLogId,
    request.problemReportId
  );
};

export const useDeleteProblemReportActivityLog = (
  mutationOptions?: UseMutationOptions<Response, unknown, Request, unknown>
) => {
  return useMutation(
    (request: Request) => deleteProblemReportActivityLog(request),
    mutationOptions
  );
};
