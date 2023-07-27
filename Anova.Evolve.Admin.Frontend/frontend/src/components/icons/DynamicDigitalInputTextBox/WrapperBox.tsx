import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import styled from 'styled-components';

const StyledBoxText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  font-weight: 600;
  color: #6c6c6c;
  text-transform: uppercase;
  white-space: normal;
  max-width: 68px;
`;

interface Props {
  text: string;
}

const WrapperBox = ({ text }: Props) => {
  return (
    <Box display="flex">
      <Box
        border="1px solid #6C6C6C"
        borderRadius="3px"
        width="68px"
        height="43px"
        textAlign="center"
        alignItems={text.length > 15 ? 'flex-start' : 'center'}
        justifyContent="center"
        display="flex"
        padding="2px"
        overflow="hidden"
        style={{ overflowWrap: 'break-word' }}
      >
        <StyledBoxText title={text}>{text}</StyledBoxText>
      </Box>
    </Box>
  );
};

export default WrapperBox;
