import Box, { BoxProps } from '@material-ui/core/Box';
import React from 'react';
import styled from 'styled-components';

const StyledBox = styled(Box)`
  box-shadow: ${(props) =>
    // Only apply a box shadow in light theme
    props.theme.palette.type === 'light'
      ? '0px 3px 10px rgba(159, 178, 189, 0.2)'
      : 'none'};
`;

const CustomBoxRedesign = (props: BoxProps) => {
  return (
    <StyledBox
      borderRadius="borderRadius" // From the theme's shape.borderRadius
      bgcolor="background.paper"
      {...props}
    />
  );
};

export default CustomBoxRedesign;
