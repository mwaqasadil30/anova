import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import styled from 'styled-components';

const StyledFilterTypeTitle = styled(Typography)`
  font-weight: bold;
  color: ${(props) => props.theme.palette.text.primary};
`;

const StyledFilterTextDetails = styled(Typography)`
  color: ${(props) => props.theme.palette.text.secondary};
`;

interface Props {
  filterType: string;
  filterText: string;
}

const FormattedTooltipText = ({ filterType, filterText }: Props) => {
  return (
    <Grid container>
      <Grid item xs="auto">
        <StyledFilterTypeTitle>{filterType}:&nbsp;</StyledFilterTypeTitle>
      </Grid>
      <Grid item xs>
        <StyledFilterTextDetails>{filterText}</StyledFilterTextDetails>
      </Grid>
    </Grid>
  );
};

export default FormattedTooltipText;
