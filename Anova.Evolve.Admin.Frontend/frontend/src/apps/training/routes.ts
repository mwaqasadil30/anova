import { buildCommonRoutesFromBasePath } from 'routes-config';

const trainingBase = '/training';

const commonRoutes = buildCommonRoutesFromBasePath(trainingBase);

const routes = {
  base: trainingBase,
  ...commonRoutes,
  list: `${trainingBase}/videos`,
  detail: `${trainingBase}/videos/:slug`,
};

export default routes;
