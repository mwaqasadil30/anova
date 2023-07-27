import { MAPBOX_ACCESS_TOKEN } from 'env';
import axios from 'axios';

const buildUrl = (query: string, accessToken = MAPBOX_ACCESS_TOKEN) => {
  const baseUrl = 'https://api.tiles.mapbox.com/geocoding/v5/mapbox.places/';
  const encodedQuery = encodeURIComponent(query);
  return `${baseUrl}${encodedQuery}.json?access_token=${accessToken}`;
};

export const parseLatLongCoordinates = (responseData: any) => {
  const mostRelevantFeature = responseData?.features?.[0];

  // NOTE: Feature has a `relevance` property that we could maybe use to
  // determine if we should return the lat/long value (to be mapped).
  // https://docs.mapbox.com/api/search/
  if (mostRelevantFeature.relevance < 0.85) {
    return null;
  }

  const longitude = mostRelevantFeature?.geometry?.coordinates?.[0];
  const latitude = mostRelevantFeature?.geometry?.coordinates?.[1];

  return {
    lat: latitude,
    long: longitude,
  };
};

export const geocode = (query: string) => {
  const url = buildUrl(query);
  return axios.get(url).then((response) => response.data);
};
