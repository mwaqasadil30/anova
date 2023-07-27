import routes from 'apps/freezers/routes';
import AuthedRoute from 'components/AuthedRoute';
import CommonRoutes from 'components/CommonRoutes';
import PermissionGatedRoute from 'components/routes/PermissionGatedRoute';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Switch } from 'react-router-dom';
import {
  selectCanCreateFreezerChart,
  selectCanReadFreezerChart,
  selectCanUpdateFreezerChart,
  selectIsFreezerAppAdmin,
  selectIsFreezerAppViewer,
} from 'redux-app/modules/user/selectors';
import ChartEditor from './containers/ChartEditor';
import DefaultChartManagerList from './containers/DefaultChartManagerList';
import DefaultChartEditor from './containers/DefaultChartEditor';
import FreezerDetail from './containers/FreezerDetail';
import SiteDetail from './containers/SiteDetail';
import SiteList from './containers/SiteList';

function FreezersApp() {
  const isFreezerAppAdmin = useSelector(selectIsFreezerAppAdmin);
  const isFreezerAppViewer = useSelector(selectIsFreezerAppViewer);
  const canReadFreezerChart = useSelector(selectCanReadFreezerChart);
  const canCreateFreezerChart = useSelector(selectCanCreateFreezerChart);
  const canUpdateFreezerChart = useSelector(selectCanUpdateFreezerChart);

  return (
    <Switch>
      <AuthedRoute path={routes.base} exact>
        <Redirect to={routes.sites.list} />
      </AuthedRoute>
      <PermissionGatedRoute
        path={routes.charts.detail}
        exact
        hasPermission={canReadFreezerChart || canUpdateFreezerChart}
      >
        <ChartEditor />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.charts.create}
        exact
        hasPermission={canCreateFreezerChart}
      >
        <ChartEditor />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.freezers.detail}
        exact
        hasPermission={isFreezerAppAdmin || isFreezerAppViewer}
      >
        <FreezerDetail />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.sites.detail}
        exact
        hasPermission={isFreezerAppAdmin || isFreezerAppViewer}
      >
        <SiteDetail />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.sites.list}
        exact
        hasPermission={isFreezerAppAdmin || isFreezerAppViewer}
      >
        <SiteList />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.defaultChartManager.list}
        exact
        hasPermission={isFreezerAppAdmin}
      >
        <DefaultChartManagerList />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.defaultChartManager.create}
        exact
        hasPermission={isFreezerAppAdmin}
      >
        <DefaultChartEditor />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.defaultChartManager.edit}
        exact
        hasPermission={isFreezerAppAdmin}
      >
        <DefaultChartEditor />
      </PermissionGatedRoute>
      <CommonRoutes routes={routes} />
    </Switch>
  );
}

export default FreezersApp;
