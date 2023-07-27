import { DataChannelDataSourceType, TankType } from 'api/admin/api';

export interface Values {
  description?: string | null;
  dataSource?: DataChannelDataSourceType | null;
  rtuId?: string | null;
  rtuChannelId?: string | null;
  sourceDataChannelId?: string | null;
  dataChannelTemplateId?: string | null;
  productId?: string | null;
  eventRuleGroupId?: string | null;
  tankDimensionId?: string | null;
  isTankDimensionsSet?: boolean | null;
  tankType?: TankType | null;
}
