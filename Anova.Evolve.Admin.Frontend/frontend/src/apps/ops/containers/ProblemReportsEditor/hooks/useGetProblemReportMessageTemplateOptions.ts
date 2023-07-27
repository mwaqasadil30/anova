import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const getProblemReportMessageTemplateOptions = () => {
  return ApiService.ProblemReportService.problemReport_RetrieveMessageTemplateFields();
};

export const useGetProblemReportMessageTemplateOptions = () => {
  return useQuery([APIQueryKey.getProblemReportMessageTemplateOptions], () =>
    getProblemReportMessageTemplateOptions()
  );
};
