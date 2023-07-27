import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

interface RetrieveChartRequest {
  chartId?: number;
}

const getChartDetails = ({ chartId }: RetrieveChartRequest) => {
  if (!chartId) {
    return null;
  }
  return ApiService.ChartService.chart_GetChart(chartId);
};

export const useGetChart = (request: RetrieveChartRequest) => {
  return useQuery(
    [APIQueryKey.getFreezerChart, request],
    () => getChartDetails(request),
    {
      enabled: !!request.chartId,
    }
  );
};
