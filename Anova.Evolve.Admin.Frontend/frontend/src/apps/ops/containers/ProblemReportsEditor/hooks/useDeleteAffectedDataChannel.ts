import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

interface Request {
  problemReportId: number;
  affectedDataChannelId: string;
}
type Response = boolean;

const deleteProblemReportAffectedDataChannel = (request: Request) => {
  return ApiService.ProblemReportService.problemReport_DeleteAffectedDataChannel(
    request.problemReportId,
    request.affectedDataChannelId
  );
};

export const useDeleteProblemReportAffectedDataChannel = (
  mutationOptions?: UseMutationOptions<Response, unknown, Request, unknown>
) => {
  return useMutation(
    (request: Request) => deleteProblemReportAffectedDataChannel(request),
    mutationOptions
  );
};
