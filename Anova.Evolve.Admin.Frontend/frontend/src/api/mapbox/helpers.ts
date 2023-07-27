import { WebMercatorViewport } from 'react-map-gl';

export const isLatitudeValid = (lat?: number | null) => {
  if (!lat && lat !== 0) {
    return false;
  }

  return lat >= -90 && lat <= 90;
};

export const isLongitudeValid = (long?: number | null) => {
  if (!long && long !== 0) {
    return false;
  }

  return long >= -180 && long <= 180;
};

const applyToArray = (func: any, array: any) => func.apply(Math, array);

export const getBoundsForPoints = (
  points?: any,
  mapWidth?: number,
  mapHeight?: number
) => {
  // Calculate corner values of bounds
  const pointsLong = points?.map((point: any) => point.long);
  const pointsLat = points?.map((point: any) => point.lat);

  const cornersLongLat = [
    [applyToArray(Math.min, pointsLong), applyToArray(Math.min, pointsLat)],
    [applyToArray(Math.max, pointsLong), applyToArray(Math.max, pointsLat)],
  ];

  // Use WebMercatorViewport to get center longitude/latitude and zoom
  const viewport = new WebMercatorViewport({
    width: mapWidth,
    height: mapHeight,
    // @ts-ignore
  }).fitBounds(cornersLongLat, { padding: 150 }); // Can also use option: offset: [0, -100]
  const { longitude, latitude, zoom } = viewport;
  return { longitude, latitude, zoom };
};
