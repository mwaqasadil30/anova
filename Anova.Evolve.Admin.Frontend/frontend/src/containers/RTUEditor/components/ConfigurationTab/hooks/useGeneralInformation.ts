import { useQuery } from 'react-query';
import { ApiService } from 'api/admin/ApiService';

const useGeneralInformation = (deviceId: string) => {
  return useQuery(
    ['hornerRtu_RetrieveHornerGeneralInformation', deviceId],
    () =>
      ApiService.HornerRtuService.hornerRtu_RetrieveHornerGeneralInformation(
        deviceId
      )
  );
};
export default useGeneralInformation;
