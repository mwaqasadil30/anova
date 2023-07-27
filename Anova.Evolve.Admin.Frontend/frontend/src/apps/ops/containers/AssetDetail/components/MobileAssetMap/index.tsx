/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import turfBearing from '@turf/bearing';
import turfDistance from '@turf/distance';
import turfGreatCircle from '@turf/great-circle';
import {
  featureCollection as turfFeatureCollection,
  Position,
} from '@turf/helpers';
import { GpsLocationDTO } from 'api/admin/api';
import { getBoundsForPoints } from 'api/mapbox/helpers';
import CommonMapGL from 'components/CommonMapGL';
import { StyledDarkFadeOverlay } from 'components/DarkFadeOverlay';
import { usePreventMapElementTabbing } from 'hooks/usePreventMapElementTabbing';
import clamp from 'lodash/clamp';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExtraState, Layer, LayerProps, Marker, Source } from 'react-map-gl';
import styled from 'styled-components';
import { graphColours, gray900 } from 'styles/colours';
import { useGetLocationReadings } from '../../hooks/useGetLocationReadings';
import { DataChannelForGraph, ReadingsHookData } from '../../types';
import { getReadingsCacheKey } from '../AssetGraph/helpers';
import LocationMarker from './GenericLocationMarker';
import {
  convertDateIntoMarkerRange,
  convertStartOfDay,
  // STASHING:
  // getHighlightedLineSegmentData,
  getHighlightedGreatCircleSegmentData,
} from './helpers';
import FirstLocationIcon from './map-icons/FirstLocationIcon';
import LastLocationIcon from './map-icons/LastLocationIcon';
import MultiDayIcon from './map-icons/MultiDayIcon';
import SingleDayIcon from './map-icons/SingleDayIcon';
import { DcReadingsForMap, LatestReading, MapLineSegment } from './types';

const StyledMapMarker = styled(Marker)`
  z-index: 1;
`;

const CustomDarkFadeOverlay = styled(StyledDarkFadeOverlay)`
  &:after {
    border-radius: 0;
  }
`;

const getLatLongCoordsFromGpsDataChannel = (
  readings?: GpsLocationDTO[] | null
) => {
  return readings?.map((reading) => {
    // Adjusts negative long values so that bounds are properly calculated
    // when points are plotted across antimeridian line
    const recalculatedLong =
      reading?.longitude && reading?.longitude < 0
        ? reading?.longitude + 360
        : reading?.longitude;
    return {
      long: recalculatedLong,
      lat: reading?.latitude,
    };
  });
};

const isSameLocation = (p1: Position, p2: Position, rad: number) => {
  return (
    turfDistance(p1, p2, {
      units: 'kilometers',
    }) < rad
  );
};

const graphPointSameAsMapPoint = (graphTime: any, mapTime: any) => {
  return graphTime === mapTime;
};

const graphPointInTimeRange = (graphTime: any, start: any, end: any) => {
  return graphTime > start && graphTime < end;
};

// GeoJSON line layer styles

interface LocationReading {
  latestReadings?: LatestReading[];
  logTime?: Date | string;
  markerDate: string;
  latitude: number;
  longitude: number;
  markerId: number | string;
  markerRange: number[];
  bearing?: number | null;
  distanceFromPrevious?: string | number;
  isLastKnownLocation?: boolean;
  isFirstInOverTwoWeekRange?: boolean;
  isSameAsPrevious?: boolean;
  isSameAsNext?: boolean;
}

interface Props {
  dataChannelId: string;
  readingsData: ReadingsHookData;
  dataChannels: DataChannelForGraph[];
  startDate?: Date;
  endDate?: Date;
  graphIsFetching: boolean;
  highlightedGraphTime?: number | null;
  selectedMarker?: number | null;
  showAllGpsReadings: boolean;
  setClickedMapMarkerTimeRange: (timeRange: number[] | null) => void;
  setSelectedMapMarker: (marker: number | null) => void;
  setHighlightedGraphTime: (time: number | null) => void;
  // setHighlightedSegment: (lineSegment: number | null) => void;
}

