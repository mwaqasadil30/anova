import { IS_TOGGLE_DARK_THEME_FEATURE_ENABLED } from 'env';
import momentTimezone from 'moment-timezone';
import { ApplicationState } from 'redux-app/modules/app/types';
import { createTransform } from 'redux-persist';

export const revertLoadingState = (
  state: any | undefined,
  property = 'loading'
) => {
  if (state?.hasOwnProperty(property)) {
    return {
      ...state,
      [property]: false,
    };
  }

  return state;
};

/**
 * Change the loading state to be `false` to prevent the case where the
 * `loading: true` state is persisted to redux. This could potentially cause a
 * button to be disabled and never be enabled since the loading state was
 * persisted in localStorage. NOTE/TODO: This may be better handled/cleaner
 * with a "Nested Persist":
 * https://github.com/rt2zz/redux-persist#nested-persists
 * @param key The reducer key.
 * @param state The reducer state.
 */
const transformSerializedState = (state: any, key: any) => {
  switch (key) {
    case 'app':
      return {
        ...state,
        // NOTE: If dark theme toggle feature flag is disabled, and the user
        // had it enabled, we force the light theme
        ...(!IS_TOGGLE_DARK_THEME_FEATURE_ENABLED && {
          theme: {
            ...state.theme,
            isDarkThemeEnabled: false,
          },
        }),
        // Prevent the maintenance dialog from persisting if the user refreshes
        // their browser while the maintenance dialog is open (and maintenance
        // has ended).
        showGlobalApplicationTimeoutDialog: false,
        showGlobalMaintenanceDialog: false,
        domain: revertLoadingState(state.domain, 'isFetching'),
        timezones: revertLoadingState(state.timezones),
        currentTimezone: revertLoadingState(state.currentTimezone),
        // Reset the snackbar notifications state since at the moment we don't
        // want to persist them between page refreshes
        snackBar: {
          notifications: [],
        },
      } as Partial<ApplicationState>;
    case 'coreApi':
      return {
        ...state,
        login: revertLoadingState(state.currentTimezone),
      };
    case 'user':
      return {
        ...state,
        userPermissionsIsFetching: false,
      };
    default:
      return revertLoadingState(state);
  }
};

// Since we have a different persistor for the app, app.domain,
// app.currentTimezone reducers, we need to make sure we dont persist any
// loading state as `true`. Otherwise, if the user refreshed the page in the
// middle of an API call, redux will rehydrate `true` for the loading state of
// the API call. That would cause the app to always show a loading spinner in
// some cases.
const transformAppSerializedState = (state: any, key: any) => {
  if (key === 'domain') {
    return revertLoadingState(state, 'isFetching');
  }
  if (key === 'timezones') {
    return revertLoadingState(state);
  }
  return state;
};

const transformDomainSerializedState = (state: any, key: any) => {
  return key === 'isFetching' ? false : state;
};

const transformCurrentTimezoneSerializedState = (state: any, key: any) => {
  return key === 'loading' ? false : state;
};

const transformRehydratedState = (outboundState: any, key: any) => {
  if (key !== 'app' || !outboundState) {
    return outboundState;
  }

  // Set the default `moment` timezone in the app (based on the
  // TimezoneSwitcher component) when rehydrating the redux state. This affects
  // the date/time value used on date and time pickers.
  const ianaTimezoneId =
    outboundState?.currentTimezone?.timezone?.ianaTimezoneId;
  if (ianaTimezoneId) {
    momentTimezone.tz.setDefault(ianaTimezoneId);
  }

  // IMPORTANT NOTE: Since the entire redux app state is preserved in
  // localStorage and restored, breaking changes to the redux app state
  // structure could cause the app to crash for existing users. For example,
  // replacing the previous:
  //    app.isDarkThemeEnabled: boolean
  // state with the following:
  //    app.theme.isDarkThemeEnabled: boolean
  // will cause existing selectors to fail, since app.theme didn't exist in the
  // old preserved state.
  // To get around this, we adjust the rehydrated state to match the initial
  // state of the slice of state that changed.
  if (key === 'app' && !outboundState?.theme) {
    return {
      ...outboundState,
      theme: {
        isDarkThemeEnabled: false,
        previouslyHadDarkThemeEnabled: null,
      },
    };
  }

  return outboundState;
};

/**
 * Loading state should not be persisted across refreshes. If so, it could
 * cause an issue where:
 * 1. A user clicks a button
 * 2. The button gets disabled because an API request is `loading` (and the
 *    request takes a long time)
 * 3. The user reloads their browser while the request is being made
 * 4. The button always remains disabled since the `loading: true` state was
 *    persisted and rehydrated in the store.
 */
export const loadingTransform = createTransform(
  // transform state on its way to being serialized and persisted.
  transformSerializedState,
  // transform state being rehydrated
  transformRehydratedState,
  // define which reducers this transform gets called for.
  { whitelist: ['app', 'coreApi', 'user'] }
);

export const loadingAppTransform = createTransform(transformAppSerializedState);
export const loadingDomainTransform = createTransform(
  transformDomainSerializedState
);
export const loadingCurrentTimezoneTransform = createTransform(
  transformCurrentTimezoneSerializedState
);
