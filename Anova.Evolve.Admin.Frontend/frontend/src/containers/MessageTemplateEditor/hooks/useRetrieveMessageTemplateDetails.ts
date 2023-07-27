import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';
import { isNumber } from 'utils/format/numbers';

const getMessageTemplateDetails = (messageTemplateId: number) => {
  return ApiService.MessageTemplateService.messageTemplate_Get(
    messageTemplateId
  );
};

export const useGetMessageTemplateById = (messageTemplateId: number) => {
  return useQuery(
    [APIQueryKey.getMessageTemplateDetails, messageTemplateId],
    () => getMessageTemplateDetails(messageTemplateId),
    {
      enabled: isNumber(messageTemplateId),
    }
  );
};
