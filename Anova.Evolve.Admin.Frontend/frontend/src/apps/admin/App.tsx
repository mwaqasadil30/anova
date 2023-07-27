import { UserPermissionType } from 'api/admin/api';
import routes from 'apps/admin/routes';
import opsRoutes from 'apps/ops/routes';
import CommonRoutes from 'components/CommonRoutes';
import PermissionGatedRoute from 'components/routes/PermissionGatedRoute';
import AssetCopy from 'containers/AssetCopy';
import AssetEditor from 'containers/AssetEditor';
import AssetGroupEditor from 'containers/AssetGroupEditor';
import AssetGroupList from 'containers/AssetGroupList';
import AssetManagerList from 'containers/AssetManagerList';
import AssetTreeEditor from 'containers/AssetTreeEditor';
import AssetTreeManagerList from 'containers/AssetTreeManager';
import DataChannelEditor from 'containers/DataChannelEditor';
import DataChannelEditorLegacy from 'containers/DataChannelEditorLegacy';
import DataChannelManagerList from 'containers/DataChannelManagerList';
import DomainEditor from 'containers/DomainEditor';
import DomainList from 'containers/DomainList';
import DomainNoteViewer from 'containers/DomainNoteViewer';
import GeofenceEditor from 'containers/GeofenceEditor';
import GeofenceManagerList from 'containers/GeofenceManagerList';
import HeliumISOContainerCreate from 'containers/HeliumISOContainerCreate';
import MessageTemplateEditor from 'containers/MessageTemplateEditor';
import MessageTemplateManagerList from 'containers/MessageTemplateManagerList';
import PollScheduleEditor from 'containers/PollScheduleEditor';
import PollScheduleManagerList from 'containers/PollScheduleManager';
import ProductEditorWrapper from 'containers/ProductEditorWrapper';
import ProductManagerList from 'containers/ProductManagerList';
import QuickTankCreate from 'containers/QuickTankCreate';
import RosterEditor from 'containers/RosterEditor';
import RosterManagerList from 'containers/RosterManagerList';
import RTUManagerList from 'containers/RTUManagerList';
import RTUEditor from 'containers/RTUEditor';
import SiteEditorWrapper from 'containers/SiteEditorWrapper';
import SiteManagerList from 'containers/SiteManagerList';
import TankDimensionEditorWrapper from 'containers/TankDimensionEditorWrapper';
import TankDimensionManagerList from 'containers/TankDimensionManagerList';
import TransferAsset from 'containers/TransferAsset';
import UserEditorBase from 'containers/UserEditorBase';
import UserManagerList from 'containers/UserManagerList';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { selectActiveDomainHasIsoContainers } from 'redux-app/modules/app/selectors';
import {
  selectCanAccessAdminDataChannelEditor,
  selectCanAccessRtuEditor,
  selectCanCreateGeofences,
  selectCanReadDataChannel,
  selectCanReadGeofences,
  selectCanUpdateGeofences,
  selectFirstAccessibleAdminRouteByPermission,
  selectHasPermission,
  selectIsSystemAdminOrWhitelisted,
} from 'redux-app/modules/user/selectors';
import { AccessType } from 'types';
import RtuAiChannelsEditor from 'containers/RtuAiChannelsEditor';
import RtuTChannelsEditor from 'containers/RtuTChannelsEditor';

