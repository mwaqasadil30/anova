import { TFunction } from 'i18next';
import { formatApiErrors } from 'utils/format/errors';
// import { fieldIsRequired } from 'utils/forms/errors';
import * as Yup from 'yup';
// import { GetTankSetupResponse } from '../hooks/useGetTankSetup';
import { SaveTankSetupRequest } from '../hooks/useSaveTankSetup';
import { SetupTankValues } from './types';

// t: TFunction,
// translationTexts: Record<string, string>
export const buildValidationSchema = () => {
  return Yup.object().shape({
    // userId: Yup.string()
    //   .required(fieldIsRequired(t, translationTexts.usernameText))
    //   .typeError(fieldIsRequired(t, translationTexts.usernameText)),
  });
};

// TODO: Not sure if we pass in the data channel from the Asset Detail API
// response, or if this drawer involves a separate API call
// tankSetup?: GetTankSetupResponse | null
// data: DataChannelDTO | null
export const formatInitialValues = (): SetupTankValues => {
  return {
    tankLevelMode: '', // TODO: What should this type actually be?
    tankType: '', // TODO: What should this type actually be?
    tankProfile: '', // TODO: What should this type actually be?
    productId: '',
    displayUnits: '', // TODO: What should this type actually be?
    maxProductHeight: '',
    specifyMinAndMaxDeliveryAmounts: false,
    minDeliveryAmounts: '',
    maxDeliveryAmounts: '',
    forecastMode: '', // TODO: What should this type actually be?
    usageRate: '',
    showHighLowForecast: false,
    showScheduledDeliveriesInForecast: false,
    rtuFrontPanelDisplay: '', // TODO: What should this type actually be?
  };
};

// values: SetupTankValues;
export const formatValuesForApi = (): SaveTankSetupRequest => {
  return {
    tankLevelMode: '', // TODO: What should this type actually be?
    tankType: '', // TODO: What should this type actually be?
    tankProfile: '', // TODO: What should this type actually be?
    productId: '',
    displayUnits: '', // TODO: What should this type actually be?
    maxProductHeight: '',
    specifyMinAndMaxDeliveryAmounts: false,
    minDeliveryAmounts: '',
    maxDeliveryAmounts: '',
    forecastMode: '', // TODO: What should this type actually be?
    usageRate: '',
    showHighLowForecast: false,
    showScheduledDeliveriesInForecast: false,
    rtuFrontPanelDisplay: '', // TODO: What should this type actually be?
  };
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
