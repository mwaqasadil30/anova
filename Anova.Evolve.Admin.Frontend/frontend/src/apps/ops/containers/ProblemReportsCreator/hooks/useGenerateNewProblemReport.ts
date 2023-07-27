import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const generateNewProblemReport = (dataChannelId: string) => {
  return ApiService.ProblemReportService.problemReport_GenerateNewProblemReport(
    dataChannelId
  );
};

export const useGenerateNewProblemReport = (dataChannelId: string) => {
  return useQuery(
    [APIQueryKey.generateNewProblemReport, dataChannelId],
    () => generateNewProblemReport(dataChannelId),
    {
      enabled: !!dataChannelId,
    }
  );
};
