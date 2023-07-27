import adminRoutes from 'apps/admin/routes';
import freezersRoutes from 'apps/freezers/routes';
import systemRoutes from 'apps/system/routes';
import opsRoutes from 'apps/ops/routes';
import ReportsApp from 'apps/reports/App';
import reportsRoutes from 'apps/reports/routes';
import TrainingApp from 'apps/training/App';
import trainingRoutes from 'apps/training/routes';
import ApplicationTimeoutDialog from 'components/ApplicationTimeoutDialog';
import AppVersionChecker from 'components/AppVersionChecker';
import MaintenanceDialog from 'components/dialog/MaintenanceDialog';
import PermissionDeniedDialog from 'components/dialog/PermissionDeniedDialog';
import FirstWelcomeDialog from 'components/FirstWelcomeDialog';
import FullPageLoadingOverlay from 'components/FullPageLoadingOverlay';
import HelmetDetails from 'components/HelmetDetails';
import RefreshUserPermissions from 'components/RefreshUserPermissions';
import UnderConstructionBanner from 'components/UnderConstructionBanner';
import { IS_NEW_APP_VERSION_FEATURE_ENABLED } from 'env';
import useIsWindowFocused from 'hooks/useIsWindowFocused';
import useNotifier from 'hooks/useNotifier';
import React, { lazy, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom';
import {
  setActiveDomain,
  setCurrentTimezone,
} from 'redux-app/modules/app/actions';
import {
  selectActiveDomain,
  selectCurrentTimezone,
  selectIsFetchingActiveDomain,
  selectIsPageUnderConstruction,
} from 'redux-app/modules/app/selectors';
import {
  selectCanAccessAdminApp,
  selectCanAccessFreezersApp,
  selectCanAccessSystemApp,
  selectCanAccessOperationsApp,
  selectCanAccessReportsApp,
  selectIsAuthenticated,
  selectIsPasswordChangeRequired,
  selectUserId,
  selectUserPermissionsIsFetching,
} from 'redux-app/modules/user/selectors';
import routes from 'routes-config';
import AuthedRoute from './components/AuthedRoute';
import MainContent from './components/layout/MainContent';
import MainNavigation from './components/navigation/MainNavigation';
import SessionProbe from './components/SessionProbe';
import Login from './containers/Login';
import ResetPassword from './containers/ResetPassword';
import SetPasswordAfterLogin from './containers/SetPasswordAfterLogin';
import './i18n';

// Code split specific apps
// See Create React App and React docs:
// https://create-react-app.dev/docs/code-splitting/#with-react-router
// https://reactjs.org/docs/code-splitting.html#route-based-code-splitting
const AdminApp = lazy(() => import('apps/admin/App'));
const OperationsApp = lazy(() => import('apps/ops/App'));
const FreezersApp = lazy(() => import('apps/freezers/App'));
const SystemApp = lazy(() => import('apps/system/App'));

function App() {
  // Set up notistack snackbar notifications
  useNotifier();

  const location = useLocation();
  const history = useHistory();
  const isWindowFocused = useIsWindowFocused();
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isPasswordChangeRequired = useSelector(selectIsPasswordChangeRequired);
  const isFetchingActiveDomain = useSelector(selectIsFetchingActiveDomain);
  const userPermissionsIsFetching = useSelector(
    selectUserPermissionsIsFetching
  );
  const showConstructionBanner = useSelector(selectIsPageUnderConstruction);
  const activeDomain = useSelector(selectActiveDomain);
  const timezoneState = useSelector(selectCurrentTimezone);

  const canAccessAdminApp = useSelector(selectCanAccessAdminApp);
  const canAccessOperationsApp = useSelector(selectCanAccessOperationsApp);
  const canAccessReportsApp = useSelector(selectCanAccessReportsApp);
  const canAccessFreezersApp = useSelector(selectCanAccessFreezersApp);
  const canAccessSystemApp = useSelector(selectCanAccessSystemApp);

  // Redirect the user to the set password page if they haven't set their
  // initial password yet. The user shouldn't be able to use the app until they
  // do.
  useEffect(() => {
    if (
      location.pathname !== routes.setPassword &&
      isAuthenticated &&
      isPasswordChangeRequired
    ) {
      history.push(routes.setPassword);
    }
  }, [isAuthenticated, isPasswordChangeRequired]);

  // Hide and remove the loading screen that's displayed BEFORE the JS bundle
  // is loaded
  useEffect(() => {
    const appLoaderElement = document.getElementById('app-loader');
    appLoaderElement?.classList.add('app-loader--hide');
    setTimeout(() => {
      appLoaderElement?.remove();
    }, 2000);
  }, []);

  // Set the active domain to be the same currently active domain anytime the
  // user focuses on a tab/window with the app. This will persist the domain to
  // local/session storage which allows links that are opened from this
  // tab/window to open up with the same domain.
  useEffect(() => {
    if (isWindowFocused) {
      dispatch(
        setActiveDomain({
          domain: activeDomain,
          assetSummaryTemplateFields: activeDomain?.assetSummaryTemplateFields,
          domainAdditionalInfo: activeDomain?.domainAdditionalInfo,
          themeColor: activeDomain?.themeColor,
        })
      );
      if (timezoneState.timezone) {
        dispatch(setCurrentTimezone(timezoneState.timezone));
      }
    }
  }, [isWindowFocused]);

  return (
    <div className="fade-on-enter-shorter">
      <HelmetDetails />
      <RefreshUserPermissions />
      {IS_NEW_APP_VERSION_FEATURE_ENABLED && <AppVersionChecker />}
      {/*
        Probe the session on an interval to determine if the user's session is
        still valid.
        NOTE: This is temporary and should be removed once the different
        authentication mechanism is implemented
      */}
      <SessionProbe />
      <ApplicationTimeoutDialog />

      {/* 
        Reset the FirstWelcomeDialog's state any time the userId changes. This
        makes sure the "Do not show again" checkbox in the WelcomeDialog is
        always unchecked initially.
        We also only show the dialog when the user has set their initial
        password after logging in for the first time.
      */}
      {!isPasswordChangeRequired && <FirstWelcomeDialog key={userId} />}
      <PermissionDeniedDialog />
      <MaintenanceDialog />
      <Switch>
        {/*
          We dont use `exact` here since there are nested routes for the login
          flow
        */}
        <Route path={routes.login}>
          <Login />
        </Route>
        <Route path={routes.resetPassword.base}>
          <ResetPassword />
        </Route>

        <AuthedRoute path={routes.setPassword}>
          <SetPasswordAfterLogin />
        </AuthedRoute>
        <Route>
          <MainNavigation>
            <MainContent>
              {/*
                Since nearly every part of the app is dependent on the domain,
                we only want to show the app when the domain's details have
                been fetched. This also prevents duplicate API calls when
                switching domains.
              */}
              {isFetchingActiveDomain || userPermissionsIsFetching ? (
                <FullPageLoadingOverlay />
              ) : (
                <>
                  {showConstructionBanner && <UnderConstructionBanner />}
                  <Suspense
                    fallback={<FullPageLoadingOverlay transparentBackground />}
                  >
                    <Switch>
                      <AuthedRoute path={routes.home} exact>
                        <Redirect to={opsRoutes.base} />
                      </AuthedRoute>
                      <AuthedRoute path={trainingRoutes.base}>
                        <TrainingApp />
                      </AuthedRoute>

                      {canAccessAdminApp && (
                        <AuthedRoute path={adminRoutes.base}>
                          <AdminApp />
                        </AuthedRoute>
                      )}
                      {canAccessOperationsApp && (
                        <AuthedRoute path={opsRoutes.base}>
                          <OperationsApp />
                        </AuthedRoute>
                      )}
                      {canAccessReportsApp && (
                        <AuthedRoute path={reportsRoutes.base}>
                          <ReportsApp />
                        </AuthedRoute>
                      )}
                      {canAccessFreezersApp && (
                        <AuthedRoute path={freezersRoutes.base}>
                          <FreezersApp />
                        </AuthedRoute>
                      )}
                      {canAccessSystemApp && (
                        <AuthedRoute path={systemRoutes.base}>
                          <SystemApp />
                        </AuthedRoute>
                      )}

                      <AuthedRoute>
                        {/*
                        If the user got to this point, they tried accessing
                        an invalid route, or a route that they dont have
                        permission to access. Redirect the user to the
                        first app they have access to and let that app
                        redirect appropriately.
                      */}
                        {canAccessOperationsApp ? (
                          <Redirect to={opsRoutes.base} />
                        ) : canAccessAdminApp ? (
                          <Redirect to={adminRoutes.base} />
                        ) : canAccessReportsApp ? (
                          <Redirect to={reportsRoutes.base} />
                        ) : canAccessFreezersApp ? (
                          <Redirect to={freezersRoutes.base} />
                        ) : canAccessSystemApp ? (
                          <Redirect to={systemRoutes.base} />
                        ) : (
                          <Redirect to={trainingRoutes.base} />
                        )}
                      </AuthedRoute>
                    </Switch>
                  </Suspense>
                </>
              )}
            </MainContent>
          </MainNavigation>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
