import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = string | null;
type ResponseObj = void;

const callRtu = (deviceId: RequestObj) => {
  return ApiService.RcmService.rcm_CallRtu(deviceId);
};

export const useCallRtu = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (deviceId: RequestObj) => callRtu(deviceId),
    mutationOptions
  );
};
