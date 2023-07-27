import adminRoutes from 'apps/admin/routes';
import opsRoutes from 'apps/ops/routes';
import reportsRoutes from 'apps/reports/routes';
import freezersRoutes from 'apps/freezers/routes';
import systemRoutes from 'apps/system/routes';
import trainingRoutes from 'apps/training/routes';
import { matchPath } from 'react-router';
import routes from 'routes-config';
import { Application } from 'types/index';

export const getAppForPathname = (pathname: string) => {
  if (pathname.startsWith(adminRoutes.base)) {
    return Application.Administration;
  }
  if (pathname.startsWith(opsRoutes.base)) {
    return Application.Operations;
  }
  if (pathname.startsWith(reportsRoutes.base)) {
    return Application.Reports;
  }
  if (pathname.startsWith(trainingRoutes.base)) {
    return Application.Training;
  }
  if (pathname.startsWith(freezersRoutes.base)) {
    return Application.Freezers;
  }
  if (pathname.startsWith(systemRoutes.base)) {
    return Application.System;
  }
  return null;
};

const adminRouteToTitleMapping = {
  [adminRoutes.language]: 'Admin - Language',
  [adminRoutes.releaseNotes]: 'Admin - Release Notes',
  [adminRoutes.assetManager.list]: 'Admin - Asset Config List',
  [adminRoutes.assetManager.create]: 'Admin - Add Asset',
  [adminRoutes.assetManager.edit]: 'Admin - Edit Asset',
  [adminRoutes.assetManager.copy]: 'Admin - Copy Asset',
  [adminRoutes.assetManager.transfer]: 'Admin - Transfer Asset',
  [adminRoutes.assetManager.quickTankCreate]: 'Admin - Quick Tank Create',
  [adminRoutes.assetManager.heliumIsoContainerCreate]:
    'Admin - Add Helium ISO Container',

  [adminRoutes.assetTreeManager.list]: 'Admin - Asset Tree List',
  [adminRoutes.assetTreeManager.create]: 'Admin - Add Asset Tree',
  [adminRoutes.assetTreeManager.edit]: 'Admin - Edit Asset Tree',

  [adminRoutes.productManager.list]: 'Admin - Product List',
  [adminRoutes.productManager.create]: 'Admin - Add Product',
  [adminRoutes.productManager.edit]: 'Admin - Edit Product',

  [adminRoutes.rtuManager.list]: 'Admin - RTU Manager List',
  [adminRoutes.rtuManager.create]: 'Admin - Add RTU',
  [adminRoutes.rtuManager.edit]: 'Admin - Edit RTU',
  [adminRoutes.rtuManager.aiChannelsEdit]: 'Admin - Edit AI Channels',

  [adminRoutes.siteManager.list]: 'Admin - Site List',
  [adminRoutes.siteManager.create]: 'Admin - Add Site',
  [adminRoutes.siteManager.edit]: 'Admin - Edit Site',

  [adminRoutes.tankDimensionManager.list]: 'Admin - Tank Dimension List',
  [adminRoutes.tankDimensionManager.create]: 'Admin - Add Tank Dimensions',
  [adminRoutes.tankDimensionManager.edit]: 'Admin - Edit Tank Dimensions',

  [adminRoutes.assetGroupManager.list]: 'Admin - Asset Group List',
  [adminRoutes.assetGroupManager.create]: 'Admin - Add Asset Group',
  [adminRoutes.assetGroupManager.edit]: 'Admin - Edit Asset Group',

  [adminRoutes.dataChannelManagerLegacy.list]:
    'Admin - Data Channel List (Legacy)',
  [adminRoutes.dataChannelManagerLegacy.create]:
    'Admin - Add Data Channel (Legacy)',
  [adminRoutes.dataChannelManagerLegacy.edit]:
    'Admin - Edit Data Channel (Legacy)',

  [adminRoutes.dataChannelManager.list]: 'Admin - Data Channel List',
  [adminRoutes.dataChannelManager.create]: 'Admin - Add Data Channel',
  [adminRoutes.dataChannelManager.edit]: 'Admin - Edit Data Channel',

  [adminRoutes.pollScheduleManager.list]: 'Admin - Poll Schedule List',
  [adminRoutes.pollScheduleManager.create]: 'Admin - Add Poll Schedule',
  [adminRoutes.pollScheduleManager.edit]: 'Admin - Edit Poll Schedule',

  [adminRoutes.domainManager.list]: 'Admin - Domain List',
  [adminRoutes.domainManager.create]: 'Admin - Add Domain',
  [adminRoutes.domainManager.edit]: 'Admin - Edit Domain',

  [adminRoutes.userManager.list]: 'Admin - User List',
  [adminRoutes.userManager.create]: 'Admin - Add User',
  [adminRoutes.userManager.edit]: 'Admin - Edit User',

  [adminRoutes.rosterManager.list]: 'Admin - Roster List',
  [adminRoutes.rosterManager.create]: 'Admin - Add Roster',
  [adminRoutes.rosterManager.edit]: 'Admin - Edit Roster',

  [adminRoutes.messageTemplateManager.list]: 'Admin - Message Template List',
  [adminRoutes.messageTemplateManager.create]: 'Admin - Add Message Template',
  [adminRoutes.messageTemplateManager.edit]: 'Admin - Edit Message Template',

  [adminRoutes.geofenceManager.list]: 'Admin - Geofence List',
  [adminRoutes.geofenceManager.create]: 'Admin - Add Geofence',
  [adminRoutes.geofenceManager.edit]: 'Admin - Edit Geofence',
};

