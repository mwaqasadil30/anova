/* eslint-disable no-restricted-imports */
// Material-UI docs for customizing theme:
// https://material-ui.com/guides/typescript/#customization-of-theme
import * as createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { CustomTheme, CustomThemeOptions } from 'styles/theme';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme extends createMuiTheme.Theme {
    custom: CustomTheme;
  }

  interface ThemeOptions extends createMuiTheme.ThemeOptions {
    custom: CustomThemeOptions;
  }
}
