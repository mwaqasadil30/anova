import { SiteInfoDto } from 'api/admin/api';

export const storeSiteIdOrSiteNumber = (
  storeSiteId?: boolean,
  site?: SiteInfoDto | null
) => {
  if (storeSiteId && site) {
    return site.id;
  }

  return site ? site.siteNumber : '';
};
