import React from 'react';
import Box, { BoxProps } from '@material-ui/core/Box';

const MessageBlock = (props: BoxProps) => {
  return (
    <Box
      display="flex"
      height="150px"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      flexDirection="column"
      {...props}
    />
  );
};

export default MessageBlock;
