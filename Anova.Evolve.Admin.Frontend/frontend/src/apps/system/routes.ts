import { buildCommonRoutesFromBasePath } from 'routes-config';

const systemBase = '/system';
const search = '/search';
const readingService = '/reading-service';
const customerMessages = '/customer-messages';

const commonRoutes = buildCommonRoutesFromBasePath(systemBase);

const routes = {
  base: systemBase,
  ...commonRoutes,
  search: `${systemBase}${search}`,
  readingService: `${systemBase}${readingService}`,
  customerMessages: `${systemBase}${customerMessages}`,
};

export const tabsMap = {
  [routes.search]: routes.search,
  [routes.readingService]: routes.readingService,
  [routes.customerMessages]: routes.customerMessages,
};

export default routes;
