import grey from '@material-ui/core/colors/grey';

export const white = '#ffffff';
export const black = '#000000';
export const gray25 = '#C5C5C5';
export const gray50 = '#FAFAFA';
export const gray100 = '#F7F7F7';
export const gray150 = '#F0F0F0';
export const gray200 = '#E1E1E1';
export const gray300 = '#D7D7D7';
export const gray600 = '#7E7E7E';
export const gray700 = '#626262';
export const gray800 = '#4B4B4B';
export const gray900 = '#333333';
export const gray950 = '#111111';
export const yellow300 = '#FFEB99';
export const yellow700 = '#806B19';
export const red500 = '#F04632';

export const boxBorderColor = '#CFCFCF';
export const lightBorderColor = '#D1D1D1';
export const boxBackgroundGrey = '#F8F8F8';
export const lightTextColor = '#767676';
export const mediumTextColor = '#404040';
export const brandYellow = '#FFD732';
export const defaultTextColor = '#1A1A1A';
export const checkmarkGreen = '#159e50';
export const crossRed = '#f23633';

export const isDragAcceptColor = '#00e676';
export const isDragRejectColor = '#ff1744';
export const isDragActiveColor = '#2196f3';
export const isDragDefaultColor = '#CCCCCC';

export const isDragAcceptColorDark = '#00e676';
export const isDragRejectColorDark = '#ff1744';
export const isDragActiveColorDark = '#2196f3';
export const isDragDefaultColorDark = gray600;

export const darkenedHeadingTableRowColor = '#E9E9E9';

export const errorMessageBlockBackground = '#F7FAFC';
export const navBarCloseIconColor = '#d9d9d9';
export const multiSelectActionButtonBackground = '#EBEBEB';
export const iconYellow = brandYellow;
export const loadingSpinnerColor = brandYellow;
export const tabErrorBadgeColor = '#F04632';
export const metricTotalCountColor = '#343434';
export const darkIconColor = '#111111';
export const addColor = '#2D4187';
export const lightDividerColor = '#efefef';
export const removeColor = '#B43526';
export const emptyBackgroundColor = '#f5f5f5;';
export const fadedPropertyTextColor = '#949494';
export const entityDetailBorderColor = '#949494';
export const inputBorderColor = '#949494';
export const switchBackgroundColor = '#949494';
export const switchSelectedColor = '#1A1A1A';
export const tabYellow = brandYellow;
export const backgroundFadedYellow = '#fffbeb';
export const subHeaderTextColor = '#2E2E2E';
export const fadedBreadcrumbColor = '#A8A8A8';
export const fadedOpsBreadcrumbColor = '#B1B1B1';
export const fadedTextColor = '#9E9E9E';
export const tableBorderColor = '#CFCFCF';
export const tableBorderColorDark = '#6d6d6d';
export const darkTextColor = '#7E7E7E';
export const missingDataColor = '#A98492';
export const fullColor = '#3893FF';
export const fullColorDark = '#4CACEB';
export const userDefinedColor = '#FFA500';
export const reorderColor = '#3BB573';
export const reorderColorDark = '#3BB573';
export const criticalColor = '#E53935';
export const criticalColorDark = '#DD4534';
export const emptyColor = criticalColor;
export const emptyColorDark = criticalColorDark;
export const urgentColor = 'rgb(229, 57, 53)';
export const highColor = 'rgb(255, 132, 49)';
export const warningColor = '#2D8DF7';
export const informationColor = '#0A38CC';
export const refillColor = 'rgb(253, 216, 53)';
export const normalColor = 'rgb(29, 161, 242)';
export const mapMarkerColor = grey[800];
export const tableRowHoverColor = '#fdf0ca';
export const tableRowHoverColorDark = '#1f1f1f';
export const tableFooterColor = '#FFFFFF';
export const tableFooterColorDark = '#515151';
export const valueDividerColor = '#DCDCDC';
export const tableHeaderColor = '#515151';
export const paginationActiveColor = tableHeaderColor;
export const paginationInactiveColor = '#F0F0F0';
export const paginationActiveColorDark = gray900;
export const paginationInactiveColorDark = gray800;
export const tableHeaderBorderColor = '#6d6d6d';
export const criticalOrEmptyTankColor = '#DD4534';
export const criticalOrEmptyTankColorDark = criticalColorDark;
export const reorderTankColor = '#3BB573';
export const reorderTankColorDark = '#3BB573';
export const normalTankColor = '#3447AE';
export const normalTankColorDark = '#4F6BFA';
export const userDefinedTankColor = '#505050';

