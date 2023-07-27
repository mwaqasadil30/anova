import {
  ApiException,
  EvolveAuthenticateAndRetrieveApplicationInfoResponse,
  UserAuthenticationResult,
} from 'api/admin/api';
import { TFunction } from 'i18next';
import * as Yup from 'yup';

export const getErrorMessage = (
  t: TFunction,
  authenticationApiError:
    | EvolveAuthenticateAndRetrieveApplicationInfoResponse
    | ApiException
    | null,
  authenticationMethodApiError: any,
  isMisconfiguredError?: boolean
) => {
  if (isMisconfiguredError) {
    return t(
      'ui.error.appSignInEnvironmentMisconfigured',
      'Application sign-in environment misconfigured'
    );
  }

  const incorrectUsernameOrPasswordText = t(
    'ui.main.incorrectusernameorpassword',
    'Incorrect Username or Password'
  );
  const loginDisabledText = t('ui.main.logindisabled', 'Login Disabled');
  const unableToConnectWithServerText = t(
    'ui.main.unabletoconnectwithserver',
    'Unable to connect with Server'
  );

  // Handle errors from the authentication method API
  if (authenticationMethodApiError) {
    return unableToConnectWithServerText;
  }

  // Handle errors from the authentication API
  if (!authenticationApiError) {
    return '';
  }

  if (authenticationApiError instanceof ApiException) {
    switch (authenticationApiError.status) {
      case 401:
        return incorrectUsernameOrPasswordText;
      case 403:
        return loginDisabledText;
      default:
        return unableToConnectWithServerText;
    }
  }

  const authenticationResult =
    authenticationApiError.authenticateAndRetrieveApplicationInfoResult
      ?.authenticationResult;

  switch (authenticationResult) {
    case UserAuthenticationResult.InvalidUsernameAndPassword:
    case UserAuthenticationResult.UserDoesNotExists:
      return incorrectUsernameOrPasswordText;
    case UserAuthenticationResult.DomainUserLoginDisabled:
    case UserAuthenticationResult.WebLoginDisabled:
      return loginDisabledText;
    default:
      return unableToConnectWithServerText;
  }
};

export const buildUsernameFormValidationSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  const fieldIsRequired = (field: string) =>
    t('validate.common.isrequired', '{{field}} is required.', { field });

  return Yup.object().shape({
    username: Yup.string()
      .typeError(fieldIsRequired(translationTexts.username))
      .required(fieldIsRequired(translationTexts.username)),
  });
};

export const buildPasswordFormValidationSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  const fieldIsRequired = (field: string) =>
    t('validate.common.isrequired', '{{field}} is required.', { field });

  return Yup.object().shape({
    password: Yup.string()
      .typeError(fieldIsRequired(translationTexts.password))
      .required(fieldIsRequired(translationTexts.password)),
  });
};

export const passwordFormInitialValues = {
  password: '',
};

const rememberMeUsernameKey = 'rememberMeUsername';

export const setRememberedUsername = (username: string) => {
  localStorage.setItem(rememberMeUsernameKey, username);
};

export const getRememberedUsername = (): string => {
  return localStorage.getItem(rememberMeUsernameKey) || '';
};
