import { useQuery } from 'react-query';
import { ApiService } from 'api/admin/ApiService';

const useMetronConfiguration = (deviceId: string) => {
  return useQuery(['metronRtu_RetrieveConfiguration', deviceId], () =>
    ApiService.MetronRtuService.metronRtu_RetrieveMetronConfigs(deviceId)
  );
};
export default useMetronConfiguration;
