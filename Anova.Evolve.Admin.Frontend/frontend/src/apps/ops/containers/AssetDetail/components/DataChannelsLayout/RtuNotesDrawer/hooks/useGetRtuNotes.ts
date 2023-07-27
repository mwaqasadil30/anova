import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const getRtuNotes = (rtuDeviceId: string) => {
  if (rtuDeviceId) {
    return ApiService.RtuService.rtu_RetrieveRtuNotes(rtuDeviceId);
  }
  return null;
};

export const useGetRtuNotes = (rtuDeviceId: string) => {
  return useQuery([APIQueryKey.getRtuNotes, rtuDeviceId], () =>
    getRtuNotes(rtuDeviceId)
  );
};
