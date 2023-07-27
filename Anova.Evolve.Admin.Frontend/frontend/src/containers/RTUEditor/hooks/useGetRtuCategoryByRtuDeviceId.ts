import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const getRtuCategoryByRtuDeviceId = (deviceId: string | null) => {
  return ApiService.RtuService.rtu_RetrieveRtuCategory(deviceId);
};

export const useGetRtuCategoryByRtuDeviceId = (deviceId: string | null) => {
  return useQuery(
    [APIQueryKey.getRtuCategory, deviceId],
    () => getRtuCategoryByRtuDeviceId(deviceId!),
    {
      enabled: !!deviceId,
    }
  );
};
