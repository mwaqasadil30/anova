import {
  AssetSummaryTemplateFields,
  DomainAdditionalInfoResponseDto,
  DomainDetail,
  EvolveAssetGroup,
  EvolveFavourite,
  EvolveTimezoneInfo,
  TreeNodeInfo,
  UserWatchListModel,
} from 'api/admin/api';
import { OptionsObject, SnackbarKey, SnackbarMessage } from 'notistack';
import { OpsNavItemType } from 'types';

export enum ApplicationActionType {
  SetActiveDomain = 'app/SET_ACTIVE_DOMAIN',
  SetActiveDomainById = 'app/SET_ACTIVE_DOMAIN_BY_ID',
  SetTimezones = 'app/SET_TIMEZONES',
  SetUserPreferredTimezoneId = 'app/SET_USER_PREFERRED_TIMEZONE_ID',
  SetCurrentTimezone = 'app/SET_CURRENT_TIMEZONE',
  SetOpsNavigationItem = 'app/SET_OPS_NAVIGATION_ITEM',
  SetOpsNavigationTreeNode = 'app/SET_OPS_NAVIGATION_TREE_NODE',
  SetHasSetDefaultFavourite = 'app/SET_HAS_SET_DEFAULT_FAVOURITE',
  SetShowGlobalApplicationTimeoutDialog = 'app/SET_SHOW_GLOBAL_APPLICATION_TIMEOUT_DIALOG',
  SetShowGlobalPermissionDeniedDialog = 'app/SET_SHOW_GLOBAL_PERMISSION_DENIED_DIALOG',
  SetShowGlobalMaintenanceDialog = 'app/SET_SHOW_GLOBAL_MAINTENANCE_DIALOG',
  SetFetchedFavouritesOn = 'app/SET_FETCHED_FAVOURITES_ON',
  SetIsDarkThemeEnabled = 'app/SET_IS_DARK_THEME_ENABLED',
  SetPreviouslyHadDarkThemeEnabled = 'app/SET_PREVIOUSLY_HAD_DARK_THEME_ENABLED',
  EnqueueSnackbar = 'app/ENQUEUE_SNACKBAR',
  CloseSnackbar = 'app/CLOSE_SNACKBAR',
  RemoveSnackbar = 'app/REMOVE_SNACKBAR',
}

export interface DomainDetailWithTheme extends DomainDetail {
  themeColor?: string | null;
  assetSummaryTemplateFields?: AssetSummaryTemplateFields | null;
  domainAdditionalInfo: DomainAdditionalInfoResponseDto | null;
  isFetching?: boolean;
  areThereDomainNotes?: boolean;
}

export type SnackbarNotificationWithOptionalKey = {
  key?: SnackbarKey;
  dismissed?: boolean;
  message: SnackbarMessage;
  options?: OptionsObject;
  [key: string]: any;
};

export interface SnackbarNotification
  extends SnackbarNotificationWithOptionalKey {
  key: SnackbarKey;
}

export interface ApplicationState {
  domain?: DomainDetailWithTheme | null;
  timezones: {
    loading: boolean;
    timezones: EvolveTimezoneInfo[];
  };
  userPreferredTimezoneId?: number | null;
  currentTimezone: {
    loading: boolean;
    timezone: EvolveTimezoneInfo | null;
  };
  hasSetDefaultFavourite: boolean;
  globalPermissionDeniedDialog: {
    showDialog: boolean;
    wasTriggeredFromApi: boolean;
  };
  showGlobalApplicationTimeoutDialog: boolean;
  showGlobalMaintenanceDialog: boolean;
  fetchedFavouritesOn: string; // Date string
  opsNavigationData:
    | {
        type: OpsNavItemType.Favourite;
        item: EvolveFavourite;
        title: string;
        nodes: null;
      }
    | {
        type: OpsNavItemType.AssetGroup;
        item: EvolveAssetGroup;
        title: string;
        nodes: null;
      }
    | {
        type: OpsNavItemType.Watchlist;
        item: UserWatchListModel;
        title: string;
        nodes: null;
      }
    | {
        type: OpsNavItemType.AssetTree;
        nodes: TreeNodeInfo[];
        item: null;
        title: '';
      }
    | null;
  theme: {
    isDarkThemeEnabled: boolean;
    previouslyHadDarkThemeEnabled: boolean | null;
  };
  snackBar: {
    notifications: SnackbarNotification[];
  };
}

