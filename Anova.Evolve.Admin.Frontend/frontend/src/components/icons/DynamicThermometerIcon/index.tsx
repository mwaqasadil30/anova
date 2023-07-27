import React from 'react';
import Box from '@material-ui/core/Box';
import clamp from 'lodash/clamp';
import styled, { css } from 'styled-components';
import { ReactComponent as ThermometerIcon } from 'assets/icons/thermometer.svg';
import { isNumber } from 'utils/format/numbers';

// This is the styled component that makes the SVG/icon dynamic
const StyledThermometerIcon = styled(({ fillHeight, ...props }) => (
  <ThermometerIcon {...props} />
))`
  rect:last-child {
    height: ${(props) => props.fillHeight}px;
  }
`;

const sharedTextCss = css`
  font-size: 10px;
  font-weight: 500;
  color: ${(props) => props.theme.custom.palette.dataChannelIcon};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 30px;
`;

const StyledMinText = styled.span`
  ${sharedTextCss}
  position: absolute;
  top: 31px;
`;
const StyledMaxText = styled.span`
  ${sharedTextCss}
  position: absolute;
`;

interface Props {
  min?: number | null;
  max?: number | null;
  value?: number | null;
}

const DynamicThermometerIcon = ({ min, max, value }: Props) => {
  let percentFullFraction = 0;
  if (isNumber(value) && isNumber(min) && isNumber(max)) {
    const valueWithinRange = value! - min!;
    const minMaxRange = max! - min!;
    percentFullFraction =
      minMaxRange !== 0 ? valueWithinRange / minMaxRange : 0;
  }

  const clampedPercentFull = clamp(percentFullFraction, 0, 1);
  // 40 is the max height for the thermometer where it nearly touches the top.
  const clampedFillHeight = 40 * clampedPercentFull;
  return (
    <Box position="relative">
      <StyledThermometerIcon fillHeight={clampedFillHeight} />
      {isNumber(min) && (
        <StyledMinText title={String(min)}>{min}</StyledMinText>
      )}
      {isNumber(max) && (
        <StyledMaxText title={String(max)}>{max}</StyledMaxText>
      )}
    </Box>
  );
};

export default DynamicThermometerIcon;