function Map({
  readingsData,
  dataChannels,
  dataChannelId,
  startDate,
  endDate,
  graphIsFetching,
  highlightedGraphTime,
  selectedMarker,
  showAllGpsReadings,
  setClickedMapMarkerTimeRange,
  setSelectedMapMarker,
  setHighlightedGraphTime,
}: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const lineLayer: LayerProps = {
    id: 'drawnLine',
    type: 'line',
    source: 'line_one',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': theme.palette.text.primary,
      'line-width': 2,
    },
  };
  // NOTE: This invisible line is used superimposed on top of the visible line
  // it is used to provide a clickable area so that the highlight line can be added
  const hoverableTransparentLineLayer: LayerProps = {
    id: 'drawnLineTwo',
    type: 'line',
    source: 'line_two',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': 'transparent',
      'line-width': 18,
    },
  };

  const highlightedLineSegment: LayerProps = {
    id: 'highlightLineSegment',
    type: 'line',
    source: 'line_three',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#FF6726',
      'line-width': 3,
    },
  };
  const [mapState, setMapState] = useState({
    viewport: {
      width: '100%',
      height: '100%',
      latitude: 0,
      longitude: 0,
      zoom: 12,
      minZoom: 0,
      maxZoom: 22,
    },
  });

  // NOTE: Using 'any' here because InteractiveMap type
  // does not include _width/_height
  const mapRef: any = useRef();
  const mapWidth = mapRef.current?._width;
  const mapHeight = mapRef.current?._height;
  // TODO: Change any type below to proper supported type e.g. MapLineSegment
  const [highlightedSegment, setHighlightedSegment] = useState<
    MapLineSegment | null | undefined
  >(null);
  const [markerTootipOpen, setMarkerTootipOpen] = useState(false);
  const [nullifyHighlight, setNullifyHighlight] = useState(false);

  usePreventMapElementTabbing();

  const { cachedReadings } = readingsData;

  const dcReadingsForMap: DcReadingsForMap[] = dataChannels
    ?.sort((a, b) => a.displayPriority! - b.displayPriority!)
    ?.map((channel, index) => {
      const graphedCacheKey = getReadingsCacheKey(channel);
      const seriesColoursIndex = index % graphColours.seriesColours.length;
      const seriesColour = graphColours.seriesColours[seriesColoursIndex];
      return {
        description: channel.description,
        decimalPlaces: channel.uomParams?.decimalPlaces || 0,
        readings: cachedReadings[graphedCacheKey]?.readings,
        scaledUnit: channel.scaledUnit,
        color: seriesColour,
        type: channel.dataChannelTypeId,
        digitalState0Text: channel.digitalState0Text,
        digitalState1Text: channel.digitalState1Text,
        digitalState2Text: channel.digitalState2Text,
        digitalState3Text: channel.digitalState3Text,
      };
    });

  const getLocationReadingsApi = useGetLocationReadings({
    dataChannelId,
    startDate,
    endDate,
    // The `movementResolutionInMeters` number value is a distance in kilometers.
    // If no value is passed in, the back-end will default to 1 kilometer,
    // meaning all GPS location readings within a 1 km radius will be condensed
    // or "summarized" into a single location reading or one gps 'point' on the map.
    movementResolutionInMeters: showAllGpsReadings ? 0 : 1,
  });

  const readingsWithBearings: any /* LocationReading[] */ = getLocationReadingsApi?.data?.locations?.map(
    (reading, i, array) => {
      // Consecutive points must be less than this distance from
      // each other (in 'kilometers') to be considered the same site
      const sameLocThreshhold = 0.2;
      // TODO: Refactor to reduce code duplication
      const currentLat = reading.latitude || 0;
      const currentLong = reading.longitude || 0;
      const currentPos: Position = [currentLong, currentLat];
      let prevLat;
      let nextLat = currentLat;
      let prevLong;
      let nextLong = currentLong;
      let prevPos;
      let nextPos: Position = [currentLong, currentLat];

      const isLastKnownLocation =
        getLocationReadingsApi?.data?.lastKnownLocation?.latitude ===
          reading.latitude &&
        getLocationReadingsApi?.data?.lastKnownLocation?.longitude ===
          reading.longitude;

      const isFirstInOverTwoWeekRange =
        i === array?.length - 1 &&
        moment(array[0].logTime).diff(array[i].logTime, 'days') > 13;

      const latestReadings: LatestReading[] = dcReadingsForMap
        .map((dcReadings) => {
          const commonReadingProps = {
            description: dcReadings.description,
            decimalPlaces: dcReadings.decimalPlaces,
            color: dcReadings.color,
            scaledUnit: dcReadings.scaledUnit,
            type: dcReadings.type,
            digitalState0Text: dcReadings.digitalState0Text,
            digitalState1Text: dcReadings.digitalState1Text,
            digitalState2Text: dcReadings.digitalState2Text,
            digitalState3Text: dcReadings.digitalState3Text,
          };
          const sameDayReading = dcReadings?.readings?.find((dcr) =>
            moment(dcr.logTime).isSame(reading.logTime, 'day')
          );
          if (sameDayReading) {
            const sameDayReadingToReturn = {
              ...sameDayReading,
              ...commonReadingProps,
            };
            return sameDayReadingToReturn;
          }
          let dateDiff = Infinity;
          let dateOfDiff: any;
          dcReadings?.readings?.forEach((dcr) => {
            const momentDiff = moment(dcr.logTime).diff(reading.logTime);
            if (momentDiff && momentDiff < dateDiff) {
              dateDiff = momentDiff;
              dateOfDiff = dcr.logTime;
            }
          });
          if (dateOfDiff) {
            const closestDayReading = dcReadings?.readings?.find((dcr) =>
              moment(dcr.logTime).isSame(dateOfDiff, 'day')
            );

            const closestDayReadingToReturn = {
              ...closestDayReading,
              ...commonReadingProps,
            };
            return closestDayReadingToReturn;
          }
          return null;
        })
        .filter((readingItem) => Boolean(readingItem)) as LatestReading[];

      const recalcLong = currentLong < 0 ? currentLong + 360 : currentLong;

      const markerProps: LocationReading = {
        logTime: reading.logTime,
        // If date is not in current year, add year
        markerDate: moment(reading.logTime).isSame(moment(), 'year')
          ? `${moment(reading.logTime).format('ddd MMM D')}`
          : `${moment(reading.logTime).format('ddd MMM D, YYYY')}`,
        bearing: null,
        latitude: currentLat,
        longitude: recalcLong,
        // TODO: determine if there's a better way to uniquely ID this
        markerId: convertStartOfDay(reading.logTime),
        markerRange: convertDateIntoMarkerRange(reading.logTime),
        isFirstInOverTwoWeekRange,
        isLastKnownLocation,
        isSameAsNext: false,
        isSameAsPrevious: false,
        latestReadings,
      };
      // runs on all loops except the first, which is the most recent, chronologically
      // determines if point is 'same' as next point
      if (array[i - 1]) {
        // "next" in terms of time, not array position
        nextLat = array[i - 1].latitude || 0;
        nextLong = array[i - 1].longitude || 0;
        nextPos = [nextLong, nextLat];
        markerProps.bearing = turfBearing(currentPos, nextPos);
        markerProps.isSameAsNext = isSameLocation(
          currentPos,
          nextPos,
          sameLocThreshhold
        );
      }
      // runs on all but last, which is least recent
      // determines if point is 'same' as previous point
      if (array[i + 1]) {
        // Previous in terms of time, not array position
        prevLat = array[i + 1].latitude || 0;
        prevLong = array[i + 1].longitude || 0;
        prevPos = [prevLong, prevLat];
        markerProps.isSameAsPrevious = isSameLocation(
          currentPos,
          prevPos,
          sameLocThreshhold
        );
      }

      return {
        ...markerProps,
      };
    }
  );

  const coords = getLatLongCoordsFromGpsDataChannel(
    getLocationReadingsApi?.data?.locations
  );

  // const coords = getLatLongCoordsFromAdjustedReadings(readingsWithBearings);

  const applyRangeMarkers = (
    reading: LocationReading,
    singleReadingPosition: number,
    allReadings: LocationReading[]
  ) => {
    let firstDayInStay: Date | undefined | string = reading.logTime;
    let lastDayInStay: Date | undefined | string = reading.logTime;
    let lastDayInStayIndex: number | null = null;
    /* eslint-disable no-plusplus */
    if (reading.isSameAsNext) {
      for (let i = singleReadingPosition; i > -1; i--) {
        lastDayInStay = allReadings[i].logTime;
        if (!allReadings[i].isSameAsNext) {
          lastDayInStay = allReadings[i].logTime;
          break;
        }
      }
    }
    if (reading.isSameAsPrevious) {
      for (let i = singleReadingPosition; i < allReadings.length; i++) {
        firstDayInStay = allReadings[i].logTime;
        if (!allReadings[i].isSameAsPrevious) {
          firstDayInStay = allReadings[i].logTime;
          break;
        }
      }
    }
    if (reading.isSameAsPrevious && !reading.isSameAsNext) {
      lastDayInStayIndex = singleReadingPosition;
    }
    /* eslint-enable no-plusplus */
    // If date in range is not in current year, add year

    const firstDayInStayLabel = moment(firstDayInStay).isSame(moment(), 'year')
      ? moment(firstDayInStay).format('ddd MMM D')
      : moment(firstDayInStay).format('ddd MMM D, YYYY');
    const lastDayInStayLabel = moment(lastDayInStay).isSame(moment(), 'year')
      ? moment(lastDayInStay).format('ddd MMM D')
      : moment(lastDayInStay).format('ddd MMM D, YYYY');

    reading.markerId = convertStartOfDay(reading.logTime);
    reading.markerRange = convertDateIntoMarkerRange(
      firstDayInStay,
      lastDayInStay
    );
    return {
      ...reading,
      startOfRange: firstDayInStay,
      endOfRange: lastDayInStay,
      rangeLabel: `${firstDayInStayLabel} - ${lastDayInStayLabel}`,
      isRange: true,
      displayAsMarker: lastDayInStayIndex === singleReadingPosition,
    };
  };

  // MAIN markers
  const markersWithRanges = readingsWithBearings?.map(
    (reading: LocationReading, i: number, array: any) => {
      let returnableReading = reading;
      if (reading.isSameAsNext || reading.isSameAsPrevious) {
        returnableReading = applyRangeMarkers(reading, i, array);
      }
      return returnableReading;
    }
  );
  const filteredMarkers = markersWithRanges?.filter((reading: any) => {
    return !reading.isRange || (reading.isRange && reading.displayAsMarker);
  });

  // NOTE / TODO: Had to switch this from MapLineSegment[] back to 'any[]' for now
  // turfGreatCircle uses a different type from turfLineString.
  const segments: any[] = [];
  filteredMarkers?.forEach((reading: any, i: number, array: any) => {
    if (array[i - 1]) {
      const currentLat = reading.latitude;
      const currentLong = reading.longitude;
      const currentPos: Position = [currentLong || 0, currentLat || 0];

      const prevLat = array[i - 1].latitude;
      const prevLong = array[i - 1].longitude;
      const prevPos: Position = [prevLong || 0, prevLat || 0];

      // TODO: Refactor all of this, as it is quite confusing.
      // Rewrite/write new method to get range this way
      const rangeEnd = array[i - 1]?.isRange
        ? convertDateIntoMarkerRange(
            reading?.logTime,
            array[i - 1]?.startOfRange
          )[1]
        : convertDateIntoMarkerRange(
            reading?.logTime,
            array[i - 1]?.logTime
          )[1];
      /* NOTE / TODO: STASHING previous singleLineSegment code. 
        ideally we would conditionally switch between turfLineString and turfGreatCircle
        depending on whether or not the plotting between prevPos and currentPos 
        crosses the antimeridian line. 
      */
      // const singleLineSegment = turfLineString([prevPos, currentPos], {
      //   name: `line_segment_${i}`,
      //   highlightableSegment: true,
      //   // TODO/NOTE Easier to separate rangeStart and rangeEnd then use as Array
      //   rangeStart: convertDateIntoMarkerRange(
      //     reading?.logTime,
      //     array[i - 1]?.logTime
      //   )[0],
      //   rangeEnd,
      //   rangeReadable: [reading.logTime, array[i - 1].logTime],
      //   logTime: reading.logTime,
      // } as any);
      const singleLineSegment = turfGreatCircle(prevPos, currentPos, {
        properties: {
          name: `line_segment_${i}`,
          highlightableSegment: true,
          // TODO/NOTE Easier to separate rangeStart and rangeEnd then use as Array
          rangeStart: convertDateIntoMarkerRange(
            reading?.logTime,
            array[i - 1]?.logTime
          )[0],
          rangeEnd,
          rangeReadable: [reading.logTime, array[i - 1].logTime],
          logTime: reading.logTime,
          prevPos,
          currentPos,
        },
      } as any);
      segments.push(singleLineSegment);
    }
  });
  const featureCollection = turfFeatureCollection(segments);

  const getIsGraphHoveredOverPoint = (r: number) =>
    Boolean(highlightedGraphTime) &&
    graphPointSameAsMapPoint(highlightedGraphTime, r);

  const getIsGraphHoveredOverRange = (r1: number, r2: number) =>
    Boolean(highlightedGraphTime) &&
    graphPointInTimeRange(highlightedGraphTime, r1, r2);

  useEffect(() => {
    if (
      getLocationReadingsApi?.data &&
      getLocationReadingsApi?.data?.locations?.length
    ) {
      const getNewViewport = () => {
        if (mapWidth && mapHeight) {
          return getBoundsForPoints(coords, mapWidth, mapHeight);
        }
        return getBoundsForPoints(coords, 1024, 520);
      };
      const newViewport = getNewViewport();
      const clampedZoomLevel = clamp(newViewport.zoom, 1, 14);
      // TODO: Fix typecheck errors that neccessitate this
      const adjustedNewViewport = {
        latitude: newViewport.latitude,
        longitude: newViewport.longitude,
        zoom: clampedZoomLevel,
        width: '100%',
        height: '520px',
        minZoom: 1,
        maxZoom: 22,
      };
      setMapState({ viewport: adjustedNewViewport });
    }
  }, [getLocationReadingsApi?.data]);

  const currMap = mapRef.current?.getMap();
  useEffect(() => {
    if (
      currMap &&
      currMap.getLayer('highlightLineSegment') &&
      highlightedSegment
    ) {
      setHighlightedSegment(null);
      setHighlightedGraphTime(null);
    }
  }, [nullifyHighlight]);

  useEffect(() => {
    const inRangeSegment = segments.find((s: any) => {
      return graphPointInTimeRange(
        highlightedGraphTime,
        s.properties.rangeStart,
        s.properties.rangeEnd
      );
    });
    if (currMap) {
      if (inRangeSegment) {
        setHighlightedSegment(inRangeSegment);
      } else if (currMap.getLayer('highlightLineSegment')) {
        try {
          currMap.removeLayer('highlightLineSegment');
          setNullifyHighlight(!nullifyHighlight);
        } catch (error) {
          console.error('Error removing map layer: ', error);
        }
      }
    }
  }, [highlightedGraphTime]);

  const onLineClick = (event: any) => {
    const { features } = event;
    const clickedFeature = features && features[0];
    const lineName =
      clickedFeature &&
      clickedFeature.properties &&
      clickedFeature?.properties.name;
    const clickedSegment = segments.find((s: any) => {
      return s.properties.name === lineName;
    });
    if (clickedFeature && clickedFeature.properties.highlightableSegment) {
      setHighlightedSegment(clickedSegment);
      setClickedMapMarkerTimeRange([
        clickedFeature.properties.rangeStart,
        clickedFeature.properties.rangeEnd,
      ]);
    } else {
      setHighlightedSegment(null);
      setClickedMapMarkerTimeRange(null);
    }
  };

  const [isHovered, setIsHovered] = useState(false);

  const getCursor = ({ isDragging }: ExtraState) => {
    return isDragging ? 'grabbing' : isHovered ? 'pointer' : 'grab';
  };

  const onLineHover = (event: any) => {
    const { features } = event;
    const hoveredFeature = features && features[0];
    if (hoveredFeature && hoveredFeature.properties.highlightableSegment) {
      setIsHovered(true);
    } else {
      setIsHovered(false);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      className="mapbox-wrapper"
      position="relative"
      overflow="hidden"
      // TODO: Replace hordcoded pixel height
      height={520}
      width="100%"
    >
      <CustomDarkFadeOverlay
        darkOpacity={0.3}
        hidden={
          !graphIsFetching &&
          !getLocationReadingsApi.isFetching &&
          !!getLocationReadingsApi?.data?.locations
        }
        darken={
          graphIsFetching ||
          getLocationReadingsApi.isFetching ||
          !getLocationReadingsApi?.data?.locations
        }
        preventClicking
      />
      {getLocationReadingsApi.isError ||
        (!graphIsFetching &&
          !getLocationReadingsApi.isFetching &&
          !getLocationReadingsApi?.data?.locations && (
            <div
              style={{
                position: 'absolute',
                textAlign: 'center',
                width: '66%',
                color: '#fff',
                zIndex: 1,
              }}
            >
              <Typography>
                {t(
                  'ui.assetdetail.noGpsReadingsInPeriod',
                  `No GPS readings to display between ${moment(
                    startDate
                  ).format('ddd MMM DD, YYYY')} and ${moment(endDate).format(
                    'ddd MMM DD, YYYY'
                  )}`
                )}
              </Typography>
            </div>
          ))}
      <CommonMapGL
        {...mapState.viewport}
        ref={mapRef}
        width="100%"
        height="100%"
        // @ts-ignore
        onViewportChange={(viewport) => setMapState({ viewport })}
        onClick={(e) => {
          setSelectedMapMarker(null);
          onLineClick(e);
        }}
        onHover={(e) => {
          onLineHover(e);
        }}
        onMouseEnter={() => {
          // NOTE: Adds extra layer of certainly of unhighlighting graph when mouse is moved out of graph.
          setHighlightedGraphTime(null);
        }}
        getCursor={getCursor}
      >
        {!!highlightedSegment && (
          <Source
            id="highlightLayer"
            type="geojson"
            data={getHighlightedGreatCircleSegmentData(highlightedSegment)}
          >
            <Layer {...highlightedLineSegment} />
          </Source>
        )}
        <Source
          id="mobileAssetGpsReadings"
          type="geojson"
          data={featureCollection as any}
        >
          <Layer {...lineLayer} />
          <Layer {...hoverableTransparentLineLayer} />
          {/* NOTE: Reversing results here is the easiest way to have 
          more recent markers appear on top of less recent markers */}
          {!graphIsFetching &&
            !getLocationReadingsApi.isFetching &&
            filteredMarkers?.reverse().map((gpsReading: any, i: number) => (
              <React.Fragment key={i}>
                {!gpsReading.isLastKnownLocation &&
                !gpsReading.isFirstInOverTwoWeekRange ? (
                  !gpsReading.displayAsMarker ? (
                    <Marker
                      latitude={gpsReading.latitude}
                      longitude={gpsReading.longitude}
                      offsetLeft={-10}
                      offsetTop={-10}
                    >
                      <LocationMarker
                        latestReadings={gpsReading.latestReadings}
                        setClickedMapMarkerTimeRange={
                          setClickedMapMarkerTimeRange
                        }
                        markerRange={gpsReading.markerRange}
                        containerRef={mapRef}
                        IconComponent={SingleDayIcon}
                        markerTootipOpen={markerTootipOpen}
                        setMarkerTootipOpen={setMarkerTootipOpen}
                        date={gpsReading.logTime}
                        markerId={gpsReading.markerId}
                        setSelected={setSelectedMapMarker}
                        isHovered={getIsGraphHoveredOverPoint(
                          gpsReading.markerId
                        )}
                        tooltipTitle={gpsReading.markerDate}
                        // TODO: move coloring logic into the component itself
                        color={
                          selectedMarker === gpsReading.markerId ||
                          graphPointSameAsMapPoint(
                            highlightedGraphTime,
                            gpsReading.markerId
                          )
                            ? '#FF6726'
                            : gray900
                        }
                        selected={selectedMarker === gpsReading.markerId}
                        bearing={gpsReading.bearing}
                      />
                    </Marker>
                  ) : (
                    <Marker
                      latitude={gpsReading.latitude}
                      longitude={gpsReading.longitude}
                      offsetLeft={-10}
                      offsetTop={-10}
                    >
                      <LocationMarker
                        latestReadings={gpsReading.latestReadings}
                        IconComponent={MultiDayIcon}
                        setClickedMapMarkerTimeRange={
                          setClickedMapMarkerTimeRange
                        }
                        markerRange={gpsReading.markerRange}
                        containerRef={mapRef}
                        markerTootipOpen={markerTootipOpen}
                        setMarkerTootipOpen={setMarkerTootipOpen}
                        date={gpsReading.logTime}
                        markerId={gpsReading.markerId}
                        setSelected={setSelectedMapMarker}
                        isHovered={getIsGraphHoveredOverRange(
                          gpsReading.markerRange[0],
                          gpsReading.markerRange[1]
                        )}
                        tooltipTitle={gpsReading.rangeLabel}
                        // TODO: move coloring logic into the component itself
                        color={
                          selectedMarker === gpsReading.markerId ||
                          graphPointInTimeRange(
                            highlightedGraphTime,
                            gpsReading.markerRange[0],
                            gpsReading.markerRange[1]
                          )
                            ? '#FF6726'
                            : gray900
                        }
                        selected={selectedMarker === gpsReading.markerId}
                        bearing={gpsReading.bearing}
                      />
                    </Marker>
                  )
                ) : (
                  <>
                    {gpsReading.isFirstInOverTwoWeekRange ? (
                      <StyledMapMarker
                        latitude={gpsReading.latitude}
                        longitude={gpsReading.longitude}
                        offsetLeft={-9}
                        offsetTop={-28}
                      >
                        <LocationMarker
                          latestReadings={gpsReading.latestReadings}
                          IconComponent={FirstLocationIcon}
                          setClickedMapMarkerTimeRange={
                            setClickedMapMarkerTimeRange
                          }
                          markerRange={gpsReading.markerRange}
                          containerRef={mapRef}
                          markerTootipOpen={markerTootipOpen}
                          setMarkerTootipOpen={setMarkerTootipOpen}
                          date={gpsReading.logTime}
                          markerId={gpsReading.markerId}
                          setSelected={setSelectedMapMarker}
                          isHovered={getIsGraphHoveredOverRange(
                            gpsReading.markerRange[0],
                            gpsReading.markerRange[1]
                          )}
                          tooltipTitle={
                            gpsReading.rangeLabel || gpsReading.markerDate
                          }
                          // TODO: move coloring logic into the component itself
                          color={
                            selectedMarker === gpsReading.markerId ||
                            graphPointInTimeRange(
                              highlightedGraphTime,
                              gpsReading.markerRange[0],
                              gpsReading.markerRange[1]
                            )
                              ? '#FF6726'
                              : gray900
                          }
                          selected={selectedMarker === gpsReading.markerId}
                          bearing={gpsReading.bearing}
                        />
                      </StyledMapMarker>
                    ) : (
                      <Marker
                        latitude={gpsReading.latitude}
                        longitude={gpsReading.longitude}
                        offsetLeft={-14}
                        offsetTop={-42}
                      >
                        <LocationMarker
                          latestReadings={gpsReading.latestReadings}
                          IconComponent={LastLocationIcon}
                          setClickedMapMarkerTimeRange={
                            setClickedMapMarkerTimeRange
                          }
                          markerRange={gpsReading.markerRange}
                          containerRef={mapRef}
                          markerTootipOpen={markerTootipOpen}
                          setMarkerTootipOpen={setMarkerTootipOpen}
                          date={gpsReading.logTime}
                          markerId={gpsReading.markerId}
                          setSelected={setSelectedMapMarker}
                          isHovered={getIsGraphHoveredOverRange(
                            gpsReading.markerRange[0],
                            gpsReading.markerRange[1]
                          )}
                          tooltipTitle={
                            gpsReading.rangeLabel || gpsReading.markerDate
                          }
                          // TODO: move coloring logic into the component itself
                          color={
                            selectedMarker === gpsReading.markerId ||
                            graphPointInTimeRange(
                              highlightedGraphTime,
                              gpsReading.markerRange[0],
                              gpsReading.markerRange[1]
                            )
                              ? '#FF6726'
                              : gray900
                          }
                          selected={selectedMarker === gpsReading.markerId}
                          bearing={gpsReading.bearing}
                        />
                      </Marker>
                    )}
                  </>
                )}
              </React.Fragment>
            ))}

          {/* filteredMarkers offset by -360° longitude. This allows markers to be rendered more than
           once which can be nbecessary when points are plotted accross the Antimeridian line OR
           when the map is very zoomed out */}
          {!graphIsFetching &&
            !getLocationReadingsApi.isFetching &&
            filteredMarkers?.reverse().map((gpsReading: any, i: number) => (
              <React.Fragment key={i}>
                {!gpsReading.isLastKnownLocation &&
                !gpsReading.isFirstInOverTwoWeekRange ? (
                  !gpsReading.displayAsMarker ? (
                    <Marker
                      latitude={gpsReading.latitude}
                      longitude={gpsReading.longitude - 360}
                      offsetLeft={-10}
                      offsetTop={-10}
                    >
                      <LocationMarker
                        latestReadings={gpsReading.latestReadings}
                        setClickedMapMarkerTimeRange={
                          setClickedMapMarkerTimeRange
                        }
                        markerRange={gpsReading.markerRange}
                        containerRef={mapRef}
                        IconComponent={SingleDayIcon}
                        markerTootipOpen={markerTootipOpen}
                        setMarkerTootipOpen={setMarkerTootipOpen}
                        date={gpsReading.logTime}
                        markerId={gpsReading.markerId}
                        setSelected={setSelectedMapMarker}
                        isHovered={getIsGraphHoveredOverPoint(
                          gpsReading.markerId
                        )}
                        tooltipTitle={gpsReading.markerDate}
                        // TODO: move coloring logic into the component itself
                        color={
                          selectedMarker === gpsReading.markerId ||
                          graphPointSameAsMapPoint(
                            highlightedGraphTime,
                            gpsReading.markerId
                          )
                            ? '#FF6726'
                            : gray900
                        }
                        selected={selectedMarker === gpsReading.markerId}
                        bearing={gpsReading.bearing}
                      />
                    </Marker>
                  ) : (
                    <Marker
                      latitude={gpsReading.latitude}
                      longitude={gpsReading.longitude - 360}
                      offsetLeft={-10}
                      offsetTop={-10}
                    >
                      <LocationMarker
                        latestReadings={gpsReading.latestReadings}
                        IconComponent={MultiDayIcon}
                        setClickedMapMarkerTimeRange={
                          setClickedMapMarkerTimeRange
                        }
                        markerRange={gpsReading.markerRange}
                        containerRef={mapRef}
                        markerTootipOpen={markerTootipOpen}
                        setMarkerTootipOpen={setMarkerTootipOpen}
                        date={gpsReading.logTime}
                        markerId={gpsReading.markerId}
                        setSelected={setSelectedMapMarker}
                        isHovered={getIsGraphHoveredOverRange(
                          gpsReading.markerRange[0],
                          gpsReading.markerRange[1]
                        )}
                        tooltipTitle={gpsReading.rangeLabel}
                        // TODO: move coloring logic into the component itself
                        color={
                          selectedMarker === gpsReading.markerId ||
                          graphPointInTimeRange(
                            highlightedGraphTime,
                            gpsReading.markerRange[0],
                            gpsReading.markerRange[1]
                          )
                            ? '#FF6726'
                            : gray900
                        }
                        selected={selectedMarker === gpsReading.markerId}
                        bearing={gpsReading.bearing}
                      />
                    </Marker>
                  )
                ) : (
                  <>
                    {gpsReading.isFirstInOverTwoWeekRange ? (
                      <StyledMapMarker
                        latitude={gpsReading.latitude}
                        longitude={gpsReading.longitude - 360}
                        offsetLeft={-9}
                        offsetTop={-28}
                      >
                        <LocationMarker
                          latestReadings={gpsReading.latestReadings}
                          IconComponent={FirstLocationIcon}
                          setClickedMapMarkerTimeRange={
                            setClickedMapMarkerTimeRange
                          }
                          markerRange={gpsReading.markerRange}
                          containerRef={mapRef}
                          markerTootipOpen={markerTootipOpen}
                          setMarkerTootipOpen={setMarkerTootipOpen}
                          date={gpsReading.logTime}
                          markerId={gpsReading.markerId}
                          setSelected={setSelectedMapMarker}
                          isHovered={getIsGraphHoveredOverRange(
                            gpsReading.markerRange[0],
                            gpsReading.markerRange[1]
                          )}
                          tooltipTitle={
                            gpsReading.rangeLabel || gpsReading.markerDate
                          }
                          // TODO: move coloring logic into the component itself
                          color={
                            selectedMarker === gpsReading.markerId ||
                            graphPointInTimeRange(
                              highlightedGraphTime,
                              gpsReading.markerRange[0],
                              gpsReading.markerRange[1]
                            )
                              ? '#FF6726'
                              : gray900
                          }
                          selected={selectedMarker === gpsReading.markerId}
                          bearing={gpsReading.bearing}
                        />
                      </StyledMapMarker>
                    ) : (
                      <Marker
                        latitude={gpsReading.latitude}
                        longitude={gpsReading.longitude - 360}
                        offsetLeft={-14}
                        offsetTop={-42}
                      >
                        <LocationMarker
                          latestReadings={gpsReading.latestReadings}
                          IconComponent={LastLocationIcon}
                          setClickedMapMarkerTimeRange={
                            setClickedMapMarkerTimeRange
                          }
                          markerRange={gpsReading.markerRange}
                          containerRef={mapRef}
                          markerTootipOpen={markerTootipOpen}
                          setMarkerTootipOpen={setMarkerTootipOpen}
                          date={gpsReading.logTime}
                          markerId={gpsReading.markerId}
                          setSelected={setSelectedMapMarker}
                          isHovered={getIsGraphHoveredOverRange(
                            gpsReading.markerRange[0],
                            gpsReading.markerRange[1]
                          )}
                          tooltipTitle={
                            gpsReading.rangeLabel || gpsReading.markerDate
                          }
                          // TODO: move coloring logic into the component itself
                          color={
                            selectedMarker === gpsReading.markerId ||
                            graphPointInTimeRange(
                              highlightedGraphTime,
                              gpsReading.markerRange[0],
                              gpsReading.markerRange[1]
                            )
                              ? '#FF6726'
                              : gray900
                          }
                          selected={selectedMarker === gpsReading.markerId}
                          bearing={gpsReading.bearing}
                        />
                      </Marker>
                    )}
                  </>
                )}
              </React.Fragment>
            ))}

          {/* filteredMarkers offset by +360° longitude. This allows markers to be rendered more than
           once which can be necessary when points are plotted accross the Antimeridian line OR
           when the map is very zoomed out */}
          {!graphIsFetching &&
            !getLocationReadingsApi.isFetching &&
            filteredMarkers?.reverse().map((gpsReading: any, i: number) => (
              <React.Fragment key={i}>
                {!gpsReading.isLastKnownLocation &&
                !gpsReading.isFirstInOverTwoWeekRange ? (
                  !gpsReading.displayAsMarker ? (
                    <Marker
                      latitude={gpsReading.latitude}
                      longitude={gpsReading.longitude + 360}
                      offsetLeft={-10}
                      offsetTop={-10}
                    >
                      <LocationMarker
                        latestReadings={gpsReading.latestReadings}
                        setClickedMapMarkerTimeRange={
                          setClickedMapMarkerTimeRange
                        }
                        markerRange={gpsReading.markerRange}
                        containerRef={mapRef}
                        IconComponent={SingleDayIcon}
                        markerTootipOpen={markerTootipOpen}
                        setMarkerTootipOpen={setMarkerTootipOpen}
                        date={gpsReading.logTime}
                        markerId={gpsReading.markerId}
                        setSelected={setSelectedMapMarker}
                        isHovered={getIsGraphHoveredOverPoint(
                          gpsReading.markerId
                        )}
                        tooltipTitle={gpsReading.markerDate}
                        // TODO: move coloring logic into the component itself
                        color={
                          selectedMarker === gpsReading.markerId ||
                          graphPointSameAsMapPoint(
                            highlightedGraphTime,
                            gpsReading.markerId
                          )
                            ? '#FF6726'
                            : gray900
                        }
                        selected={selectedMarker === gpsReading.markerId}
                        bearing={gpsReading.bearing}
                      />
                    </Marker>
                  ) : (
                    <Marker
                      latitude={gpsReading.latitude}
                      longitude={gpsReading.longitude + 360}
                      offsetLeft={-10}
                      offsetTop={-10}
                    >
                      <LocationMarker
                        latestReadings={gpsReading.latestReadings}
                        IconComponent={MultiDayIcon}
                        setClickedMapMarkerTimeRange={
                          setClickedMapMarkerTimeRange
                        }
                        markerRange={gpsReading.markerRange}
                        containerRef={mapRef}
                        markerTootipOpen={markerTootipOpen}
                        setMarkerTootipOpen={setMarkerTootipOpen}
                        date={gpsReading.logTime}
                        markerId={gpsReading.markerId}
                        setSelected={setSelectedMapMarker}
                        isHovered={getIsGraphHoveredOverRange(
                          gpsReading.markerRange[0],
                          gpsReading.markerRange[1]
                        )}
                        tooltipTitle={gpsReading.rangeLabel}
                        // TODO: move coloring logic into the component itself
                        color={
                          selectedMarker === gpsReading.markerId ||
                          graphPointInTimeRange(
                            highlightedGraphTime,
                            gpsReading.markerRange[0],
                            gpsReading.markerRange[1]
                          )
                            ? '#FF6726'
                            : gray900
                        }
                        selected={selectedMarker === gpsReading.markerId}
                        bearing={gpsReading.bearing}
                      />
                    </Marker>
                  )
                ) : (
                  <>
                    {gpsReading.isFirstInOverTwoWeekRange ? (
                      <StyledMapMarker
                        latitude={gpsReading.latitude}
                        longitude={gpsReading.longitude + 360}
                        offsetLeft={-9}
                        offsetTop={-28}
                      >
                        <LocationMarker
                          latestReadings={gpsReading.latestReadings}
                          IconComponent={FirstLocationIcon}
                          setClickedMapMarkerTimeRange={
                            setClickedMapMarkerTimeRange
                          }
                          markerRange={gpsReading.markerRange}
                          containerRef={mapRef}
                          markerTootipOpen={markerTootipOpen}
                          setMarkerTootipOpen={setMarkerTootipOpen}
                          date={gpsReading.logTime}
                          markerId={gpsReading.markerId}
                          setSelected={setSelectedMapMarker}
                          isHovered={getIsGraphHoveredOverRange(
                            gpsReading.markerRange[0],
                            gpsReading.markerRange[1]
                          )}
                          tooltipTitle={
                            gpsReading.rangeLabel || gpsReading.markerDate
                          }
                          // TODO: move coloring logic into the component itself
                          color={
                            selectedMarker === gpsReading.markerId ||
                            graphPointInTimeRange(
                              highlightedGraphTime,
                              gpsReading.markerRange[0],
                              gpsReading.markerRange[1]
                            )
                              ? '#FF6726'
                              : gray900
                          }
                          selected={selectedMarker === gpsReading.markerId}
                          bearing={gpsReading.bearing}
                        />
                      </StyledMapMarker>
                    ) : (
                      <Marker
                        latitude={gpsReading.latitude}
                        longitude={gpsReading.longitude + 360}
                        offsetLeft={-14}
                        offsetTop={-42}
                      >
                        <LocationMarker
                          latestReadings={gpsReading.latestReadings}
                          IconComponent={LastLocationIcon}
                          setClickedMapMarkerTimeRange={
                            setClickedMapMarkerTimeRange
                          }
                          markerRange={gpsReading.markerRange}
                          containerRef={mapRef}
                          markerTootipOpen={markerTootipOpen}
                          setMarkerTootipOpen={setMarkerTootipOpen}
                          date={gpsReading.logTime}
                          markerId={gpsReading.markerId}
                          setSelected={setSelectedMapMarker}
                          isHovered={getIsGraphHoveredOverRange(
                            gpsReading.markerRange[0],
                            gpsReading.markerRange[1]
                          )}
                          tooltipTitle={
                            gpsReading.rangeLabel || gpsReading.markerDate
                          }
                          // TODO: move coloring logic into the component itself
                          color={
                            selectedMarker === gpsReading.markerId ||
                            graphPointInTimeRange(
                              highlightedGraphTime,
                              gpsReading.markerRange[0],
                              gpsReading.markerRange[1]
                            )
                              ? '#FF6726'
                              : gray900
                          }
                          selected={selectedMarker === gpsReading.markerId}
                          bearing={gpsReading.bearing}
                        />
                      </Marker>
                    )}
                  </>
                )}
              </React.Fragment>
            ))}
        </Source>
      </CommonMapGL>
    </Box>
  );
}

export default Map;
/* eslint-enable indent */
