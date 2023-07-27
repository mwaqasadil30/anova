import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip';
import React from 'react';
import styled from 'styled-components';

const StyledTooltip = styled((props) => (
  <Tooltip arrow classes={{ popper: props.className }} {...props} />
))`
  & .MuiTooltip-tooltip {
    background-color: ${(props) => props.theme.palette.background.paper};
    color: ${(props) => props.theme.palette.text.secondary};
    font-size: 14px;
    font-weight: 400;
    padding: 8px 16px;
    box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.25);
  }
  & .MuiTooltip-arrow {
    color: ${(props) => props.theme.palette.background.paper};
  }
  & .MuiTooltip-tooltipPlacementBottom {
    margin: 4px 0;
  }
`;

interface CustomTooltipProps extends TooltipProps {
  title: string;
}

const CustomTooltip = ({ title, children, ...props }: CustomTooltipProps) => {
  return (
    <StyledTooltip title={title} {...props}>
      <div>{children}</div>
    </StyledTooltip>
  );
};

export default CustomTooltip;