const opsRouteToTitleMapping = {
  [opsRoutes.language]: 'Ops - Language',
  [opsRoutes.releaseNotes]: 'Ops - Release Notes',

  [opsRoutes.dashboard.home]: 'Ops - Dashboard',

  [opsRoutes.assetSummary.list]: 'Ops - Asset Summary',
  [opsRoutes.assetSummary.detail]: 'Ops - Asset Details',
  [opsRoutes.assetSummary.detailQuickEditEvents]:
    'Ops - Asset Details - Quick Edit Events',

  [opsRoutes.events.list]: 'Ops - Event List',
  [opsRoutes.events.detail]: 'Ops - Event Details',

  [opsRoutes.assetMap.list]: 'Ops - Asset Map',

  [opsRoutes.problemReports.list]: 'Ops - Problem Reports',
  [opsRoutes.problemReports.create]: 'Ops - Problem Report Create',
  [opsRoutes.problemReports.edit]: 'Ops - Problem Report Details',
};

const trainingRouteToTitleMapping = {
  [trainingRoutes.language]: 'Training Hub - Language',
  [trainingRoutes.releaseNotes]: 'Training Hub - Release Notes',
  [trainingRoutes.list]: 'Training Hub',
  [trainingRoutes.detail]: 'Training Hub - Video',
};

const reportsRouteToTitleMapping = {
  [reportsRoutes.language]: 'Reports - Language',
  [reportsRoutes.releaseNotes]: 'Reports - Release Notes',
  [reportsRoutes.reportsList]: 'Reports - Reports List',
  [reportsRoutes.quickAssetCreate]: 'Reports - Quick Asset Create',
};

const freezersRouteToTitleMapping = {
  [freezersRoutes.language]: 'Freezers - Language',
  [freezersRoutes.releaseNotes]: 'Freezers - Release Notes',
  [freezersRoutes.sites.list]: 'Freezers - Site List',
  [freezersRoutes.sites.detail]: 'Freezers - Site Detail',
  [freezersRoutes.freezers.detail]: 'Freezers - Freezer Detail',
  [freezersRoutes.charts.create]: 'Freezers - Add Chart',
  [freezersRoutes.charts.detail]: 'Freezers - Edit Chart',
};

const systemRouteToTitleMapping = {
  [systemRoutes.search]: 'System - Search',
  [systemRoutes.readingService]: 'System - Readings Service',
  [systemRoutes.customerMessages]: 'System - Customer Messages',
};

const defaultRouteToTitleMapping = {
  [routes.login]: 'Login',
  [routes.resetPassword.request]: 'Reset Password - Request',
  [routes.resetPassword.emailSent]: 'Reset Password - Email Sent',
  [routes.resetPassword.changePasswordWithToken]:
    'Reset Password - Change Password',
  [routes.resetPassword.changeSuccess]: 'Reset Password - Success',
};

export const getRouteMappingForApp = (app: Application | null) => {
  switch (app) {
    case Application.Administration:
      return adminRouteToTitleMapping;
    case Application.Operations:
      return opsRouteToTitleMapping;
    case Application.Reports:
      return reportsRouteToTitleMapping;
    case Application.Training:
      return trainingRouteToTitleMapping;
    case Application.Freezers:
      return freezersRouteToTitleMapping;
    case Application.System:
      return systemRouteToTitleMapping;
    default:
      return defaultRouteToTitleMapping;
  }
};

export const getPageTitleFromMapping = (mapping: any, pathname: string) => {
  const mappedRouteToHelmetTitle = Object.keys(mapping).find(
    (routePathname) => {
      const matchedPath = matchPath(pathname, {
        path: routePathname,
        exact: true,
        strict: false,
      });

      return !!matchedPath;
    }
  );

  const pageTitle = mapping[mappedRouteToHelmetTitle!];
  return pageTitle;
};

export const getPageTitleForPathname = (pathname: string) => {
  const currentApplication = getAppForPathname(pathname);
  const routeMappingToTitle = getRouteMappingForApp(currentApplication);
  const pageTitle = getPageTitleFromMapping(routeMappingToTitle, pathname);

  return pageTitle ? `${pageTitle} - ANOVA Transcend` : `ANOVA Transcend`;
};
