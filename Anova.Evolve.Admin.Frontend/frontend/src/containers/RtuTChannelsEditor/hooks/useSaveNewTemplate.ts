import { useMutation } from 'react-query';
import { ApiService } from 'api/admin/ApiService';
import { HornerRtuTransactionChannelDTO } from 'api/admin/api';

const useSaveNewTemplate = () => {
  return useMutation(
    ({
      templateName,
      channels,
    }: {
      templateName: string;
      channels: HornerRtuTransactionChannelDTO[];
    }) =>
      ApiService.HornerRtuService.hornerRtu_CreateHornerTransactionChannelsTemplate(
        templateName,
        channels
      )
  );
};
export default useSaveNewTemplate;
