import { BrowserAuthOptions } from '@azure/msal-browser';

interface ClientAppsMapping {
  TEST: BrowserAuthOptions;
  PRODUCTION: BrowserAuthOptions;
}

/**
 * Enter here the user flows and custom policies for your B2C application
 * To learn more about user flows, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
 * To learn more about custom policies, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
 */
export const clientApplications: ClientAppsMapping = {
  TEST: {
    clientId: '7e0ac7cb-8fde-4a72-b170-cd10e686d731',
    // This is the authority that was used previously. Since the authority is
    // now retrieved from the back-end when the user enters their email
    // address, we'll need to pass it every where it's needed (logging in,
    // logging out).
    // authority:
    //   'https://transcendtest.b2clogin.com/transcendtest.onmicrosoft.com/B2C_1_SignUp_SignIn',
    knownAuthorities: [
      'transcendtest.b2clogin.com',
      'transcendtest.onmicrosoft.com',
    ],
  },
  PRODUCTION: {
    clientId: '944226bc-f105-4a6e-8d6c-30f4da49b8a3',
    knownAuthorities: [
      'transcendprod.b2clogin.com',
      'transcendprod.onmicrosoft.com',
    ],
  },
};
