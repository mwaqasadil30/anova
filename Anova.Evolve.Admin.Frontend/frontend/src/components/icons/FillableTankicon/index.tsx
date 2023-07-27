import Box from '@material-ui/core/Box';
import { ReactComponent as FillableTankIcon } from 'assets/icons/fillable-tank.svg';
import clamp from 'lodash/clamp';
import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';

const StyledFillableTankIcon = styled(({ percentFull, ...props }) => (
  <FillableTankIcon {...props} />
))`
  .empty-tank-portion {
    height: ${(props) => 36 * clamp(1 - props.percentFull / 100, 0, 1)}px;
  }
`;

interface Props {
  percentFull: number;
}

const FillableTank = ({ percentFull }: Props) => {
  const themeContext = useContext(ThemeContext);
  const { domainColor } = themeContext.custom;

  const clampedPercentFull = clamp(percentFull, 0, 100);

  return (
    <Box>
      <StyledFillableTankIcon
        color={domainColor}
        percentFull={percentFull}
        aria-label="Fillable tank icon"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clampedPercentFull}
      />
    </Box>
  );
};

export default FillableTank;
