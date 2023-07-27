/* eslint-disable indent */
import { ReactComponent as ThreeDigitalStateAtZero } from 'assets/icons/3-digital-input-on-0.svg';
import { ReactComponent as ThreeDigitalStateAtOne } from 'assets/icons/3-digital-input-on-1.svg';
import { ReactComponent as ThreeDigitalStateAtTwo } from 'assets/icons/3-digital-input-on-2.svg';
import { ReactComponent as FourDigitalStateAtZero } from 'assets/icons/4-digital-input-on-0.svg';
import { ReactComponent as FourDigitalStateAtOne } from 'assets/icons/4-digital-input-on-1.svg';
import { ReactComponent as FourDigitalStateAtTwo } from 'assets/icons/4-digital-input-on-2.svg';
import { ReactComponent as FourDigitalStateAtThree } from 'assets/icons/4-digital-input-on-3.svg';
import { ReactComponent as DigitalOffIcon } from 'assets/icons/digital-input-off-dc.svg';
import { ReactComponent as DigitalOnIcon } from 'assets/icons/digital-input-on-dc.svg';
import { ReactComponent as OtherAnalogIcon } from 'assets/icons/other-analog.svg';
import round from 'lodash/round';
import React from 'react';
import { isNumber } from 'utils/format/numbers';

const renderOnOffSwitch = (value: number) => {
  return value <= 0 ? <DigitalOffIcon /> : <DigitalOnIcon />;
};

const renderThreeStateInput = (value: number) => {
  if (value <= 0) {
    return <ThreeDigitalStateAtZero />;
  }

  if (value <= 1) {
    return <ThreeDigitalStateAtOne />;
  }

  return <ThreeDigitalStateAtTwo />;
};

const renderFourStateInput = (value: number) => {
  if (value <= 0) {
    return <FourDigitalStateAtZero />;
  }

  if (value <= 1) {
    return <FourDigitalStateAtOne />;
  }

  if (value <= 2) {
    return <FourDigitalStateAtTwo />;
  }

  return <FourDigitalStateAtThree />;
};

interface DigitalInputProps {
  value?: number | null;
  stateOneText?: string | null;
  stateTwoText?: string | null;
  stateThreeText?: string | null;
}

const DigitalInputIcon = ({
  value,
  stateOneText,
  stateTwoText,
  stateThreeText,
}: DigitalInputProps) => {
  if (!isNumber(value)) {
    return <OtherAnalogIcon />;
  }

  const cleanedValue = round(Number(value));

  const isOnOffSwitch = stateOneText && !stateTwoText;
  const hasThreeStates = stateTwoText && !stateThreeText;
  const hasFourStates = stateThreeText;

  if (isOnOffSwitch) {
    return renderOnOffSwitch(cleanedValue);
  }

  if (hasThreeStates) {
    return renderThreeStateInput(cleanedValue);
  }

  if (hasFourStates) {
    return renderFourStateInput(cleanedValue);
  }

  return <OtherAnalogIcon />;
};

export default DigitalInputIcon;
