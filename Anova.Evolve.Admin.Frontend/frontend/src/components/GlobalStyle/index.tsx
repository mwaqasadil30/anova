/* eslint-disable indent */
import { createGlobalStyle } from 'styled-components';

// Global styles to help with dark theme styling. Some of this was retrieved
// from Material UI's CssBaseline component which has some adjustments for dark
// theme. The CssBaseline component itself wasn't used since it affected
// multiple parts of the app that have already been implemented.
// https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/CssBaseline/CssBaseline.js
const GlobalStyle = createGlobalStyle`
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    color: ${(props) => props.theme.palette.text.primary};
    background-color: ${(props) => props.theme.palette.background.default};

    @media print {
      // Save printer ink.
      background-color: ${(props) => props.theme.palette.common.white};
    }

    // Add support for document.body.requestFullScreen().
    // Other elements, if background transparent, are not supported.
    &::backdrop {
      background-color: ${(props) => props.theme.palette.background.default};
    }
  }

  :root {
    /*
      For webkit browsers (i.e. everthing minus Firefox). Safari seems to have
      issues with this where it doesn't update the scrollbar color immediately
      when changing the theme (hovering over the scrollbar seems to trigger the
      change). Might need to find an alternative way to style scrollbars in
      Safari.
    */
    color-scheme: ${(props) =>
      props.theme.palette.type === 'light' ? 'light' : 'dark'};

    /* For Firefox */
    scrollbar-color: ${(props) =>
      props.theme.palette.type === 'light'
        ? '#c7c7c7 #fafafa'
        : '#6b6b6b #2c2c2c'};
  }

  /*
    Prevent weird issue in webkit browsers where changing the color-scheme
    doesn't update the scrollbar corner (leaving it white in dark mode, and
    black in light mode). Note that if there are corners in the scrollbars (ex:
    horizontal + vertical scrollbars in a full height table), having the corner
    transparent will actually show the border radius of the element behind the
    scrollbar.
  */
  ::-webkit-scrollbar-corner {
    background: transparent;
  }
`;

export default GlobalStyle;
