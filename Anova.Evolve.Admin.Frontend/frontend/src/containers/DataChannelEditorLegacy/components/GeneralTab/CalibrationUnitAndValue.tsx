import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import styled from 'styled-components';
import { defaultTextColor, valueDividerColor } from 'styles/colours';

const Description = styled(Typography)`
  font-size: 14px;
  color: ${defaultTextColor};
`;

const Value = styled(Typography)`
  font-size: 15px;
  font-weight: 500;
  color: ${defaultTextColor};
`;

interface Props {
  description: React.ReactNode;
  value?: React.ReactNode;
}

const CalibrationUnitAndValue = ({ description, value }: Props) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      borderBottom={`1px solid ${valueDividerColor}`}
    >
      <Description>{description}</Description>
      <Value>{value}</Value>
    </Box>
  );
};

export default CalibrationUnitAndValue;
