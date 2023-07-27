import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import MuiLink from '@material-ui/core/Link';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { publicClientAppConfiguration } from 'authentication/msal';
import Alert from 'components/Alert';
import Button from 'components/Button';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import PasswordField from 'components/forms/form-fields/PasswordField';
import CenteredContentWithLogo from 'components/layout/CenteredContentWithLogo';
import {
  SpacedBoxToHandleErrorHelperText,
  StyledCircularProgress,
  StyledLink,
  StyledPageHeader,
} from 'components/layout/CenteredContentWithLogo/styles';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useHistory, useLocation } from 'react-router';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import { resetApiState } from 'redux-app/modules/coreApi/actions';
import { selectLogin } from 'redux-app/modules/coreApi/selectors';
import { setUserAuthenticationMethod } from 'redux-app/modules/user/actions';
import { LoginUserRoutine } from 'redux-app/modules/user/routines';
import {
  selectIsAuthenticated,
  selectIsPasswordChangeRequired,
} from 'redux-app/modules/user/selectors';
import routes from 'routes-config';
import styled from 'styled-components';
import { ai } from 'utils/app-insights';
import MSALAuthentication from './components/MSALAuthentication';
import RememberMeFormEffect from './components/RememberMeFormEffect';
import {
  buildPasswordFormValidationSchema,
  buildUsernameFormValidationSchema,
  getErrorMessage,
  getRememberedUsername,
  passwordFormInitialValues,
  setRememberedUsername,
} from './helpers';
import { useGetUserAuthenticationMethod } from './hooks/useGetUserAuthenticationMethod';
import { StyledBackIconButton } from './styles';
import { PasswordFormValues, UsernameFormValues } from './types';

// For now the checkbox label is colored via this wrapper. The
// CheckboxWithLabel component should allow customizing the text color directly
// via a styled component
const SecondaryTextWrapper = styled.div`
  color: ${(props) => props.theme.palette.text.secondary};
`;

