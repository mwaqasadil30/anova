import { useQuery } from 'react-query';
import { ApiService } from 'api/admin/ApiService';

const useRtuNotes = (deviceId: string) => {
  return useQuery(['rtu_RetrieveRtuNotes', deviceId], () =>
    ApiService.RtuService.rtu_RetrieveRtuNotes(deviceId)
  );
};
export default useRtuNotes;
