import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = number;

const deleteChart = (chartId?: RequestObj) => {
  if (chartId === undefined || chartId === null) {
    return null;
  }

  return ApiService.ChartService.chart_DeleteChart(chartId);
};

export const useDeleteChart = (
  mutationOptions?: UseMutationOptions<unknown, unknown, RequestObj, unknown>
) => {
  return useMutation(
    // TODO: Figure out why this needs ts-ignore
    // @ts-ignore
    (chartId: RequestObj) => deleteChart(chartId),
    mutationOptions
  );
};
