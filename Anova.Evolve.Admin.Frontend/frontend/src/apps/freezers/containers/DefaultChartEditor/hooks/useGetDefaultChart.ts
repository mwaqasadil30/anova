import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

interface RetrieveChartRequest {
  defaultChartId?: number;
}

const getDefaultChartDetails = ({ defaultChartId }: RetrieveChartRequest) => {
  if (!defaultChartId) {
    return null;
  }
  return ApiService.ChartDefaultService.chartDefault_GetChartDefault(
    defaultChartId
  );
};

export const useGetDefaultChart = (request: RetrieveChartRequest) => {
  return useQuery(
    [APIQueryKey.getDefaultChart, request],
    () => getDefaultChartDetails(request),
    {
      enabled: !!request.defaultChartId,
    }
  );
};
