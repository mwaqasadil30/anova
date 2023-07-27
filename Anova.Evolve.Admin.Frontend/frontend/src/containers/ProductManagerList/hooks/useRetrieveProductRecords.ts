import {
  EvolveRetrieveProductRecordsByDomainRequest,
  EvolveRetrieveProductRecordsByDomainResponse,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery, UseQueryOptions } from 'react-query';

const retrieveProductRecords = (
  request: EvolveRetrieveProductRecordsByDomainRequest
) => {
  return ApiService.GeneralService.retrieveProductRecordsByDomain_RetrieveProductRecordsByDomain(
    request
  );
};

export const useRetrieveProductRecords = (
  request: EvolveRetrieveProductRecordsByDomainRequest,
  options?: UseQueryOptions<EvolveRetrieveProductRecordsByDomainResponse>
) => {
  return useQuery(
    [APIQueryKey.retrieveProductRecords, request],
    () => retrieveProductRecords(request),
    options
  );
};
