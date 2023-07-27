/* eslint-disable no-console */
import clamp from 'lodash/clamp';
import cloneDeep from 'lodash/cloneDeep';
import { isNumber } from 'utils/format/numbers';

// Clone the config to prevent modifying it easily by changing window.__config
// at any time. This means it can only be modified when the application starts.
export const appConfig = cloneDeep(window.__config);

const commonTruthyBooleanStrings = ['true', '1', 'yes', 'y'];

const stringToBoolean = (variable?: string | null) =>
  !!variable && commonTruthyBooleanStrings.includes(variable.toLowerCase());

const logWarningIfMissingVariable = (variable: any, name: string) => {
  if (!variable && process.env.NODE_ENV !== 'test') {
    console.warn(`Missing required configuration for ${name}`);
  }
};

// #region API URLs
// For local development, we access the ADMIN_BASE_API_URL via an environment
// variable because we need to run a proxy (via `src/setupProxy.js`). For all
// other environments, it should be set via the `config.js` file.
export const ADMIN_BASE_API_URL =
  appConfig?.REACT_APP_ADMIN_BASE_API_URL ||
  process.env.REACT_APP_ADMIN_BASE_API_URL;
export const TRAINING_VIDEO_BASE_API_URL =
  appConfig?.REACT_APP_TRAINING_VIDEO_BASE_API_URL;
// #endregion API URLs

// #region Keys and tokens
export const APPLICATION_INSIGHTS_INSTRUMENTATION_KEY =
  appConfig?.REACT_APP_APPLICATION_INSIGHTS_INSTRUMENTATION_KEY;
export const MAPBOX_ACCESS_TOKEN = appConfig?.REACT_APP_MAPBOX_ACCESS_TOKEN;
// #endregion Keys and tokens

// #region General feature flags
export const IS_ASSET_DETAIL_POLL_RTU_FEATURE_ENABLED = stringToBoolean(
  appConfig?.REACT_APP_ENABLE_ASSET_DETAIL_POLL_RTU_FEATURE
);
export const IS_DATA_CHANNEL_GENERAL_INFO_EDIT_FEATURE_ENABLED = stringToBoolean(
  appConfig?.REACT_APP_ENABLE_DATA_CHANNEL_GENERAL_INFO_EDIT_FEATURE
);
export const IS_DATA_CHANNEL_SENSOR_CALIBRATION_EDIT_FEATURE_ENABLED = stringToBoolean(
  appConfig?.REACT_APP_ENABLE_DATA_CHANNEL_SENSOR_CALIBRATION_EDIT_FEATURE
);
export const IS_DATA_CHANNEL_TANK_AND_SENSOR_CONFIGURATION_EDIT_FEATURE_ENABLED = stringToBoolean(
  appConfig?.REACT_APP_ENABLE_DATA_CHANNEL_TANK_AND_SENSOR_CONFIGURATION_EDIT_FEATURE
);
export const IS_DATA_CHANNEL_TANK_SETUP_EDIT_FEATURE_ENABLED = stringToBoolean(
  appConfig?.REACT_APP_ENABLE_DATA_CHANNEL_TANK_SETUP_EDIT_FEATURE
);
export const IS_DATA_CHANNEL_FORECAST_AND_DELIVERY_EDIT_FEATURE_ENABLED = stringToBoolean(
  appConfig?.REACT_APP_ENABLE_DATA_CHANNEL_FORECAST_AND_DELIVERY_EDIT_FEATURE
);
export const IS_DATA_CHANNEL_INTEGRATION_PANEL_EDIT_FEATURE_ENABLED = stringToBoolean(
  appConfig?.REACT_APP_ENABLE_DATA_CHANNEL_INTEGRATION_PANEL_EDIT_FEATURE
);
export const IS_DATA_CHANNEL_CUSTOM_INTEGRATION1_EDIT_FEATURE_ENABLED = stringToBoolean(
  appConfig?.REACT_APP_ENABLE_DATA_CHANNEL_CUSTOM_INTEGRATION1_EDIT_FEATURE
);
export const IS_DATA_CHANNEL_EVENTS_EDIT_FEATURE_ENABLED = stringToBoolean(
  appConfig?.REACT_APP_ENABLE_DATA_CHANNEL_EVENTS_EDIT_FEATURE
);
export const IS_ASSET_MAP_FEATURE_ENABLED = stringToBoolean(
  appConfig?.REACT_APP_ENABLE_ASSET_MAP_FEATURE
);
export const IS_NEW_DATA_CHANNEL_EDITOR_FEATURE_ENABLED = stringToBoolean(
  appConfig?.REACT_APP_ENABLE_NEW_DATA_CHANNEL_EDITOR_FEATURE
);
export const IS_RTU_EDITOR_FEATURE_ENABLED = stringToBoolean(
  appConfig?.REACT_APP_ENABLE_RTU_EDITOR_FEATURE
);
export const IS_PROBLEM_REPORTS_FEATURE_ENABLED = stringToBoolean(
  appConfig?.REACT_APP_ENABLE_PROBLEM_REPORTS_FEATURE
);
export const IS_QUICK_EDIT_EVENTS_SAVE_FEATURE_ENABLED = stringToBoolean(
  appConfig?.REACT_APP_ENABLE_QUICK_EDIT_EVENTS_SAVE_FEATURE
);
export const IS_FREEZERS_APP_FEATURE_ENABLED = stringToBoolean(
  appConfig?.REACT_APP_ENABLE_FREEZERS_APP_FEATURE
);

