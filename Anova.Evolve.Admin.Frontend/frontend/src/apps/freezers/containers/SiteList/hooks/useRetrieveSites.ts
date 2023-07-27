import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const getSites = () => {
  return ApiService.FreezerAssetService.freezerAsset_GetSiteAssetSummary();
};

export const useGetSites = () => {
  return useQuery(APIQueryKey.retrieveFreezerSites, getSites);
};
