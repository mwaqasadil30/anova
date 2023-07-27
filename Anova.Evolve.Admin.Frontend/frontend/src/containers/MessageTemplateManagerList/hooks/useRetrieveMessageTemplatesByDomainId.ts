import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const getMessageTemplatesByDomainId = (domainId: string) => {
  return ApiService.MessageTemplateService.messageTemplate_GetList(domainId);
};

export const useGetMessageTemplatesByDomainId = (domainId: string) => {
  return useQuery([APIQueryKey.getMessageTemplateList, domainId], () =>
    getMessageTemplatesByDomainId(domainId)
  );
};
