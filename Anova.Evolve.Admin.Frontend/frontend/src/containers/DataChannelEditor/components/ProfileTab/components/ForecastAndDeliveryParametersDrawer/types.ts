import { ForecastMode, UnitTypeEnum } from 'api/admin/api';

export interface Values {
  forecastModeTypeId: ForecastMode | ''; // TODO: api needs to update this type as enum
  showHighLowForecast: boolean;
  reforecastWhenDeliveryScheduled: boolean;
  manualUsageRate: number | '';
  unitsId?: UnitTypeEnum | '';
}
