import {
  EvolveRetrieveSiteInfoRecordsByOptionsRequest,
  EvolveRetrieveSiteInfoRecordsByOptionsResponse,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery, UseQueryOptions } from 'react-query';

const retrieveSiteInfoRecords = (
  filterOptions: EvolveRetrieveSiteInfoRecordsByOptionsRequest
) => {
  return ApiService.GeneralService.retrieveSiteInfoRecordsByOptions_RetrieveSiteInfoRecordsByOptions(
    filterOptions
  );
};

export const useRetrieveSiteInfoRecords = (
  filterOptions: EvolveRetrieveSiteInfoRecordsByOptionsRequest,
  options?: UseQueryOptions<EvolveRetrieveSiteInfoRecordsByOptionsResponse>
) => {
  return useQuery(
    [APIQueryKey.retrieveSiteInfoRecords, filterOptions],
    () => retrieveSiteInfoRecords(filterOptions),
    options
  );
};
