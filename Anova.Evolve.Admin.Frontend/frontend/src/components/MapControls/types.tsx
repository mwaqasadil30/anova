import React from 'react';
import MapIcon from '@material-ui/icons/Map';
import SatelliteIcon from '@material-ui/icons/Satellite';
import TerrainIcon from '@material-ui/icons/Terrain';
import { MapboxStylesheets } from 'styles/mapbox';

export interface MapStyle {
  stylesheet: {
    light: MapboxStylesheets;
    dark: MapboxStylesheets;
  };
  icon: React.ReactNode;
  type: string;
}

export enum MAP_STYLE_TYPE {
  MAP = 'MAP',
  SATELLITE = 'SATELLITE',
  TERRAIN = 'TERRAIN',
}

export const mapStyleDetailsMapping: Record<MAP_STYLE_TYPE, MapStyle> = {
  [MAP_STYLE_TYPE.MAP]: {
    stylesheet: {
      light: MapboxStylesheets.MapboxStreets,
      dark: MapboxStylesheets.MapboxNavigationNight,
    },
    icon: <MapIcon />,
    type: MAP_STYLE_TYPE.MAP,
  },
  [MAP_STYLE_TYPE.SATELLITE]: {
    stylesheet: {
      light: MapboxStylesheets.MapboxSatelliteStreets,
      dark: MapboxStylesheets.MapboxSatelliteStreets,
    },
    icon: <SatelliteIcon />,
    type: MAP_STYLE_TYPE.SATELLITE,
  },
  [MAP_STYLE_TYPE.TERRAIN]: {
    stylesheet: {
      light: MapboxStylesheets.MapboxOutdoors,
      dark: MapboxStylesheets.MapboxOutdoors,
    },
    icon: <TerrainIcon />,
    type: MAP_STYLE_TYPE.TERRAIN,
  },
};
