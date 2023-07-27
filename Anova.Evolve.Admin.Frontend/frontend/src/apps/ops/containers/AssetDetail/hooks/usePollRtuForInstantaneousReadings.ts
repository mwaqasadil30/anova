import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = string;
type ResponseObj = boolean;

const pollRtuForInstantaneousReadings = (deviceId: string) => {
  return ApiService.RtuService.rtu_PollRtuForInstantaneousReadings(deviceId);
};

export const usePollRtuForInstantaneousReadings = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (request: RequestObj) => pollRtuForInstantaneousReadings(request),
    mutationOptions
  );
};
