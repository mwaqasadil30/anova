/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {
  AssetDetailDto,
  EvolveAssetLocationDto,
  EvolveAssetMapAssetInfoRecord,
} from 'api/admin/api';
import { getBoundsForPoints } from 'api/mapbox/helpers';
import { ReactComponent as FilterToggleIcon } from 'assets/icons/filter-toggle.svg';
import Button from 'components/Button';
import CommonMapGL from 'components/CommonMapGL';
import MapMarker from 'components/icons/MapMarker';
import MultiAssetMapMarker from 'components/icons/MultiAssetMapMarker';
import clamp from 'lodash/clamp';
import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlyToInterpolator, Marker } from 'react-map-gl';
import useDebounce from 'react-use/lib/useDebounce';
import styled, { ThemeContext } from 'styled-components';
import useSupercluster from 'use-supercluster';
import { formatModifiedDatetime } from 'utils/format/dates';
import { isNumber } from 'utils/format/numbers';
import { getTankColorForInventoryStatus } from 'utils/ui/helpers';
import { MapViewport } from '../types';
import ClusterMarker from './ClusterMarker';

const StyledFilterToggleButton = styled(({ hide, ...props }) => (
  <Button {...props} />
))`
  && {
    border: none;
  }
  .MuiButton-startIcon {
    transition: transform 0.25s linear;
    transform: ${(props) => (props.hide ? `rotate(180deg)` : `rotate(0deg)`)};
  }
`;

const StyledDivider = styled(Divider)`
  margin-top: 10px;
  margin-bottom: 10px;
`;

const StyledFilterToggleWrapper = styled.div`
  position: absolute;
  right: 47px;
  top: 10px;
`;

const StyledAssetType = styled(Typography)`
  font-weight: 500;
  color: grey;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

const StyledDateText = styled(Typography)`
  color: grey;
  font-style: italic;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

