import type { AssetInfoRecordDTO } from 'types/asset';

export const formatAddressInOneLine = (
  address1?: string | null,
  city?: string | null,
  state?: string | null,
  country?: string | null
) => {
  return [address1, city, state, country].filter(Boolean).join(', ');
};

export const formatAssetRecordSiteInformation = (
  assetRecord: AssetInfoRecordDTO
) => {
  const { address1, city, state, country } = assetRecord;
  return formatAddressInOneLine(address1, city, state, country);
};
