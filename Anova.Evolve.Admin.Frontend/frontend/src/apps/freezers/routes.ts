import { buildCommonRoutesFromBasePath } from 'routes-config';

const freezersBase = '/freezers-app';
const sites = '/sites';
const languagePath = '/language';
const defaultChartManager = '/default-chart-manager';
const defaultChartId = 'defaultChartId';

const commonRoutes = buildCommonRoutesFromBasePath(freezersBase);

const routes = {
  base: freezersBase,
  ...commonRoutes,
  language: `${freezersBase}${languagePath}`,
  sites: {
    list: `${freezersBase}${sites}`,
    detail: `${freezersBase}${sites}/:siteId`,
  },
  freezers: {
    detail: `${freezersBase}${sites}/freezers/:freezerId`,
  },
  charts: {
    // TODO: May want to include the freezer ID in the URL when creating a
    // chart since it seems like you can only create charts for freezers.
    create: `${freezersBase}${sites}/freezers/:freezerId/charts/create`,
    detail: `${freezersBase}${sites}/freezers/:freezerId/charts/:chartId/edit`,
  },
  defaultChartManager: {
    list: `${freezersBase}${defaultChartManager}`,
    create: `${freezersBase}${defaultChartManager}/create`,
    edit: `${freezersBase}${defaultChartManager}/:${defaultChartId}/edit`,
  },
};

export default routes;
export const tabsMap = {
  [routes.sites.list]: routes.sites.list,
  [routes.defaultChartManager.list]: routes.defaultChartManager.list,
};
