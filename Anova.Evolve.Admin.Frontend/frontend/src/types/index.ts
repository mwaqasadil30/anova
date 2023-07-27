import { UserPermissionType, UserPermissionDetails } from 'api/admin/api';

// For userAccessToTranscendAndDolV3StatusId
// See: AuthenticateAndRetrieveApplicationInfo api endpoint AND/OR
// selectUserAccessTranscendAndDolv3StatusId in redux-app/modules/user/selectors.ts
export enum TranscendAndDolV3UserAccess {
  CanAccessTranscend = 1,
  CreatePasswordToAccessTranscendAndDolV3 = 2,
  CanAccessTranscendAndDolV3 = 3,
}

// Translations
export enum Language {
  English = 'en',
  German = 'de',
  Spanish = 'es',
  French = 'fr',
  Thai = 'th',
  ChineseSimplified = 'zh-Hans',
  ChineseTraditional = 'zh-Hant',
}

// Geographic time format
export enum GeoCsvFormat {
  NorthAmerica = 1,
  Europe = 2,
}

// Asset Graph
// NOTE: The zoom level enum values are in hours
export enum ReadingsChartZoomLevel {
  NotSet = 0,
  TwoYears = 17520,
  OneYear = 8760,
  TwelveWeeks = 2016,
  FourWeeks = 672,
  TwoWeeks = 336,
  OneWeek = 168,
  FourDays = 96,
  TwoDays = 48,
  OneDay = 24,
  TwelveHours = 12,
  SixHours = 6,
  ThreeHour = 3,
}

export const DEFAULT_CHART_ZOOM_LEVEL = ReadingsChartZoomLevel.OneWeek;

export enum OpsNavItemType {
  Favourite = 'favourite',
  Watchlist = 'watch-list',
  AssetGroup = 'asset-group',
  AssetTree = 'asset-tree',
}

// #region Permissions
export type PermissionMapping = Record<
  UserPermissionType,
  Omit<UserPermissionDetails, 'init' | 'toJSON'>
>;

export enum AccessType {
  Create = 'isCreateEnabled',
  Delete = 'isDeleteEnabled',
  Default = 'isEnabled',
  Read = 'isReadEnabled',
  Update = 'isUpdateEnabled',
}
// #endregion Permissions

// For the display units dropdown on the Asset Summary page
export enum UnitDisplayType {
  Scaled,
  Display,
  PercentFull,
}

export enum Application {
  Administration = 'administration',
  Operations = 'operations',
  Reports = 'reports',
  Training = 'training',
  Freezers = 'freezers',
  System = 'system',
}

// Application Insights Event Tracking
export enum AnalyticsEvent {
  SubmittedFeedback = 'SubmittedFeedback',
  VideoPlayed = 'Video Played',
  PDFDownloaded = 'PDF Downloaded',
}

export enum PDFDownloadType {
  FreezerDetail = 'Freezer Detail',
  AssetDetailGraph = 'Asset Detail Graph',
}

// Authentication
export enum SingleSignOnClientAppEnvironment {
  Test = 'TEST',
  Production = 'PRODUCTION',
}
export enum AuthProviderClassificiation {
  SingleSignOn = 'Single Sign-On',
  DOLV3 = 'DOLV3',
}

export interface AppConfig {
  REACT_APP_ACTIVE_EVENTS_API_POLLING_INTERVAL_IN_SECONDS?: string;
  REACT_APP_ADMIN_BASE_API_URL?: string;
  REACT_APP_APP_WHITELISTED_USERNAMES?: string;
  REACT_APP_APPLICATION_INSIGHTS_INSTRUMENTATION_KEY?: string;
  REACT_APP_DEV_TOGGLE_DARK_THEME_EVERYWHERE_FEATURE?: string;
  REACT_APP_DEV_USE_PROXY?: string;
  REACT_APP_ENABLE_ASSET_DETAIL_POLL_RTU_FEATURE?: string;
  REACT_APP_ENABLE_DATA_CHANNEL_GENERAL_INFO_EDIT_FEATURE?: string;
  REACT_APP_ENABLE_DATA_CHANNEL_SENSOR_CALIBRATION_EDIT_FEATURE?: string;
  REACT_APP_ENABLE_DATA_CHANNEL_TANK_AND_SENSOR_CONFIGURATION_EDIT_FEATURE?: string;
  REACT_APP_ENABLE_DATA_CHANNEL_TANK_SETUP_EDIT_FEATURE?: string;
  REACT_APP_ENABLE_DATA_CHANNEL_FORECAST_AND_DELIVERY_EDIT_FEATURE?: string;
  REACT_APP_ENABLE_DATA_CHANNEL_INTEGRATION_PANEL_EDIT_FEATURE?: string;
  REACT_APP_ENABLE_DATA_CHANNEL_CUSTOM_INTEGRATION1_EDIT_FEATURE?: string;
  REACT_APP_ENABLE_DATA_CHANNEL_EVENTS_EDIT_FEATURE?: string;
  REACT_APP_ENABLE_ASSET_MAP_FEATURE?: string;
  REACT_APP_ENABLE_NEW_DATA_CHANNEL_EDITOR_FEATURE?: string;
  REACT_APP_ENABLE_PROBLEM_REPORTS_FEATURE?: string;
  REACT_APP_ENABLE_QUICK_EDIT_EVENTS_SAVE_FEATURE?: string;
  REACT_APP_ENABLE_FREEZERS_APP_FEATURE?: string;
  REACT_APP_ENABLE_NEW_APP_VERSION_FEATURE?: string;
  REACT_APP_ENABLE_RTU_EDITOR_FEATURE?: string;
  REACT_APP_ENABLE_TOGGLE_DARK_THEME_FEATURE?: string;
  REACT_APP_I18NEXT_DEBUG?: string;
  REACT_APP_MAPBOX_ACCESS_TOKEN?: string;
  REACT_APP_MAX_GRAPHABLE_DATA_CHANNEL_COUNT?: string;
  REACT_APP_NEW_APP_VERSION_INTERVAL_IN_MINUTES?: string;
  REACT_APP_PROBLEM_REPORTS_API_POLLING_INTERVAL_IN_SECONDS?: string;
  REACT_APP_VIRTUAL_FLOW_METER_ENABLED_DOMAINS?: string;
  REACT_APP_SESSION_PROBE_INTERVAL_IN_MINUTES?: string;
  REACT_APP_SSO_CLIENT_APPLICATION_ENVIRONMENT?: string;
  REACT_APP_TRAINING_VIDEO_BASE_API_URL?: string;
  REACT_APP_WELCOME_VIDEO_URL?: string;
}
