import Box from '@material-ui/core/Box';
import React from 'react';
import styled from 'styled-components';
import { isNumber } from 'utils/format/numbers';

const StyledLine = styled.div`
  height: 2px;
  background-color: ${(props) => props.theme.custom.palette.dataChannelIcon};
`;
const StyledText = styled.div`
  font-size: 10px;
  font-weight: bold;
  color: ${(props) => props.theme.custom.palette.dataChannelIcon};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

interface Props {
  value?: string | number | null;
}

const DynamicDigitalCounter = ({ value }: Props) => {
  const hasValidValue = value || isNumber(value);
  const displayValue = hasValidValue ? String(value).padStart(9, '0') : '-';
  const minWidth = hasValidValue ? undefined : 60;

  return (
    <Box
      display="inline-block"
      minWidth={minWidth}
      maxWidth={64}
      style={{ verticalAlign: 'middle' }}
    >
      <StyledLine />
      <StyledText title={displayValue}>{displayValue}</StyledText>
      <StyledLine />
    </Box>
  );
};

export default DynamicDigitalCounter;
