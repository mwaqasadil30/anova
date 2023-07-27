import { UserPermissionType } from 'api/admin/api';
import routes from 'apps/ops/routes';
import AuthedRoute from 'components/AuthedRoute';
import CommonRoutes from 'components/CommonRoutes';
import PermissionGatedRoute from 'components/routes/PermissionGatedRoute';
import { IS_ASSET_MAP_FEATURE_ENABLED } from 'env';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Switch } from 'react-router-dom';
import {
  selectCanViewProblemReportsTab,
  selectHasPermission,
} from 'redux-app/modules/user/selectors';
import { AccessType } from 'types';
import AssetDetail from './containers/AssetDetail';
import AssetMap from './containers/AssetMap';
import AssetSummary from './containers/AssetSummary';
import AssetSummaryLegacy from './containers/AssetSummaryLegacy';
import EventDetail from './containers/EventDetail';
import EventsSummaryListWithUserSettings from './containers/EventsSummaryList';
import ProblemReportsCreator from './containers/ProblemReportsCreator';
import ProblemReportsEditor from './containers/ProblemReportsEditor';
import ProblemReportsList from './containers/ProblemReportsList';

function OpsApp() {
  // const canAccessDashboard = useSelector(selectIsUserSystemAdminOrSystemUser);
  const hasPermission = useSelector(selectHasPermission);

  const canViewAssetSummaryTab = hasPermission(
    UserPermissionType.ViewTabAssetSummary
  );
  const canViewMap =
    IS_ASSET_MAP_FEATURE_ENABLED &&
    hasPermission(UserPermissionType.MiscellaneousFeatureViewMap);

  const canViewEventsTab = hasPermission(UserPermissionType.ViewTabEvents);

  const canViewProblemReportsTab = useSelector(selectCanViewProblemReportsTab);

  const canAccessProblemReportEditor =
    hasPermission(
      UserPermissionType.ProblemReportEditorAccess,
      AccessType.Create
    ) && canViewProblemReportsTab;

  return (
    <>
      <Switch>
        <AuthedRoute path={routes.base} exact>
          {canViewAssetSummaryTab ? (
            <Redirect to={routes.assetSummary.list} />
          ) : canViewEventsTab ? (
            <Redirect to={routes.events.list} />
          ) : (
            <Redirect to={routes.assetMap.list} />
          )}
        </AuthedRoute>
        <AuthedRoute path={routes.dashboard.home} exact>
          {/* {canAccessDashboard ? (
            <Dashboard />
          ) : (
            <Redirect to={routes.assetSummary.list} />
          )} */}
          <Redirect to={routes.assetSummary.list} />
        </AuthedRoute>
        <PermissionGatedRoute
          path={routes.assetSummary.detail}
          hasPermission={canViewAssetSummaryTab}
        >
          <AssetDetail />
        </PermissionGatedRoute>
        <PermissionGatedRoute
          path={routes.assetMap.list}
          exact
          hasPermission={canViewMap}
        >
          <AssetMap />
        </PermissionGatedRoute>
        <PermissionGatedRoute
          path={routes.assetSummary.listVersion2}
          hasPermission={canViewAssetSummaryTab}
          exact
        >
          <AssetSummaryLegacy />
        </PermissionGatedRoute>
        <PermissionGatedRoute
          path={routes.assetSummary.list}
          hasPermission={canViewAssetSummaryTab}
          exact
        >
          <AssetSummary />
        </PermissionGatedRoute>
        <PermissionGatedRoute
          path={routes.events.list}
          hasPermission={canViewEventsTab}
          exact
        >
          <EventsSummaryListWithUserSettings />
        </PermissionGatedRoute>
        <AuthedRoute path={routes.events.detail} exact>
          <EventDetail />
        </AuthedRoute>
        <PermissionGatedRoute
          path={routes.problemReports.list}
          hasPermission={canViewProblemReportsTab}
          exact
        >
          <ProblemReportsList />
        </PermissionGatedRoute>
        <PermissionGatedRoute
          path={routes.problemReports.create}
          hasPermission={canAccessProblemReportEditor}
          exact
        >
          <ProblemReportsCreator />
        </PermissionGatedRoute>
        <PermissionGatedRoute
          path={routes.problemReports.edit}
          hasPermission={canViewProblemReportsTab}
          exact
        >
          <ProblemReportsEditor />
        </PermissionGatedRoute>
        <CommonRoutes routes={routes} />
      </Switch>
    </>
  );
}

export default OpsApp;
