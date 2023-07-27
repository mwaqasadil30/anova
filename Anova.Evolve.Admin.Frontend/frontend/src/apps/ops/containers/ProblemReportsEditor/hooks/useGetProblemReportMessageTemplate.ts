import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const getProblemReportMessageTemplates = () => {
  return ApiService.ProblemReportService.problemReport_RetrieveMessageTemplates();
};

export const useGetProblemReportMessageTemplates = () => {
  return useQuery([APIQueryKey.getProblemReportMessageTemplate], () =>
    getProblemReportMessageTemplates()
  );
};
