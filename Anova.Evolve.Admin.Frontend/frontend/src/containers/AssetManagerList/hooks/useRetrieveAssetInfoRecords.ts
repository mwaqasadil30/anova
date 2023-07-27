import {
  EvolveRetrieveAssetInfoRecordsByOptionsRequest,
  EvolveRetrieveAssetInfoRecordsByOptionsResponse,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery, UseQueryOptions } from 'react-query';

const retrieveAssetInfoRecords = (
  filterOptions: EvolveRetrieveAssetInfoRecordsByOptionsRequest
) => {
  return ApiService.AssetService.retrieveAssetInfoRecordsByOptions_RetrieveAssetInfoRecordsByOptions(
    filterOptions
  );
};

export const useRetrieveAssetInfoRecords = (
  filterOptions: EvolveRetrieveAssetInfoRecordsByOptionsRequest,
  options?: UseQueryOptions<EvolveRetrieveAssetInfoRecordsByOptionsResponse>
) => {
  return useQuery(
    [APIQueryKey.retrieveAssetInfoRecords, filterOptions],
    () => retrieveAssetInfoRecords(filterOptions),
    options
  );
};
