import { createMuiTheme, ThemeOptions } from '@material-ui/core/styles';
import merge from 'lodash/merge';
import {
  black,
  brandYellow,
  defaultTextColor,
  isDragAcceptColor,
  isDragRejectColor,
  isDragActiveColor,
  isDragDefaultColor,
  isDragAcceptColorDark,
  isDragRejectColorDark,
  isDragActiveColorDark,
  isDragDefaultColorDark,
  getDomainSecondaryThemeColor,
  graphColours,
  gray100,
  gray700,
  gray900,
  tableBorderColor,
  tableBorderColorDark,
  tableRowHoverColor,
  tableRowHoverColorDark,
  paginationActiveColor,
  paginationInactiveColor,
  paginationActiveColorDark,
  paginationInactiveColorDark,
  white,
  tableFooterColor,
  tableFooterColorDark,
} from './colours';
import { defaultFonts } from './fonts';

// The breakpoint (and anything below) at which the side-navigation will be
// changed to overlap the content of the page instead of shrinking the main
// content of the page
export const mobileSidebarBreakpoint = 'md';
export const closedSidebarWidth = 64;
export const openedSidebarWidth = 240;
export const inputLabelHeight = 24;
export const navbarHeight = 56;
export const opsNavbarHeight = 46;
export const constructionBannerHeight = 30;

export interface CustomThemeOptions {
  domainColor?: string;
  domainSecondaryColor?: string;
  palette?: {
    icon?: {
      color?: string;
      fadedColor?: string;
    };
    dataChannelIcon: string;
    background?: {
      defaultAlternate: string;
      drawerHeader?: string;
      buttonBackground: string;
      outlineButtonHoverBackground: string;
      paginationItemActive: string;
      paginationItemInactive: string;
    };
    draggable: {
      isDraggingColor: string;
      isNotDraggingColor: string;
      isDragAccept: string;
      isDragReject: string;
      isDragActive: string;
      isDragDefault: string;
    };
    table?: {
      borderColor?: string;
      rowHoverColor?: string;
      footerCellBackgroundColor?: string;
    };
    gradient?: {
      gradientStart?: string;
      gradientEnd?: string;
    };
    switch?: {
      trackColor?: string;
      trackBorderColor?: string;
    };
  };
  highcharts?: {
    axisLabelColor?: string;
    axisLineColor?: string;
    gridLineColor?: string;
    crosshairColor?: string;
    mainPlotLineColor?: string;
    tooltip?: {
      backgroundColor?: string;
    };
  };
  fontSize?: {
    commonFontSize?: string;
    commonLineHeight?: string;
    tableCells?: string;
    uniqueLineHeight?: string;
  };
}
export interface CustomTheme {
  domainColor: string;
  domainSecondaryColor: string;
  palette: {
    icon: {
      color: string;
      fadedColor: string;
    };
    dataChannelIcon: string;
    background: {
      defaultAlternate: string;
      drawerHeader: string;
      buttonBackground: string;
      outlineButtonHoverBackground: string;
      paginationItemActive: string;
      paginationItemInactive: string;
    };
    draggable: {
      isDraggingColor: string;
      isNotDraggingColor: string;
      isDragAccept: string;
      isDragReject: string;
      isDragActive: string;
      isDragDefault: string;
    };
    table: {
      borderColor: string;
      rowHoverColor: string;
      footerCellBackgroundColor: string;
    };
    gradient: {
      gradientStart: string;
      gradientEnd: string;
    };
    switch: {
      trackColor: string;
      trackBorderColor: string;
    };
  };
  highcharts: {
    axisLabelColor: string;
    axisLineColor: string;
    gridLineColor: string;
    crosshairColor: string;
    mainPlotLineColor: string;
    tooltip: {
      backgroundColor: string;
    };
  };
  fontSize: {
    commonFontSize: string;
    commonLineHeight: string;
    tableCells: string;
    uniqueLineHeight: string;
  };
}

const commonBorderRadius = 10;
const commonSelectMenuDropdownFontSize = 13;

