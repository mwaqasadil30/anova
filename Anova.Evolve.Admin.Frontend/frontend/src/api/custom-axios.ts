/* tslint-disable no-explicit-any */
import { PublicClientApplication } from '@azure/msal-browser';
import { buildBaseLoginRequest } from 'authentication/config';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { i18n } from 'i18next';
import { AnyAction, Store } from 'redux';
import {
  setShowGlobalApplicationTimeoutDialog,
  setShowGlobalPermissionDeniedDialog,
} from 'redux-app/modules/app/actions';
import {
  selectActiveDomainId,
  selectCurrentTimezone,
} from 'redux-app/modules/app/selectors';
import {
  selectB2cScopeAppAuthenticateUri,
  selectB2cSignInFlowUri,
  selectIsAuthenticated,
  selectIsDOLV3Login,
} from 'redux-app/modules/user/selectors';
import { isNumber } from 'utils/format/numbers';
import TimeZoneHelper from './TimeZoneHelper';

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const config: AxiosRequestConfig = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  withCredentials: true, // Check cross-site Access-Control
};

const axiosInstance = axios.create(config);

axiosInstance.interceptors.request.use(
  (cfg: any) => {
    // add user locale information to headers of each request
    // in case we need to do anything with that locale
    /* eslint-disable no-param-reassign */
    cfg.headers.IANALocaleInfo = JSON.stringify(
      TimeZoneHelper.getLocalDateTimeFormatOptions()
    );
    return cfg;
  },
  (err: any) => {
    // Do something with request error
    return Promise.reject(err);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (res: any) => {
    // Do something with response data
    return res;
  },
  (err: any) => {
    // Do something with response error
    return Promise.reject(err);
  }
);

export { axiosInstance as CustomAxios };

const commonPermissionDeniedParams = {
  showDialog: true,
  wasTriggeredFromApi: true,
};

export const initializeInterceptors = (
  instance: AxiosInstance,
  store: Store<any, AnyAction>,
  msalPublicClientApp: PublicClientApplication,
  i18nSettings: i18n
) => {
  // Set up request interceptor to pass in previously used session cookie state
  // as headers. Things like the domain ID, timezone, language were in the
  // session cookie, preventing users from using different domains on different
  // browser tabs.
  instance.interceptors.request.use(
    (requestConfig) => {
      const reduxState = store.getState();
      const domainId = selectActiveDomainId(reduxState);
      const timezoneState = selectCurrentTimezone(reduxState);

      if (!domainId) {
        /* eslint-disable-next-line no-console */
        console.info(
          '[interceptor] No effective domain ID available for the request'
        );
      } else {
        requestConfig.headers['X-EffectiveDomainId'] = domainId;
      }

      const timezoneId = timezoneState.timezone?.timezoneId;
      const localTimezoneSystemId = timezoneState.timezone?.systemId;
      const localTimezoneOffset = timezoneState.timezone?.utcOffset;
      if (isNumber(timezoneId)) {
        requestConfig.headers['X-SelectedTimeZoneId'] = timezoneId;
      }
      if (localTimezoneSystemId) {
        requestConfig.headers[
          'X-LocalTimezoneSystemId'
        ] = localTimezoneSystemId;
      }
      if (localTimezoneOffset) {
        requestConfig.headers['X-LocalTimezoneOffset'] = localTimezoneOffset;
      }

      requestConfig.headers.UserLanguage = i18nSettings.language || 'en';

      return requestConfig;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Set up request interceptor to pass in the MSAL access token only if we
  // have an active Microsoft account
  instance.interceptors.request.use(
    async (requestConfig) => {
      const activeAccount = msalPublicClientApp.getActiveAccount();
      const reduxState = store.getState();
      const isDOLV3Login = selectIsDOLV3Login(reduxState);
      const b2cSignInUri = selectB2cSignInFlowUri(reduxState);
      const b2cScopeAppAuthenticateUri = selectB2cScopeAppAuthenticateUri(
        reduxState
      );

      // If the user is logging in with legacy basic authentication, then we
      // don't need to inject any headers in the request
      if (isDOLV3Login) {
        return requestConfig;
      }

      // If there is no active Microsoft account, or a piece of configuration
      // for authenticating is missing, log about it and leave the request
      // untouched.
      if (!activeAccount || !b2cSignInUri || !b2cScopeAppAuthenticateUri) {
        /* eslint-disable-next-line no-console */
        console.info(
          '[interceptor] No active account, signin URI or scope URI available',
          activeAccount?.username,
          b2cSignInUri,
          b2cScopeAppAuthenticateUri
        );
        return requestConfig;
      }

      // If we have an active Microsoft account, try to acquire an access token
      // silently and pass it into the request's Authorization header.
      let accessToken = '';
      try {
        const baseLoginRequest = buildBaseLoginRequest({
          scopeUri: b2cScopeAppAuthenticateUri,
          authority: b2cSignInUri,
        });
        const tokenResponse = await msalPublicClientApp.acquireTokenSilent({
          ...baseLoginRequest,
          forceRefresh: false,
          account: activeAccount,
        });
        accessToken = tokenResponse.accessToken;
      } catch (error) {
        console.error('Unable to retrieve token silently', error);

        // If we're unable to get an access token, and the API being called
        // requires one, the backend will just return a 404, which doesn't
        // indicate that the user should log in again to get valid credentials.
        // So here, we display a dialog saying their session has timed out.
        const isAuthenticated = selectIsAuthenticated(store.getState());
        if (isAuthenticated) {
          store.dispatch(setShowGlobalApplicationTimeoutDialog(true));
        }
      }

      if (!accessToken) {
        return requestConfig;
      }

      const bearer = `Bearer ${accessToken}`;
      return {
        ...requestConfig,
        headers: {
          ...requestConfig.headers,
          Authorization: bearer,
        },
      };
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (res) => {
      if (res.status === 403) {
        store.dispatch(
          setShowGlobalPermissionDeniedDialog(commonPermissionDeniedParams)
        );
      } else if (res.status === 503) {
        // NOTE: This redirect is temporarily in place for the first scheduled
        // downtime. If we want to show a modal instead, dispatch this action
        // to show the maintenance dialog:
        // store.dispatch(setShowGlobalMaintenanceDialog(true));
        window.location.href = 'https://offline.transcend.anova.com';
      }

      return res;
    },
    (err) => {
      if (err.status === 403) {
        store.dispatch(
          setShowGlobalPermissionDeniedDialog(commonPermissionDeniedParams)
        );
      } else if (
        // Detect if the user's session has timed out, if so, display the
        // application timeout dialog if the user is authenticated.
        err.response?.status === 401 &&
        // At the moment the front-end just knows a 401 http status code with
        // an ErrorCode of 3 means the session expired due to the application
        // timeout (there doesn't seem to be an enum for ErrorCode).
        err.response?.data?.ErrorCode === 3
      ) {
        // If the user isn't authenticated, we don't want to show them the
        // dialog. Some API calls may happen while the user's already
        // unauthenticated because of race conditions. For example, the logout
        // action is dispatched, they're redirected to a page that triggers API
        // calls which only receive responses by the time they're already
        // unauthenticated on the login page.
        const isAuthenticated = selectIsAuthenticated(store.getState());
        if (isAuthenticated) {
          store.dispatch(setShowGlobalApplicationTimeoutDialog(true));
        }
      } else if (err.status === 503) {
        // NOTE: This redirect is temporarily in place for the first scheduled
        // downtime. If we want to show a modal instead, dispatch this action
        // to show the maintenance dialog:
        // store.dispatch(setShowGlobalMaintenanceDialog(true));
        window.location.href = 'https://offline.transcend.anova.com';
      }

      return Promise.reject(err);
    }
  );
};
