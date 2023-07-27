/* eslint-disable indent */
import React from 'react';
import Box, { BoxProps } from '@material-ui/core/Box';
import styled from 'styled-components';

interface Props extends BoxProps {
  darken?: boolean;
  preventClicking?: boolean;
  darkOpacity?: number;
}

const DarkFadeOverlay = styled(
  ({ darken, preventClicking, darkOpacity, ...rest }: Props) => (
    <Box {...rest} />
  )
)`
  position: relative;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: ${(props) =>
      props.darken
        ? props.darkOpacity
          ? `rgba(0,0,0, ${props.darkOpacity})`
          : 'rgba(0,0,0,.1)'
        : 'rgba(0,0,0,0)'};
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background 0.2s ease;
    pointer-events: ${(props) =>
      props.darken && props.preventClicking ? 'auto' : 'none'};
    border-radius: ${(props) => props.theme.shape.borderRadius}px;
  }
`;

export const StyledDarkFadeOverlay = styled(DarkFadeOverlay)`
  position: absolute;
  pointer-events: none;
  z-index: 1;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export default DarkFadeOverlay;
