import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type Request = number;
type Response = boolean;

const deleteDefaultCharts = (id: Request) => {
  return ApiService.ChartDefaultService.chartDefault_DeleteChart(id);
};

export const useDeleteDefaultCharts = (
  mutationOptions?: UseMutationOptions<Response, unknown, Request, unknown>
) => {
  return useMutation((id: Request) => deleteDefaultCharts(id), mutationOptions);
};
