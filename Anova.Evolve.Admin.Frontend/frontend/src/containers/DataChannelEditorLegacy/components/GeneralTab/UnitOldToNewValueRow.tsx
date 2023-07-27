import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import round from 'lodash/round';
import React from 'react';
import styled from 'styled-components';

const StyledArrowForwardIcon = styled(ArrowForwardIcon)`
  font-size: 20px;
  vertical-align: middle;
`;

const BoldedText = styled(Typography)`
  font-weight: 500;
`;

interface Props {
  label: React.ReactNode;
  oldValue: number;
  oldUnit: string;
  newValue: number;
  newUnit: string;
  decimalPlaces: number;
}

const UnitOldToNewValueRow = ({
  label,
  oldValue,
  oldUnit,
  newValue,
  newUnit,
  decimalPlaces,
}: Props) => {
  return (
    <>
      <Grid item xs={4}>
        <BoldedText>{label}</BoldedText>
      </Grid>
      <Grid item xs>
        <Typography align="right">
          {round(oldValue, decimalPlaces)} ({oldUnit})
        </Typography>
      </Grid>
      <Grid item xs={1}>
        <Box textAlign="center">
          <StyledArrowForwardIcon />
        </Box>
      </Grid>
      <Grid item xs>
        <BoldedText align="left">
          {round(newValue, decimalPlaces)} ({newUnit})
        </BoldedText>
      </Grid>
    </>
  );
};

export default UnitOldToNewValueRow;
