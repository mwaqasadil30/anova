import routes from 'apps/training/routes';
import AuthedRoute from 'components/AuthedRoute';
import CommonRoutes from 'components/CommonRoutes';
import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import TrainingVideoDetail from './containers/TrainingVideoDetail';
import TrainingVideoList from './containers/TrainingVideoList';

function TrainingApp() {
  return (
    <Switch>
      <AuthedRoute path={routes.base} exact>
        <Redirect to={routes.list} />
      </AuthedRoute>
      <AuthedRoute path={routes.list} exact>
        <TrainingVideoList />
      </AuthedRoute>
      <AuthedRoute path={routes.detail} exact>
        <TrainingVideoDetail />
      </AuthedRoute>
      <CommonRoutes routes={routes} />
    </Switch>
  );
}

export default TrainingApp;
