import { EvolveTimezoneInfo } from 'api/admin/api';
import { LOCATION_CHANGE } from 'connected-react-router';
import {
  IS_DEV_TOGGLE_DARK_THEME_EVERYWHERE_FEATURE_ENABLED,
  IS_TOGGLE_DARK_THEME_FEATURE_ENABLED,
} from 'env';
import { combineReducers } from 'redux';
import {
  loadingDomainTransform,
  loadingCurrentTimezoneTransform,
} from 'redux-app/persist/transforms';
import { ApplicationWideAction, BaseAction } from 'redux-app/types-actions';
import { persistReducer } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';
import { DEFAULT_TIMEZONE_ID } from 'utils/api/constants';
import {
  getIsDarkThemeOnlyPathname,
  getIsLightOrDarkThemeForPathname,
  getIsLightThemeOnlyPathname,
} from 'utils/theme-availability';
import { UserActionType } from '../user/types';
import {
  FetchActiveDomainRoutine,
  FetchTimezonesRoutine,
  UpdateUserPreferredTimezoneRoutine,
} from './routines';
import {
  ApplicationActionType,
  ApplicationState,
  DomainDetailWithTheme,
} from './types';

const initialState = null;

const domainReducer = (
  state: DomainDetailWithTheme | null = initialState,
  action: ApplicationWideAction
) => {
  switch (action.type) {
    case FetchActiveDomainRoutine.REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case FetchActiveDomainRoutine.FULFILL: {
      return { ...state, isFetching: false };
    }
    case ApplicationActionType.SetActiveDomain: {
      const {
        domain,
        assetSummaryTemplateFields,
        domainAdditionalInfo,
      } = action.payload;
      return {
        ...domain,
        assetSummaryTemplateFields,
        domainAdditionalInfo,
      };
    }
    case UserActionType.Logout: {
      return initialState;
    }
    default:
      return state;
  }
};

const initialTimezonesState = {
  loading: false,
  timezones: [] as EvolveTimezoneInfo[],
};

const timezonesReducer = (
  state = initialTimezonesState,
  action: BaseAction
) => {
  switch (action.type) {
    case FetchTimezonesRoutine.REQUEST: {
      return { ...state, loading: true };
    }
    case FetchTimezonesRoutine.FULFILL: {
      return { ...state, loading: false };
    }
    case ApplicationActionType.SetTimezones: {
      const { timezones } = action.payload;
      return { ...state, timezones };
    }
    case UserActionType.Logout: {
      return initialTimezonesState;
    }
    default:
      return state;
  }
};

const initialUserPreferredTimezoneId = DEFAULT_TIMEZONE_ID;

const userPreferredTimezoneIdReducer = (
  state = initialUserPreferredTimezoneId,
  action: BaseAction
) => {
  switch (action.type) {
    case ApplicationActionType.SetUserPreferredTimezoneId: {
      const { timezoneId } = action.payload;
      return timezoneId;
    }
    case UserActionType.Logout: {
      return initialUserPreferredTimezoneId;
    }
    default:
      return state;
  }
};

const initialCurrentTimezone = {
  loading: false,
  timezone: null,
};

const currentTimezoneReducer = (
  state = initialCurrentTimezone,
  action: BaseAction
) => {
  switch (action.type) {
    case UpdateUserPreferredTimezoneRoutine.REQUEST:
      return { ...state, loading: true };
    case UpdateUserPreferredTimezoneRoutine.FULFILL:
      return { ...state, loading: false };
    case ApplicationActionType.SetCurrentTimezone: {
      const { timezone } = action.payload;
      return { ...state, timezone };
    }
    case UserActionType.Logout: {
      return initialCurrentTimezone;
    }
    default:
      return state;
  }
};

