import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from 'components/Button';
import { StyledPageHeader } from 'components/layout/CenteredContentWithLogo/styles';
import Link from 'components/Link';
import React from 'react';
import { useTranslation } from 'react-i18next';
import routes from 'routes-config';

const EmailSentContent = () => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={4} justify="center">
      <Grid item xs={12}>
        <StyledPageHeader dense align="center">
          {t('ui.resetPassword.checkYourEmail', 'Check your email')}
        </StyledPageHeader>
      </Grid>
      <Grid item xs={12}>
        <Typography color="textSecondary" align="center">
          {t(
            'ui.resetPassword.checkYourEmailDescription',
            'If we found a matching account, you will receive an email with the password reset link.'
          )}
        </Typography>
      </Grid>
      <Grid item xs={12} md={5}>
        <Button
          variant="contained"
          type="submit"
          fullWidth
          component={Link}
          to={routes.login}
          // Prevent the user from landing back on this back if they use
          // the browser back button
          replace
        >
          {t('ui.resetPassword.backToLogin', 'Back to Login')}
        </Button>
      </Grid>
    </Grid>
  );
};

export default EmailSentContent;
