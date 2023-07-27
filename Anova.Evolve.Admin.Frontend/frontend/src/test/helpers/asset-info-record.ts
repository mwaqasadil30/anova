import { AssetInfoRecordDTO } from 'types/asset';
import { AssetInfoRecord } from 'api/admin/api';

export const buildAssetInfoRecord = (
  overrides?: Partial<AssetInfoRecord>
): AssetInfoRecordDTO => {
  return {
    assetId: '1234',
    domainId: '5678',
    assetDescription: 'Asset Description',
    assetTitle: 'Asset Title',
    customerName: 'Customer Name',
    siteId: '9012',
    address1: '123 Fake St.',
    address2: null,
    address3: null,
    city: 'Toronto',
    state: 'ON',
    country: 'Canada',
    deviceId: '3456',
    productName: 'Product Name',
    dataChannelCount: 7,
    ...overrides,
  };
};
