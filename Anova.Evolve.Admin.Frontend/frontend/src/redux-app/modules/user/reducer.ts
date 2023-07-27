import { BaseAction } from 'redux-app/types-actions';
import { GetUserPermissions, LoginUserRoutine } from './routines';
import { UserActionType, UserState } from './types';

const initialState: UserState = {
  loaded: false,
  isAuthenticated: false,
  data: null,
  hasConfirmedWelcomeDialog: false,
  authenticationMethod: null,
  userPermissions: null,
  userPermissionsIsFetching: false,
  userPermissionsError: null,
};

const userReducer = (state: UserState = initialState, action: BaseAction) => {
  switch (action.type) {
    case LoginUserRoutine.SUCCESS:
      return {
        ...state,
        data: action.payload,
        isAuthenticated: true,
        loaded: true,
      };
    // case VerifySessionRoutine.SUCCESS:
    //   return {
    //     ...state,
    //     data: action.payload,
    //     isAuthenticated: true,
    //     loaded: true,
    //   };
    case UserActionType.SetAuthLoaded:
      return {
        ...state,
        loaded: true,
      };
    case UserActionType.ChangePasswordSuccess: {
      const updatedUserData = {
        ...state.data,
        authenticateAndRetrieveApplicationInfoResult: {
          ...state.data?.authenticateAndRetrieveApplicationInfoResult,
          userInfo: {
            ...state.data?.authenticateAndRetrieveApplicationInfoResult
              ?.userInfo,
            // Password change is no longer required
            isPasswordChangeRequired: false,
          },
        },
      };
      return {
        ...state,
        data: updatedUserData,
      };
    }
    case GetUserPermissions.REQUEST:
      return {
        ...state,
        userPermissionsIsFetching: true,
      };
    case GetUserPermissions.SUCCESS: {
      return {
        ...state,
        userPermissionsIsFetching: false,
        userPermissions: action.payload,
      };
    }
    case GetUserPermissions.FAILURE:
      return {
        ...state,
        userPermissionsIsFetching: false,
        userPermissionsError: action.payload,
      };
    case UserActionType.ConfirmWelcomeDialog:
      return {
        ...state,
        hasConfirmedWelcomeDialog: true,
      };
    case UserActionType.Logout:
      return {
        ...state,
        loaded: true,
        isAuthenticated: false,
        data: null,
        hasConfirmedWelcomeDialog: false,
        authenticationMethod: null,
        userPermissions: null,
        userPermissionsIsFetching: false,
        userPermissionsError: null,
      };
    case UserActionType.SetAuthenticationMethod:
      return {
        ...state,
        authenticationMethod: action.payload.authenticationMethod,
      };
    case UserActionType.SetUserAccessType:
      return {
        ...state,
        data: {
          ...state.data,
          userAccessToTranscendAndDolV3StatusId:
            action.payload.userAccessToTranscendAndDolV3StatusId,
        },
      };
    default:
      return state;
  }
};

export { initialState as initialUserState, userReducer };
