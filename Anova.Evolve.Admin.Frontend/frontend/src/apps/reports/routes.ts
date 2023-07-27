import { buildCommonRoutesFromBasePath } from 'routes-config';

const reportsBase = '/reports';

const commonRoutes = buildCommonRoutesFromBasePath(reportsBase);

const routes = {
  base: reportsBase,
  ...commonRoutes,
  reportsList: `${reportsBase}/home`,
  quickAssetCreate: `${reportsBase}/quick-asset-create`,
};

export default routes;
