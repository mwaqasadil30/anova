import { ApiService } from 'api/admin/ApiService';
import { useQuery } from 'react-query';

const useCommunicationConfigs = (deviceId: string) => {
  return useQuery(['hornerRtu_RetrieveCommunicationConfigs', deviceId], () =>
    ApiService.HornerRtuService.hornerRtu_RetrieveCommunicationConfigs(deviceId)
  );
};
export default useCommunicationConfigs;
