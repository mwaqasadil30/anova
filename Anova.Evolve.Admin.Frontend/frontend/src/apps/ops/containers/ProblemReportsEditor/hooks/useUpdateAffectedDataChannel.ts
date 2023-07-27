import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

interface Request {
  problemReportId: number;
  affectedDataChannelId: string;
  isPrimary?: boolean;
  isFaulty?: boolean;
}
type Response = boolean;

const updateProblemReportAffectedDataChannel = (request: Request) => {
  return ApiService.ProblemReportService.problemReport_UpdateAffectedDataChannel(
    request.problemReportId,
    request.affectedDataChannelId,
    request.isPrimary,
    request.isFaulty
  );
};

export const useUpdateProblemReportAffectedDataChannel = (
  mutationOptions?: UseMutationOptions<Response, unknown, Request, unknown>
) => {
  return useMutation(
    (request: Request) => updateProblemReportAffectedDataChannel(request),
    mutationOptions
  );
};
