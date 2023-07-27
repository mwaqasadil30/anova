/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Alert from 'components/Alert';
import Button from 'components/Button';
import LoadingButton from 'components/buttons/LoadingButton';
import DefaultTransition from 'components/common/animations/DefaultTransition';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import PasswordField from 'components/forms/form-fields/PasswordField';
import { StyledPageHeader } from 'components/layout/CenteredContentWithLogo/styles';
import PasswordRequirementsList from 'components/PasswordRequirementsList';
import PasswordRequirementsPopper from 'components/PasswordRequirementsPopper';
import PasswordStrengthIndicatorWithApi from 'components/PasswordStrengthIndicatorWithApi';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import routes from 'routes-config';
import { EMPTY_GUID } from 'utils/api/constants';
import { validateAllPasswordRequirements } from 'utils/ui/password';
import {
  buildValidationSchema,
  initialValues,
  mapApiErrorsToFields,
} from './helpers';
import { useResetPassword } from './hooks/useResetPassword';
import { useValidateResetPasswordToken } from './hooks/useValidateResetPasswordToken';
import { Values } from './types';

const ResetPasswordWithToken = () => {
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();

  const [
    hasTokenExpiredAfterSubmission,
    setHasTokenExpiredAfterSubmission,
  ] = useState(false);

  const queryParams = queryString.parse(location.search);
  const { token } = queryParams;

  const [
    popperAnchorEl,
    setPopperAnchorEl,
  ] = React.useState<HTMLElement | null>(null);
  const [isPopperOpen, setIsPopperOpen] = React.useState(false);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setPopperAnchorEl(event.currentTarget.parentElement);
    setIsPopperOpen(true);
  };

  const handleBlur = () => {
    setPopperAnchorEl(null);
    setIsPopperOpen(false);
  };

  const passwordText = t('ui.changepassword.password', 'Password');
  const confirmPasswordText = t(
    'ui.changepassword.confirmpassword',
    'Confirm Password'
  );
  const validationSchema = buildValidationSchema(t, {
    password: passwordText,
    confirmPassword: confirmPasswordText,
  });

  const validateResetPasswordTokenApi = useValidateResetPasswordToken();
  const resetPasswordApi = useResetPassword({
    onSuccess: (wasSuccessful) => {
      if (wasSuccessful) {
        history.replace(routes.resetPassword.changeSuccess);
      } else {
        // If the API response returns `false` then the token has most likely
        // expired
        setHasTokenExpiredAfterSubmission(true);
      }
    },
  });

  const handleFormSubmit = (
    values: Values,
    formikBag: FormikHelpers<Values>
  ) => {
    return resetPasswordApi
      .mutateAsync({ token: token as string, newPassword: values.newPassword })
      .catch((error) => {
        if (error) {
          const formattedErrors = mapApiErrorsToFields(t, error);

          formikBag.setErrors(formattedErrors as any);
          formikBag.setStatus({ errors: formattedErrors });
        }
      });
  };

  useEffect(() => {
    // If we dont have a valid token, then pass the empty GUID so we can still
    // handle errors consistently on the front-end
    const formattedToken =
      token && typeof token === 'string' ? token : EMPTY_GUID;

    validateResetPasswordTokenApi.mutateAsync(formattedToken).catch(() => {});
  }, [token]);

  const hasTokenExpired =
    validateResetPasswordTokenApi.data === false ||
    hasTokenExpiredAfterSubmission;

  return (
    <Box
      width={500}
      maxWidth="100%"
      minHeight={300}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      flexWrap="nowrap"
    >
      <Box
        width="100%"
        // Set a min height to prevent weird janking only when loading
        minHeight={validateResetPasswordTokenApi.isLoading ? 200 : 'initial'}
      >
        <TransitionLoadingSpinner
          in={validateResetPasswordTokenApi.isLoading}
        />
      </Box>

      <DefaultTransition
        in={
          !validateResetPasswordTokenApi.isLoading &&
          (validateResetPasswordTokenApi.isError || hasTokenExpired)
        }
        unmountOnExit
      >
        <div>
          {!validateResetPasswordTokenApi.isLoading &&
            (validateResetPasswordTokenApi.isError || hasTokenExpired) && (
              <Grid container spacing={4} justify="center">
                <Grid item xs={12}>
                  <StyledPageHeader dense align="center">
                    {t(
                      'ui.resetPassword.invalidTokenHeader',
                      'Unable to reset password'
                    )}
                  </StyledPageHeader>
                </Grid>
                <Grid item xs={12}>
                  {hasTokenExpired ? (
                    <Typography color="textSecondary" align="center">
                      {t(
                        'ui.resetPassword.invalidTokenDescription',
                        'You have exceeded the time limit for the password reset process.'
                      )}
                    </Typography>
                  ) : (
                    validateResetPasswordTokenApi.isError && (
                      <Typography color="error" align="center">
                        {t(
                          'ui.common.defaultError',
                          'An unexpected error occurred'
                        )}
                      </Typography>
                    )
                  )}
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
            )}
        </div>
      </DefaultTransition>

      <DefaultTransition
        in={
          !validateResetPasswordTokenApi.isLoading &&
          validateResetPasswordTokenApi.isSuccess &&
          !hasTokenExpired
        }
        unmountOnExit
      >
        <div>
          {!validateResetPasswordTokenApi.isLoading &&
            validateResetPasswordTokenApi.isSuccess &&
            !hasTokenExpired && (
              <Formik<Values>
                initialValues={initialValues}
                validationSchema={validationSchema}
                validate={(values) => {
                  const errors: any = {};

                  const passwordValidationRequirements = validateAllPasswordRequirements(
                    values.newPassword
                  );
                  const invalidRequirements = Object.values(
                    passwordValidationRequirements
                  ).filter((isValid) => !isValid);
                  const isPasswordInvalid = invalidRequirements.length > 0;

                  if (isPasswordInvalid) {
                    errors.newPassword = t(
                      'ui.resetPassword.invalidPassword',
                      'Invalid password'
                    );
                  }

                  return errors;
                }}
                onSubmit={handleFormSubmit}
              >
                {({ values, handleSubmit }) => {
                  return (
                    <Form onSubmit={handleSubmit}>
                      <Grid container spacing={3} justify="center">
                        <Grid item xs={12}>
                          <StyledPageHeader dense align="center">
                            {t(
                              'ui.resetPassword.enterNewPassword',
                              'Enter new password'
                            )}
                          </StyledPageHeader>
                        </Grid>

                        {resetPasswordApi.isError && (
                          <Grid item xs={12}>
                            <Alert severity="error">
                              {t(
                                'ui.common.defaultError',
                                'An unexpected error occurred'
                              )}
                            </Alert>
                          </Grid>
                        )}
                        <Grid item xs={12}>
                          <PasswordStrengthIndicatorWithApi
                            password={values.newPassword}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            component={PasswordField}
                            required
                            id="newPassword-input"
                            name="newPassword"
                            placeholder={t(
                              'ui.changepassword.password.placeholder',
                              'Enter new password'
                            )}
                            fullWidth
                            disabled={resetPasswordApi.isLoading}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                          />
                          <PasswordRequirementsPopper
                            open={isPopperOpen}
                            anchorEl={popperAnchorEl}
                            placement="bottom"
                            disablePortal={false}
                            style={{
                              width: popperAnchorEl?.offsetWidth,
                            }}
                          >
                            <PasswordRequirementsList
                              password={values.newPassword}
                            />
                          </PasswordRequirementsPopper>
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            component={PasswordField}
                            required
                            id="confirmNewPassword-input"
                            name="confirmNewPassword"
                            placeholder={t(
                              'ui.changepassword.confirmpassword.placeholder',
                              'Re-enter new password'
                            )}
                            fullWidth
                            disabled={resetPasswordApi.isLoading}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Grid
                            container
                            spacing={3}
                            alignItems="center"
                            justify="center"
                          >
                            <Grid item xs={12} md={5}>
                              <LoadingButton
                                type="submit"
                                fullWidth
                                isLoading={resetPasswordApi.isLoading}
                              >
                                {t(
                                  'ui.resetPassword.savePassword',
                                  'Save Password'
                                )}
                              </LoadingButton>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Form>
                  );
                }}
              </Formik>
            )}
        </div>
      </DefaultTransition>
    </Box>
  );
};

export default ResetPasswordWithToken;
