import routes from 'apps/system/routes';
import AuthedRoute from 'components/AuthedRoute';
import CommonRoutes from 'components/CommonRoutes';
import PermissionGatedRoute from 'components/routes/PermissionGatedRoute';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Switch } from 'react-router-dom';
import { selectCanAccessSystemSearch } from 'redux-app/modules/user/selectors';
import SearchPage from './containers/SearchPage';

function SystemApp() {
  const canAccessSystemSearch = useSelector(selectCanAccessSystemSearch);

  return (
    <Switch>
      <AuthedRoute path={routes.base} exact>
        <Redirect to={routes.search} />
      </AuthedRoute>
      <PermissionGatedRoute
        path={routes.search}
        exact
        hasPermission={canAccessSystemSearch}
      >
        <SearchPage />
      </PermissionGatedRoute>
      <CommonRoutes routes={routes} />
    </Switch>
  );
}

export default SystemApp;
