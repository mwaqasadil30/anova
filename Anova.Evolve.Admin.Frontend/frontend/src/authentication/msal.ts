/* eslint-disable no-console */
import {
  Configuration,
  LogLevel,
  PublicClientApplication,
} from '@azure/msal-browser';
import { SSO_CLIENT_APPLICATION_ENVIRONMENT } from 'env';
import { SingleSignOnClientAppEnvironment } from 'types';

import { clientApplications } from './policies';

const commonConfiguration: Partial<Configuration> = {
  cache: {
    cacheLocation: 'localStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: false, // If you wish to store cache items in cookies as well as browser cache, set this to "true".
  },
  system: {
    loggerOptions: {
      loggerCallback: (
        level: LogLevel,
        message: string,
        containsPii: boolean
      ): void => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            console.log(message);
        }
      },
      piiLoggingEnabled: false,
    },
    windowHashTimeout: 60000,
    iframeHashTimeout: 10000,
    loadFrameTimeout: 0,
  },
};

// Get the application configuration to use based on the environment provided
const ACTIVE_CONFIGURATION =
  SSO_CLIENT_APPLICATION_ENVIRONMENT === SingleSignOnClientAppEnvironment.Test
    ? clientApplications.TEST
    : clientApplications.PRODUCTION;

// MSAL configuration
export const publicClientAppConfiguration: Configuration = {
  ...commonConfiguration,
  auth: {
    // This is the ONLY mandatory field; everything else is optional.
    clientId: ACTIVE_CONFIGURATION.clientId,
    // Choose sign-up/sign-in user-flow as your default.
    authority: ACTIVE_CONFIGURATION.authority,
    // You must identify your tenant's domain as a known authority.
    knownAuthorities: ACTIVE_CONFIGURATION.knownAuthorities,
    // You must register this URI on Azure Portal/App Registration. Defaults to "window.location.href".
    // redirectUri: window.location.origin,
  },
};

export const msalInstance = new PublicClientApplication(
  publicClientAppConfiguration
);