const commonTheme: Partial<ThemeOptions> = {
  shape: {
    borderRadius: commonBorderRadius,
  },
  overrides: {
    // Material-UI types dont have Autocomplete-related (Material-ui/lab)
    // props in typescript, but they can still be accessed with a @ts-ignore.
    // Example below:
    // @ts-ignore
    MuiAutocomplete: {
      loading: {
        fontSize: commonSelectMenuDropdownFontSize,
      },
      option: {
        fontSize: commonSelectMenuDropdownFontSize,
      },
    },
    MuiDialog: {
      paper: {
        borderRadius: commonBorderRadius,
      },
    },
    MuiMenu: {
      paper: {
        borderRadius: commonBorderRadius,
      },
    },
    MuiMenuItem: {
      root: {
        fontSize: commonSelectMenuDropdownFontSize,
      },
    },
  },
  custom: {
    fontSize: {
      // NOTE: in-line styles wont be changed by this value
      commonFontSize: '13px',
      tableCells: '13px',
      commonLineHeight: '18px',
      // some tables require a 19px line height for a 13px font size
      uniqueLineHeight: '19px',
    },
  },
};

// See Material UI "Dark mode" documentation to see the changes applied to
// light/dark theme:
// https://material-ui.com/customization/palette/#dark-mode
// Material UI "Default Theme" documentation:
// https://material-ui.com/customization/default-theme/
export const lightTheme: Partial<ThemeOptions> = merge({}, commonTheme, {
  palette: {
    type: 'light',
    error: {
      main: '#ED2D2D',
    },
    text: {
      primary: 'rgba(51, 51, 51, 1)',
      secondary: 'rgba(51, 51, 51, 0.65)',
      disabled: 'rgba(51, 51, 51, 0.37)',
    },
    background: {
      default: '#F8F8F8',
      paper: white,
    },
    action: {
      active: 'rgba(0, 0, 0, 0.54)',
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(0, 0, 0, 0.08)',
      disabled: 'rgba(51, 51, 51, 0.37)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  overrides: {
    MuiAlert: {
      filledError: {
        backgroundColor: '#F3423A',
      },
    },
    MuiAppBar: {
      colorDefault: {
        backgroundColor: white,
      },
    },
    // Change the default light theme color of icons within IconButtons to
    // match designs in Figma (a slightly darker gray compared to Material UI's
    // default).
    MuiIconButton: {
      root: {
        color: 'rgb(98, 98, 98)',
      },
    },
    // Overrides for @material-ui/pickers
    // https://material-ui-pickers.dev/guides/css-overrides#override-example
    MuiPickersDay: {
      day: {
        color: defaultTextColor,
      },
      daySelected: {
        backgroundColor: gray900,
        '&:hover': {
          backgroundColor: black,
        },
      },
      current: {
        color: black,
        '& .MuiTypography-body2': {
          fontWeight: 600,
        },
      },
    },
  },
  custom: {
    palette: {
      icon: {
        color: 'rgb(98, 98, 98)',
        fadedColor: 'rgb(216, 216, 216)',
      },
      dataChannelIcon: '#6c6c6c',
      background: {
        defaultAlternate: '#CCCCCC',
        drawerHeader: white,
        buttonBackground: '#e6e6e6',
        outlineButtonHoverBackground: gray100,
        paginationItemActive: paginationActiveColor,
        paginationItemInactive: paginationInactiveColor,
      },
      draggable: {
        isDraggingColor: '#d3d3d3',
        isNotDraggingColor: '#ffffff',
        isDragAccept: isDragAcceptColor,
        isDragReject: isDragRejectColor,
        isDragActive: isDragActiveColor,
        isDragDefault: isDragDefaultColor,
      },
      table: {
        borderColor: tableBorderColor,
        rowHoverColor: tableRowHoverColor,
        footerCellBackgroundColor: tableFooterColor,
      },
      gradient: {
        gradientStart: 'rgba(255, 255, 255, 1)',
        gradientEnd: 'rgba(255, 255, 255, 0)',
      },
      switch: {
        trackColor: white,
        trackBorderColor: 'rgba(51, 51, 51, 0.65)',
      },
    },
    highcharts: {
      axisLabelColor: graphColours.axisLabel,
      axisLineColor: graphColours.axisLine,
      gridLineColor: graphColours.gridLine,
      crosshairColor: graphColours.crosshair,
      mainPlotLineColor: graphColours.mainPlotLine,
      tooltip: {
        backgroundColor: graphColours.tooltip.backgroundColor,
      },
    },
  } as CustomTheme,
});
export const darkTheme: Partial<ThemeOptions> = merge({}, commonTheme, {
  palette: {
    type: 'dark',
    error: {
      main: '#FF8E8E',
    },
    text: {
      primary: 'rgba(255, 255, 255, 1)',
      secondary: 'rgba(255, 255, 255, 0.75)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
    background: {
      default: '#666666',
      paper: '#333333',
    },

    action: {
      active: '#fff',
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.16)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  overrides: {
    MuiAlert: {
      filledError: {
        backgroundColor: '#F3423A',
      },
    },
    MuiAppBar: {
      colorDefault: {
        backgroundColor: '#333333',
        color: 'rgba(210, 210, 210, 1)',
      },
    },
    MuiPickersCalendarHeader: {
      dayLabel: {
        color: white,
      },
    },
    // Overrides for @material-ui/pickers
    // https://material-ui-pickers.dev/guides/css-overrides#override-example
    MuiPickersDay: {
      day: {
        color: white,
      },
      dayDisabled: {
        color: gray700,
      },
      daySelected: {
        backgroundColor: '#666666',
        '&:hover': {
          backgroundColor: '#666666',
        },
      },
      current: {
        color: black,
        '& .MuiTypography-body2': {
          fontWeight: 600,
          color: white,
        },
      },
    },
  },
  custom: {
    palette: {
      icon: {
        fadedColor: 'rgb(119, 119, 119)',
      },
      dataChannelIcon: '#b8b8b8',
      background: {
        defaultAlternate: '#666666',
        drawerHeader: '#515151',
        buttonBackground: '#333333',
        outlineButtonHoverBackground: '#333333',
        paginationItemActive: paginationActiveColorDark,
        paginationItemInactive: paginationInactiveColorDark,
      },
      draggable: {
        isDraggingColor: '#515151',
        isNotDraggingColor: '#333333',
        isDragAccept: isDragAcceptColorDark,
        isDragReject: isDragRejectColorDark,
        isDragActive: isDragActiveColorDark,
        isDragDefault: isDragDefaultColorDark,
      },
      table: {
        borderColor: tableBorderColorDark,
        rowHoverColor: tableRowHoverColorDark,
        footerCellBackgroundColor: tableFooterColorDark,
      },
      gradient: {
        gradientStart: 'rgba(51, 51, 51, 1)',
        gradientEnd: 'rgba(51, 51, 51, 0)',
      },
      switch: {
        trackColor: '#a7a7a7',
        trackBorderColor: '#a7a7a7',
      },
    },
    highcharts: {
      axisLabelColor: graphColours.axisLabelDark,
      axisLineColor: graphColours.axisLineDark,
      gridLineColor: graphColours.gridLineDark,
      crosshairColor: graphColours.crosshairDark,
      mainPlotLineColor: graphColours.mainPlotLineDark,
      tooltip: {
        backgroundColor: graphColours.tooltip.backgroundColorDark,
      },
    },
    fontSize: {
      // NOTE: in-line styles wont be changed by this value
      commonFontSize: '13px',
      tableCells: '13px',
      commonLineHeight: '18px',
      // some tables require a 19px line height for a 13px font size
      uniqueLineHeight: '19px',
    },
  } as CustomTheme,
});

// Material-ui theme
// https://material-ui.com/customization/default-theme/#default-theme
export const createTheme = (themeOverrides?: Partial<ThemeOptions>) => {
  const builtTheme = createMuiTheme(
    {
      palette: {
        primary: {
          main: '#3f51b5',
        },
        secondary: {
          main: '#f50057',
        },
        error: {
          main: '#f44336',
        },
      },
      typography: {
        fontFamily: defaultFonts,
        button: {
          textTransform: 'none',
        },
        // NOTE: This property touches most components; this could be used for
        // implementing the dark theme option
        // allVariants: {
        //   color: 'red',
        // },
      },
      mixins: {
        toolbar: {
          '@media (min-width:600px)': {
            minHeight: 56,
          },
        },
      },
      props: {
        MuiDialog: {
          PaperProps: {
            square: true,
          },
        },
      },
      overrides: {
        MuiAppBar: {
          root: {
            backgroundColor: white,
          },
        },
        MuiPickersToolbar: {
          toolbar: {
            backgroundColor: 'blue',
          },
        },
        MuiLink: {
          root: {
            fontFamily: defaultFonts,
          },
        },
      },
      custom: {
        domainColor: brandYellow,
        domainSecondaryColor: getDomainSecondaryThemeColor(brandYellow),
      },
    } as ThemeOptions,
    themeOverrides as object
  );
  return builtTheme;
};

const defaultTheme = createTheme();

export default defaultTheme;
