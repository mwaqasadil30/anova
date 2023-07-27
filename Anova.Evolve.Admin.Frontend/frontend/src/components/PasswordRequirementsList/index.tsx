import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  buildPasswordRequirementsLabels,
  validateAllPasswordRequirements,
} from 'utils/ui/password';
import PasswordRequirement from './PasswordRequirement';

const StyledPaper = styled(Paper)`
  background: ${(props) =>
    props.theme.palette.type === 'dark'
      ? '#575757'
      : props.theme.palette.background.paper};
  border-radius: 6px;
  padding: ${(props) => props.theme.spacing(3)}px;
`;

const BoldedText = styled(Typography)`
  font-weight: 600;
  font-size: 17px;
  color: ${(props) => props.theme.palette.text.secondary};
  margin-bottom: 8px;
`;

interface Props {
  password: string;
}

const PasswordRequirementsList = ({ password }: Props) => {
  const { t } = useTranslation();

  const passwordValidationRequirements = validateAllPasswordRequirements(
    password
  );
  const requirements = buildPasswordRequirementsLabels(
    t,
    passwordValidationRequirements
  );

  return (
    <StyledPaper>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12}>
          <BoldedText>
            {t(
              'ui.changepassword.yourPasswordMustContain',
              'Your password must contain'
            )}
          </BoldedText>
        </Grid>
        {requirements.map((requirement, index) => {
          return (
            <Grid item xs={12} key={index}>
              <PasswordRequirement requirement={requirement} />
            </Grid>
          );
        })}
      </Grid>
    </StyledPaper>
  );
};

export default PasswordRequirementsList;
