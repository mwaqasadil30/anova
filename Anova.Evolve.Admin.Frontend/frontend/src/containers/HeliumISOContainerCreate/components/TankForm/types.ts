import { EvolveAssetCustomProperty } from 'api/admin/api';
import type { FormIntegrationDetails } from 'utils/forms/types';

export interface Values {
  domainId: string | null;
  description: string;
  designCurveId: number | string;
  siteId?: string;
  rtuId?: string;
  addHeliumPressureRateOfChange: boolean;
  customProperties?: EvolveAssetCustomProperty[] | null;
  assetIntegrationId: string | null;
  integrationDomainId?: string | null;
  heliumLevelIntegrationDetails: FormIntegrationDetails | null;
  heliumPressureIntegrationDetails: FormIntegrationDetails | null;
  nitrogenLevelIntegrationDetails: FormIntegrationDetails | null;
  nitrogenPressureIntegrationDetails: FormIntegrationDetails | null;
  batteryIntegrationDetails: FormIntegrationDetails | null;
  gpsIntegrationDetails: FormIntegrationDetails | null;
  notes: string;
}
