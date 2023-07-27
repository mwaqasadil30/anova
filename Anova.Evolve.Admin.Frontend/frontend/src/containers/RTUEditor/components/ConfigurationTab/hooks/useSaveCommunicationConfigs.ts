import { HornerRtuCommunicationConfigDTO } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation } from 'react-query';

const useSaveCommunicationConfigs = (deviceId: string) => {
  const mutuation = useMutation((formData: HornerRtuCommunicationConfigDTO) => {
    return ApiService.HornerRtuService.hornerRtu_UpdateHornerCommunicationConfigs(
      deviceId,
      formData
    );
  });
  return mutuation;
};
export default useSaveCommunicationConfigs;
