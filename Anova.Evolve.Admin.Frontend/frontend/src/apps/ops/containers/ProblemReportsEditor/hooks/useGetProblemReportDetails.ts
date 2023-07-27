import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';
import { isNumber } from 'utils/format/numbers';

const getProblemReportDetails = (problemReportId: number) => {
  return ApiService.ProblemReportService.problemReport_Get(problemReportId);
};

export const useGetProblemReportDetailsById = (problemReportId: number) => {
  return useQuery(
    [APIQueryKey.getProblemReportDetails, problemReportId],
    () => getProblemReportDetails(problemReportId),
    {
      enabled: isNumber(problemReportId),
      // Don't cache problem report data. We do this because if a user selects
      // a problem report from their watchlist, the data of the new problem
      // report they selected will not fetch it's data, but instead caches
      // the data of the problem report they were viewing before.
      cacheTime: 0,
      staleTime: 0,
    }
  );
};
