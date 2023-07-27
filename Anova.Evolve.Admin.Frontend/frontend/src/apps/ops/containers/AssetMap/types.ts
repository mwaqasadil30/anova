import { EvolveAssetDetailDataChannelInfo } from 'api/admin/api';

// Things to potentially keep track of to preserve the user's browser state on
// this page
export interface UpdateRouteStateParams {}

export type DataChannelForGraph = EvolveAssetDetailDataChannelInfo;

export interface MapViewport {
  latitude: number;
  longitude: number;
  zoom: number;
  // transitionInterpolator uses `FlyToInterpolator` from `react-map-gl`
  transitionInterpolator?: any;
  transitionDuration?: number | 'auto';
}
