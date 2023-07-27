import { MetronGeneralInformationDTO } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation } from 'react-query';

const useSaveMetronGeneralInformation = (deviceId: string) => {
  const mutuation = useMutation((formData: MetronGeneralInformationDTO) => {
    return ApiService.MetronRtuService.metronRtu_UpdateMetronGeneralInformation(
      deviceId,
      formData
    );
  });
  return mutuation;
};
export default useSaveMetronGeneralInformation;
