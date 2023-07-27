/* eslint-disable indent */
import { ReactComponent as OneSignalStrength } from 'assets/icons/1-bar-signal-strength.svg';
import { ReactComponent as TwoSignalStrength } from 'assets/icons/2-bar-signal-strength.svg';
import { ReactComponent as ThreeSignalStrength } from 'assets/icons/3-bar-signal-strength.svg';
import { ReactComponent as FourSignalStrength } from 'assets/icons/4-bar-signal-strength.svg';
import { ReactComponent as FullSignalStrength } from 'assets/icons/5-bar-full-signal-strength.svg';
import { ReactComponent as EmptySignalStrength } from 'assets/icons/empty-signal-strength.svg';
import clamp from 'lodash/clamp';
import React from 'react';
import { isNumber } from 'utils/format/numbers';

interface SignalStrengthProps {
  value?: number | null;
  min?: number | null;
  max?: number | null;
}

const DynamicSignalStrengthIcon = ({
  value,
  min,
  max,
}: SignalStrengthProps) => {
  const cleanedValue = isNumber(value) ? Number(value) : 0;
  const cleanedMin = isNumber(min) ? Number(min) : 0;
  const cleanedMax = isNumber(max) ? Number(max) : 0;

  const valueWithinRange = cleanedValue! - cleanedMin!;
  const maxMinRange = cleanedMax - cleanedMin;

  const readingValuePercentage =
    maxMinRange === 0 ? 0 : valueWithinRange / maxMinRange;

  const clampedReadingValuePercentage = clamp(
    readingValuePercentage * 100,
    0,
    100
  );

  if (clampedReadingValuePercentage <= 0) {
    return <EmptySignalStrength />;
  }

  if (clampedReadingValuePercentage <= 20) {
    return <OneSignalStrength />;
  }
  if (clampedReadingValuePercentage <= 40) {
    return <TwoSignalStrength />;
  }
  if (clampedReadingValuePercentage <= 60) {
    return <ThreeSignalStrength />;
  }
  if (clampedReadingValuePercentage <= 80) {
    return <FourSignalStrength />;
  }

  return <FullSignalStrength />;
};

export default DynamicSignalStrengthIcon;
