/* eslint-disable indent */
import React from 'react';
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip';
import styled from 'styled-components';
import { getCustomDomainContrastText } from 'styles/colours';

// Used an example from Material UI 5 docs, since 4 doesnt use styled components
// https://mui.com/components/tooltips/#CustomizedTooltips.tsx
const ThemedTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))`
  & .MuiTooltip-tooltip {
    background: ${(props) => props.theme.custom.domainColor};
    color: ${(props) =>
      getCustomDomainContrastText(props.theme.custom.domainColor)};
    border-radius: 16px;
    font-size: 14px;
    font-weight: 500;
    padding: 6px 16px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
  }
`;

export default ThemedTooltip;
