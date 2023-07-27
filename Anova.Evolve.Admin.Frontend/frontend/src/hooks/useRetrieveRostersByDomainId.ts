import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const retrieveRostersByDomainId = (domainId: string) => {
  return ApiService.RosterService.roster_GetByDomainId(domainId);
};

export const useRetrieveRostersByDomainId = (domainId: string) => {
  return useQuery([APIQueryKey.retrieveRosterList, domainId], () =>
    retrieveRostersByDomainId(domainId)
  );
};
