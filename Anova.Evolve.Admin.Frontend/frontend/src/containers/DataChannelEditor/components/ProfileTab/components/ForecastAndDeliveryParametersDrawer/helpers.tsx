import {
  DataChannelForecastDeliveryInfoDTO,
  DataChannelReportDTO,
  DataChannelSaveForecastDeliveryInfoDTO,
  UnitConversionModeEnum,
} from 'api/admin/api';
import { TFunction } from 'i18next';
import { formatApiErrors } from 'utils/format/errors';
import { isNumber } from 'utils/format/numbers';
import { Values } from './types';

export const formatInitialValues = (
  forecastAndDeliveryInfo?: DataChannelForecastDeliveryInfoDTO | null
): Values => {
  return {
    forecastModeTypeId: isNumber(forecastAndDeliveryInfo?.forecastModeTypeId)
      ? forecastAndDeliveryInfo?.forecastModeTypeId!
      : '',
    showHighLowForecast: forecastAndDeliveryInfo?.showHighLowForecast || false,
    reforecastWhenDeliveryScheduled:
      forecastAndDeliveryInfo?.reforecastWhenDeliveryScheduled || false,
    manualUsageRate: isNumber(forecastAndDeliveryInfo?.manualUsageRate)
      ? forecastAndDeliveryInfo?.manualUsageRate!
      : '',
  };
};

export const formatValuesForApi = (
  values: Values,
  dataChannelDetails?: DataChannelReportDTO | null
) => {
  const isBasicTank =
    dataChannelDetails?.tankSetupInfo?.unitConversionModeId ===
    UnitConversionModeEnum.Basic;
  const isSimplifiedVolumetricTank =
    dataChannelDetails?.tankSetupInfo?.unitConversionModeId ===
    UnitConversionModeEnum.SimplifiedVolumetric;
  const isVolumetricTank =
    dataChannelDetails?.tankSetupInfo?.unitConversionModeId ===
    UnitConversionModeEnum.Volumetric;

  const getUnitsIdByTankTypeForApi = () => {
    if (isSimplifiedVolumetricTank) {
      return isNumber(
        dataChannelDetails?.tankSetupInfo?.simplifiedTankSetupInfo
          ?.displayUnitsId
      )
        ? dataChannelDetails?.tankSetupInfo?.simplifiedTankSetupInfo
            ?.displayUnitsId
        : '';
    }

    if (isVolumetricTank) {
      return isNumber(
        dataChannelDetails?.tankSetupInfo?.volumetricTankSetupInfo
          ?.displayUnitsId
      )
        ? dataChannelDetails?.tankSetupInfo?.volumetricTankSetupInfo
            ?.displayUnitsId
        : '';
    }

    return null;
  };

  const unitsIdForApi = getUnitsIdByTankTypeForApi();

  // @ts-ignore
  return {
    forecastModeTypeId: isNumber(values.forecastModeTypeId)
      ? values.forecastModeTypeId
      : null,
    showHighLowForecast: values.showHighLowForecast || false,
    reforecastWhenDeliveryScheduled:
      values.reforecastWhenDeliveryScheduled || false,
    manualUsageRate: isNumber(values.manualUsageRate)
      ? values.manualUsageRate
      : null,
    // Only send unitsId when the tank type is NOT Basic
    unitsId: !isBasicTank ? unitsIdForApi : null,
  } as DataChannelSaveForecastDeliveryInfoDTO;
};

export const mapApiErrorsToFields = (t: TFunction, errors: any) => {
  if (!errors) {
    return null;
  }

  if (Array.isArray(errors)) {
    return formatApiErrors(t, errors);
  }

  return errors;
};
