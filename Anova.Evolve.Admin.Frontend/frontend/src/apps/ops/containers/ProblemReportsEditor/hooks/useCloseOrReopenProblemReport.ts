import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = {
  problemReportId: number;
  status: string;
};
type ResponseObj = boolean;

const closeOrReopenProblemReport = (request: RequestObj) => {
  return ApiService.ProblemReportService.problemReport_UpdateProblemReportStatus(
    request.problemReportId,
    request.status
  );
};

export const useCloseOrReopenProblemReport = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (request: RequestObj) => closeOrReopenProblemReport(request),
    mutationOptions
  );
};
