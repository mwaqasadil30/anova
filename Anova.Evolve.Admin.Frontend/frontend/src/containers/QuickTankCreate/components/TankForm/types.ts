import {
  DataChannelDataSourceType,
  EvolveAssetCustomProperty,
  TankType,
} from 'api/admin/api';
import type { FormIntegrationDetails } from 'utils/forms/types';

export interface Values {
  description: string;
  technician: string;
  siteId?: string;
  isTankDimensionsSet?: boolean;
  tankType?: TankType | null;
  productId?: string | null;
  tankDimensionId?: string | null;

  dataSource?: DataChannelDataSourceType | null;
  displayUnits?: string | null;
  levelMonitoringMaxProductHeight?: string | null;
  levelVolumeMaxProductHeight?: string | null;
  reorderEventValue?: number | null;
  criticalEventValue?: number | null;
  _convertedDisplayUnitsProductHeight?: number | null;
  _convertedReorderEventValue?: number | null;
  _convertedCriticalEventValue?: number | null;

  eventRuleGroupId?: number | null;
  notes?: string | null;
  customProperties?: EvolveAssetCustomProperty[] | null;

  // Integration parameters
  integrationId?: string | null;
  integrationDomainId?: string | null;
  levelIntegrationDetails: FormIntegrationDetails;
  pressureIntegrationDetails: FormIntegrationDetails;
  batteryIntegrationDetails: FormIntegrationDetails;

  // Data Source: RTU
  rtuId?: string;
  levelDataChannelTemplateId?: string | null;
  levelRtuChannelId?: string | null;
  pressureDataChannelTemplateId?: string | null;
  pressureRtuChannelId?: string | null;
  addBatteryChannel?: boolean;
  addRtuTemperatureChannel?: boolean;

  // Data Source: Published data channel
  sourceDataChannelId?: string | null;
}
