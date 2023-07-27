import {
  ApplicationUserRoleType,
  AssetSummaryTemplate,
  RTUCategoryType,
  UserPermissionType,
} from 'api/admin/api';
import adminRoutes from 'apps/admin/routes';
import freezerRoutes from 'apps/freezers/routes';
import {
  APP_PARSED_WHITELISTED_USERNAMES,
  IS_ASSET_DETAIL_POLL_RTU_FEATURE_ENABLED,
  IS_FREEZERS_APP_FEATURE_ENABLED,
  IS_NEW_DATA_CHANNEL_EDITOR_FEATURE_ENABLED,
  IS_PROBLEM_REPORTS_FEATURE_ENABLED,
  IS_RTU_EDITOR_FEATURE_ENABLED,
} from 'env';
import { selectIsActiveDomainApciEnabled } from 'redux-app/modules/app/selectors';
import memoize from 'lodash/memoize';
import { State } from 'redux-app/types';
import { createSelector } from 'reselect';
import { AccessType, PermissionMapping } from 'types';

export const selectUser = (state: State) => state.user;
export const selectUserDataResult = createSelector(
  selectUser,
  (user) => user.data?.authenticateAndRetrieveApplicationInfoResult
);
// #region New, separate user permission api call response
export const selectUserPermissions = createSelector(
  selectUser,
  (user) => user.userPermissions
);
export const selectUserPermissionsIsFetching = createSelector(
  selectUser,
  (user) => user.userPermissionsIsFetching
);
export const selectUserRoleType = createSelector(
  selectUserPermissions,
  (userPermissions) => userPermissions?.roleType
);
// #endregion New, separate user permission api call response
export const selectDefaultFavourite = createSelector(
  selectUserDataResult,
  (result) => result?.userInfo?.defaultFavourite
);
export const selectUserId = createSelector(
  selectUserDataResult,
  (result) => result?.userInfo?.userId
);
export const selectUsername = createSelector(
  selectUserDataResult,
  (result) => result?.userInfo?.username
);
export const selectIsUserSystemAdmin = createSelector(
  selectUserRoleType,
  (userRoleType) => userRoleType === ApplicationUserRoleType.SystemAdministrator
);
export const selectIsUserSystemUser = createSelector(
  selectUserRoleType,
  (userRoleType) => userRoleType === ApplicationUserRoleType.SystemUser
);
export const selectIsUserSystemAdminOrSystemUser = createSelector(
  selectIsUserSystemAdmin,
  selectIsUserSystemUser,
  (isUserSystemAdmin, isUserSystemUser) =>
    !!isUserSystemAdmin || !!isUserSystemUser
);
export const selectIsSystemAdminOrWhitelisted = createSelector(
  selectIsUserSystemAdmin,
  selectUsername,
  (isSystemAdmin, username) => {
    const whitelistedAccounts = APP_PARSED_WHITELISTED_USERNAMES;

    const isAccountWhitelisted =
      !!username && !!whitelistedAccounts?.includes(username.toLowerCase());

    return isSystemAdmin || isAccountWhitelisted;
  }
);
export const selectIsAuthenticated = createSelector(
  selectUser,
  (user) => user.isAuthenticated
);
export const selectIsPasswordChangeRequired = createSelector(
  selectUserDataResult,
  (result) => result?.userInfo?.isPasswordChangeRequired
);

export const selectB2cSignInFlowUri = createSelector(
  selectUser,
  (user) => user.authenticationMethod?.thirdParty?.b2cSigninUserFlowUri
);
export const selectB2cScopeAppAuthenticateUri = createSelector(
  selectUser,
  (user) => user.authenticationMethod?.thirdParty?.b2cScopeAppAuthenticateUri
);
export const selectIsDOLV3Login = createSelector(
  selectUser,
  (user) => user.authenticationMethod?.isDOLV3Login
);

