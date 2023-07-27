import Box, { BoxProps } from '@material-ui/core/Box';
import React from 'react';
import styled from 'styled-components';

const StyledBox = styled(Box)`
  box-shadow: ${(props) =>
    props.theme.palette.type === 'light' &&
    '0px 3px 10px rgba(159, 178, 189, 0.2)'};
`;

const EditorBox = (props: BoxProps) => {
  return (
    <StyledBox bgcolor="background.paper" borderRadius={10} p={3} {...props} />
  );
};

export default EditorBox;
