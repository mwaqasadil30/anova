import { ChartDto } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = ChartDto;
type ResponseObj = ChartDto;

const saveChart = (request: RequestObj) => {
  return ApiService.ChartService.chart_Save(request);
};

export const useSaveChart = (
  mutationOptions?: UseMutationOptions<ResponseObj, unknown, unknown, unknown>
) => {
  return useMutation(
    (request: RequestObj) => saveChart(request),
    mutationOptions
  );
};
