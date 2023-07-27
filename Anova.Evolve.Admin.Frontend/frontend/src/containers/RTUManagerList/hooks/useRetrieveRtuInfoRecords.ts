import {
  EvolveRetrieveRtuInfoRecordsByOptionsRequest,
  EvolveRetrieveRtuInfoRecordsByOptionsResponse,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery, UseQueryOptions } from 'react-query';

const retrieveRtuInfoRecords = (
  filterOptions: EvolveRetrieveRtuInfoRecordsByOptionsRequest
) => {
  return ApiService.RTUService.retrieveRtuInfoRecordsByOptions_RetrieveRtuInfoRecordsByOptions(
    filterOptions
  );
};

export const useRetrieveRtuInfoRecords = (
  filterOptions: EvolveRetrieveRtuInfoRecordsByOptionsRequest,
  options?: UseQueryOptions<EvolveRetrieveRtuInfoRecordsByOptionsResponse>
) => {
  return useQuery(
    [APIQueryKey.retrieveRtuInfoRecords, filterOptions],
    () => retrieveRtuInfoRecords(filterOptions),
    options
  );
};
