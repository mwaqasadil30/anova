import { DataChannelTankAndSensorConfigDTO } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = DataChannelTankAndSensorConfigDTO;

type ResponseObj = boolean;

const savePressureTankAndSensorConfig = (request: RequestObj) => {
  return ApiService.DataChannelService.dataChannel_SavePressureTankAndSensorConfig(
    request
  );
};

export const useSavePressureTankAndSensorConfig = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (request: RequestObj) => savePressureTankAndSensorConfig(request),
    mutationOptions
  );
};
