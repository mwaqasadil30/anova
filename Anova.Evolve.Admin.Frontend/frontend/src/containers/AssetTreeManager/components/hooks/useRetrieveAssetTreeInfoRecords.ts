import {
  EvolveRetrieveAssetTreeInfoRecordsByDomainRequest,
  EvolveRetrieveAssetTreeInfoRecordsByDomainResponse,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery, UseQueryOptions } from 'react-query';

const retrieveAssetTreeInfoRecords = (
  request: EvolveRetrieveAssetTreeInfoRecordsByDomainRequest
) => {
  return ApiService.AssetService.retrieveAssetTreeInfoRecordsByDomain_RetrieveAssetTreeInfoRecordsByDomain(
    request
  );
};

export const useRetrieveAssetTreeInfoRecords = (
  request: EvolveRetrieveAssetTreeInfoRecordsByDomainRequest,
  options?: UseQueryOptions<EvolveRetrieveAssetTreeInfoRecordsByDomainResponse>
) => {
  return useQuery(
    [APIQueryKey.retrieveAssetTreeInfoRecords, request],
    () => retrieveAssetTreeInfoRecords(request),
    options
  );
};