export const selectShowPreviewPage = createSelector(
  selectUser,
  (user) => user.data?.showPreviewPage
);
export const selectCanUserEditTheirProfile = createSelector(
  selectUser,
  (user) => user.data?.canUserEditTheirProfile
);
export const selectHasConfirmedWelcomeDialog = createSelector(
  selectUser,
  (user) => user.hasConfirmedWelcomeDialog
);
export const selectUserAccessTranscendAndDolv3StatusId = createSelector(
  selectUser,
  // See TranscendAndDolV3UserAccess enum in src/types/index.ts
  // If userAccessToTranscendAndDolV3StatusId (typed as number, not ENUM) ===
  // 1 -> user only has access to login to Transcend
  // 2 -> user has been granted permission to log in to DOLV3 and Transcend but
  //      first needs to set a new password before they can log in to DOLV3
  // 3 -> user is able to log in to DOLV3 and Transcend
  (user) => user.data?.userAccessToTranscendAndDolV3StatusId
);
export const selectUsernameConvertedForDolV3Application = createSelector(
  selectUser,
  (user) => user.data?.userNameConvertedForDolV3Application
);

/**
 * Return an object mapping a permission type (UserPermissionType) to the
 * permission details (UserPermissionDetails) for all of the user's
 * permissions.
 *
 * Example for a user with only the UserPermissionType.DataChannelTypeAccess
 * permission):
 * {
 *   1: {
 *     applicationUserRoleGroupItemId: 1
 *     dataChannelType: null
 *     isCreateEnabled: true
 *     isDeleteEnabled: true
 *     isEnabled: true
 *     isReadEnabled: true
 *     isUpdateEnabled: true
 *     permissionName: "Data Channel Type Visibility"
 *     permissionType: 1
 *   }
 * }
 */
export const selectUserPermissionMapping = createSelector(
  selectUserPermissions,
  (userPermissions) => {
    const permissions = userPermissions?.permissions;

    const mappedPermissions = permissions?.reduce(
      (mapping, currentPermission) => ({
        ...mapping,
        [currentPermission.permissionType as any]: currentPermission,
      }),
      {} as PermissionMapping
    );

    return mappedPermissions;
  }
);

/**
 * Return a selector that takes two positional arguments for checking if a user
 * has a certain permission.
 * Example usage:
 *   const hasPermission = useSelector(selectHasPermission);
 *   const canCreateAssets = hasPermission(
 *     UserPermissionType.AssetGlobal,
 *     AccessType.Create
 *   );
 * See reselect's docs on creating a selector that takes arguments:
 * https://github.com/reduxjs/reselect#q-how-do-i-create-a-selector-that-takes-an-argument
 * @param permissionType The UserPermissionType being checked
 * @param accessType The access type being checked (create, update, delete,
 *                   etc.). If not passed, AccessType.Default is used
 */
export const selectHasPermission = createSelector(
  selectIsUserSystemAdmin,
  selectUserPermissionMapping,
  (isSystemAdmin, permissionMapping) =>
    memoize(
      (
        permissionType: UserPermissionType,
        accessType: AccessType = AccessType.Default
      ) => {
        const hasSelectedPermission =
          isSystemAdmin || permissionMapping?.[permissionType]?.[accessType];

        // IMPORTANT NOTE:
        // Having the Update access type infers having the Read access type.
        // Having the Create access type infers having the Read AND Update Types.
        if (accessType === AccessType.Update) {
          return (
            hasSelectedPermission ||
            permissionMapping?.[permissionType]?.[AccessType.Create]
          );
        }
        if (accessType === AccessType.Read) {
          return (
            hasSelectedPermission ||
            permissionMapping?.[permissionType]?.[AccessType.Create] ||
            permissionMapping?.[permissionType]?.[AccessType.Update]
          );
        }

        return hasSelectedPermission;
      },
      // The cache key: `${isSystemAdmin}_${permissionType}_${accessType}`
      (...args) => [isSystemAdmin, ...args].join('_')
    )
);

