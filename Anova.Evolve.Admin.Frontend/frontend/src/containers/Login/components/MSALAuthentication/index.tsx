/* eslint-disable indent */
import { InteractionType } from '@azure/msal-browser';
import {
  useIsAuthenticated,
  useMsal,
  useMsalAuthentication,
} from '@azure/msal-react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { buildBaseLoginRequest } from 'authentication/config';
import { msalInstance } from 'authentication/msal';
import Alert from 'components/Alert';
import CircularProgress from 'components/CircularProgress';
import { StyledPageHeader } from 'components/layout/CenteredContentWithLogo/styles';
import { getErrorMessage } from 'containers/Login/helpers';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import { selectLogin } from 'redux-app/modules/coreApi/selectors';
import {
  selectB2cScopeAppAuthenticateUri,
  selectB2cSignInFlowUri,
} from 'redux-app/modules/user/selectors';
import routes from 'routes-config';
import styled from 'styled-components';
import { StyledBackIconButton } from '../../styles';

const StyledAlert = styled(Alert)`
  /* Break apart long URLs to prevent any text from overflowing in the Alert box. */
  overflow-wrap: anywhere;
`;

// For now we display the full error from Microsoft. If we want to customize
// the error messages we can use this helper.
// const formatAuthErrorMessage = (t: TFunction, error: BrowserAuthError) => {
//   switch (error.errorCode) {
//     case 'user_cancelled': {
//       return t('ui.authentication.flowWasCancelled', 'Flow was cancelled');
//     }
//     default:
//       return error.errorMessage;
//   }
// };

interface Props {
  validatedUsername: string;
  performTokenLogin: () => void;
}

const MSALAuthentication = ({
  validatedUsername,
  performTokenLogin,
}: Props) => {
  const history = useHistory();
  const { t } = useTranslation();

  const authenticationApi = useSelector(selectLogin);
  const domainApi = useSelector(selectActiveDomain);
  const b2cSignInUri = useSelector(selectB2cSignInFlowUri);
  const b2cScopeAppAuthenticateUri = useSelector(
    selectB2cScopeAppAuthenticateUri
  );

  const baseLoginRequest = buildBaseLoginRequest({
    scopeUri: b2cScopeAppAuthenticateUri,
    authority: b2cSignInUri,
  });
  const loginRequest = {
    ...baseLoginRequest,
    loginHint: validatedUsername,
  };

  const msalAuth = useMsalAuthentication(
    InteractionType.Redirect,
    loginRequest
  );
  const msal = useMsal();

  const activeAccount = msal.instance.getActiveAccount();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (msal.accounts.length) {
      // Log in using the first account we find. Note that the account list
      // would have an account if:
      // - the user finished logging in via the redirect
      // - a user's already logged in via Active Directory separate from the
      //   Transcend app
      msalInstance.setActiveAccount(msal.accounts[0]);
      performTokenLogin();
    }
  }, [msal.accounts]);

  const authApiError = getErrorMessage(t, authenticationApi.error, null);

  return (
    <Grid container spacing={4} justify="center">
      <Grid item xs={12}>
        <Box width="100%">
          <Grid container spacing={1} alignItems="center" justify="center">
            <Grid item>
              <StyledBackIconButton
                onClick={() => history.replace(routes.login)}
              />
            </Grid>
            <Grid item>
              <StyledPageHeader dense align="center">
                {t('ui.main.loginTitle', 'Log in to your account')}
              </StyledPageHeader>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box width="100%">
          {msalAuth.error?.errorMessage || authApiError ? (
            <Box width="100%">
              <StyledAlert severity="error">
                {msalAuth.error?.errorMessage || authApiError}
              </StyledAlert>
            </Box>
          ) : authenticationApi.loading || domainApi?.isFetching ? (
            <Box textAlign="center">
              <div>
                <CircularProgress />
              </div>
              {t('ui.main.loggingin', 'Logging In..')}
            </Box>
          ) : isAuthenticated ? (
            <Typography style={{ color: 'white' }}>
              {t('ui.authentication.loggedIn', 'Logged in')}{' '}
              {activeAccount?.username && `as ${activeAccount.username}`}
            </Typography>
          ) : (
            // If we reach this case, the MSAL authentication flow must be in
            // progress, so we show a loading spinner
            <Box textAlign="center">
              <CircularProgress />
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default MSALAuthentication;
