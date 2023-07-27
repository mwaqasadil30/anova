import { buildCommonRoutesFromBasePath } from 'routes-config';

const assetConfigurationManager = '/asset-configuration-manager';
const assetTreeManager = '/asset-tree-manager';
const productManager = '/product-manager';
const siteManager = '/site-manager';
const tankDimensionsManager = '/tank-dimensions-manager';
const assetGroupManager = '/asset-group-manager';
const dataChannelManager = '/data-channel-manager';
const dataChannelManagerLegacy = '/data-channel-manager-legacy';
const pollScheduleManager = '/poll-schedule-manager';
const domainManager = '/domain-manager';
const rtuManager = '/rtu-manager';
const basePath = '/admin';
const userManager = '/user-manager';
const rosterManager = '/roster-manager';
const messageTemplateManager = '/message-template-manager';
const geofenceManager = '/geofence-manager';

export const AssetId = 'assetId';
export const AssetTreeId = 'assetTreeId';
export const ProductId = 'productId';
export const RtuDeviceId = 'rtuDeviceId';
export const SiteId = 'siteId';
export const TankDimensionId = 'tankDimensionId';
export const AssetGroupId = 'assetGroupId';
export const DataChannelId = 'dataChannelId';
export const PollScheduleId = 'pollScheduleId';
export const DomainId = 'domainId';
export const UserId = 'userId';
export const RosterId = 'rosterId';
export const MessageTemplateId = 'messageTemplateId';
export const GeofenceId = 'geofenceId';
export const tabName = 'tabName';

const commonRoutes = buildCommonRoutesFromBasePath(basePath);

const routes = {
  base: basePath,
  ...commonRoutes,
  assetManager: {
    list: `${basePath}${assetConfigurationManager}`,
    create: `${basePath}${assetConfigurationManager}/create`,
    edit: `${basePath}${assetConfigurationManager}/:${AssetId}/edit`,
    copy: `${basePath}${assetConfigurationManager}/:${AssetId}/copy`,
    transfer: `${basePath}${assetConfigurationManager}/transfer`,
    quickTankCreate: `${basePath}${assetConfigurationManager}/quick-tank-create`,
    heliumIsoContainerCreate: `${basePath}${assetConfigurationManager}/helium-iso-container-create`,
  },
  geofenceManager: {
    list: `${basePath}${geofenceManager}`,
    create: `${basePath}${geofenceManager}/create`,
    edit: `${basePath}${geofenceManager}/:${GeofenceId}/edit`,
  },
  assetTreeManager: {
    list: `${basePath}${assetTreeManager}`,
    create: `${basePath}${assetTreeManager}/create`,
    edit: `${basePath}${assetTreeManager}/:${AssetTreeId}/edit`,
  },
  productManager: {
    list: `${basePath}${productManager}`,
    create: `${basePath}${productManager}/create`,
    edit: `${basePath}${productManager}/:${ProductId}/edit`,
  },
  rtuManager: {
    list: `${basePath}${rtuManager}`,
    create: `${basePath}${rtuManager}/create`,
    edit: `${basePath}${rtuManager}/:${RtuDeviceId}/edit/:${tabName}`,
    aiChannelsEdit: `${basePath}${rtuManager}/:${RtuDeviceId}/aichannels-edit`,
    tChannelsEdit: `${basePath}${rtuManager}/:${RtuDeviceId}/tchannels-edit`,
  },
  siteManager: {
    list: `${basePath}${siteManager}`,
    create: `${basePath}${siteManager}/create`,
    edit: `${basePath}${siteManager}/:${SiteId}/edit`,
  },
  tankDimensionManager: {
    list: `${basePath}${tankDimensionsManager}`,
    create: `${basePath}${tankDimensionsManager}/create`,
    edit: `${basePath}${tankDimensionsManager}/:${TankDimensionId}/edit`,
  },
  assetGroupManager: {
    list: `${basePath}${assetGroupManager}`,
    create: `${basePath}${assetGroupManager}/create`,
    edit: `${basePath}${assetGroupManager}/:${AssetGroupId}/edit`,
  },
  dataChannelManager: {
    list: `${basePath}${dataChannelManager}`,
    create: `${basePath}${dataChannelManager}/create`,
    edit: `${basePath}${dataChannelManager}/:${DataChannelId}/edit`,
    eventEdit: `${basePath}${dataChannelManager}/:${DataChannelId}/edit/event-edit`,
  },
  dataChannelManagerLegacy: {
    list: `${basePath}${dataChannelManagerLegacy}`,
    create: `${basePath}${dataChannelManagerLegacy}/create`,
    edit: `${basePath}${dataChannelManagerLegacy}/:${DataChannelId}/edit`,
  },
  pollScheduleManager: {
    list: `${basePath}${pollScheduleManager}`,
    create: `${basePath}${pollScheduleManager}/create`,
    edit: `${basePath}${pollScheduleManager}/:${PollScheduleId}/edit`,
  },
  domainManager: {
    list: `${basePath}${domainManager}`,
    create: `${basePath}${domainManager}/create`,
    edit: `${basePath}${domainManager}/:${DomainId}/edit`,
    notes: `${basePath}${domainManager}/:${DomainId}/notes`,
  },
  eventManager: {
    list: `${basePath}/events`,
  },
  userManager: {
    list: `${basePath}${userManager}`,
    create: `${basePath}${userManager}/create`,
    edit: `${basePath}${userManager}/:${UserId}/edit`,
  },
  rosterManager: {
    list: `${basePath}${rosterManager}`,
    create: `${basePath}${rosterManager}/create`,
    edit: `${basePath}${rosterManager}/:${RosterId}/edit`,
  },
  messageTemplateManager: {
    list: `${basePath}${messageTemplateManager}`,
    create: `${basePath}${messageTemplateManager}/create`,
    edit: `${basePath}${messageTemplateManager}/:${MessageTemplateId}/edit`,
  },
};

export const tabsMap = {
  [routes.assetManager.list]: routes.assetManager.list,
  [routes.assetTreeManager.list]: routes.assetManager.list,
  [routes.productManager.list]: routes.assetManager.list,
  [routes.rtuManager.list]: routes.assetManager.list,
  [routes.siteManager.list]: routes.assetManager.list,
  [routes.tankDimensionManager.list]: routes.assetManager.list,
  [routes.assetGroupManager.list]: routes.assetManager.list,
  [routes.dataChannelManager.list]: routes.assetManager.list,
  [routes.dataChannelManagerLegacy.list]: routes.assetManager.list,
  [routes.pollScheduleManager.list]: routes.assetManager.list,
  [routes.domainManager.list]: routes.domainManager.list,
  [routes.userManager.list]: routes.userManager.list,
  [routes.rosterManager.list]: routes.eventManager.list,
  [routes.messageTemplateManager.list]: routes.eventManager.list,
  [routes.geofenceManager.list]: routes.eventManager.list,
};

export default routes;
