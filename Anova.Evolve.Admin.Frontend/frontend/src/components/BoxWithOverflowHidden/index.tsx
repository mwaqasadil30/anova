import React from 'react';
import Box, { BoxProps } from '@material-ui/core/Box';

const BoxWithOverflowHidden = (props: BoxProps) => {
  return (
    <Box
      // The overflow="hidden" prevents making the whole page scrollable (only
      // the table). However, it prevents the box-shadow from showing up
      // which is why we have negative spacing to ensure the box shadow is
      // shown.
      overflow="hidden"
      height="100%"
      px={1}
      mx={-1}
      {...props}
    />
  );
};

export default BoxWithOverflowHidden;
