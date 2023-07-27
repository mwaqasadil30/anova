import { AssetTreeInfoRecordDTO } from 'types/asset';
import { AssetTreeInfoRecord } from 'api/admin/api';

export const buildAssetTreeInfoRecord = (
  overrides?: Partial<AssetTreeInfoRecord>
): AssetTreeInfoRecordDTO => {
  return {
    assetTreeId: '123',
    name: '',
    expression: '',
    ...overrides,
  } as AssetTreeInfoRecord;
};
