import { HornerGeneralInformationDTO } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation } from 'react-query';

const useSaveGeneralInformation = (deviceId: string) => {
  const mutuation = useMutation((formData: HornerGeneralInformationDTO) => {
    return ApiService.HornerRtuService.hornerRtu_UpdateHornerGeneralInformation(
      deviceId,
      formData
    );
  });
  return mutuation;
};
export default useSaveGeneralInformation;
