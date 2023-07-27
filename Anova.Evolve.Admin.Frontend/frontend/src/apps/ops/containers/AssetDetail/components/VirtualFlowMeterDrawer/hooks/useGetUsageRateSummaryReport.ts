import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

interface Request {
  assetId?: string | null;
}

const getUsageRateSummaryReport = (assetId: string) => {
  return ApiService.UsageRateService.usageRate_GetUsageRateSummaryReport(
    assetId
  );
};

export const useGetUsageRateSummaryReport = (request: Request) => {
  return useQuery(
    [APIQueryKey.getUsageRateSummaryReport, request],
    () => getUsageRateSummaryReport(request.assetId!),
    {
      enabled: !!request.assetId,
    }
  );
};
