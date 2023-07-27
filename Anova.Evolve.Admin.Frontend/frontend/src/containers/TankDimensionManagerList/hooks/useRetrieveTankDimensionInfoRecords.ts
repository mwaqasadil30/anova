import {
  EvolveRetrieveTankDimensionInfoRecordsByDomainRequest,
  EvolveRetrieveTankDimensionInfoRecordsByDomainResponse,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery, UseQueryOptions } from 'react-query';

const retrieveTankDimensionInfoRecords = (
  request: EvolveRetrieveTankDimensionInfoRecordsByDomainRequest
) => {
  return ApiService.GeneralService.retrieveTankDimensionInfoRecordsByDomain_RetrieveTankDimensionInfoRecordsByDomain(
    request
  );
};

export const useRetrieveTankDimensionInfoRecords = (
  request: EvolveRetrieveTankDimensionInfoRecordsByDomainRequest,
  options?: UseQueryOptions<EvolveRetrieveTankDimensionInfoRecordsByDomainResponse>
) => {
  return useQuery(
    [APIQueryKey.retrieveTankDimensionInfoRecords, request],
    () => retrieveTankDimensionInfoRecords(request),
    options
  );
};