export const freezerCritical = '#FF7060';
export const freezerWarning = '#FFD732';
export const freezerOkay = '#67EB8C';

// #Hicharts graph styles
export const graphColours = {
  inactiveLegendItem: '#CCCCCC',
  gridLine: 'rgba(0, 0, 0, 0.1)',
  gridLineDark: 'rgba(255, 255, 255, 0.1)',
  axisLine: '#bdbdbd',
  axisLineDark: '#656565',
  axisLabel: '#666666',
  axisLabelDark: 'rgba(255, 255, 255, 0.75)',
  crosshair: '#cccccc',
  crosshairDark: '#a2a2a2',
  mainPlotLine: '#333333',
  mainPlotLineDark: '#dadada',
  fullPlotLine: '#2196f3',
  reorderPlotLine: '#13B15C',
  urgentPlotLine: '#F03737',
  userDefinedPlotLine: '#fb8c00',
  noInventoryStatusPlotline: '#999999',
  tooltip: {
    backgroundColor: 'white',
    backgroundColorDark: '#1d1d1d',
  },

  pastBand: '#FFFAE4',
  // Previously used 'rgba(203, 203, 211, 0.25)' for the regular band
  regularBand: 'rgba(0, 0, 0, 0.12)',
  reorderBand: 'rgba(91, 200, 53, 0.25)',
  urgentBand: 'rgba(254, 67, 45, 0.2)',
  userDefinedBand: 'rgba(251, 140, 0, 0.25)',
  futureBand: 'rgba(0, 0, 0, 0.12)', // Previously using a darker color #FFF1CD
  emptyBand: '#FFFFFF',

  forecastSeriesColour: 'black',
  forecastSeriesColourDark: '#a7a7a7',

  seriesColours: [
    '#2196f3',
    '#9f7fd7',
    '#4caf50',
    '#e91e63',
    '#ffc107',
    '#009688',
    '#cddc39',
    '#795548',
    '#3f51b5',
  ],
};

// #region Domain colors
// Colors prefixed with OLD_ are deprecated
export enum DomainThemeColor {
  Yellow = '#FFD732',
  Blue = '#4CACEB',
  Navy = '#427CD2',
  Green = '#4AC281',
  Teal = '#3FA3AE',
  Orange = '#FF8730',
  Red = '#ED5C5C',
  /* eslint-disable @typescript-eslint/camelcase */
  OLD_Blue = '#31B9E2',
  OLD_Blue2 = '#27B9E8',
  OLD_Navy = '#6580C8',
  OLD_Orange = '#FFAB49',
  /* eslint-enable @typescript-eslint/camelcase */
}

export const DEFAULT_DOMAIN_THEME_COLOR = DomainThemeColor.Yellow;
export const DEFAULT_DOMAIN_SECONDARY_THEME_COLOR = '#464646';

export const DOMAIN_PRIMARY_TO_SECONDARY_COLOUR_MAPPING = {
  [DomainThemeColor.Blue]: DomainThemeColor.Blue,
  [DomainThemeColor.Navy]: DomainThemeColor.Navy,
  [DomainThemeColor.Teal]: DomainThemeColor.Teal,
  [DomainThemeColor.Green]: DomainThemeColor.Green,
  [DomainThemeColor.Orange]: DomainThemeColor.Orange,
  [DomainThemeColor.Yellow]: DEFAULT_DOMAIN_SECONDARY_THEME_COLOR,
  [DomainThemeColor.Red]: DEFAULT_DOMAIN_SECONDARY_THEME_COLOR,
  [DomainThemeColor.OLD_Blue]: DomainThemeColor.Blue,
  [DomainThemeColor.OLD_Blue2]: DomainThemeColor.Blue,
  [DomainThemeColor.OLD_Navy]: DomainThemeColor.Navy,
  [DomainThemeColor.OLD_Orange]: DomainThemeColor.Orange,
};
export const getDomainSecondaryThemeColor = (
  primaryDomainColor?: string | null
) => {
  return (
    // @ts-ignore
    DOMAIN_PRIMARY_TO_SECONDARY_COLOUR_MAPPING[primaryDomainColor] ||
    DEFAULT_DOMAIN_SECONDARY_THEME_COLOR
  );
};

// #endregion Domain colors

export const getCustomDomainContrastText = (backgroundColor: string) => {
  return backgroundColor === DomainThemeColor.Yellow ? black : white;
};
