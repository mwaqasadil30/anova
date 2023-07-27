import {
  EvolveAssetGroup,
  EvolveFavourite,
  EvolveTimezoneInfo,
  TreeNodeInfo,
  UserWatchListModel,
} from 'api/admin/api';
import { TFunction } from 'i18next';
import { SnackbarKey } from 'notistack';
import { OpsNavItemType } from 'types';
import { DEFAULT_TIMEZONE_ID } from 'utils/api/constants';
import {
  ApplicationActionType,
  CloseSnackbarAction,
  EnqueueSnackbarAction,
  RemoveSnackbarAction,
  SetActiveDomainAction,
  SetActiveDomainByIdAction,
  SetCurrentTimezone,
  SetFetchedFavouritesOnAction,
  SetHasSetDefaultFavourite,
  SetIsDarkThemeEnabledAction,
  SetPreviouslyHadDarkThemeEnabledAction,
  SetShowGlobalApplicationTimeoutDialog,
  SetShowGlobalMaintenanceDialog,
  SetShowGlobalPermissionDeniedDialog,
  SnackbarNotificationWithOptionalKey,
} from './types';

export const setActiveDomain = (
  payload: SetActiveDomainAction['payload']
): SetActiveDomainAction => ({
  type: ApplicationActionType.SetActiveDomain,
  payload,
});

export const setActiveDomainById = (
  domainId?: string | null
): SetActiveDomainByIdAction => ({
  type: ApplicationActionType.SetActiveDomainById,
  payload: { domainId },
});

export const setTimezones = (timezones?: EvolveTimezoneInfo[] | null) => ({
  type: ApplicationActionType.SetTimezones,
  payload: { timezones: timezones || [] },
});

export const setUserPreferredTimezoneId = (timezoneId?: number | null) => ({
  type: ApplicationActionType.SetUserPreferredTimezoneId,
  payload: { timezoneId: timezoneId || DEFAULT_TIMEZONE_ID },
});

export const setCurrentTimezone = (
  timezone?: EvolveTimezoneInfo | null
): SetCurrentTimezone => ({
  type: ApplicationActionType.SetCurrentTimezone,
  payload: { timezone },
});

interface SetShowGlobalPermissionDeniedDialogOptions {
  showDialog: boolean;
  wasTriggeredFromApi?: boolean;
}

export const setShowGlobalPermissionDeniedDialog = ({
  showDialog,
  wasTriggeredFromApi,
}: SetShowGlobalPermissionDeniedDialogOptions): SetShowGlobalPermissionDeniedDialog => ({
  type: ApplicationActionType.SetShowGlobalPermissionDeniedDialog,
  payload: { showDialog, wasTriggeredFromApi },
});

export const setShowGlobalApplicationTimeoutDialog = (
  showDialog: boolean
): SetShowGlobalApplicationTimeoutDialog => ({
  type: ApplicationActionType.SetShowGlobalApplicationTimeoutDialog,
  payload: { showDialog },
});

export const setShowGlobalMaintenanceDialog = (
  showDialog: boolean
): SetShowGlobalMaintenanceDialog => ({
  type: ApplicationActionType.SetShowGlobalMaintenanceDialog,
  payload: { showDialog },
});

export const setHasSetDefaultFavourite = (
  hasSetDefaultFavourite: boolean
): SetHasSetDefaultFavourite => ({
  type: ApplicationActionType.SetHasSetDefaultFavourite,
  payload: { hasSetDefaultFavourite },
});

export const setOpsNavigationTreeNode = (nodes: TreeNodeInfo[]) => {
  return {
    type: ApplicationActionType.SetOpsNavigationTreeNode,
    payload: {
      type: OpsNavItemType.AssetTree,
      nodes,
    },
  };
};

export const setOpsNavigationItem = (
  navItem: EvolveFavourite | EvolveAssetGroup | UserWatchListModel | null
) => {
  let navType;
  let navTitle;
  if (navItem instanceof UserWatchListModel) {
    navType = OpsNavItemType.Watchlist;
    navTitle = navItem.description;
  } else if (navItem instanceof EvolveFavourite) {
    navType = OpsNavItemType.Favourite;
    navTitle = navItem.description;
  } else if (navItem instanceof EvolveAssetGroup) {
    navType = OpsNavItemType.AssetGroup;
    navTitle = navItem.name;
  }

  return {
    type: ApplicationActionType.SetOpsNavigationItem,
    payload: { type: navType, item: navItem, title: navTitle },
  };
};

export const setFetchedFavouritesOn = (
  date?: Date
): SetFetchedFavouritesOnAction => {
  const dateWithDefault = date || new Date();
  return {
    type: ApplicationActionType.SetFetchedFavouritesOn,
    payload: { isoDate: dateWithDefault.toISOString() },
  };
};

export const setIsDarkThemeEnabled = (
  isEnabled: boolean
): SetIsDarkThemeEnabledAction => {
  return {
    type: ApplicationActionType.SetIsDarkThemeEnabled,
    payload: { isEnabled },
  };
};

export const setPreviouslyHadDarkThemeEnabled = (
  previouslyHadDarkThemeEnabled: boolean
): SetPreviouslyHadDarkThemeEnabledAction => {
  return {
    type: ApplicationActionType.SetPreviouslyHadDarkThemeEnabled,
    payload: { previouslyHadDarkThemeEnabled },
  };
};

export const enqueueSnackbar = (
  notification: SnackbarNotificationWithOptionalKey
): EnqueueSnackbarAction => {
  const key = notification.options && notification.options.key;

  return {
    type: ApplicationActionType.EnqueueSnackbar,
    payload: {
      key: key || new Date().getTime() + Math.random(),
      notification,
    },
  };
};

export const enqueueSaveSuccessSnackbar = (
  t: TFunction
): EnqueueSnackbarAction => {
  return {
    type: ApplicationActionType.EnqueueSnackbar,
    payload: {
      key: new Date().getTime() + Math.random(),
      notification: {
        message: t(
          'ui.common.changesSavedSuccess',
          'Changes saved successfully'
        ),
        options: { variant: 'success' },
      },
    },
  };
};

export const enqueueProblemReportEmailSendSuccessSnackbar = (
  t: TFunction
): EnqueueSnackbarAction => {
  return {
    type: ApplicationActionType.EnqueueSnackbar,
    payload: {
      key: new Date().getTime() + Math.random(),
      notification: {
        message: t('ui.common.emailHasBeenSent', 'Email has been sent'),
        options: {
          variant: 'success',
          // The styles below don't work for some reason.
          style: {
            minWidth: '175px',
          },
        },
      },
    },
  };
};

export const closeSnackbar = (key: SnackbarKey): CloseSnackbarAction => ({
  type: ApplicationActionType.CloseSnackbar,
  payload: {
    dismissAll: !key, // dismiss all if no key has been defined
    key,
  },
});

export const removeSnackbar = (key: SnackbarKey): RemoveSnackbarAction => ({
  type: ApplicationActionType.RemoveSnackbar,
  payload: {
    key,
  },
});
