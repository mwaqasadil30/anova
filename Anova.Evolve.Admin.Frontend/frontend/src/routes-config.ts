const languagePath = '/language';
const releaseNotesPath = '/release-notes';
const contactSupportPath = '/contact-support';
const accessDolv3Path = '/access-dolv3';
const userProfilePath = '/user-profile';
const resetPasswordPath = '/reset-password';

const routes = {
  home: '/',
  login: '/login',
  loginEnterPassword: '/login/password',
  loginThirdParty: '/login/third-party',
  // The set password route is only available to logged in users who need to
  // change their password immediately after logging in (from the backend
  // user's isPasswordChangeRequired property)
  setPassword: '/set-password',
  resetPassword: {
    base: resetPasswordPath,
    request: `${resetPasswordPath}/request`,
    emailSent: `${resetPasswordPath}/email-sent`,
    changePasswordWithToken: `${resetPasswordPath}/change`,
    changeSuccess: `${resetPasswordPath}/success`,
  },
};

export const buildCommonRoutesFromBasePath = (basePath: string) => {
  return {
    language: `${basePath}${languagePath}`,
    releaseNotes: `${basePath}${releaseNotesPath}`,
    contactSupport: `${basePath}${contactSupportPath}`,
    accessDolv3: `${basePath}${accessDolv3Path}`,
    userProfile: `${basePath}${userProfilePath}`,
  };
};

export default routes;
