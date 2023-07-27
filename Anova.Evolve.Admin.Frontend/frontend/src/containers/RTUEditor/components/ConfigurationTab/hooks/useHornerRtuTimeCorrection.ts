import { useQuery } from 'react-query';
import { ApiService } from 'api/admin/ApiService';

const useHornerRtuTimeCorrection = (deviceId: string) => {
  return useQuery(['hornerRtu_RetrieveTimeCorrectionInfo', deviceId], () =>
    ApiService.HornerRtuService.hornerRtu_RetrieveTimeCorrectionInfo(deviceId)
  );
};
export default useHornerRtuTimeCorrection;
