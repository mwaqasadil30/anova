import { buildCommonRoutesFromBasePath } from 'routes-config';

const opsBase = '/ops';
const assetSummary = '/asset-summary';
const dashboardHome = '/dashboard';
const events = '/events';
const problemReports = '/problem-reports';
const bell = '/bell';
const problemReportId = 'problemReportId';

export const AssetId = 'assetId';
export const DataChannelId = 'dataChannelId';

const commonRoutes = buildCommonRoutesFromBasePath(opsBase);

const routes = {
  base: opsBase,
  ...commonRoutes,
  assetMap: {
    list: `${opsBase}/asset-map`,
  },
  dashboard: {
    home: `${opsBase}${dashboardHome}`,
    list: `${opsBase}${dashboardHome}/list`,
  },
  assetSummary: {
    list: `${opsBase}${assetSummary}`,
    listVersion2: `${opsBase}${assetSummary}/v2`,
    detail: `${opsBase}${assetSummary}/:${AssetId}/detail`,
    detailQuickEditEvents: `${opsBase}${assetSummary}/:${AssetId}/detail/quick-edit-events`,
    create: `${opsBase}${assetSummary}/create`,
  },
  events: {
    list: `${opsBase}${events}`,
    create: `${opsBase}${events}/create`,
    detail: `${opsBase}${events}/:eventId`,
  },
  problemReports: {
    list: `${opsBase}${problemReports}`,
    create: `${opsBase}${problemReports}/:${DataChannelId}/create`,
    edit: `${opsBase}${problemReports}/:${problemReportId}/edit`,
  },
  bell: {
    list: `${opsBase}${bell}`,
    create: `${opsBase}${bell}/create`,
  },
};

export default routes;
export const tabsMap = {
  [routes.assetSummary.list]: routes.assetSummary.list,
  [routes.assetMap.list]: routes.assetMap.list,
  [routes.events.list]: routes.events.list,
  [routes.problemReports.list]: routes.problemReports.list,
  [routes.bell.list]: routes.bell.list,
  [routes.dashboard.home]: routes.dashboard.home,
};
