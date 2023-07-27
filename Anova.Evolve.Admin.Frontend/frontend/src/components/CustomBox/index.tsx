import React from 'react';
import Box, { BoxProps } from '@material-ui/core/Box';
import { boxBorderColor, boxBackgroundGrey, white } from 'styles/colours';

interface CustomBoxProps extends BoxProps {
  grayBackground?: boolean;
}

const CustomBox = (props: CustomBoxProps) => {
  const { grayBackground, ...rest } = props;
  return (
    <Box
      bgcolor={grayBackground ? boxBackgroundGrey : white}
      border={`1px solid ${boxBorderColor}`}
      {...rest}
    />
  );
};

export default CustomBox;
