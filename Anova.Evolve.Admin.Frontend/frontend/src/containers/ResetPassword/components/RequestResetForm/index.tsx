import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import MuiLink from '@material-ui/core/Link';
import Alert from 'components/Alert';
import Button from 'components/Button';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import {
  SpacedBoxToHandleErrorHelperText,
  StyledCircularProgress,
  StyledLink,
  StyledPageHeader,
} from 'components/layout/CenteredContentWithLogo/styles';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import routes from 'routes-config';
import { buildValidationSchema } from './helpers';
import { useSendForgotPasswordEmail } from './hooks/useSendForgotPasswordEmail';
import { ForgotPasswordFormValues } from './types';

const RequestResetForm = () => {
  const history = useHistory();
  const { t } = useTranslation();

  const usernameText = t('ui.common.username', 'Username');
  const usernameFormValidationSchema = buildValidationSchema(t, {
    username: usernameText,
  });

  const sendForgotPasswordEmailApi = useSendForgotPasswordEmail();

  const initialValues: ForgotPasswordFormValues = {
    username: '',
  };

  const forgotPassword = (values: ForgotPasswordFormValues) => {
    return sendForgotPasswordEmailApi
      .mutateAsync({ userName: values.username })
      .then(() => {
        // At the moment we always redirect to the email sent page (which
        // indicates an email will be sent if a matching account was found).
        // In the future we'll need to handle 3rd party logins by checking
        // `response.isDOLV3Login`.
        history.push(routes.resetPassword.emailSent);
      })
      .catch(() => {});
  };

  return (
    <Formik<ForgotPasswordFormValues>
      initialValues={initialValues}
      validationSchema={usernameFormValidationSchema}
      onSubmit={forgotPassword}
    >
      {({ isSubmitting, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Grid container spacing={4} justify="center">
            <Grid item xs={12}>
              <StyledPageHeader dense align="center">
                {t(
                  'ui.common.password.enterYourUsername',
                  'Enter your username'
                )}
              </StyledPageHeader>
            </Grid>
            {sendForgotPasswordEmailApi.isError && (
              <Grid item xs={12}>
                <Alert severity="error">
                  {t('ui.common.defaultError', 'An unexpected error occurred')}
                </Alert>
              </Grid>
            )}
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <SpacedBoxToHandleErrorHelperText>
                    <Field
                      component={CustomTextField}
                      required
                      id="username-input"
                      name="username"
                      placeholder={t(
                        'ui.simplelogin.enterusername',
                        'Enter username'
                      )}
                      fullWidth
                      disabled={isSubmitting}
                    />
                  </SpacedBoxToHandleErrorHelperText>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={3} alignItems="center" justify="center">
                <Grid item xs={12} md={5}>
                  <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Box display="flex" alignItems="center">
                        <StyledCircularProgress size={24} />{' '}
                        {t('ui.common.loading', 'Loading...')}
                      </Box>
                    ) : (
                      t('ui.resetPassword.resetPassword', 'Reset Password')
                    )}
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Box textAlign="center">
                    <MuiLink
                      component={StyledLink}
                      to={routes.login}
                      underline="always"
                    >
                      {t('ui.resetPassword.backToLogin', 'Back to Login')}
                    </MuiLink>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default RequestResetForm;
