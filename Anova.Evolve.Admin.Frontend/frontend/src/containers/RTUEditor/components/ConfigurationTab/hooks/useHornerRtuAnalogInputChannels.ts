import { useQuery } from 'react-query';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';

const useHornerRtuAnalogInputChannels = (
  deviceId: string,
  templateId?: number
) => {
  return useQuery(
    [APIQueryKey.retrieveHornerAnalogInputChannels, deviceId, templateId],
    () => {
      if (templateId && templateId !== -1) {
        return ApiService.HornerRtuService.hornerRtu_RetrieveHornerAnalogInputChannelsTemplate(
          templateId
        );
      }
      return ApiService.HornerRtuService.hornerRtu_RetrieveHornerAnalogInputChannels(
        deviceId
      );
    }
  );
};
export default useHornerRtuAnalogInputChannels;