export interface SetActiveDomainByIdAction {
  type: ApplicationActionType.SetActiveDomainById;
  payload: {
    domainId?: string | null;
  };
}

export interface SetActiveDomainPayload {
  domain?: DomainDetail | null;
  themeColor?: string | null;
  assetSummaryTemplateFields?: AssetSummaryTemplateFields | null;
  domainAdditionalInfo?: DomainAdditionalInfoResponseDto | null;
}

export interface SetActiveDomainAction {
  type: ApplicationActionType.SetActiveDomain;
  payload: SetActiveDomainPayload;
}

export interface SetCurrentTimezone {
  type: ApplicationActionType.SetCurrentTimezone;
  payload: {
    timezone?: EvolveTimezoneInfo | null;
  };
}

export interface SetHasSetDefaultFavourite {
  type: ApplicationActionType.SetHasSetDefaultFavourite;
  payload: {
    hasSetDefaultFavourite: boolean;
  };
}

export interface SetShowGlobalPermissionDeniedDialog {
  type: ApplicationActionType.SetShowGlobalPermissionDeniedDialog;
  payload: {
    showDialog: boolean;
    wasTriggeredFromApi?: boolean;
  };
}

export interface SetShowGlobalApplicationTimeoutDialog {
  type: ApplicationActionType.SetShowGlobalApplicationTimeoutDialog;
  payload: {
    showDialog: boolean;
  };
}

export interface SetShowGlobalMaintenanceDialog {
  type: ApplicationActionType.SetShowGlobalMaintenanceDialog;
  payload: {
    showDialog: boolean;
  };
}

export interface SetFetchedFavouritesOnAction {
  type: ApplicationActionType.SetFetchedFavouritesOn;
  payload: {
    isoDate: string;
  };
}

export interface SetIsDarkThemeEnabledAction {
  type: ApplicationActionType.SetIsDarkThemeEnabled;
  payload: {
    isEnabled: boolean;
  };
}

export interface SetPreviouslyHadDarkThemeEnabledAction {
  type: ApplicationActionType.SetPreviouslyHadDarkThemeEnabled;
  payload: {
    previouslyHadDarkThemeEnabled: boolean;
  };
}

export interface EnqueueSnackbarAction {
  type: ApplicationActionType.EnqueueSnackbar;
  payload: {
    key: SnackbarKey;
    notification: SnackbarNotificationWithOptionalKey;
  };
}

export interface CloseSnackbarAction {
  type: ApplicationActionType.CloseSnackbar;
  payload: {
    dismissAll: boolean;
    key: SnackbarKey;
  };
}

export interface RemoveSnackbarAction {
  type: ApplicationActionType.RemoveSnackbar;
  payload: {
    key: SnackbarKey;
  };
}

export type ApplicationAction =
  | SetActiveDomainAction
  | SetActiveDomainByIdAction
  | SetCurrentTimezone
  | SetHasSetDefaultFavourite
  | SetShowGlobalApplicationTimeoutDialog
  | SetShowGlobalPermissionDeniedDialog
  | SetFetchedFavouritesOnAction
  | SetShowGlobalMaintenanceDialog
  | SetIsDarkThemeEnabledAction
  | SetPreviouslyHadDarkThemeEnabledAction
  | EnqueueSnackbarAction
  | CloseSnackbarAction
  | RemoveSnackbarAction;
