import { useMutation } from 'react-query';
import { ApiService } from 'api/admin/ApiService';
import { HornerRtuAnalogInputChannelDTO } from 'api/admin/api';

const useSaveNewTemplate = () => {
  return useMutation(
    ({
      templateName,
      channels,
    }: {
      templateName: string;
      channels: HornerRtuAnalogInputChannelDTO[];
    }) =>
      ApiService.HornerRtuService.hornerRtu_CreateHornerAnalogInputChannelsTemplate(
        templateName,
        channels
      )
  );
};
export default useSaveNewTemplate;
