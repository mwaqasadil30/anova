import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

interface RetrieveDomainNotesRequest {
  domainId?: string;
}

const getGetDomainNotes = ({ domainId }: RetrieveDomainNotesRequest) => {
  if (!domainId) {
    return null;
  }
  return ApiService.DomainNotesService.domainNotes_GetByDomainId(domainId);
};

const useGetDomainNotes = (request: RetrieveDomainNotesRequest) => {
  return useQuery(
    [APIQueryKey.getDomainNotes, request],
    () => getGetDomainNotes(request),
    {
      enabled: !!request.domainId,
    }
  );
};

export default useGetDomainNotes;
