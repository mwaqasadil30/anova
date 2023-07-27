import {
  EvolveRetrieveDomainInfoRecordsByParentDomainIdRequest,
  EvolveRetrieveDomainInfoRecordsByParentDomainIdResponse,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery, UseQueryOptions } from 'react-query';

const retrieveDomainInfoRecords = (
  request: EvolveRetrieveDomainInfoRecordsByParentDomainIdRequest
) => {
  return ApiService.GeneralService.retrieveDomainInfoRecordsByParentDomainId_RetrieveDomainInfoRecordsByParentDomainId(
    request
  );
};

export const useRetrieveDomainInfoRecords = (
  request: EvolveRetrieveDomainInfoRecordsByParentDomainIdRequest,
  options?: UseQueryOptions<EvolveRetrieveDomainInfoRecordsByParentDomainIdResponse>
) => {
  return useQuery(
    [APIQueryKey.retrieveDomainInfoRecords, request],
    () => retrieveDomainInfoRecords(request),
    options
  );
};
