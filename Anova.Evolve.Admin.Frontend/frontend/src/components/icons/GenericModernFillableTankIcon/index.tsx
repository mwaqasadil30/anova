import clamp from 'lodash/clamp';
import React from 'react';
import styled from 'styled-components';
import { isNumber } from 'utils/format/numbers';
import { renderImportance } from 'utils/ui/helpers';
import {
  EventImportanceLevelType,
  EventRuleImportanceLevel,
} from 'api/admin/api';

const tankFillSliceHeightInPixels = 2;

const StyledTankOuterShell = styled(({ height, width, ...props }) => (
  <div {...props} />
))`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background: ${(props) =>
    props.theme.palette.type === 'dark' ? '#7b7b7b' : '#e1e1e1'};
  border-radius: 4px;
  display: inline-block;

  position: relative;
`;

const StyledTankFill = styled(
  ({
    percentFullRelativeToHeight,
    showTopBorderRadius,
    width,
    color,
    ...props
  }) => <div {...props} />
)`
  height: ${(props) => props.percentFullRelativeToHeight}px;
  width: ${(props) => props.width}px;
  background: ${(props) => props.color};
  border-radius: ${(props) =>
    props.showTopBorderRadius ? '2px' : '0 0 2px 2px'};

  position: absolute;
  bottom: 0;
`;

const StyledTankSlice = styled(
  ({ percentFullRelativeToHeight, width, ...props }) => <div {...props} />
)`
  height: ${tankFillSliceHeightInPixels}px;
  width: ${(props) => props.width}px;
  background: transparent;
  position: absolute;
  bottom: ${(props) => props.percentFullRelativeToHeight}px;
`;

interface Props {
  percentFull: number | null | undefined;
  color: string;
  height: number;
  width: number;
  importanceLevel?:
    | EventImportanceLevelType
    | EventRuleImportanceLevel
    | undefined
    | null;
}

const StyledImportanceLevelWrapper = styled.div`
  transform: translate(-50%, -50%);
  position: absolute;
  z-index: 2;
`;

const GenericModernFillableTankIcon = ({
  percentFull,
  color,
  height,
  width,
  importanceLevel,
}: Props) => {
  const cleanedPercentFull = isNumber(percentFull) ? Number(percentFull) : 0;
  const clampedPercentFull = clamp(cleanedPercentFull, 0, 100);

  const percentFullRelativeToHeight =
    height * clamp(clampedPercentFull / 100, 0, 1);

  const isTankAlmostFull =
    // Minus 1 (pixel) for a bit more padding
    height - tankFillSliceHeightInPixels - 1 <= percentFullRelativeToHeight;
  const isTankAlmostEmpty =
    // Minus 1 (pixel) for a bit more padding
    tankFillSliceHeightInPixels - 1 > percentFullRelativeToHeight;

  return (
    <StyledTankOuterShell
      aria-label="Fillable tank icon"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clampedPercentFull}
      width={width}
      height={height}
    >
      {isNumber(importanceLevel) && (
        <StyledImportanceLevelWrapper>
          {renderImportance(importanceLevel)}
        </StyledImportanceLevelWrapper>
      )}
      {!isTankAlmostFull && !isTankAlmostEmpty && (
        <StyledTankSlice
          percentFullRelativeToHeight={percentFullRelativeToHeight}
          width={width}
        />
      )}
      <StyledTankFill
        percentFullRelativeToHeight={percentFullRelativeToHeight}
        showTopBorderRadius={isTankAlmostFull}
        width={width}
        color={color}
      />
    </StyledTankOuterShell>
  );
};

export default GenericModernFillableTankIcon;
