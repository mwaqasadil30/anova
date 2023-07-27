import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ReactComponent as EntityInfoIcon } from 'assets/icons/entity-info.svg';
import styled from 'styled-components';
import React from 'react';

const PaddedBox = styled(Box)`
  padding: 5px 15px 5px 0;
`;

const StyledEmptyText = styled(Typography)`
  font-size: 15px;
  font-weight: 500;
  color: ${(props) => props.theme.palette.text.secondary};
`;

const StyledEntityInfoIcon = styled(EntityInfoIcon)`
  vertical-align: middle;
`;

interface Props {
  children: React.ReactNode;
}

/* 
  NOTE:
  This version is slightly different from <EmptyContentBlock />, which has a
  larger cloud icon displayed above the message text. This one has a smaller
  icon to take up less space.
*/
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
