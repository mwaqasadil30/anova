import { DataChannelManualReadingDTO } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = {
  dataChannelId: string;
  reading: DataChannelManualReadingDTO;
};

type ResponseObj = boolean;

const saveManualReading = (request: RequestObj) => {
  return ApiService.DataChannelService.dataChannel_SaveManualReading(
    request.dataChannelId,
    request.reading
  );
};

export const useSaveManualReading = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (request: RequestObj) => saveManualReading(request),
    mutationOptions
  );
};
