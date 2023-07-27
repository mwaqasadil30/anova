import {
  GetUserAuthenticationProviderDto,
  EvolveAuthenticateAndRetrieveApplicationInfoResponse,
  UserPermissionsInfo,
} from 'api/admin/api';
import { TranscendAndDolV3UserAccess } from 'types';

export interface UserState {
  loaded: boolean;
  isAuthenticated: boolean;
  data: EvolveAuthenticateAndRetrieveApplicationInfoResponse | null;
  hasConfirmedWelcomeDialog: boolean;
  authenticationMethod?: GetUserAuthenticationProviderDto | null;
  userPermissions?: UserPermissionsInfo | null;
  userPermissionsIsFetching?: boolean;
  userPermissionsError?: any | null;
}

export enum UserActionType {
  SetAuthLoaded = 'user/SET_USER_LOADED',
  PerformLogout = 'user/USER_PERFORM_LOGOUT',
  Logout = 'user/USER_LOGOUT',
  SetUserPermissions = 'user/SET_USER_PERMISSIONS',
  ConfirmWelcomeDialog = 'user/CONFIRM_WELCOME_DIALOG',
  ChangePasswordSuccess = 'user/CHANGE_PASSWORD_SUCCESS',
  SetAuthenticationMethod = 'user/SET_AUTHENTICATION_METHOD',
  SetUserAccessType = 'user/SET_USER_ACCESS_TYPE',
}

export interface UserPerformLogoutPayload {
  redirectPath?: string;
}

export interface UserPerformLogoutAction {
  type: UserActionType.PerformLogout;
  payload: UserPerformLogoutPayload;
}

export interface UserLogoutAction {
  type: UserActionType.Logout;
}

export interface SetUserPermissionsAction {
  type: UserActionType.SetUserPermissions;
  payload: {
    userPermissions: UserPermissionsInfo;
  };
}

export interface ConfirmWelcomeDialogAction {
  type: UserActionType.ConfirmWelcomeDialog;
}

export interface ChangePasswordSuccessAction {
  type: UserActionType.ChangePasswordSuccess;
}

export interface SetAuthenticationMethodAction {
  type: UserActionType.SetAuthenticationMethod;
  payload: {
    authenticationMethod: GetUserAuthenticationProviderDto;
  };
}

export interface SetUserAccessTypeAction {
  type: UserActionType.SetUserAccessType;
  payload: {
    accessType: TranscendAndDolV3UserAccess;
  };
}

export type UserAction =
  | { type: UserActionType.SetAuthLoaded }
  | UserPerformLogoutAction
  | UserLogoutAction
  | SetUserPermissionsAction
  | ConfirmWelcomeDialogAction
  | ChangePasswordSuccessAction
  | SetAuthenticationMethodAction
  | SetUserAccessTypeAction;
