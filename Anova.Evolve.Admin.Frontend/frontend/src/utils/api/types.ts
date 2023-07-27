import { EditAssetDataChannel, EventInfoRecord } from 'api/admin/api';

export type PartialDataChannel = Pick<EditAssetDataChannel, 'description'>;
export type PartialEventRule = Pick<EventInfoRecord, 'eventRuleType'>;
