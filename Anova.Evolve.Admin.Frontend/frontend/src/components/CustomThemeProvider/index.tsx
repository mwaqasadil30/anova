/* eslint-disable indent */
import { Theme } from '@material-ui/core/styles';
import MuiThemeProvider from '@material-ui/styles/ThemeProvider';
import GlobalStyle from 'components/GlobalStyle';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  selectActiveDomainThemeColor,
  selectIsDarkThemeEnabled,
} from 'redux-app/modules/app/selectors';
import { ThemeProvider } from 'styled-components';
import { getDomainSecondaryThemeColor } from 'styles/colours';
import { createTheme, lightTheme, darkTheme } from 'styles/theme';

interface Props {
  children: React.ReactNode;
  forceThemeType?: 'light' | 'dark';
  includeGlobalStyles?: boolean;
}

const CustomThemeProvider = ({
  children,
  forceThemeType,
  includeGlobalStyles,
}: Props) => {
  const domainThemeColor = useSelector(selectActiveDomainThemeColor);
  const domainSecondaryThemeColor = getDomainSecondaryThemeColor(
    domainThemeColor
  );

  const isDarkThemeEnabled = useSelector(selectIsDarkThemeEnabled);

  const selectedThemeType =
    // Parentheses are required to correctly prioritize forceThemeType over
    // isDarkThemeEnabled. Without parentheses, 'dark' was always being
    // returned
    forceThemeType || (isDarkThemeEnabled ? 'dark' : 'light');
  const selectedTheme = selectedThemeType === 'dark' ? darkTheme : lightTheme;

  const themeOverrides = {
    ...selectedTheme,
    ...(domainThemeColor && {
      custom: {
        ...selectedTheme.custom,
        domainColor: domainThemeColor,
        domainSecondaryColor: domainSecondaryThemeColor,
      },
    }),
  } as Theme;

  const customTheme = useMemo(() => createTheme(themeOverrides), [
    domainThemeColor,
    domainSecondaryThemeColor,
    selectedThemeType,
  ]);

  return (
    <MuiThemeProvider theme={customTheme}>
      <ThemeProvider theme={customTheme}>
        {includeGlobalStyles && <GlobalStyle />}
        {children}
      </ThemeProvider>
    </MuiThemeProvider>
  );
};

export default CustomThemeProvider;
