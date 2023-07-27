import { EditAssetCopyDataChannelInfo } from 'api/admin/api';

export interface Values {
  assetId?: string;
  assetTitle?: string | null;
  domainId?: string;
  sourceSiteId?: string;
  sourceSiteName?: string | null;
  sourceTechnician?: string | null;
  targetDescription?: string | null;
  targetSiteId?: string | null;
  targetTechnician?: string | null;
  targetNotes?: string | null;
  isMobile?: boolean;
  geoAreaGroupId?: number | null;
  dataChannels?: EditAssetCopyDataChannelInfo[] | null;
  targetAssetId?: string | null;
}
