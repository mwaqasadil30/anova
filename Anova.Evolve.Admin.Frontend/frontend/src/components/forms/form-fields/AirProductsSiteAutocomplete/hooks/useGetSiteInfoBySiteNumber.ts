import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const getSiteInfoBySiteNumber = (siteNumber: string) => {
  return ApiService.SiteService.site_SearchForSiteBySiteNumber(siteNumber);
};

export const useGetSiteInfoBySiteNumber = (siteNumber: string) => {
  return useQuery(
    [APIQueryKey.getSiteInfoBySiteNumber, siteNumber],
    () => getSiteInfoBySiteNumber(siteNumber),
    {
      enabled: !!siteNumber,
      cacheTime: 0,
      staleTime: 0,
    }
  );
};