export const selectCanViewGeofenceTab = createSelector(
  selectHasPermission,
  (hasPermission) =>
    hasPermission(UserPermissionType.GeofenceAccess, AccessType.Read)
);
export const selectCanReadGeofences = createSelector(
  selectHasPermission,
  (hasPermission) =>
    hasPermission(UserPermissionType.GeofenceAccess, AccessType.Read)
);
export const selectCanCreateGeofences = createSelector(
  selectHasPermission,
  (hasPermission) =>
    hasPermission(UserPermissionType.GeofenceAccess, AccessType.Create)
);
export const selectCanUpdateGeofences = createSelector(
  selectHasPermission,
  (hasPermission) =>
    hasPermission(UserPermissionType.GeofenceAccess, AccessType.Update)
);
export const selectCanDeleteGeofences = createSelector(
  selectHasPermission,
  (hasPermission) =>
    hasPermission(UserPermissionType.GeofenceAccess, AccessType.Delete)
);

export const selectCanViewProblemReportsTab = createSelector(
  selectHasPermission,
  selectIsActiveDomainApciEnabled,
  (hasPermission, isActiveDomainApciEnabled) =>
    IS_PROBLEM_REPORTS_FEATURE_ENABLED &&
    hasPermission(UserPermissionType.ViewTabProblemReports) &&
    isActiveDomainApciEnabled
);
export const selectCanReadProblemReportDetails = createSelector(
  selectHasPermission,
  (hasPermission) =>
    IS_PROBLEM_REPORTS_FEATURE_ENABLED &&
    hasPermission(UserPermissionType.ProblemReportEditorAccess, AccessType.Read)
);
export const selectCanReadDataChannel = createSelector(
  selectHasPermission,
  (hasPermission) =>
    IS_NEW_DATA_CHANNEL_EDITOR_FEATURE_ENABLED &&
    hasPermission(UserPermissionType.DataChannelGlobal, AccessType.Read)
);
export const selectCanAccessRtuEditor = createSelector(
  selectHasPermission,
  () => IS_RTU_EDITOR_FEATURE_ENABLED
);

// const rtuPermissionMapping = {
//   [RTUCategoryType.Clover]: hasPermission(UserPermissionType.RTUCloverEditor, AccessType.Read),
//   [RTUCategoryType.File]: hasPermission(UserPermissionType.RTUFileEditor, AccessType.Read),
// }

// Rtu editor READ access permission checks
// Has 'Legacy' in its name because it is using the old Rtu category type enum
// and we've started using RtuDeviceCategory.
export const selectRtuLegacyTypeReadPermissionMapping = createSelector(
  selectHasPermission,
  (hasPermission) => {
    const canReadRTU400SeriesEditor = hasPermission(
      UserPermissionType.RTU400SeriesEditor,
      AccessType.Read
    );
    const canReadRTUFileEditor = hasPermission(
      UserPermissionType.RTUFileEditor,
      AccessType.Read
    );
    const canReadRTUHornerEditor = hasPermission(
      UserPermissionType.RTUHornerEditor,
      AccessType.Read
    );
    const canReadRTUCloverEditor = hasPermission(
      UserPermissionType.RTUCloverEditor,
      AccessType.Read
    );
    const canReadRTUMetron2Editor = hasPermission(
      UserPermissionType.RTUMetron2Editor,
      AccessType.Read
    );
    const canReadRTUWiredEditor = hasPermission(
      UserPermissionType.RTUWiredEditor,
      AccessType.Read
    );
    const canReadRtuWirelessEditor = hasPermission(
      UserPermissionType.RtuWirelessEditor,
      AccessType.Read
    );

    return {
      [RTUCategoryType.FourHundredSeries]: canReadRTU400SeriesEditor,
      [RTUCategoryType.File]: canReadRTUFileEditor,
      [RTUCategoryType.Horner]: canReadRTUHornerEditor,
      [RTUCategoryType.Clover]: canReadRTUCloverEditor,
      [RTUCategoryType.Metron2]: canReadRTUMetron2Editor,
      [RTUCategoryType.Modbus]: canReadRTUWiredEditor,
      [RTUCategoryType.SMS]: canReadRtuWirelessEditor,
    };
  }
);

