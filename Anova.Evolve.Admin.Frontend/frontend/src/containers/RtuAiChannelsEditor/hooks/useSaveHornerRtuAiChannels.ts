import { HornerRtuAnalogInputChannelDTO } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation } from 'react-query';

const useSaveHornerRtuAiChannels = () => {
  return useMutation(
    ({
      deviceId,
      analogInputChannels,
    }: {
      deviceId: string;
      analogInputChannels: HornerRtuAnalogInputChannelDTO[];
    }) => {
      return ApiService.HornerRtuService.hornerRtu_UpdateHornerAnalogInputChannels(
        deviceId,
        analogInputChannels
      );
    }
  );
};
export default useSaveHornerRtuAiChannels;
