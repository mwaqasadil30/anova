/* eslint-disable indent */
import { State } from 'redux-app/types';
import opsRoutes from 'apps/ops/routes';
import adminRoutes from 'apps/admin/routes';
import reportsRoutes from 'apps/reports/routes';
import trainingRoutes from 'apps/training/routes';
import freezersRoutes from 'apps/freezers/routes';
import { createSelector } from 'reselect';
import { selectLocationPathname } from 'redux-app/selectors';
import { matchPath } from 'react-router';
import {
  navbarHeight,
  opsNavbarHeight,
  constructionBannerHeight,
} from 'styles/theme';
import { IntegrationProfileType } from 'api/admin/api';
import { VIRTUAL_FLOW_METER_ENABLED_DOMAINS } from 'env';

export const selectSnackbarNotifications = (state: State) =>
  state.app.snackBar.notifications || [];
export const selectIsDarkThemeEnabled = (state: State) =>
  state.app.theme.isDarkThemeEnabled;
export const selectUserPreferredTimezoneId = (state: State) =>
  state.app.userPreferredTimezoneId;
export const selectTimezones = (state: State) => state.app.timezones;
export const selectCurrentTimezone = (state: State) =>
  state.app.currentTimezone;
export const selectCurrentIanaTimezoneId = (state: State) =>
  state.app.currentTimezone.timezone?.ianaTimezoneId;
export const selectActiveDomain = (state: State) => state.app.domain;
export const selectActiveDomainId = createSelector(
  selectActiveDomain,
  (activeDomain) => activeDomain?.domainId
);
export const selectIsActiveDomainApciEnabled = createSelector(
  selectActiveDomain,
  (activeDomain) =>
    activeDomain?.integrationProfile === IntegrationProfileType.APCI
);
export const selectActiveDomainName = createSelector(
  selectActiveDomain,
  (activeDomain) => activeDomain?.name
);
export const selectIsCurrentDomainDataOnline = createSelector(
  selectActiveDomain,
  (activeDomain) => activeDomain?.name?.toLowerCase() === 'dataonline'
);
export const selectActiveDomainItemsPerPage = createSelector(
  selectActiveDomain,
  (activeDomain) => activeDomain?.itemsPerPage
);
export const selectActiveDomainThemeColor = createSelector(
  selectActiveDomain,
  (activeDomain) => activeDomain?.domainAdditionalInfo?.themeColor
);
export const selectActiveDomainHasIsoContainers = createSelector(
  selectActiveDomain,
  (activeDomain) => activeDomain?.domainAdditionalInfo?.hasIsoContainer
);
export const selectIsFetchingActiveDomain = createSelector(
  selectActiveDomain,
  (activeDomain) => activeDomain?.isFetching
);
export const selectDefaultEventStateDescription = createSelector(
  selectActiveDomain,
  (activeDomain) => activeDomain?.defaultEventStateDescription
);
export const selectHasVirtualFlowMeterEnabled = createSelector(
  selectActiveDomainName,
  (activeDomainName) =>
    activeDomainName &&
    VIRTUAL_FLOW_METER_ENABLED_DOMAINS.includes(activeDomainName.toLowerCase())
);
export const selectUserHomeDomain = (state: State) =>
  state.user.data?.authenticateAndRetrieveApplicationInfoResult?.homeDomain;

export const selectDefaultFavourites = (state: State) =>
  state.user.data?.defaultFavourites;
export const selectOpsNavigationData = (state: State) =>
  state.app.opsNavigationData;
export const selectHasSetDefaultFavourite = (state: State) =>
  state.app.hasSetDefaultFavourite;
export const selectFetchedFavouritesOn = (state: State) =>
  state.app.fetchedFavouritesOn;
export const selectGlobalPermissionDeniedDialog = (state: State) =>
  state.app.globalPermissionDeniedDialog;
export const selectShowGlobalApplicationTimeoutDialog = (state: State) =>
  state.app.showGlobalApplicationTimeoutDialog;
export const selectShowGlobalMaintenanceDialog = (state: State) =>
  state.app.showGlobalMaintenanceDialog;
export const selectShowGlobalPermissionDeniedDialog = createSelector(
  selectGlobalPermissionDeniedDialog,
  (globalPermissionDeniedDialog) => globalPermissionDeniedDialog.showDialog
);

export const selectIsUsingAdminApp = createSelector(
  selectLocationPathname,
  (pathname) => pathname.startsWith(adminRoutes.base)
);
export const selectIsUsingOpsApp = createSelector(
  selectLocationPathname,
  (pathname) => pathname.startsWith(opsRoutes.base)
);
export const selectIsUsingReportsApp = createSelector(
  selectLocationPathname,
  (pathname) => pathname.startsWith(reportsRoutes.base)
);
export const selectIsUsingTrainingApp = createSelector(
  selectLocationPathname,
  (pathname) => pathname.startsWith(trainingRoutes.base)
);
export const selectIsUsingFreezersApp = createSelector(
  selectLocationPathname,
  (pathname) => pathname.startsWith(freezersRoutes.base)
);
export const selectReleaseNotesRouteForCurrentApp = createSelector(
  selectIsUsingAdminApp,
  selectIsUsingOpsApp,
  selectIsUsingReportsApp,
  selectIsUsingFreezersApp,
  selectIsUsingTrainingApp,
  (
    isUsingAdminApp,
    isUsingOpsApp,
    isUsingReportsApp,
    isUsingFreezersApp,
    isUsingTrainingApp
  ) => {
    return isUsingAdminApp
      ? adminRoutes.releaseNotes
      : isUsingOpsApp
      ? opsRoutes.releaseNotes
      : isUsingReportsApp
      ? reportsRoutes.releaseNotes
      : isUsingFreezersApp
      ? freezersRoutes.releaseNotes
      : isUsingTrainingApp
      ? trainingRoutes.releaseNotes
      : '';
  }
);
// TODO: Add a selectCurrentActiveApp selector that returns an enum of the
// active app?
export const selectShowOpsNavBar = createSelector(
  selectIsUsingOpsApp,
  selectLocationPathname,
  (isUsingOpsApp, pathname) =>
    isUsingOpsApp && pathname !== opsRoutes.dashboard.home
);

export const selectIsPageUnderConstruction = createSelector(
  selectLocationPathname,
  (pathname) => {
    const isOnDataChannelEditor = !!matchPath(
      pathname,
      adminRoutes.dataChannelManagerLegacy.edit
    );
    return isOnDataChannelEditor;
  }
);

export const selectTopOffsetForNavbars = createSelector(
  selectShowOpsNavBar,
  (showOpsNavBar) => {
    const calculatedOpsNavbarHeight = showOpsNavBar ? opsNavbarHeight : 0;
    return navbarHeight + calculatedOpsNavbarHeight;
  }
);

export const selectTopOffset = createSelector(
  selectTopOffsetForNavbars,
  selectIsPageUnderConstruction,
  (topOffsetForNavbars, isPageUnderConstruction) => {
    const calculatedConstructionBannerHeight = isPageUnderConstruction
      ? constructionBannerHeight
      : 0;
    return topOffsetForNavbars + calculatedConstructionBannerHeight;
  }
);
