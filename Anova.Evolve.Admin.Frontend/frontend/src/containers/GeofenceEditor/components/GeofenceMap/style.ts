import { Theme } from '@material-ui/core/styles';
import { MapStyle, MAP_STYLE_TYPE } from 'components/MapControls/types';
import { RENDER_STATE } from 'react-map-gl-draw';

const getThemeColorForMapStyle = (theme: Theme, mapStyle: MapStyle) => {
  return mapStyle.type === MAP_STYLE_TYPE.SATELLITE ||
    (theme.palette.type === 'dark' && mapStyle.type === MAP_STYLE_TYPE.MAP)
    ? theme.custom.domainColor
    : theme.custom.domainSecondaryColor;
};

export const getEditHandleStyle = (theme: Theme, mapStyle: MapStyle) => ({
  state,
}: any) => {
  const mapStyleColor = getThemeColorForMapStyle(theme, mapStyle);
  switch (state) {
    case RENDER_STATE.SELECTED:
    case RENDER_STATE.HOVERED:
      return {
        fill: mapStyleColor,
        fillOpacity: 1,
        stroke: 'rgb(255, 255, 255)',
        strokeWidth: 3,
        r: 7,
      };
    case RENDER_STATE.INACTIVE:
    case RENDER_STATE.UNCOMMITTED:
      return {
        fill: mapStyleColor,
        fillOpacity: 1,
        stroke: 'rgb(255, 255, 255)',
        strokeWidth: 0,
        r: 7,
      };
    default:
      return {
        fill: mapStyleColor,
        fillOpacity: 1,
        r: 6,
      };
  }
};

export const getFeatureStyle = (theme: Theme, mapStyle: MapStyle) => ({
  state,
}: any) => {
  const mapStyleColor = getThemeColorForMapStyle(theme, mapStyle);
  switch (state) {
    case RENDER_STATE.SELECTED:
      return {
        stroke: mapStyleColor,
        strokeWidth: 1,
        fill: mapStyleColor,
        fillOpacity: 0.4,
        cursor: 'grab',
      };
    case RENDER_STATE.HOVERED:
    case RENDER_STATE.UNCOMMITTED:
    case RENDER_STATE.CLOSING:
      return {
        stroke: mapStyleColor,
        strokeWidth: 1,
        fill: mapStyleColor,
        fillOpacity: 0.4,
      };

    default:
      return {
        stroke: mapStyleColor,
        strokeWidth: 1,
        fill: mapStyleColor,
        fillOpacity: 0.25,
      };
  }
};
