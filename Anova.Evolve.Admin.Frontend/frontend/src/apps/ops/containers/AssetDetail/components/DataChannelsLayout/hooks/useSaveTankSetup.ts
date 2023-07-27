// import { ApiService } from 'api/admin/ApiService';
import { ForecastMode, SupportedUOMType } from 'api/admin/api';
import { useMutation, UseMutationOptions } from 'react-query';

export interface SaveTankSetupRequest {
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
export interface SaveTankSetupResponse {}

// request: SaveTankSetupRequest
const saveTankSetup = () => {
  return new Promise<SaveTankSetupResponse>((resolve) => {
    setTimeout(() => {
      resolve({} as SaveTankSetupResponse);
    }, 800);
  });
  // return ApiService.RosterService.roster_Save(request);
};

export const useSaveTankSetup = (
  mutationOptions?: UseMutationOptions<
    SaveTankSetupResponse,
    unknown,
    SaveTankSetupRequest,
    unknown
  >
) => {
  return useMutation(
    // TODO: Pass in request
    // (request: SaveTankSetupRequest) => saveTankSetup(request),
    () => saveTankSetup(),
    mutationOptions
  );
};