export const IS_NEW_APP_VERSION_FEATURE_ENABLED = stringToBoolean(
  appConfig?.REACT_APP_ENABLE_NEW_APP_VERSION_FEATURE
);

export const IS_TOGGLE_DARK_THEME_FEATURE_ENABLED = stringToBoolean(
  appConfig?.REACT_APP_ENABLE_TOGGLE_DARK_THEME_FEATURE
);
export const IS_DEV_TOGGLE_DARK_THEME_EVERYWHERE_FEATURE_ENABLED = stringToBoolean(
  appConfig?.REACT_APP_DEV_TOGGLE_DARK_THEME_EVERYWHERE_FEATURE
);
// #endregion General feature flags

// #region Data channel graph related configuration
const maxGraphableDataChannelCount =
  appConfig?.REACT_APP_MAX_GRAPHABLE_DATA_CHANNEL_COUNT;
export const MAX_GRAPHABLE_DATA_CHANNEL_COUNT =
  isNumber(maxGraphableDataChannelCount) &&
  Number(maxGraphableDataChannelCount) >= 1
    ? clamp(Number(maxGraphableDataChannelCount), 1, 5)
    : 1;
// #endregion Data channel graph related configuration

export const SHOULD_USE_PROXY = stringToBoolean(
  appConfig?.REACT_APP_DEV_USE_PROXY
);

export const I18NEXT_DEBUG = stringToBoolean(
  appConfig?.REACT_APP_I18NEXT_DEBUG
);

export const SSO_CLIENT_APPLICATION_ENVIRONMENT = appConfig?.REACT_APP_SSO_CLIENT_APPLICATION_ENVIRONMENT?.toUpperCase().trim();

export const WELCOME_VIDEO_URL =
  appConfig?.REACT_APP_WELCOME_VIDEO_URL ||
  'https://ucarecdn.com/a968ea27-6584-4426-81ef-f726c1adc2fb/';

const appVersionCheckerIntervalInMinutes =
  appConfig?.REACT_APP_NEW_APP_VERSION_INTERVAL_IN_MINUTES;
export const APP_VERSION_CHECKER_INTERVAL_IN_MINUTES =
  isNumber(appVersionCheckerIntervalInMinutes) &&
  Number(appVersionCheckerIntervalInMinutes) >= 1
    ? Number(appVersionCheckerIntervalInMinutes)
    : 60;

const sessionProbeIntervalInMinutes =
  appConfig?.REACT_APP_SESSION_PROBE_INTERVAL_IN_MINUTES;
export const SESSION_PROBE_INTERVAL_IN_MINUTES =
  isNumber(sessionProbeIntervalInMinutes) &&
  Number(sessionProbeIntervalInMinutes) >= 1
    ? Number(sessionProbeIntervalInMinutes)
    : 60;

const activeEventsApiPollingIntervalInSeconds =
  appConfig?.REACT_APP_ACTIVE_EVENTS_API_POLLING_INTERVAL_IN_SECONDS;
export const ACTIVE_EVENTS_API_POLLING_INTERVAL_IN_SECONDS =
  isNumber(activeEventsApiPollingIntervalInSeconds) &&
  Number(activeEventsApiPollingIntervalInSeconds) >= 30
    ? Number(activeEventsApiPollingIntervalInSeconds)
    : 120;

const problemReportsApiPollingIntervalInSeconds =
  appConfig?.REACT_APP_PROBLEM_REPORTS_API_POLLING_INTERVAL_IN_SECONDS;
export const PROBLEM_REPORT_API_POLLING_INTERVAL_IN_SECONDS =
  isNumber(problemReportsApiPollingIntervalInSeconds) &&
  Number(problemReportsApiPollingIntervalInSeconds) >= 30
    ? Number(problemReportsApiPollingIntervalInSeconds)
    : 120;

export const APP_PARSED_WHITELISTED_USERNAMES = appConfig?.REACT_APP_APP_WHITELISTED_USERNAMES?.toLowerCase()
  .split(',')
  .map((username) => username.trim());

export const VIRTUAL_FLOW_METER_ENABLED_DOMAINS =
  appConfig?.REACT_APP_VIRTUAL_FLOW_METER_ENABLED_DOMAINS?.toLowerCase()
    .split(',')
    .map((domainName) => domainName.trim()) || [];

logWarningIfMissingVariable(ADMIN_BASE_API_URL, 'ADMIN_BASE_API_URL');
logWarningIfMissingVariable(MAPBOX_ACCESS_TOKEN, 'MAPBOX_ACCESS_TOKEN');
logWarningIfMissingVariable(
  TRAINING_VIDEO_BASE_API_URL,
  'TRAINING_VIDEO_BASE_API_URL'
);
