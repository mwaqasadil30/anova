import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { PaddedBox, StyledEmptyText, StyledEntityInfoIcon } from '../constants';

interface Props {
  children: React.ReactNode;
}

const EmptyContent = ({ children }: Props) => {
  return (
    <PaddedBox>
      <Grid container spacing={3} alignItems="center">
        <Grid item>
          <Box textAlign="center" ml={1}>
            <StyledEntityInfoIcon />
          </Box>
        </Grid>
        <Grid item>
          <StyledEmptyText>{children}</StyledEmptyText>
        </Grid>
      </Grid>
    </PaddedBox>
  );
};

export default EmptyContent;