const StyledCheckboxWithLabel = styled(CheckboxWithLabel)`
  color: ${(props) => props.theme.palette.text.secondary};
  &[class*='Mui-checked'] {
    color: ${(props) => props.theme.palette.text.secondary};
  }
`;

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation<LocationState>();

  const initialRememberedUsername = getRememberedUsername();

  const [validatedUsername, setValidatedUsername] = useState(
    initialRememberedUsername
  );
  const [rememberMe, setRememberMe] = useState(!!initialRememberedUsername);
  const [
    isSignInAppEnvMisconfiguredError,
    setIsSignInAppEnvMisconfiguredError,
  ] = useState(false);

  const usernameText = t('ui.common.username', 'Username');
  const passwordText = t('ui.changepassword.password', 'Password');
  const usernameFormValidationSchema = buildUsernameFormValidationSchema(t, {
    username: usernameText,
  });
  const passwordFormValidationSchema = buildPasswordFormValidationSchema(t, {
    password: passwordText,
  });

  const getUserAuthenticationMethodApi = useGetUserAuthenticationMethod();

  const usernameFormInitialValues: UsernameFormValues = {
    username: validatedUsername,
    rememberMe,
  };

  const validateUsername = (values: UsernameFormValues) => {
    // Reset the login API state so login error messages (like "Invalid
    // username or password") don't show up when the user submits a different
    // username
    dispatch(resetApiState('login'));
    setIsSignInAppEnvMisconfiguredError(false);

    return getUserAuthenticationMethodApi
      .makeRequest(values.username)
      .then((res) => {
        setValidatedUsername(values.username);
        setRememberMe(values.rememberMe);

        // Presist the user's authentication method details to redux. We need
        // to determine if they're authentication via a third party. If they
        // are subsequent requests to the back-end need a token as well as an
        // authority to authenticate correctly (ex: via msal-react).
        dispatch(setUserAuthenticationMethod(res));

        if (values.rememberMe) {
          setRememberedUsername(values.username);
        }

        // Log to app insights if the back-end and front-end are using
        // different configurations for single sign on
        const isValidAuthority =
          res.b2cDomain &&
          publicClientAppConfiguration.auth.knownAuthorities?.includes(
            res.b2cDomain
          );
        if (!isValidAuthority) {
          ai.appInsights.trackException({
            exception: new Error(
              `Invalid authority: ${res.b2cDomain}, available authorities are: ${publicClientAppConfiguration.auth.knownAuthorities}`
            ),
            severityLevel: SeverityLevel.Critical,
          });
        }

        // Route the user appropriately based on their authentication provider
        if (res.isDOLV3Login) {
          history.push(routes.loginEnterPassword);
        } else if (!res.isDOLV3Login && isValidAuthority) {
          history.push(routes.loginThirdParty);
        } else if (!res.isDOLV3Login && !isValidAuthority) {
          setIsSignInAppEnvMisconfiguredError(true);
        }
      })
      .catch(() => {});
  };

  const performLogin = useCallback(
    (
      formValues: PasswordFormValues,
      formikProps: FormikHelpers<PasswordFormValues>
    ) => {
      dispatch(
        LoginUserRoutine.trigger({
          formValues: {
            username: validatedUsername,
            password: formValues.password,
          },
          formikProps,
        })
      );
    },
    [dispatch, validatedUsername]
  );

  const performTokenLogin = useCallback(() => {
    dispatch(LoginUserRoutine.trigger());
  }, [dispatch]);

  const locationState = location.state as LocationState;

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isPasswordChangeRequired = useSelector(selectIsPasswordChangeRequired);
  const activeDomain = useSelector(selectActiveDomain);
  const authenticationApi = useSelector(selectLogin);

  const errorMessage = getErrorMessage(
    t,
    authenticationApi.error,
    getUserAuthenticationMethodApi.error,
    isSignInAppEnvMisconfiguredError
  );

  const isLoggingInOrInitializingApp =
    authenticationApi.loading ||
    // NOTE: This is checking if the details of the
    // domain have been retrieved yet. May want to include more checks here
    // (timezone, favourites, etc.) and check API request loading status
    // instead of if an ID exists
    (isAuthenticated && !activeDomain?.domainId);

  // Redirect to the login "Enter username" page if the user tries accessing
  // the "Enter password" page without having a username entered/validated
  useEffect(() => {
    if (location.pathname === routes.loginEnterPassword && !validatedUsername) {
      history.push(routes.login);
    }
  }, [location.pathname, validatedUsername]);

  // Focus on the password input when landing on the "Enter password" page
  useEffect(() => {
    if (location.pathname === routes.loginEnterPassword) {
      const passwordInputElement = document.getElementById('password-input');
      if (passwordInputElement) {
        passwordInputElement.focus();
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    // Redirect if the user logs in successfully
    if (isAuthenticated && isPasswordChangeRequired) {
      history.push(routes.setPassword);
    } else if (isAuthenticated && activeDomain?.domainId) {
      const redirectRoute =
        locationState &&
        locationState.from &&
        locationState.from.pathname !== routes.login
          ? locationState.from.pathname
          : routes.home;

      history.push(redirectRoute);
    }
  }, [isAuthenticated, isPasswordChangeRequired, activeDomain?.domainId]);

  const passwordResetLink = (
    <Box textAlign="center">
      <MuiLink
        component={StyledLink}
        to={routes.resetPassword.request}
        underline="always"
      >
        {t('ui.resetPassword.forgotPassword', 'Forgot password?')}
      </MuiLink>
    </Box>
  );

  return (
    <CenteredContentWithLogo>
      <Switch>
        <Route path={routes.login} exact>
          <Formik<UsernameFormValues>
            initialValues={usernameFormInitialValues}
            validationSchema={usernameFormValidationSchema}
            onSubmit={validateUsername}
            // Having multiple Formik instances on the same page seem to
            // preserve form values state between all instances. To get around
            // this, use a key:
            // https://github.com/formium/formik/issues/1367#issuecomment-560168349
            key="username-form"
          >
            {({ isSubmitting, values, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                {/*
                  NOTE: This component is used to reset the remembered username
                  anytime the "Remember Me" checkbox is unchecked
                */}
                <RememberMeFormEffect rememberMe={values.rememberMe} />

                <Grid container spacing={4} justify="center">
                  <Grid item xs={12}>
                    <StyledPageHeader dense align="center">
                      {t('ui.main.loginTitle', 'Log in to your account')}
                    </StyledPageHeader>
                  </Grid>
                  {errorMessage && (
                    <Grid item xs={12}>
                      <Alert severity="error">{errorMessage}</Alert>
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
                            disabled={isLoggingInOrInitializingApp}
                          />
                        </SpacedBoxToHandleErrorHelperText>
                      </Grid>
                      <Grid item xs={12}>
                        <SecondaryTextWrapper>
                          <Field
                            id="rememberMe-input"
                            component={StyledCheckboxWithLabel}
                            name="rememberMe"
                            type="checkbox"
                            Label={{
                              label: t('ui.main.rememberme', 'Remember Me'),
                            }}
                          />
                        </SecondaryTextWrapper>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid
                      container
                      spacing={3}
                      alignItems="center"
                      justify="center"
                    >
                      <Grid item xs={12} md={4}>
                        <Button
                          variant="contained"
                          type="submit"
                          fullWidth
                          disabled={
                            isLoggingInOrInitializingApp || isSubmitting
                          }
                        >
                          {isLoggingInOrInitializingApp || isSubmitting ? (
                            <Box display="flex" alignItems="center">
                              <StyledCircularProgress size={24} />{' '}
                              {t('ui.common.loading', 'Loading...')}
                            </Box>
                          ) : (
                            t('ui.main.next', 'Next')
                          )}
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Route>
        <Route path={routes.loginEnterPassword}>
          <Formik<PasswordFormValues>
            initialValues={passwordFormInitialValues}
            validationSchema={passwordFormValidationSchema}
            onSubmit={performLogin}
            // Having multiple Formik instances on the same page seem to
            // preserve form values state between all instances. To get around
            // this, use a key:
            // https://github.com/formium/formik/issues/1367#issuecomment-560168349
            key="password-form"
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Grid container spacing={4} justify="center">
                  <Grid item xs={12}>
                    <Grid
                      container
                      spacing={1}
                      alignItems="center"
                      justify="center"
                    >
                      <Grid item>
                        <StyledBackIconButton />
                      </Grid>
                      <Grid item>
                        <StyledPageHeader dense align="center">
                          {t(
                            'ui.common.password.enterYourPassword',
                            'Enter your password'
                          )}
                        </StyledPageHeader>
                      </Grid>
                    </Grid>
                  </Grid>
                  {errorMessage && (
                    <Grid item xs={12}>
                      <Alert severity="error">{errorMessage}</Alert>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <SpacedBoxToHandleErrorHelperText>
                      <Field
                        component={PasswordField}
                        required
                        id="password-input"
                        name="password"
                        placeholder={t(
                          'ui.common.password.placeholder',
                          'Enter password'
                        )}
                        fullWidth
                        disabled={isLoggingInOrInitializingApp}
                      />
                    </SpacedBoxToHandleErrorHelperText>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid
                      container
                      spacing={3}
                      alignItems="center"
                      justify="center"
                    >
                      <Grid item xs={12} md={4}>
                        <Button
                          variant="contained"
                          type="submit"
                          fullWidth
                          disabled={isLoggingInOrInitializingApp}
                        >
                          {isLoggingInOrInitializingApp ? (
                            <Box display="flex" alignItems="center">
                              <StyledCircularProgress size={24} />{' '}
                              {t('ui.common.loading', 'Loading...')}
                            </Box>
                          ) : (
                            t('ui.main.login', 'Login')
                          )}
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        {passwordResetLink}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Route>
        <Route path={routes.loginThirdParty} exact>
          <MSALAuthentication
            validatedUsername={validatedUsername}
            performTokenLogin={performTokenLogin}
          />
        </Route>
      </Switch>
    </CenteredContentWithLogo>
  );
};

export default Login;
