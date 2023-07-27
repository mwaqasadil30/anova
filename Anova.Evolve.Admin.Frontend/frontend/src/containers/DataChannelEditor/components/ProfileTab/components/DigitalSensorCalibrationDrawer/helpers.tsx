import {
  DataChannelSaveDigitalSetupInfoDTO,
  DigitalInputSensorCalibrationInfoDTO,
} from 'api/admin/api';
import { TFunction } from 'i18next';
import { formatApiErrors } from 'utils/format/errors';
import { Values } from './types';

export const formatInitialValues = (
  digitalInputSensorCalibration?: DigitalInputSensorCalibrationInfoDTO | null
): Values => {
  const state0IsConfigured =
    digitalInputSensorCalibration?.digitalStateProfiles?.[0]?.isConfigured;
  const state0Limit =
    digitalInputSensorCalibration?.digitalStateProfiles?.[0]?.value;
  const state0Text =
    digitalInputSensorCalibration?.digitalStateProfiles?.[0]?.text;

  const state1IsConfigured =
    digitalInputSensorCalibration?.digitalStateProfiles?.[1]?.isConfigured;
  const state1Limit =
    digitalInputSensorCalibration?.digitalStateProfiles?.[1]?.value;
  const state1Text =
    digitalInputSensorCalibration?.digitalStateProfiles?.[1]?.text;

  const state2IsConfigured =
    digitalInputSensorCalibration?.digitalStateProfiles?.[2]?.isConfigured;
  const state2Limit =
    digitalInputSensorCalibration?.digitalStateProfiles?.[2]?.value;
  const state2Text =
    digitalInputSensorCalibration?.digitalStateProfiles?.[2]?.text;

  const state3IsConfigured =
    digitalInputSensorCalibration?.digitalStateProfiles?.[3]?.isConfigured;
  const state3Limit =
    digitalInputSensorCalibration?.digitalStateProfiles?.[3]?.value;
  const state3Text =
    digitalInputSensorCalibration?.digitalStateProfiles?.[3]?.text;

  const digitalStateProfiles =
    digitalInputSensorCalibration?.digitalStateProfiles;

  const digitalInputStates = {
    ...(state0IsConfigured && { state0Limit, state0Text }),
    ...(state1IsConfigured && { state1Limit, state1Text }),
    ...(state2IsConfigured && { state2Limit, state2Text }),
    ...(state3IsConfigured && { state3Limit, state3Text }),
  };

  return {
    ...digitalInputStates,
    digitalStateProfiles,
    invertData: digitalInputSensorCalibration?.isRawDataInverted,
  };
};

export const formatValuesForApi = (
  values: Values
): DataChannelSaveDigitalSetupInfoDTO => {
  return {
    dataChannelId: values.dataChannelId,
    state0Limit: values.state0Limit,
    state0Text: values.state0Text,
    state1Limit: values.state1Limit,
    state1Text: values.state1Text,
    state2Limit: values.state2Limit,
    state2Text: values.state2Text,
    state3Limit: values.state3Limit,
    state3Text: values.state3Text,
    invertData: values.invertData,
  } as DataChannelSaveDigitalSetupInfoDTO;
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
