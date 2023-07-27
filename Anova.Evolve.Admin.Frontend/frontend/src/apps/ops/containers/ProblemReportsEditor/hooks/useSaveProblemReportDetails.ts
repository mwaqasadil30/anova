import { ProblemReportDto } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

export interface Request {
  problemReportId: number;
  problemReport: ProblemReportDto;
}

type Response = boolean;

const saveProblemReportDetails = (request: Request) => {
  return ApiService.ProblemReportService.problemReport_Update(
    request.problemReportId,
    request.problemReport
  );
};

export const useSaveProblemReportDetails = (
  mutationOptions?: UseMutationOptions<Response, unknown, Request, unknown>
) => {
  return useMutation(
    (request: Request) => saveProblemReportDetails(request),
    mutationOptions
  );
};