// Rtu editor Delete access permission checks mapping
// Has 'Legacy' in its name because it is using the old Rtu category type enum
// and we've started using RtuDeviceCategory.
export const selectRtuLegacyTypeDeletePermissionMapping = createSelector(
  selectHasPermission,
  (hasPermission) => {
    const canDeleteRTU400SeriesEditor = hasPermission(
      UserPermissionType.RTU400SeriesEditor,
      AccessType.Delete
    );
    const canDeleteRTUFileEditor = hasPermission(
      UserPermissionType.RTUFileEditor,
      AccessType.Delete
    );
    const canDeleteRTUHornerEditor = hasPermission(
      UserPermissionType.RTUHornerEditor,
      AccessType.Delete
    );
    const canDeleteRTUCloverEditor = hasPermission(
      UserPermissionType.RTUCloverEditor,
      AccessType.Delete
    );
    const canDeleteRTUMetron2Editor = hasPermission(
      UserPermissionType.RTUMetron2Editor,
      AccessType.Delete
    );
    const canDeleteRTUWiredEditor = hasPermission(
      UserPermissionType.RTUWiredEditor,
      AccessType.Delete
    );
    const canDeleteRtuWirelessEditor = hasPermission(
      UserPermissionType.RtuWirelessEditor,
      AccessType.Delete
    );

    return {
      [RTUCategoryType.FourHundredSeries]: canDeleteRTU400SeriesEditor,
      [RTUCategoryType.File]: canDeleteRTUFileEditor,
      [RTUCategoryType.Horner]: canDeleteRTUHornerEditor,
      [RTUCategoryType.Clover]: canDeleteRTUCloverEditor,
      [RTUCategoryType.Metron2]: canDeleteRTUMetron2Editor,
      [RTUCategoryType.Modbus]: canDeleteRTUWiredEditor,
      [RTUCategoryType.SMS]: canDeleteRtuWirelessEditor,
    };
  }
);

// Rtu history tab
export const selectCanAccessRtuHistoryTab = createSelector(
  selectHasPermission,
  (hasPermission) =>
    hasPermission(UserPermissionType.RtuMetron2Audit, AccessType.Read) &&
    hasPermission(UserPermissionType.RtuHornerAudit, AccessType.Read) &&
    hasPermission(UserPermissionType.RtuSmsAudit, AccessType.Read) &&
    hasPermission(UserPermissionType.RtuModbusAudit, AccessType.Read) &&
    hasPermission(UserPermissionType.RTUFileEditor, AccessType.Read) &&
    hasPermission(UserPermissionType.RTU400SeriesAudit, AccessType.Read)
);

export const selectCanAccessAdminDataChannelEditor = createSelector(
  selectHasPermission,
  (hasPermission) =>
    IS_NEW_DATA_CHANNEL_EDITOR_FEATURE_ENABLED &&
    hasPermission(UserPermissionType.DataChannelGlobal, AccessType.Read) &&
    hasPermission(UserPermissionType.AdministrationTabDataChannel) &&
    hasPermission(UserPermissionType.AdministrationTabAccess)
);
export const selectCanPollRtus = createSelector(
  selectHasPermission,
  (hasPermission) =>
    IS_ASSET_DETAIL_POLL_RTU_FEATURE_ENABLED &&
    hasPermission(UserPermissionType.MiscellaneousFeaturePollRTU)
);

// Freezer app permissions
export const selectIsFreezerAppAdmin = createSelector(
  selectHasPermission,
  (hasPermission) =>
    IS_FREEZERS_APP_FEATURE_ENABLED &&
    hasPermission(UserPermissionType.MiscellaneousFeatureFreezerAdmin)
);
export const selectIsFreezerAppViewer = createSelector(
  selectHasPermission,
  (hasPermission) =>
    IS_FREEZERS_APP_FEATURE_ENABLED &&
    hasPermission(UserPermissionType.MiscellaneousFeatureFreezerView)
);
export const selectCanReadFreezerChart = createSelector(
  selectIsFreezerAppAdmin,
  selectIsFreezerAppViewer,
  (isFreezerAppAdmin, isFreezerAppViewer) =>
    IS_FREEZERS_APP_FEATURE_ENABLED && (isFreezerAppAdmin || isFreezerAppViewer)
);
export const selectCanCreateFreezerChart = createSelector(
  selectIsFreezerAppAdmin,
  selectIsFreezerAppViewer,
  (isFreezerAppAdmin, isFreezerAppViewer) =>
    IS_FREEZERS_APP_FEATURE_ENABLED && (isFreezerAppAdmin || isFreezerAppViewer)
);
export const selectCanUpdateFreezerChart = createSelector(
  selectIsFreezerAppAdmin,
  selectIsFreezerAppViewer,
  (isFreezerAppAdmin, isFreezerAppViewer) =>
    IS_FREEZERS_APP_FEATURE_ENABLED && (isFreezerAppAdmin || isFreezerAppViewer)
);
export const selectCanDeleteFreezerChart = createSelector(
  selectIsFreezerAppAdmin,
  selectIsFreezerAppViewer,
  (isFreezerAppAdmin, isFreezerAppViewer) =>
    IS_FREEZERS_APP_FEATURE_ENABLED && (isFreezerAppAdmin || isFreezerAppViewer)
);

