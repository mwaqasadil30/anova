import type { AssetInfoRecord, AssetTreeInfoRecord } from 'api/admin/api';

export type AssetInfoRecordDTO = Omit<AssetInfoRecord, 'init' | 'toJSON'>;

export type AssetTreeInfoRecordDTO = Omit<
  AssetTreeInfoRecord,
  'init' | 'toJSON'
>;
