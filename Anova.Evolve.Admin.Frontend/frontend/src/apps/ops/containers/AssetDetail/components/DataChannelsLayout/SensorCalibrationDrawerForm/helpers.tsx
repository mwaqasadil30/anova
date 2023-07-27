import { DataChannelDTO, ScalingModeType } from 'api/admin/api';
import { TFunction } from 'i18next';
import { formatApiErrors } from 'utils/format/errors';
import { isNumber } from 'utils/format/numbers';
// import { fieldIsRequired } from 'utils/forms/errors';
import * as Yup from 'yup';
import { SaveSensorCalibrationRequest } from '../hooks/useSaveSensorCalibration';
import { SensorCalibrationValues } from './types';

// t: TFunction,
// translationTexts: Record<string, string>
export const buildValidationSchema = () => {
  return Yup.object().shape({
    // userId: Yup.string()
    //   .required(fieldIsRequired(t, translationTexts.usernameText))
    //   .typeError(fieldIsRequired(t, translationTexts.usernameText)),
  });
};

export const formatInitialValues = (
  // TODO: Not sure if we pass in the data channel from the Asset Detail API
  // response, or if this drawer involves a separate API call
  // sensorCalibration?: GetSensorCalibrationResponse | null
  data: DataChannelDTO | null
): SensorCalibrationValues => {
  return {
    // Basic Information
    description: data?.description || '',
    dataChannelType: isNumber(data?.dataChannelTypeId)
      ? data?.dataChannelTypeId!
      : null,
    dataChannelTemplateId: '',
    isVolumetric: data?.isVolumetric || false,
    scaledUnits: data?.scaledUnit || '', // TODO: What should this type actually be?

    // Basic Information > Advanced Settings
    scalingMode: ScalingModeType.Linear, // TODO: Replace hard-coded default
    rawUnits: '', // TODO: What should this type actually be?
    // Basic Information > Advanced Settings > Prescaling
    enablePrescaling: false,
    zeroScale: data?.uomParams?.rawUnitsAtZero || '',
    fullScale: data?.uomParams?.rawUnitsAtFullScale || '',
    // Basic Information > Advanced Settings > Filter
    enableLimits: false,
    lowLimit: '',
    highLimit: '',

    // Scaling Mode > Linear
    rawParametersSensorMin: '',
    rawParametersSensorMax: '',
    scaledParametersSensorMin: '',
    scaledParametersSensorMax: '',

    // Scaling Mode > Mapped
    // Array of up to 20 items
    mappedValues: [],
  };
};

export const formatValuesForApi = (
  values: SensorCalibrationValues
): SaveSensorCalibrationRequest => {
  return {
    // Basic Information
    dataChannelTemplateId: values.dataChannelTemplateId || '',
    isVolumetric: values.isVolumetric || false,
    scaledUnits: values.scaledUnits || null,

    // Basic Information > Advanced Settings
    scalingMode: values.scalingMode || null,
    rawUnits: values.rawUnits || null, // TODO: What should this type actually be?
    // Basic Information > Advanced Settings > Prescaling
    enablePrescaling: values.enablePrescaling || false,
    zeroScale: values.zeroScale || null,
    fullScale: values.fullScale || null,
    // Basic Information > Advanced Settings > Filter
    enableLimits: values.enableLimits || false,
    lowLimit: values.lowLimit || null,
    highLimit: values.highLimit || null,

    // Scaling Mode > Linear
    rawParametersSensorMin: values.rawParametersSensorMin || null,
    rawParametersSensorMax: values.rawParametersSensorMax || null,
    scaledParametersSensorMin: values.scaledParametersSensorMin || null,
    scaledParametersSensorMax: values.scaledParametersSensorMax || null,

    // Scaling Mode > Mapped
    // Array of up to 20 items
    mappedValues: values.mappedValues || [],
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