// #region App access
export const selectCanAccessOperationsApp = createSelector(
  selectHasPermission,
  (hasPermission) => {
    const canViewAssetSummaryTab = hasPermission(
      UserPermissionType.ViewTabAssetSummary
    );
    const canViewEventsTab = hasPermission(UserPermissionType.ViewTabEvents);
    const canViewMapsTab = hasPermission(
      UserPermissionType.MiscellaneousFeatureViewMap
    );

    return canViewAssetSummaryTab || canViewEventsTab || canViewMapsTab;
  }
);
export const selectCanAccessAdminApp = createSelector(
  selectHasPermission,
  (hasPermission) => {
    const canViewAdminTab = hasPermission(
      UserPermissionType.AdministrationTabAccess
    );
    return canViewAdminTab;
  }
);
export const selectFirstAccessibleAdminRouteByPermission = createSelector(
  selectIsSystemAdminOrWhitelisted,
  selectHasPermission,
  selectCanViewGeofenceTab,
  (isSystemAdminOrWhitelisted, hasPermission, canViewGeofenceTab) => {
    if (isSystemAdminOrWhitelisted) {
      return adminRoutes.assetManager.list;
    }
    // NOTE/TODO: Remember to add new admin pages in here once they are deployed
    // for real users

    // We only allow 4 pages to be accessed by non-system admins at the moment
    const canViewSiteTab = hasPermission(
      UserPermissionType.AdministrationTabSite
    );
    const canViewTankDimensionTab = hasPermission(
      UserPermissionType.AdministrationTabTankDimensions
    );
    const canViewProductTab = hasPermission(
      UserPermissionType.AdministrationTabProduct
    );
    const canViewAssetGroup = hasPermission(
      UserPermissionType.AdministrationTabAssetGroup
    );
    const canViewUserTab = hasPermission(
      UserPermissionType.AdministrationTabUser
    );
    const canViewMessageTemplateTab = hasPermission(
      UserPermissionType.AdministrationTabMessageTemplate
    );
    const canViewRosterAdminTab = hasPermission(
      UserPermissionType.AdministrationTabRoster
    );
    const canViewDataChannelTab = hasPermission(
      UserPermissionType.AdministrationTabDataChannel
    );

    if (canViewSiteTab) {
      return adminRoutes.siteManager.list;
    }
    if (canViewTankDimensionTab) {
      return adminRoutes.tankDimensionManager.list;
    }
    if (canViewProductTab) {
      return adminRoutes.productManager.list;
    }
    if (canViewAssetGroup) {
      return adminRoutes.assetGroupManager.list;
    }
    if (canViewUserTab) {
      return adminRoutes.userManager.list;
    }
    if (canViewMessageTemplateTab) {
      return adminRoutes.messageTemplateManager.list;
    }
    if (canViewRosterAdminTab) {
      return adminRoutes.rosterManager.list;
    }
    if (canViewGeofenceTab) {
      return adminRoutes.geofenceManager.list;
    }
    if (canViewDataChannelTab) {
      return adminRoutes.dataChannelManager.list;
    }

    return '';
  }
);
export const selectCanAccessReportsApp = selectIsSystemAdminOrWhitelisted;
export const selectCanAccessFreezersApp = createSelector(
  selectIsFreezerAppAdmin,
  selectIsFreezerAppViewer,
  (isFreezerAppAdmin, isFreezerAppViewer) => {
    return (
      IS_FREEZERS_APP_FEATURE_ENABLED &&
      (isFreezerAppAdmin || isFreezerAppViewer)
    );
  }
);

