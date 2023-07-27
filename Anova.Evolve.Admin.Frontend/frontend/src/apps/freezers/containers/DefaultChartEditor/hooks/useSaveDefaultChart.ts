import { ChartDefaultDto } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = ChartDefaultDto;
type ResponseObj = ChartDefaultDto;

const saveDefaultChart = (request: RequestObj) => {
  return ApiService.ChartDefaultService.chartDefault_Save(request);
};

export const useSaveDefaultChart = (
  mutationOptions?: UseMutationOptions<ResponseObj, unknown, unknown, unknown>
) => {
  return useMutation(
    (request: RequestObj) => saveDefaultChart(request),
    mutationOptions
  );
};
