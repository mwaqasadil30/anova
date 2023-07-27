import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const getDefaultCharts = () => {
  return ApiService.ChartDefaultService.chartDefault_GetChartDefaultList();
};

export const useGetDefaultCharts = () => {
  return useQuery(APIQueryKey.getDefaultChartList, getDefaultCharts);
};
