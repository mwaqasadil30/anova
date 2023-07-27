import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { ReactComponent as InfoIcon } from 'assets/icons/info.svg';
import { gray900 } from 'styles/colours';

const StyledGrid = styled(Grid)`
  height: 150px;
  width: 100%;
  && {
    margin-left: 50px;
  }
`;

const StyledTypography = styled(Typography)`
  && {
    font-weight: 500;
    color: ${gray900};
  }
`;

interface Props {
  children: React.ReactNode;
}

const EmptyDataChannels = ({ children }: Props) => {
  return (
    <StyledGrid container spacing={3} alignItems="center">
      <Grid item>
        <InfoIcon />
      </Grid>
      <Grid item>
        <StyledTypography variant="h6">{children}</StyledTypography>
      </Grid>
    </StyledGrid>
  );
};

export default EmptyDataChannels;
