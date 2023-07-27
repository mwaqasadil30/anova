import React from 'react';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';

const GridItemWithBorder = styled(
  ({ useLeftBorder, useRightBorder, ...props }) => <Grid {...props} />
)`
  && {
    padding: 0 24px 12px 24px;
    margin-bottom: 12px;
  }
  /* prettier-ignore */
  ${(props) => props.theme.breakpoints.up('sm')} {
    && {
      border-left: 1px solid
        ${(props) =>
    props.useLeftBorder
      ? props.theme.palette.background.default
      : 'transparent'};
      border-right: 1px solid
        ${(props) =>
    props.useRightBorder
      ? props.theme.palette.background.default
      : 'transparent'};
      padding-left: ${(props) => (props.useLeftBorder ? '24px' : '12px')};
    }
  }
`;

export default GridItemWithBorder;