const hasSetDefaultFavouriteReducer = (
  state = false,
  action: ApplicationWideAction
) => {
  switch (action.type) {
    case ApplicationActionType.SetActiveDomain:
    case UserActionType.Logout: {
      return false;
    }
    case ApplicationActionType.SetHasSetDefaultFavourite: {
      const { hasSetDefaultFavourite } = action.payload;
      return hasSetDefaultFavourite;
    }
    default:
      return state;
  }
};

const opsNavigationItemReducer = (state = null, action: BaseAction) => {
  switch (action.type) {
    case ApplicationActionType.SetOpsNavigationTreeNode: {
      const { type, nodes } = action.payload;
      return { title: '', item: null, type, nodes };
    }
    case ApplicationActionType.SetOpsNavigationItem: {
      const { item, type, title } = action.payload;

      return item ? { type, item, title, nodes: null } : null;
    }
    case UserActionType.Logout: {
      return null;
    }
    default:
      return state;
  }
};

const initialGlobalPermissionDeniedDialogState: ApplicationState['globalPermissionDeniedDialog'] = {
  showDialog: false,
  wasTriggeredFromApi: false,
};

const globalPermissionDeniedDialogReducer = (
  state = initialGlobalPermissionDeniedDialogState,
  action: ApplicationWideAction
) => {
  switch (action.type) {
    case ApplicationActionType.SetShowGlobalPermissionDeniedDialog: {
      const { showDialog, wasTriggeredFromApi } = action.payload;
      return {
        showDialog,
        wasTriggeredFromApi: showDialog ? wasTriggeredFromApi : false,
      };
    }
    case ApplicationActionType.SetActiveDomain:
    case UserActionType.Logout: {
      return initialGlobalPermissionDeniedDialogState;
    }
    default:
      return state;
  }
};

const initialShowGlobalMaintenanceDialogReducer = false;

const showGlobalMaintenanceDialogReducer = (
  state = initialShowGlobalMaintenanceDialogReducer,
  action: ApplicationWideAction
) => {
  switch (action.type) {
    case ApplicationActionType.SetShowGlobalMaintenanceDialog: {
      return action.payload;
    }
    case UserActionType.Logout: {
      return initialShowGlobalMaintenanceDialogReducer;
    }
    default:
      return state;
  }
};

const initialShowGlobalApplicationTimeoutDialogReducer = false;

const showGlobalApplicationTimeoutDialogReducer = (
  state = initialShowGlobalApplicationTimeoutDialogReducer,
  action: ApplicationWideAction
) => {
  switch (action.type) {
    case ApplicationActionType.SetShowGlobalApplicationTimeoutDialog: {
      return action.payload.showDialog;
    }
    case UserActionType.Logout: {
      return initialShowGlobalApplicationTimeoutDialogReducer;
    }
    default:
      return state;
  }
};

const initialFetchedFavouritesOnState = '';

const fetchedFavouritesOnReducer = (
  state = initialFetchedFavouritesOnState,
  action: ApplicationWideAction
) => {
  switch (action.type) {
    case ApplicationActionType.SetFetchedFavouritesOn: {
      return action.payload.isoDate;
    }
    case UserActionType.Logout: {
      return initialFetchedFavouritesOnState;
    }
    default:
      return state;
  }
};

const initialThemeState: ApplicationState['theme'] = {
  isDarkThemeEnabled: false,
  previouslyHadDarkThemeEnabled: null,
};

