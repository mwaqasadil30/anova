import {
  CustomIntegration1DTO,
  CustomSiteIntegration1DataChannelDTO,
} from 'api/admin/api';
import { TFunction } from 'i18next';
import { formatApiErrors } from 'utils/format/errors';
import { isNumber } from 'utils/format/numbers';
import { Values } from './types';

export const formatInitialValues = (
  customIntegration?: CustomIntegration1DTO | null
): Values => {
  return {
    // shipTo has been renamed to siteNumber, but this api property will need
    // to be updated to have this property renamed (see: CustomIntegration1DTO)
    siteNumber: customIntegration?.shipTo || '',
    tankFunctionTypeId: isNumber(customIntegration?.tankFunctionTypeId)
      ? customIntegration?.tankFunctionTypeId!
      : '',
    isSendEnabled: customIntegration?.isSendEnabled || false,
    airProductsUnitTypeId: isNumber(customIntegration?.airProductsUnitTypeId)
      ? customIntegration?.airProductsUnitTypeId!
      : '',
  };
};

export const formatValuesForApi = (
  values: Values
): CustomSiteIntegration1DataChannelDTO => {
  // @ts-ignore
  return {
    // siteNumber is the renamed shipTo property
    siteNumber: values?.siteNumber || '',
    tankFunctionTypeId: isNumber(values?.tankFunctionTypeId)
      ? values?.tankFunctionTypeId!
      : '',
    isSendEnabled: values?.isSendEnabled || false,
  } as CustomSiteIntegration1DataChannelDTO;
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
