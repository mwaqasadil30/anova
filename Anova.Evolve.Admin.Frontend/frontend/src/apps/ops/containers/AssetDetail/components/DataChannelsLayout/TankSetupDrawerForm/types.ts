import { ForecastMode, SupportedUOMType } from 'api/admin/api';

export interface SetupTankValues {
  tankLevelMode: SupportedUOMType | ''; // TODO: What should this type actually be?
  tankType: ''; // TODO: What should this type actually be?
  tankProfile: ''; // TODO: What should this type actually be?
  productId: string;
  displayUnits: ''; // TODO: What should this type actually be?
  maxProductHeight: number | '';
  specifyMinAndMaxDeliveryAmounts: boolean;
  minDeliveryAmounts: number | '';
  maxDeliveryAmounts: number | '';
  forecastMode: ForecastMode | '';
  usageRate: number | '';
  showHighLowForecast: boolean;
  showScheduledDeliveriesInForecast: boolean;
  rtuFrontPanelDisplay: ''; // TODO: What should this type actually be?
}
