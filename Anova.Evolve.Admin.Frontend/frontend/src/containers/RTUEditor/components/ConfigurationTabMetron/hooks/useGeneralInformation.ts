import { useQuery } from 'react-query';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';

const useGeneralInformation = (deviceId: string) => {
  return useQuery(
    [APIQueryKey.retrieveMetronGeneralInformation, deviceId],
    () =>
      ApiService.MetronRtuService.metronRtu_RetrieveMetronGeneralInformation(
        deviceId
      )
  );
};
export default useGeneralInformation;
