import { useEffect } from 'react';
import { Values } from './types';

interface Props {
  values: Values;
  initialValues: Values;
  dataChannelId?: string | null;
  hasFormSubmitted: boolean;
  openEventEditorWarningDialog: () => void;
}

const DigitalSensorCalibrationFormEffect = ({
  values,
  initialValues,
  hasFormSubmitted,
  openEventEditorWarningDialog,
}: Props) => {
  // Redirect user to the event editor if any of these values have been changed
  useEffect(() => {
    if (
      hasFormSubmitted &&
      (initialValues.state0Limit !== values.state0Limit ||
        initialValues.state1Limit !== values.state1Limit ||
        initialValues.state2Limit !== values.state2Limit ||
        initialValues.state3Limit !== values.state3Limit ||
        initialValues.state0Text !== values.state0Text ||
        initialValues.state1Text !== values.state1Text ||
        initialValues.state2Text !== values.state2Text ||
        initialValues.state3Text !== values.state3Text ||
        initialValues.invertData !== values.invertData)
    ) {
      openEventEditorWarningDialog();
    }
  }, [
    hasFormSubmitted,
    values.state0Limit,
    values.state1Limit,
    values.state2Limit,
    values.state3Limit,
    values.state0Text,
    values.state1Text,
    values.state2Text,
    values.state3Text,
    values.invertData,
  ]);

  return null;
};

export default DigitalSensorCalibrationFormEffect;
