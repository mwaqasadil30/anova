import {
  DataChannelTankDimensionsMapPointDTO,
  GenerateScalingMapDTO,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery, UseQueryOptions } from 'react-query';

const getGenerateDataChannelMapPoints = (
  tankAndSensorConfig: GenerateScalingMapDTO
) => {
  return ApiService.DataChannelService.dataChannel_GenerateScalingMap(
    tankAndSensorConfig
  );
};

export const useGetGenerateDataChannelMapPoints = (
  tankAndSensorConfig: GenerateScalingMapDTO | null,
  options?: UseQueryOptions<DataChannelTankDimensionsMapPointDTO[]>
) => {
  return useQuery(
    [APIQueryKey.getGenerateDataChannelMapPoints, tankAndSensorConfig],
    () => getGenerateDataChannelMapPoints(tankAndSensorConfig!),
    {
      enabled: !!tankAndSensorConfig,
      ...options,
    }
  );
};
