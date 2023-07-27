/* eslint-disable indent */
import round from 'lodash/round';
import { isNumber } from 'utils/format/numbers';

const renderOnOffSwitch = (
  value: number,
  stateZeroText: string,
  stateOneText: string
) => {
  if (value <= 0) {
    return stateZeroText;
  }

  return stateOneText;
};

const renderThreeStateInput = (
  value: number,
  stateZeroText: string,
  stateOneText: string,
  stateTwoText: string
) => {
  if (value <= 0) {
    return stateZeroText;
  }

  if (value <= 1) {
    return stateOneText;
  }

  return stateTwoText;
};

const renderFourStateInput = (
  value: number,
  stateZeroText: string,
  stateOneText: string,
  stateTwoText: string,
  stateThreeText: string
) => {
  if (value <= 0) {
    return stateZeroText;
  }

  if (value <= 1) {
    return stateOneText;
  }

  if (value <= 2) {
    return stateTwoText;
  }

  return stateThreeText;
};

interface DisplayTextProps {
  value?: number | null;
  stateZeroText?: string | null;
  stateOneText?: string | null;
  stateTwoText?: string | null;
  stateThreeText?: string | null;
}

export const getDigitalInputDisplayText = ({
  value,
  stateZeroText,
  stateOneText,
  stateTwoText,
  stateThreeText,
}: DisplayTextProps) => {
  const cleanedValue = round(Number(value));

  if (!isNumber(value)) {
    return '';
  }

  const isOnOffSwitch = stateZeroText && stateOneText && !stateTwoText;
  const hasThreeStates =
    stateZeroText && stateOneText && stateTwoText && !stateThreeText;
  const hasFourStates =
    stateZeroText && stateOneText && stateTwoText && stateThreeText;

  const valueText = isOnOffSwitch
    ? renderOnOffSwitch(cleanedValue, stateZeroText!, stateOneText!)
    : hasThreeStates
    ? renderThreeStateInput(
        cleanedValue,
        stateZeroText!,
        stateOneText!,
        stateTwoText!
      )
    : hasFourStates
    ? renderFourStateInput(
        cleanedValue,
        stateZeroText!,
        stateOneText!,
        stateTwoText!,
        stateThreeText!
      )
    : '';

  return valueText;
};
