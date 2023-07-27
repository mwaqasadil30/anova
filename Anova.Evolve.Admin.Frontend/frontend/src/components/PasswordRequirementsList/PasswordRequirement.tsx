import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ReactComponent as CircleCheckboxEmpty } from 'assets/icons/circle-checkbox-empty.svg';
import { ReactComponent as CircleCheckboxFilled } from 'assets/icons/circle-checkbox-filled.svg';
import React from 'react';
import styled from 'styled-components';
import { PasswordRequirementItem } from 'utils/ui/password';

const StyledCircleCheckboxEmpty = styled(CircleCheckboxEmpty)`
  color: ${(props) =>
    props.theme.palette.type === 'dark' ? '#414141' : '#e2e2e2'};
`;

const StyledCircleCheckboxFilled = styled(CircleCheckboxFilled)`
  color: #333333;
`;

const StyledLabel = styled(Typography)`
  color: ${(props) => props.theme.palette.text.secondary};
`;

interface Props {
  requirement: PasswordRequirementItem;
}

const PasswordRequirement = ({ requirement }: Props) => {
  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item>
        {requirement.isValid ? (
          <StyledCircleCheckboxFilled />
        ) : (
          <StyledCircleCheckboxEmpty />
        )}
      </Grid>
      <Grid item>
        <StyledLabel>{requirement.label}</StyledLabel>
      </Grid>
    </Grid>
  );
};

export default PasswordRequirement;