export const selectFirstAccessibleFreezerRouteByPermission = createSelector(
  selectIsSystemAdminOrWhitelisted,
  selectIsFreezerAppAdmin,
  selectIsFreezerAppViewer,
  (isSystemAdminOrWhitelisted, isFreezerAppAdmin, isFreezerAppViewer) => {
    if (
      IS_FREEZERS_APP_FEATURE_ENABLED &&
      (isSystemAdminOrWhitelisted || isFreezerAppAdmin || isFreezerAppViewer)
    ) {
      return freezerRoutes.sites.list;
    }

    return '';
  }
);

export const selectCanAccessSystemApp = createSelector(
  selectHasPermission,
  (hasPermission) => {
    const canViewSystemTabAssetSearch = hasPermission(
      UserPermissionType.SystemTabAssetSearch
    );
    const canViewSystemTabRTUSearch = hasPermission(
      UserPermissionType.SystemTabRTUSearch
    );
    const canViewSystemTabRTURequestSearch = hasPermission(
      UserPermissionType.SystemTabRTURequestSearch
    );
    const canViewSystemTabCarrierAndSystem = hasPermission(
      UserPermissionType.SystemTabCarrierAndSystem
    );
    const canViewSystemTabMissingData = hasPermission(
      UserPermissionType.SystemTabMissingData
    );
    const canViewSystemTabFTPCompareResults = hasPermission(
      UserPermissionType.SystemTabFTPCompareResults
    );
    const canViewSystemTabFTPStatus = hasPermission(
      UserPermissionType.SystemTabFTPStatus
    );
    const canViewSystemTabDataChannelTemplate = hasPermission(
      UserPermissionType.SystemTabDataChannelTemplate
    );
    const canViewSystemTabRTUOutbound = hasPermission(
      UserPermissionType.SystemTabRTUOutbound
    );
    const canViewSystemTabOrphanChannels = hasPermission(
      UserPermissionType.SystemTabOrphanChannels
    );

    return (
      canViewSystemTabAssetSearch ||
      canViewSystemTabRTUSearch ||
      canViewSystemTabRTURequestSearch ||
      canViewSystemTabCarrierAndSystem ||
      canViewSystemTabMissingData ||
      canViewSystemTabFTPCompareResults ||
      canViewSystemTabFTPStatus ||
      canViewSystemTabDataChannelTemplate ||
      canViewSystemTabRTUOutbound ||
      canViewSystemTabOrphanChannels
    );
  }
);
export const selectCanAccessSystemSearch = createSelector(
  selectHasPermission,
  (hasPermission) => {
    const canViewSystemTabAssetSearch = hasPermission(
      UserPermissionType.SystemTabAssetSearch
    );
    const canViewSystemTabRTUSearch = hasPermission(
      UserPermissionType.SystemTabRTUSearch
    );
    const canViewSystemTabRTURequestSearch = hasPermission(
      UserPermissionType.SystemTabRTURequestSearch
    );
    const canViewSystemTabCarrierAndSystem = hasPermission(
      UserPermissionType.SystemTabCarrierAndSystem
    );
    return (
      canViewSystemTabAssetSearch ||
      canViewSystemTabRTUSearch ||
      canViewSystemTabRTURequestSearch ||
      canViewSystemTabCarrierAndSystem
    );
  }
);
// #endregion App access

const defaultAssetSummaryTemplates: AssetSummaryTemplate[] = [];
export const effectiveAssetSummaryTemplates = (state: State) =>
  state.user.data?.effectiveDomainAssetSummaryTemplate ||
  defaultAssetSummaryTemplates;
export const homeAssetSummaryTemplates = (state: State) =>
  state.user.data?.homeDomainAssetSummaryTemplate ||
  defaultAssetSummaryTemplates;
