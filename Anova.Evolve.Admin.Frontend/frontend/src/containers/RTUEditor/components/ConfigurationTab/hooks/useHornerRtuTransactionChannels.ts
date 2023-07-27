import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

interface Request {
  deviceId: string;
  templateId?: number;
}

const useHornerRtuTransactionChannels = (request: Request) => {
  return useQuery(
    [
      APIQueryKey.retrieveHornerTransactionChannels,
      request.deviceId,
      request.templateId,
    ],
    () => {
      if (request.templateId && request.templateId !== -1) {
        return ApiService.HornerRtuService.hornerRtu_RetrieveHornerTransactionChannelsTemplate(
          request.templateId
        );
      }
      return ApiService.HornerRtuService.hornerRtu_RetrieveHornerTransactionChannels(
        request.deviceId
      );
    }
  );
};
export default useHornerRtuTransactionChannels;