function AdminApp() {
  const domainHasIsoContainers = useSelector(
    selectActiveDomainHasIsoContainers
  );

  // Some of the permissions and routes below are checking if the user is a
  // system admin since we're slowly rolling out certain pages to non-system
  // admins. Non-system admins should NOT be able to access the pages that
  // haven't been rolled out, even if they do have the associated permission.
  const isSystemAdminOrWhitelisted = useSelector(
    selectIsSystemAdminOrWhitelisted
  );
  const hasPermission = useSelector(selectHasPermission);

  // Permissions for pages that have been rolled out
  // Pages under the "Asset" primary nav item
  const canReadDataChannel = useSelector(selectCanReadDataChannel);
  const canAccessDataChannelEditor = useSelector(
    selectCanAccessAdminDataChannelEditor
  );
  const canAccessRtuEditor = useSelector(selectCanAccessRtuEditor);
  const canCreateSite = hasPermission(
    UserPermissionType.SiteGlobal,
    AccessType.Create
  );
  const canReadSite = hasPermission(
    UserPermissionType.SiteGlobal,
    AccessType.Read
  );
  const canUpdateSite = hasPermission(
    UserPermissionType.SiteGlobal,
    AccessType.Update
  );
  const canCreateTankDimension = hasPermission(
    UserPermissionType.TankDimensionAccess,
    AccessType.Create
  );
  const canAccessRtuManagerList = hasPermission(
    UserPermissionType.AdministrationTabRTU
  );
  const canReadTankDimension = hasPermission(
    UserPermissionType.TankDimensionAccess,
    AccessType.Read
  );
  const canUpdateTankDimension = hasPermission(
    UserPermissionType.TankDimensionAccess,
    AccessType.Update
  );
  const canCreateProduct = hasPermission(
    UserPermissionType.ProductAccess,
    AccessType.Create
  );
  const canReadProduct = hasPermission(
    UserPermissionType.ProductAccess,
    AccessType.Read
  );
  const canUpdateProduct = hasPermission(
    UserPermissionType.ProductAccess,
    AccessType.Update
  );
  const canCreatePollSchedule = hasPermission(
    UserPermissionType.RTUPollSchedule,
    AccessType.Create
  );
  const canReadPollSchedule = hasPermission(
    UserPermissionType.RTUPollSchedule,
    AccessType.Read
  );
  const canUpdatePollSchedule = hasPermission(
    UserPermissionType.RTUPollSchedule,
    AccessType.Update
  );
  const canCreateAssetGroup = hasPermission(
    UserPermissionType.AssetGroupAccess,
    AccessType.Create
  );
  const canReadAssetGroup = hasPermission(
    UserPermissionType.AssetGroupAccess,
    AccessType.Read
  );
  const canUpdateAssetGroup = hasPermission(
    UserPermissionType.AssetGroupAccess,
    AccessType.Update
  );
  const canCreateAssetTree = hasPermission(
    UserPermissionType.AssetTreeAccess,
    AccessType.Create
  );
  const canReadAssetTree = hasPermission(
    UserPermissionType.AssetTreeAccess,
    AccessType.Read
  );
  const canUpdateAssetTree = hasPermission(
    UserPermissionType.AssetTreeAccess,
    AccessType.Update
  );
  // Pages under the "Domains" primary nav item
  const canCreateUser = hasPermission(
    UserPermissionType.UserGeneral,
    AccessType.Create
  );
  const canReadUser = hasPermission(
    UserPermissionType.UserGeneral,
    AccessType.Read
  );
  const canUpdateUser = hasPermission(
    UserPermissionType.UserGeneral,
    AccessType.Update
  );
  // Pages under the "Events" primary nav item
  const canReadRoster = hasPermission(
    UserPermissionType.EventRosters,
    AccessType.Read
  );
  const canCreateRoster = hasPermission(
    UserPermissionType.EventRosters,
    AccessType.Create
  );
  const canUpdateRoster = hasPermission(
    UserPermissionType.EventRosters,
    AccessType.Update
  );
  const canReadMessageTemplate = hasPermission(
    UserPermissionType.EventMessageTemplates,
    AccessType.Read
  );
  const canCreateMessageTemplate = hasPermission(
    UserPermissionType.EventMessageTemplates,
    AccessType.Create
  );
  const canUpdateMessageTemplate = hasPermission(
    UserPermissionType.EventMessageTemplates,
    AccessType.Update
  );
  const canReadGeofence = useSelector(selectCanReadGeofences);
  const canCreateGeofence = useSelector(selectCanCreateGeofences);
  const canUpdateGeofence = useSelector(selectCanUpdateGeofences);

  // Permissions for pages that have NOT been rolled out
  const canCreateAsset =
    isSystemAdminOrWhitelisted &&
    hasPermission(UserPermissionType.AssetGlobal, AccessType.Create);

  const firstAccessibleAdminRouteByPermission = useSelector(
    selectFirstAccessibleAdminRouteByPermission
  );

  return (
    <Switch>
      <Route path={routes.base} exact>
        {firstAccessibleAdminRouteByPermission ? (
          <Redirect to={firstAccessibleAdminRouteByPermission} />
        ) : (
          // Redirect to the Ops app if the user can't access any admin pages
          <Redirect to={opsRoutes.base} />
        )}
      </Route>
      <PermissionGatedRoute
        path={routes.assetManager.list}
        exact
        hasPermission={isSystemAdminOrWhitelisted}
      >
        <AssetManagerList />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.assetManager.create}
        exact
        hasPermission={isSystemAdminOrWhitelisted}
      >
        <AssetEditor />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.assetManager.edit}
        exact
        hasPermission={isSystemAdminOrWhitelisted}
      >
        <AssetEditor />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.assetManager.copy}
        exact
        hasPermission={isSystemAdminOrWhitelisted}
      >
        <AssetCopy />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.assetManager.transfer}
        exact
        hasPermission={isSystemAdminOrWhitelisted}
      >
        <TransferAsset />
      </PermissionGatedRoute>

      <PermissionGatedRoute
        path={routes.productManager.edit}
        exact
        hasPermission={canReadProduct || canUpdateProduct}
      >
        <ProductEditorWrapper />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.productManager.create}
        exact
        hasPermission={canCreateProduct}
      >
        <ProductEditorWrapper />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.productManager.list}
        exact
        hasPermission={canReadProduct}
      >
        <ProductManagerList />
      </PermissionGatedRoute>

      {canAccessRtuManagerList && (
        <PermissionGatedRoute
          path={routes.rtuManager.list}
          exact
          hasPermission={canAccessRtuManagerList}
        >
          <RTUManagerList />
        </PermissionGatedRoute>
      )}

      {canAccessRtuEditor && (
        <PermissionGatedRoute
          path={routes.rtuManager.edit}
          exact
          hasPermission={canAccessRtuEditor}
        >
          <RTUEditor />
        </PermissionGatedRoute>
      )}
      {canAccessRtuEditor && (
        <PermissionGatedRoute
          path={routes.rtuManager.aiChannelsEdit}
          exact
          hasPermission={canAccessRtuEditor}
        >
          <RtuAiChannelsEditor />
        </PermissionGatedRoute>
      )}
      {canAccessRtuEditor && (
        <PermissionGatedRoute
          path={routes.rtuManager.tChannelsEdit}
          exact
          hasPermission={canAccessRtuEditor}
        >
          <RtuTChannelsEditor />
        </PermissionGatedRoute>
      )}

      <PermissionGatedRoute
        path={routes.assetTreeManager.list}
        exact
        hasPermission={canReadAssetTree}
      >
        <AssetTreeManagerList />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.assetTreeManager.create}
        exact
        hasPermission={canCreateAssetTree}
      >
        <AssetTreeEditor />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.assetTreeManager.edit}
        exact
        hasPermission={canReadAssetTree || canUpdateAssetTree}
      >
        <AssetTreeEditor />
      </PermissionGatedRoute>

      <PermissionGatedRoute
        path={routes.geofenceManager.list}
        exact
        hasPermission={canReadGeofence}
      >
        <GeofenceManagerList />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.geofenceManager.create}
        exact
        hasPermission={canCreateGeofence}
      >
        <GeofenceEditor />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.geofenceManager.edit}
        exact
        hasPermission={canReadGeofence || canUpdateGeofence}
      >
        <GeofenceEditor />
      </PermissionGatedRoute>

      <PermissionGatedRoute
        path={routes.tankDimensionManager.list}
        exact
        hasPermission={canReadTankDimension}
      >
        <TankDimensionManagerList />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.tankDimensionManager.edit}
        exact
        hasPermission={canReadTankDimension || canUpdateTankDimension}
      >
        <TankDimensionEditorWrapper />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.tankDimensionManager.create}
        exact
        hasPermission={canCreateTankDimension}
      >
        <TankDimensionEditorWrapper />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.siteManager.create}
        exact
        hasPermission={canCreateSite}
      >
        <SiteEditorWrapper />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.siteManager.edit}
        exact
        // NOTE: Having the Create permission automatically infers
        // Read and Update access
        hasPermission={canReadSite || canUpdateSite}
      >
        <SiteEditorWrapper />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.siteManager.list}
        exact
        // NOTE: Having the Create or Update permissions automatically infer
        // Read access
        hasPermission={canReadSite}
      >
        <SiteManagerList />
      </PermissionGatedRoute>

      <PermissionGatedRoute
        path={routes.assetGroupManager.list}
        exact
        hasPermission={canReadAssetGroup}
      >
        <AssetGroupList />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.assetGroupManager.create}
        exact
        hasPermission={canCreateAssetGroup}
      >
        <AssetGroupEditor />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.assetGroupManager.edit}
        exact
        hasPermission={canReadAssetGroup || canUpdateAssetGroup}
      >
        <AssetGroupEditor />
      </PermissionGatedRoute>

      {canAccessDataChannelEditor && (
        <PermissionGatedRoute
          path={routes.dataChannelManager.edit}
          hasPermission={canAccessDataChannelEditor}
        >
          <DataChannelEditor />
        </PermissionGatedRoute>
      )}
      {/* TODO: Soon to be removed/deprecated. */}
      <PermissionGatedRoute
        path={routes.dataChannelManagerLegacy.edit}
        exact
        hasPermission={isSystemAdminOrWhitelisted}
      >
        <DataChannelEditorLegacy />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.dataChannelManager.list}
        exact
        hasPermission={canReadDataChannel}
      >
        <DataChannelManagerList />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.pollScheduleManager.list}
        exact
        hasPermission={canReadPollSchedule}
      >
        <PollScheduleManagerList />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.pollScheduleManager.create}
        exact
        hasPermission={canCreatePollSchedule}
      >
        <PollScheduleEditor />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.pollScheduleManager.edit}
        exact
        hasPermission={canReadPollSchedule || canUpdatePollSchedule}
      >
        <PollScheduleEditor />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.assetManager.quickTankCreate}
        exact
        hasPermission={canCreateAsset}
      >
        <QuickTankCreate />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.assetManager.heliumIsoContainerCreate}
        exact
        hasPermission={canCreateAsset && domainHasIsoContainers}
      >
        <HeliumISOContainerCreate />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.domainManager.list}
        exact
        hasPermission={isSystemAdminOrWhitelisted}
      >
        <DomainList />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.domainManager.create}
        exact
        hasPermission={isSystemAdminOrWhitelisted}
      >
        <DomainEditor />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.domainManager.edit}
        exact
        hasPermission={isSystemAdminOrWhitelisted}
      >
        <DomainEditor />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.domainManager.notes}
        exact
        hasPermission={isSystemAdminOrWhitelisted}
      >
        <DomainNoteViewer />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.userManager.list}
        exact
        // NOTE: Having the Create or Update permissions automatically infer
        // Read access
        hasPermission={canReadUser}
      >
        <UserManagerList />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.userManager.create}
        exact
        hasPermission={canCreateUser}
      >
        <UserEditorBase />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.userManager.edit}
        exact
        hasPermission={canReadUser || canUpdateUser}
      >
        <UserEditorBase />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.rosterManager.create}
        exact
        hasPermission={canCreateRoster}
      >
        <RosterEditor />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.rosterManager.edit}
        exact
        hasPermission={canReadRoster || canUpdateRoster}
      >
        <RosterEditor />
      </PermissionGatedRoute>

      <PermissionGatedRoute
        path={routes.rosterManager.list}
        exact
        // NOTE: Having the Create or Update permissions automatically infer
        // Read access
        hasPermission={canReadRoster}
      >
        <RosterManagerList />
      </PermissionGatedRoute>

      <PermissionGatedRoute
        path={routes.messageTemplateManager.create}
        exact
        hasPermission={canCreateMessageTemplate}
      >
        <MessageTemplateEditor />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.messageTemplateManager.edit}
        exact
        hasPermission={canReadMessageTemplate || canUpdateMessageTemplate}
      >
        <MessageTemplateEditor />
      </PermissionGatedRoute>
      <PermissionGatedRoute
        path={routes.messageTemplateManager.list}
        exact
        // NOTE: Having the Create or Update permissions automatically infer
        // Read access
        hasPermission={canReadMessageTemplate}
      >
        <MessageTemplateManagerList />
      </PermissionGatedRoute>

      <CommonRoutes routes={routes} />
    </Switch>
  );
}

export default AdminApp;
