import {
  EvolveRetrieveAssetGroupInfoRecordsByDomainRequest,
  EvolveRetrieveAssetGroupInfoRecordsByDomainResponse,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery, UseQueryOptions } from 'react-query';

const retrieveAssetGroupInfoRecords = (
  request: EvolveRetrieveAssetGroupInfoRecordsByDomainRequest
) => {
  return ApiService.AssetService.retrieveAssetGroupInfoRecordsByDomain_RetrieveAssetGroupInfoRecordsByDomain(
    request
  );
};

export const useRetrieveAssetGroupInfoRecords = (
  request: EvolveRetrieveAssetGroupInfoRecordsByDomainRequest,
  options?: UseQueryOptions<EvolveRetrieveAssetGroupInfoRecordsByDomainResponse>
) => {
  return useQuery(
    [APIQueryKey.retrieveAssetGroupInfoRecords, request],
    () => retrieveAssetGroupInfoRecords(request),
    options
  );
};
