import {
  GetUserAuthenticationProviderDto,
  UserPermissionsInfo,
} from 'api/admin/api';
import { TranscendAndDolV3UserAccess } from 'types';
import {
  SetAuthenticationMethodAction as SetUserAuthenticationMethodAction,
  SetUserPermissionsAction,
  UserAction,
  UserActionType,
  UserPerformLogoutPayload,
} from './types';

export const setUserLoaded = (): UserAction => ({
  type: UserActionType.SetAuthLoaded,
});

export const performLogout = (
  options: UserPerformLogoutPayload = {}
): UserAction => ({
  type: UserActionType.PerformLogout,
  payload: options,
});

export const logoutUser = (): UserAction => ({
  type: UserActionType.Logout,
});

export const setUserPermissions = (
  userPermissions: UserPermissionsInfo
): SetUserPermissionsAction => ({
  type: UserActionType.SetUserPermissions,
  payload: { userPermissions },
});

export const confirmWelcomeDialog = (): UserAction => ({
  type: UserActionType.ConfirmWelcomeDialog,
});

export const changePasswordSuccess = () => ({
  type: UserActionType.ChangePasswordSuccess,
});

export const setUserAuthenticationMethod = (
  authenticationMethod: GetUserAuthenticationProviderDto
): SetUserAuthenticationMethodAction => ({
  type: UserActionType.SetAuthenticationMethod,
  payload: { authenticationMethod },
});

export const setUserAccessToDolV3AndTranscend = (
  accessType: TranscendAndDolV3UserAccess | undefined
) => {
  return {
    type: UserActionType.SetUserAccessType,
    payload: { accessType },
  };
};
