import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const getProblemReportEmailAddresses = () => {
  return ApiService.ProblemReportService.problemReport_RetrieveEmailAddresses();
};

export const useGetProblemReportEmailAddresses = () => {
  return useQuery([APIQueryKey.getProblemReportEmailAddresses], () =>
    getProblemReportEmailAddresses()
  );
};
