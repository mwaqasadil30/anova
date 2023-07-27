/* eslint-disable indent */
import { darken } from '@material-ui/core/styles';
import { css } from 'styled-components';
import { getCustomDomainContrastText } from './colours';
import { defaultFonts } from './fonts';

export const defaultHighchartsStyles = css`
  .highcharts-background {
    fill: ${(props) => props.theme.palette.background.paper};
  }

  & .highcharts-plot-line-label {
    text-anchor: start;
  }

  /* Main plotline styles (note that this plotline is custom) */
  .highcharts-plot-line.custom-main-plotline {
    stroke: ${(props) => props.theme.custom.highcharts.mainPlotLineColor};
  }
  .highcharts-plot-line-label.custom-main-plotline {
    background-color: ${(props) =>
      props.theme.custom.highcharts.mainPlotLineColor};
    color: ${(props) =>
      props.theme.palette.getContrastText(
        props.theme.custom.highcharts.mainPlotLineColor
      )};
  }

  /* Crosshair styles */
  .highcharts-crosshair {
    stroke: ${(props) => props.theme.custom.highcharts.crosshairColor};
  }

  /* Axis styles */
  .highcharts-axis-labels.highcharts-xaxis-labels > text {
    /*
      Using important! here to override the default highcharts styles
      For some reason, using styledMode: true isn't working on chart to allow
      customization via CSS.
    */
    font-family: ${defaultFonts} !important;
    color: ${(props) =>
      props.theme.custom.highcharts.axisLabelColor} !important;
    fill: ${(props) => props.theme.custom.highcharts.axisLabelColor} !important;
    font-size: ${(props) =>
      props.theme.custom.fontSize?.commonFontSize} !important;
  }

  /* Tooltip styles */
  /*
    See material-ui's z-index values:
    https://material-ui.com/customization/z-index/
  */
  & .highcharts-tooltip-container {
    z-index: 1200 !important;
  }

  & .highcharts-tooltip > span {
    /*
      Cause the tooltip to appear on top of plotlines (since the background is
      transparent by default)
    */
    background-color: ${(props) =>
      props.theme.custom.highcharts.tooltip.backgroundColor};
  }

  & .highcharts-tooltip span,
  & .highcharts-tooltip div {
    color: ${(props) => props.theme.palette.text.primary};
  }

  & .highcharts-tooltip .custom-tooltip-divider {
    border-top: 1px solid ${(props) => props.theme.palette.divider};
  }

  .highcharts-label-box.highcharts-tooltip-box {
    fill: ${(props) => props.theme.custom.highcharts.tooltip.backgroundColor};
  }

  /* Reset Zoom button styles */
  .highcharts-button.highcharts-reset-zoom text {
    font-family: ${defaultFonts};
    font-weight: 500;
    ${(props) => {
      const dominantDomainColor =
        props.theme.palette.type === 'light'
          ? props.theme.custom.domainSecondaryColor
          : props.theme.custom.domainColor;
      const textColorForDominantColor = getCustomDomainContrastText(
        dominantDomainColor
      );

      return `
        fill: ${textColorForDominantColor};
      `;
    }}
  }
  .highcharts-button.highcharts-reset-zoom > rect {
    stroke-width: 0;
    rx: 8;
    ry: 8;

    fill: ${(props) =>
      props.theme.palette.type === 'light'
        ? props.theme.custom.domainSecondaryColor
        : props.theme.custom.domainColor};
  }

  /* Context button (eg: export to PNG/JPEG/PDF) */
  .highcharts-contextbutton .highcharts-button-box {
    fill: ${(props) => props.theme.palette.background.default};
    border-radius: 4px;
  }
  .highcharts-contextbutton .highcharts-button-symbol {
    stroke: ${(props) => props.theme.palette.text.secondary};
  }
  .highcharts-contextbutton.highcharts-button-hover {
    cursor: pointer;
  }
  .highcharts-contextbutton.highcharts-button-hover .highcharts-button-box {
    fill: ${(props) => darken(props.theme.palette.background.default, 0.2)};
  }

  /* Context menu */
  .highcharts-menu {
    /*
      Highcharts doesn't seem to allow overriding styles, so we use !important
      to force them
    */
    background: ${(props) => props.theme.palette.background.paper} !important;
    border: 0 !important;
    padding: 10px 0 !important;
    box-shadow: ${(props) =>
      props.theme.palette.type === 'light'
        ? 'rgb(136 136 136) 3px 3px 10px !important'
        : 'rgb(27 27 27) 3px 3px 10px !important'};
    border-radius: ${(props) => props.theme.shape.borderRadius}px;
    font-family: ${(props) => props.theme.typography.fontFamily};
  }
  .highcharts-menu .highcharts-menu-item {
    color: ${(props) => props.theme.palette.text.primary} !important;
    font-size: 14px !important;
  }
  .highcharts-menu hr {
    border-color: ${(props) => props.theme.palette.divider};
  }
  .highcharts-menu .highcharts-menu-item:hover {
    background: ${(props) => props.theme.palette.action.hover} !important;
  }
`;
