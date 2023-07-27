import { ApiService } from 'api/admin/ApiService';
import { useQuery } from 'react-query';

const useCommunicationConfigs = (deviceId: string) => {
  return useQuery(['metronRtu_RetrieveCommunicationConfigs', deviceId], () =>
    ApiService.MetronRtuService.metronRtu_RetrieveMetronCommunicationConfigs(
      deviceId
    )
  );
};
export default useCommunicationConfigs;
