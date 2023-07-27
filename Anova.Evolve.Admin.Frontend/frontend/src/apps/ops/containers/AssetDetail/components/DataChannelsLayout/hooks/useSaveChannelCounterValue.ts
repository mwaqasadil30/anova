import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = {
  rtuDeviceId: string;
  channelNumber: string;
  counterValue: number;
};

type ResponseObj = boolean;

const saveChannelCounterValue = (request: RequestObj) => {
  return ApiService.RtuService.rtu_SetChannelCounterValue(
    request.rtuDeviceId,
    request.channelNumber,
    request.counterValue
  );
};

export const useSaveChannelCounterValue = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (request: RequestObj) => saveChannelCounterValue(request),
    mutationOptions
  );
};
