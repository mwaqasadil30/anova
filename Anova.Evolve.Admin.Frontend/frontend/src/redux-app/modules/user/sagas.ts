import {
  EvolveAuthenticateAndRetrieveApplicationInfoRequest,
  EvolveAuthenticateAndRetrieveApplicationInfoResponse,
  EvolveLogoutRequest,
  UserAuthenticationResult,
  UserPermissionsInfo,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import { queryClient } from 'api/react-query/helpers';
import { setSessionId } from 'api/utils';
import { msalInstance } from 'authentication/msal';
import { replace } from 'connected-react-router';
import {
  setActiveDomainById,
  setPreviouslyHadDarkThemeEnabled,
  setTimezones,
} from 'redux-app/modules/app/actions';
import {
  LoginAction,
  LoginActionSuccess,
} from 'redux-app/modules/coreApi/types';
import { SagaIterator } from 'redux-saga';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import routes from 'routes-config';
import { getDarkThemePreferenceForUser } from 'utils/theme-preference';
import { logoutUser } from './actions';
import { GetUserPermissions, LoginUserRoutine } from './routines';
import { selectB2cSignInFlowUri, selectUserId } from './selectors';
import { UserActionType, UserPerformLogoutAction } from './types';

interface AuthenticateData {
  username: string;
  password: string;
}

const authenticate = (authData: AuthenticateData | undefined) =>
  AdminApiService.BaseService.authenticateAndRetrieveApplicationInfo_AuthenticateAndRetrieveApplicationInfo(
    {
      username: authData?.username || '',
      password: authData?.password || '',
    } as EvolveAuthenticateAndRetrieveApplicationInfoRequest
  );

const retrieveUserPermissions = () =>
  AdminApiService.UserService.user_RetrieveCurrentUserPermissions();

const logout = (userId: string) =>
  AdminApiService.UserDetailsService.userDetails_Logout(
    EvolveLogoutRequest.fromJS({ userId })
  );

function* userLoginWorker(action: LoginAction) {
  const formValues = action.payload?.formValues;
  const formikProps = action.payload?.formikProps;

  try {
    yield put(LoginUserRoutine.request());
    const response: EvolveAuthenticateAndRetrieveApplicationInfoResponse = yield call(
      authenticate,
      formValues
    );

    const authenticationResult =
      response.authenticateAndRetrieveApplicationInfoResult
        ?.authenticationResult;
    if (authenticationResult !== UserAuthenticationResult.Authenticated) {
      yield put(LoginUserRoutine.failure(response));
    } else {
      yield put(LoginUserRoutine.success(response));
    }
  } catch (error) {
    yield put(LoginUserRoutine.failure(error));
  } finally {
    formikProps?.setSubmitting(false);
  }
}

function* userPerformLogoutWorker(action: UserPerformLogoutAction) {
  yield call(setSessionId, '');

  const b2cSignInUri: string | null | undefined = yield select(
    selectB2cSignInFlowUri
  );
  const userId: string | undefined = yield select(selectUserId);

  try {
    if (userId) {
      yield call(logout, userId);
    }
  } catch (error) {
    console.error('Error occurred while logging out', error);
  }

  // Dispatch the actual logout event which will reset all reducers to their
  // initial state
  yield put(logoutUser());

  // Only redirect if the user didn't explicitly logout (eg: a 401 response
  // was received from the API)
  const { redirectPath } = action.payload;
  const defaultRedirectRoute = routes.home;
  const cleanRedirectPath =
    redirectPath !== routes.login
      ? redirectPath || defaultRedirectRoute
      : defaultRedirectRoute;

  // If the account's logged in via MSAL, log them out
  const activeAccount = msalInstance.getActiveAccount();
  if (activeAccount && b2cSignInUri) {
    try {
      msalInstance.logoutRedirect({
        authority: b2cSignInUri,
        postLogoutRedirectUri: cleanRedirectPath,
      });
    } catch (error) {
      console.error('Error occurred while logging out via MSAL', error);
    }
  }

  // Clear all queries so no cache persists when a user logs in once more.
  // Incase they log into another account with different domains, for example.
  queryClient.clear();

  yield put(replace(cleanRedirectPath));
}

function* userLoginSuccessWorker(action: LoginActionSuccess) {
  const username =
    action.payload.authenticateAndRetrieveApplicationInfoResult?.userInfo
      ?.username;
  const domain =
    action.payload.authenticateAndRetrieveApplicationInfoResult
      ?.effectiveDomain;

  // const userPermissions: UserPermissionsInfo = yield call(
  //   retrieveUserPermissions
  // );

  // if (userPermissions) {
  //   yield put(setUserPermissions(userPermissions));
  // }
  yield put(GetUserPermissions.trigger());
  yield put(setActiveDomainById(domain?.domainId));
  yield put(setTimezones(action.payload.ianaTimezones));

  // Set up previous dark theme settings
  if (username) {
    const previouslyHadDarkThemeEnabled = getDarkThemePreferenceForUser(
      username
    );
    yield put(setPreviouslyHadDarkThemeEnabled(previouslyHadDarkThemeEnabled));
  }
}

function* getUserPermissionsWorker() {
  try {
    yield put(GetUserPermissions.request());
    const userPermissions: UserPermissionsInfo = yield call(
      retrieveUserPermissions
    );

    if (userPermissions) {
      yield put(GetUserPermissions.success(userPermissions));
    } else {
      yield put(GetUserPermissions.failure(userPermissions));
    }
  } catch (error) {
    yield put(GetUserPermissions.failure(error));
  }
}

// function* initializeUserWorker() {
//   const sessionId = yield call(getSessionId);
//   sessionId
//     ? yield put(VerifySessionRoutine.trigger())
//     : yield put(setUserLoaded());
// }

function* userWatcher(): SagaIterator {
  yield all([
    takeLatest(LoginUserRoutine.TRIGGER, userLoginWorker),
    takeLatest(LoginUserRoutine.SUCCESS, userLoginSuccessWorker),
    takeLatest(GetUserPermissions.TRIGGER, getUserPermissionsWorker),
    // takeLatest(InitializeUserRoutine.TRIGGER, initializeUserWorker),
    takeLatest(UserActionType.PerformLogout, userPerformLogoutWorker),
  ]);
}

export { userLoginWorker, userWatcher };
