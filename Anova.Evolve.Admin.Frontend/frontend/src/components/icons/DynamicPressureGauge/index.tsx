/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import { ReactComponent as PressureIcon } from 'assets/icons/pressure-gauge.svg';
import { ReactComponent as PressureNeedleIcon } from 'assets/icons/pressure-needle.svg';
import clamp from 'lodash/clamp';
import round from 'lodash/round';
import React from 'react';
import styled, { css } from 'styled-components';
import { isNumber } from 'utils/format/numbers';

const sharedTextStyles = css`
  position: absolute;
  font-size: 9px;
  font-weight: 500;
  color: ${(props) => props.theme.custom.palette.dataChannelIcon};
  top: 33px;
  left: 10px;
  z-index: 3;
  min-width: 25px;
  max-width: 25px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const StyledMinText = styled.span`
  ${sharedTextStyles}
  top: 33px;
  left: 0;
`;
const StyledMaxText = styled.span`
  ${sharedTextStyles}
  top: 33px;
  left: 31px;
`;

interface PressureGaugeProps {
  value?: number | null;
  min?: number | null;
  max?: number | null;
}

const DynamicPressureGauge = ({ value, min, max }: PressureGaugeProps) => {
  const cleanedValue = isNumber(value) ? Number(value) : 0;
  const cleanedMin = isNumber(min) ? Number(min) : 0;
  const cleanedMax = isNumber(max) ? Number(max) : 0;

  // These values represent the pressure gauge needle SVG rotation amount
  const minNeedleRotation = -150;
  const maxNeedleRotation = 70;

  const valueWithinRange = cleanedValue! - cleanedMin!;
  const maxMinRange = cleanedMax - cleanedMin;

  const readingValuePercentage =
    maxMinRange === 0 ? 0 : valueWithinRange / maxMinRange;

  const clampedReadingValuePercentage = clamp(readingValuePercentage, 0, 1);

  const pressureGaugeNeedleRotationAmount =
    (maxNeedleRotation - minNeedleRotation) * clampedReadingValuePercentage;

  const finalPressureNeedleRotationAmount =
    minNeedleRotation + pressureGaugeNeedleRotationAmount;

  const roundedFinalPressureGaugeNeedleRotationAmount = round(
    finalPressureNeedleRotationAmount,
    3
  );

  return (
    <Box position="relative" width={60}>
      <PressureIcon
        style={{
          position: 'absolute',
        }}
      />
      <PressureNeedleIcon
        style={{
          transform: `rotate(${roundedFinalPressureGaugeNeedleRotationAmount}deg)`,
        }}
      />
      <StyledMinText title={String(min)}>{min}</StyledMinText>
      <StyledMaxText title={String(max)}>{max}</StyledMaxText>
    </Box>
  );
};

export default DynamicPressureGauge;
