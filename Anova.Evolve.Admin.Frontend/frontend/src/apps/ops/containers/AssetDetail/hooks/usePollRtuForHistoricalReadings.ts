import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = string;
type ResponseObj = boolean;

const pollRtuForHistoricalReadings = (deviceId: string) => {
  return ApiService.RtuService.rtu_PollRtuForInstantaneousAndHistoricalReadings(
    deviceId
  );
};

export const usePollRtuForHistoricalReadings = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (request: RequestObj) => pollRtuForHistoricalReadings(request),
    mutationOptions
  );
};