const StyledAssetText = styled(Typography)`
  color: grey;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

const useCustomMarkerStyle = makeStyles(() =>
  createStyles({
    selected: {
      zIndex: 1,
    },
    unselected: {
      zIndex: 0,
    },
    markerButton: {
      zIndex: 0,
      '&:focus': {
        outline: 'none',
      },
    },
  })
);

const getFillLevel = ({
  fillPercentage,
  emptyString,
}: {
  fillPercentage?: number | null;
  emptyString: string;
}) => {
  const clampedFill = clamp(fillPercentage!, 0, 100);
  if (!isNumber(fillPercentage)) {
    return emptyString;
  }
  const fillLevel = clampedFill!;
  const roundedFillLevel = Math.round(fillLevel);
  const assetFillLevelAsString = roundedFillLevel.toString();
  const assetFillLevelString = `${assetFillLevelAsString}%`;
  return assetFillLevelString;
};

const getDataChannelsLength = (site: EvolveAssetLocationDto) => {
  return (
    site.assets
      ?.map((asset) => asset.dataChannels?.length)
      .flat()
      .reduce((prev, current) => (prev || 0) + (current || 0), 0) || 0
  );
};

const getSiteAssetsLength = (site: EvolveAssetLocationDto) => {
  if (site.assets && site.assets?.length) {
    return site.assets?.length;
  }
  return 0;
};

const siteIsMissingData = (site: EvolveAssetLocationDto) => {
  let siteHasMissingData = false;
  // if (site.assets && site.assets?.length) {
  //   return site.assets?.length;
  // }
  if (site.assets && site.assets?.length) {
    for (let index = 0; index < site.assets?.length; index += 1) {
      const asset = site.assets[index];
      const dcs = asset.dataChannels;
      if (dcs && dcs.length) {
        for (let indexTwo = 0; indexTwo < dcs?.length; indexTwo += 1) {
          const thisDc = dcs?.[indexTwo];
          if (thisDc.hasMissingData) {
            siteHasMissingData = true;
          }
        }
      }
    }
  }

  return siteHasMissingData;
};

const pieChartSlices = (
  site: EvolveAssetLocationDto,
  themeType: 'light' | 'dark'
) => {
  const counts: number[] = [];
  const uniqueValues: string[] = [];
  let prev: string;
  const numberOfSegments = getSiteAssetsLength(site);
  const statuses = site?.assets?.map((asset) => {
    return getTankColorForInventoryStatus(
      asset.dataChannels?.[0].eventInventoryStatusId,
      themeType
    );
  });
  const sortedStatuses = statuses?.sort();

  sortedStatuses?.forEach((stat) => {
    if (stat !== prev) {
      uniqueValues.push(stat);
      counts.push(1);
    } else {
      // eslint-disable-next-line no-plusplus
      counts[counts.length - 1]++;
    }
    prev = stat;
  });
  const percentagesAndFills = counts.map((c, i) => {
    const percent = c / numberOfSegments;
    const color = uniqueValues[i];
    return { percent, color };
  });
  const percentagesFillsAndCumulative = percentagesAndFills.map(
    (paf, i, arr) => {
      const { percent, color } = paf;
      let cumulativePercent = 0;
      if (i > 0) {
        // eslint-disable-next-line no-plusplus
        for (let j = 1; j <= i; j++) {
          const prevItem = arr[j - 1];
          cumulativePercent += prevItem.percent;
        }
      }
      return { percent, color, cumulativePercent };
    }
  );
  return percentagesFillsAndCumulative;
};

const MemoizedMarkers = memo(
  ({
    onClickMarker,
    openPanelOnSiteSelection,
    selectedSiteMarker,
    setSelectedAssetDetails,
    clusters,
    setSelectedSiteAsset,
    supercluster,
    setMapState,
    setSelectedDataChannelId,
    mapWidth,
    mapHeight,
  }: any) => {
    const classes = useCustomMarkerStyle();
    const { t } = useTranslation();
    const theme = useTheme();

    const getIsMarkerSelected = (
      plottedLocation: EvolveAssetLocationDto,
      selectedLocation: EvolveAssetLocationDto
    ) => {
      if (!selectedLocation) {
        return false;
      }
      // NOTE: This is not suitable for production
      // TODO: Replace condition for matching latitude and longitude. Instead use siteId once available
      if (
        plottedLocation.longitude === selectedLocation.longitude &&
        plottedLocation.latitude === selectedLocation.latitude
      ) {
        return true;
      }
      return false;
    };

    return (
      <>
        {clusters?.map((cluster: any, key: any) => {
          const { cluster: isCluster } = cluster.properties;
          const [longitude, latitude] = cluster.geometry.coordinates;
          return isCluster ? (
            <ClusterMarker
              key={key}
              latitude={latitude}
              longitude={longitude}
              supercluster={supercluster}
              cluster={cluster}
              setMapState={setMapState}
              getBoundsForPoints={getBoundsForPoints}
              mapWidth={mapWidth}
              mapHeight={mapHeight}
            />
          ) : (
            <Marker
              className={
                getIsMarkerSelected(cluster, selectedSiteMarker)
                  ? classes.selected
                  : classes.unselected
              }
              key={key}
              latitude={cluster.latitude!}
              longitude={cluster.longitude!}
              offsetLeft={-20}
              offsetTop={-60}
            >
              {getDataChannelsLength(cluster) > 1 ? (
                <button
                  className={classes.markerButton}
                  type="button"
                  style={{
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                  }}
                  onClick={() => {
                    setSelectedAssetDetails(null);
                    openPanelOnSiteSelection(true);
                    onClickMarker(cluster);
                    setSelectedSiteAsset(null);
                  }}
                >
                  {' '}
                  <MultiAssetMapMarker
                    theme={theme.palette.type}
                    selected={getIsMarkerSelected(cluster, selectedSiteMarker)}
                    assetDataChannelsLength={getDataChannelsLength(cluster)}
                    slices={pieChartSlices(cluster, theme.palette.type)}
                    missingData={siteIsMissingData(cluster)}
                  />
                </button>
              ) : (
                <button
                  className={classes.markerButton}
                  type="button"
                  style={{
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                  }}
                  onClick={() => {
                    openPanelOnSiteSelection(true);
                    onClickMarker(cluster);
                    setSelectedSiteAsset(cluster.assets[0]);
                    setSelectedDataChannelId(
                      cluster?.assets?.[0]?.dataChannels?.[0]?.dataChannelId
                    );
                  }}
                >
                  <MapMarker
                    color={getTankColorForInventoryStatus(
                      cluster?.assets?.[0]?.dataChannels?.[0]
                        .eventInventoryStatusId,
                      theme.palette.type
                    )}
                    assetFillLevel={getFillLevel({
                      fillPercentage:
                        cluster?.assets?.[0]?.dataChannels?.[0].percentfull,
                      emptyString: t('ui.common.notapplicable', 'N/A'),
                    })}
                    selected={getIsMarkerSelected(cluster, selectedSiteMarker)}
                    missingData={siteIsMissingData(cluster)}
                  />
                </button>
              )}
            </Marker>
          );
        })}
      </>
    );
  }
);

const getLatLongCoords = (sites?: EvolveAssetLocationDto[]) => {
  return sites?.map((site) => ({ long: site.longitude, lat: site.latitude }));
};

const initialMapViewport = {
  latitude: 43.6532,
  longitude: 79.3832,
  zoom: 0,
};

interface Props {
  sites?: EvolveAssetLocationDto[];
  hideFilterBar: boolean;
  isFetchingSites?: boolean;
  selectedSiteMarker?: EvolveAssetLocationDto | null;
  zoomToSelectedSiteKey: string;
  debouncedMapViewport: MapViewport | null;
  initialLocationStateMapViewport: MapViewport | null;
  onClickMarker: (site: EvolveAssetLocationDto | null) => void;
  openPanelOnSiteSelection: (arg0: boolean) => void;
  setSelectedAssetDetails: (asset: AssetDetailDto | null) => void;
  setSelectedSiteAsset: (asset: EvolveAssetMapAssetInfoRecord | null) => void;
  onShowHideFilterBar: (shouldHideFilterBar: boolean) => void;
  setDebouncedMapViewport: React.Dispatch<
    React.SetStateAction<MapViewport | null>
  >;
  setSelectedDataChannelId: (dcId: string) => void;
}

function Map({
  sites,
  isFetchingSites,
  selectedSiteMarker,
  zoomToSelectedSiteKey,
  hideFilterBar,
  initialLocationStateMapViewport,
  debouncedMapViewport,
  onClickMarker,
  openPanelOnSiteSelection,
  setSelectedAssetDetails,
  setSelectedSiteAsset,
  onShowHideFilterBar,
  setDebouncedMapViewport,
  setSelectedDataChannelId,
}: Props) {
  const themeContext = useContext(ThemeContext);
  const { t } = useTranslation();

  const { domainColor } = themeContext.custom;
  const [hasMounted, setHasMounted] = useState(false);

  const defaultMapViewport = debouncedMapViewport || initialMapViewport;
  const [mapState, setMapState] = useState<{ viewport: MapViewport }>({
    viewport: defaultMapViewport,
  });

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const [hoveredSite, setHoveredSite] = useState<EvolveAssetLocationDto>();

  // console.info('mapRef?.current ', getLatLongCoords(sites));
  const mapRef: any = useRef();
  const mapWidth = mapRef.current?._width;
  const mapHeight = mapRef.current?._height;

  const mapPointsForClustering = sites?.map((site) => ({
    type: 'Site',
    properties: { cluster: false },
    geometry: {
      type: 'Point',
      coordinates: [site?.longitude, site?.latitude],
    },
    ...site,
  }));

  const bounds = mapRef?.current
    ? mapRef?.current?.getMap()?.getBounds()?.toArray()?.flat()
    : null;
  const { clusters, supercluster } = useSupercluster({
    points: mapPointsForClustering || [],
    zoom: mapState.viewport.zoom,
    bounds,
    options: { radius: 50, maxZoom: 14 },
  });

  // Center the map on ALL the sites only once (when the list of sites comes
  // back)
  useEffect(() => {
    if (
      sites &&
      sites.length > 0 &&
      !isFetchingSites &&
      // We only center the map if there isn't a saved map viewport in the
      // browser history (ex: the user pressed the back button on the browser
      // to re-visit the map page at the same lat, long and zoom level they
      // were previously viewing the map in)
      !initialLocationStateMapViewport
    ) {
      const coords = getLatLongCoords(sites);
      const newViewport = getBoundsForPoints(coords, mapWidth, mapHeight);
      setMapState({ viewport: newViewport });
    }
  }, [isFetchingSites]);

  useEffect(() => {
    // NOTE: Mapbox has issues when rendering certain widths and heights, need
    // to wait until its mounted:
    // https://stackoverflow.com/a/57605506/7752479
    setHasMounted(true);
  }, []);

  // Keep track of the map viewport so it can be restored when the user
  // refreshes the page or presses the browser back button
  useDebounce(
    () => {
      const { latitude, longitude, zoom } = mapState.viewport;
      setDebouncedMapViewport({
        latitude,
        longitude,
        zoom,
      });
    },
    1000,
    [mapState]
  );

  // Zoom in to the selected site. Note that we're using an extra state
  // variable to avoid bubbling the mapState up to the page (which greatly
  // affects performance since panning on the graph would re-render the entire
  // page).
  useEffect(() => {
    if (
      zoomToSelectedSiteKey &&
      selectedSiteMarker &&
      isNumber(selectedSiteMarker.latitude) &&
      isNumber(selectedSiteMarker.longitude)
    ) {
      setMapState({
        viewport: {
          latitude: selectedSiteMarker.latitude!,
          longitude: selectedSiteMarker.longitude!,
          // setting zoom above 15 because superClusters
          // have been set to break above 15
          zoom: 15.1,
          transitionInterpolator: new FlyToInterpolator({
            speed: 3,
          }),
          transitionDuration: 'auto',
        },
      });
    }
  }, [zoomToSelectedSiteKey]);

  const open = Boolean(anchorEl);

  const hoveredAssetDataChannels = hoveredSite?.assets?.[0].dataChannels;

  const filterButtonText = hideFilterBar
    ? t('ui.common.showfilters', 'Show Filters')
    : t('ui.common.hidefilters', 'Hide Filters');

  return (
    <Box
      display="flex"
      justifyContent="center"
      height="100%"
      width="100%"
      position="relative"
    >
      {hasMounted && (
        <CommonMapGL
          {...mapState.viewport}
          ref={mapRef}
          width="100%"
          height="100%"
          // @ts-ignore
          onViewportChange={(viewport) => {
            setMapState({ viewport });
          }}
          onClick={(e) => {
            // TODO: refactor more cleanly
            // NOTE: This deselects any actively selected marker
            // if and only if the user clicks on the map,
            // but not on a marker or cluster or map control
            if (
              e.target.getAttribute('class') &&
              e.target.getAttribute('class').indexOf('overlays') > -1
            ) {
              setSelectedAssetDetails(null);
              setSelectedSiteAsset(null);
              onClickMarker(null);
            }
          }}
          showGeolocateControlOption
        >
          <MemoizedMarkers
            sites={sites}
            domainColor={domainColor}
            setHoveredSite={setHoveredSite}
            setAnchorEl={setAnchorEl}
            onClickMarker={onClickMarker}
            openPanelOnSiteSelection={openPanelOnSiteSelection}
            selectedSiteMarker={selectedSiteMarker}
            setSelectedAssetDetails={setSelectedAssetDetails}
            setSelectedSiteAsset={setSelectedSiteAsset}
            clusters={clusters}
            supercluster={supercluster}
            mapState={mapState}
            setMapState={setMapState}
            mapViewport={mapState.viewport}
            setSelectedDataChannelId={setSelectedDataChannelId}
            mapWidth={mapWidth}
            mapHeight={mapHeight}
          />

          <StyledFilterToggleWrapper>
            <StyledFilterToggleButton
              variant="contained"
              hide={hideFilterBar}
              startIcon={<FilterToggleIcon />}
              onClick={() => onShowHideFilterBar(!hideFilterBar)}
            >
              {filterButtonText}
            </StyledFilterToggleButton>
          </StyledFilterToggleWrapper>
        </CommonMapGL>
      )}

      <Popover
        style={{ pointerEvents: 'none' }}
        id="mouse-over-popover"
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transitionDuration={0}
        onClose={() => setAnchorEl(null)}
        disableRestoreFocus
        PaperProps={{ style: { width: 200 } }}
      >
        <Box p={2}>
          {/* TODO: determine if  this and the other hover items should be removed 
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <StyledAssetDescription>
                {hoveredSite?.assets?.[0]?.assetDescription}
              </StyledAssetDescription>
            </Grid>
          </Grid> */}
          <Grid container spacing={5}>
            <Grid item xs>
              <StyledDivider />
            </Grid>
          </Grid>
          {hoveredAssetDataChannels?.map((dataChannel, index) => {
            const dataChannelDescription = [
              dataChannel.productName,
              dataChannel.dataChannelDescription,
            ]
              .filter(Boolean)
              .join(' - ');

            const isLast = index === hoveredAssetDataChannels.length - 1;

            return (
              <Grid
                container
                spacing={1}
                alignItems="center"
                key={dataChannel.dataChannelId!}
              >
                <Grid item xs={12}>
                  <StyledAssetType>{dataChannelDescription}</StyledAssetType>
                </Grid>

                {isNumber(dataChannel.latestReadingValue) && (
                  <Grid item xs={12}>
                    <StyledAssetText>
                      {Math.round(dataChannel.latestReadingValue!)}{' '}
                      {dataChannel.unit}
                    </StyledAssetText>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <StyledDateText>
                    {formatModifiedDatetime(
                      hoveredSite?.assets?.[0].dataChannels?.[0].readingTime
                    )}
                  </StyledDateText>
                </Grid>
                {!isLast && (
                  <Grid item xs>
                    <StyledDivider />
                  </Grid>
                )}
              </Grid>
            );
          })}
        </Box>
      </Popover>
    </Box>
  );
}

export default Map;
