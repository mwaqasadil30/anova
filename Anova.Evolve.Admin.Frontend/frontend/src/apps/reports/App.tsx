import routes from 'apps/reports/routes';
import AuthedRoute from 'components/AuthedRoute';
import CommonRoutes from 'components/CommonRoutes';
import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import QuickTankCreate from './containers/QuickAssetCreateReport';
import ReportsList from './containers/ReportsList';

function ReportsApp() {
  return (
    <>
      <Switch>
        <AuthedRoute path={routes.base} exact>
          <Redirect to={routes.reportsList} />
        </AuthedRoute>
        <AuthedRoute path={routes.reportsList} exact>
          <ReportsList />
        </AuthedRoute>
        <AuthedRoute path={routes.quickAssetCreate} exact>
          <QuickTankCreate />
        </AuthedRoute>
        <CommonRoutes routes={routes} />
      </Switch>
    </>
  );
}

export default ReportsApp;
