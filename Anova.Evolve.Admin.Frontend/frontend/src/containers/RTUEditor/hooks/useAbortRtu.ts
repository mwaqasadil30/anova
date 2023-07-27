import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = string | null;
type ResponseObj = void;

const abortRtu = (deviceId: RequestObj) => {
  return ApiService.RcmService.rcm_AbortRtuCall(deviceId);
};

export const useAbortRtu = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (deviceId: RequestObj) => abortRtu(deviceId),
    mutationOptions
  );
};