const themeReducer = (
  state = initialThemeState,
  action: ApplicationWideAction
): ApplicationState['theme'] => {
  switch (action.type) {
    case LOCATION_CHANGE: {
      const { pathname } = action.payload.location;

      // If the developer feature to enable switching the theme everywhere is
      // enabled, don't update the theme when changing routes.
      if (IS_DEV_TOGGLE_DARK_THEME_EVERYWHERE_FEATURE_ENABLED) {
        return state;
      }

      // If you are on a page that only supports dark mode, force dark mode on.
      const isDarkThemeOnlyPage = getIsDarkThemeOnlyPathname(pathname);
      if (isDarkThemeOnlyPage) {
        return {
          ...state,
          isDarkThemeEnabled: true,
        };
      }

      // If the theme toggle is disabled, force the light theme.
      if (!IS_TOGGLE_DARK_THEME_FEATURE_ENABLED) {
        return {
          ...state,
          isDarkThemeEnabled: false,
        };
      }

      // If you are on a page that only supports light mode, force light mode on.
      const isLightThemeOnlyPage = getIsLightThemeOnlyPathname(pathname);
      if (isLightThemeOnlyPage) {
        return {
          ...state,
          isDarkThemeEnabled: false,
        };
      }

      // If the theme toggle is enabled and you land on an app that supports
      // the light and dark theme, then use the previously selected theme.
      const canChangeThemeForPage = getIsLightOrDarkThemeForPathname(pathname);
      if (IS_TOGGLE_DARK_THEME_FEATURE_ENABLED && canChangeThemeForPage) {
        return {
          ...state,
          // Set the theme to be what the user previously selected (if they
          // have), otherwise use the current theme.
          isDarkThemeEnabled:
            state.previouslyHadDarkThemeEnabled !== null
              ? state.previouslyHadDarkThemeEnabled
              : state.isDarkThemeEnabled,
        };
      }

      // Otherwise, default to what theme you have selected
      return state;
    }
    case ApplicationActionType.SetIsDarkThemeEnabled: {
      return {
        ...state,
        isDarkThemeEnabled: action.payload.isEnabled,
        previouslyHadDarkThemeEnabled: action.payload.isEnabled,
      };
    }
    case ApplicationActionType.SetPreviouslyHadDarkThemeEnabled: {
      return {
        ...state,
        previouslyHadDarkThemeEnabled:
          action.payload.previouslyHadDarkThemeEnabled,
      };
    }
    case UserActionType.Logout: {
      return initialThemeState;
    }
    default:
      return state;
  }
};

const initialSnackbarState: ApplicationState['snackBar'] = {
  notifications: [],
};

const snackBarReducer = (
  state = initialSnackbarState,
  action: ApplicationWideAction
): ApplicationState['snackBar'] => {
  switch (action.type) {
    case ApplicationActionType.EnqueueSnackbar:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            ...action.payload.notification,
            key: action.payload.key,
          },
        ],
      };

    case ApplicationActionType.CloseSnackbar:
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          action.payload.dismissAll || notification.key === action.payload.key
            ? { ...notification, dismissed: true }
            : { ...notification }
        ),
      };

    case ApplicationActionType.RemoveSnackbar:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.key !== action.payload.key
        ),
      };

    case UserActionType.Logout:
      return initialSnackbarState;

    default:
      return state;
  }
};

const domainPersistConfig = {
  key: 'domain',
  storage: storageSession,
  transforms: [loadingDomainTransform],
};

const currentTimezonePersistConfig = {
  key: 'currentTimezone',
  storage: storageSession,
  transforms: [loadingCurrentTimezoneTransform],
};

export default combineReducers({
  // Use session storage for the domain which should help restore the
  // appropriate domain when refreshing the page, in case the user has multiple
  // tabs open with different domains.
  // @ts-ignore
  domain: persistReducer(domainPersistConfig, domainReducer),
  timezones: timezonesReducer,
  userPreferredTimezoneId: userPreferredTimezoneIdReducer,
  currentTimezone: persistReducer(
    currentTimezonePersistConfig,
    currentTimezoneReducer
  ),
  opsNavigationData: opsNavigationItemReducer,
  hasSetDefaultFavourite: hasSetDefaultFavouriteReducer,
  globalPermissionDeniedDialog: globalPermissionDeniedDialogReducer,
  showGlobalApplicationTimeoutDialog: showGlobalApplicationTimeoutDialogReducer,
  showGlobalMaintenanceDialog: showGlobalMaintenanceDialogReducer,
  fetchedFavouritesOn: fetchedFavouritesOnReducer,
  theme: themeReducer,
  snackBar: snackBarReducer,
});
