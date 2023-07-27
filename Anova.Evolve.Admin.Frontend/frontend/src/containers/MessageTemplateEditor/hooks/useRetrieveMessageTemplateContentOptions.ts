import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const getMessageTemplateContentOptions = (domainId: string) => {
  return ApiService.MessageTemplateService.messageTemplate_GetMessageTemplateFields(
    domainId
  );
};

export const useGetMessageTemplateContentOptions = (domainId: string) => {
  return useQuery(
    [APIQueryKey.getMessageTemplateContentOptions, domainId],
    () => getMessageTemplateContentOptions(domainId)
  );
};
