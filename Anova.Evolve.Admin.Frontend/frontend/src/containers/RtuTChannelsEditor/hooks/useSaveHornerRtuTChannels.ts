import { HornerRtuTransactionChannelDTO } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation } from 'react-query';

const useSaveHornerRtuTChannels = () => {
  return useMutation(
    ({
      deviceId,
      transactionChannels,
    }: {
      deviceId: string;
      transactionChannels: HornerRtuTransactionChannelDTO[];
    }) => {
      return ApiService.HornerRtuService.hornerRtu_UpdateHornerTransactionChannels(
        deviceId,
        transactionChannels
      );
    }
  );
};
export default useSaveHornerRtuTChannels;
