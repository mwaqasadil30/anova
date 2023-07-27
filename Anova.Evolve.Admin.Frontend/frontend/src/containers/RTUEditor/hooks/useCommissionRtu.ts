import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = string | null;
type ResponseObj = void;

const commissionRtu = (deviceId: RequestObj) => {
  return ApiService.RcmService.rcm_CommissionRtu(deviceId);
};

export const useCommissionRtu = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (deviceId: RequestObj) => commissionRtu(deviceId),
    mutationOptions
  );
};
