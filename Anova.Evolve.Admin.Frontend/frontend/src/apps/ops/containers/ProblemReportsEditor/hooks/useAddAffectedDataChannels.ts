import { DataChannel_SummaryDto } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

interface Request {
  problemReportId: number;
  affectedDataChannels: DataChannel_SummaryDto[];
}
type Response = boolean;

const addSelectedAffectedDataChannels = (request: Request) => {
  return ApiService.ProblemReportService.problemReport_AddAffectedDataChannel(
    request.problemReportId,
    request.affectedDataChannels
  );
};

export const useAddSelectedAffectedDataChannels = (
  mutationOptions?: UseMutationOptions<Response, unknown, Request, unknown>
) => {
  return useMutation(
    (request: Request) => addSelectedAffectedDataChannels(request),
    mutationOptions
  );
};
