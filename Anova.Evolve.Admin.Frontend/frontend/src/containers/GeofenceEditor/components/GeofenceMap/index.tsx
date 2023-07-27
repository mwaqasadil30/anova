import Box from '@material-ui/core/Box';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import Popper from '@material-ui/core/Popper';
import { useTheme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import { GeoAreaType } from 'api/admin/api';
import { getBoundsForPoints } from 'api/mapbox/helpers';
import { ReactComponent as DrawCircleIcon } from 'assets/icons/draw-circle.svg';
import { ReactComponent as DrawPolygonIcon } from 'assets/icons/draw-polygon.svg';
import { ReactComponent as InfoIcon } from 'assets/icons/info-20.svg';
import { ReactComponent as TrashIcon } from 'assets/icons/trash.svg';
import Button from 'components/Button';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import MapControls from 'components/MapControls';
import {
  mapStyleDetailsMapping,
  MAP_STYLE_TYPE,
} from 'components/MapControls/types';
import { MAPBOX_ACCESS_TOKEN } from 'env';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import ReactMapGL from 'react-map-gl';
import {
  DrawCircleFromCenterMode,
  DrawPolygonMode,
  EditingMode,
  Editor,
  RENDER_STATE,
} from 'react-map-gl-draw';
import Geocoder from 'react-map-gl-geocoder';
import usePrevious from 'react-use/lib/usePrevious';
import styled from 'styled-components';
import {
  getCustomDomainContrastText,
  gray300,
  gray900,
  white,
} from 'styles/colours';
import MapboxMarkerWithTitle from '../MapboxMarkerWithTitle';
import { MAP_GL_DRAW_SHAPE_TYPES } from '../ObjectForm/helpers';
import { GeofencedFeature } from '../ObjectForm/types';
import './geocoderStyles.css';
import { getEditHandleStyle, getFeatureStyle } from './style';

const StyledNavControlWrapper = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
`;

const StyledText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize.commonFontSize};
  font-weight: 400;
`;

const StyledMapButton = styled(({ smallSize, ...props }) => (
  <Button {...props} />
))`
  ${(props) => {
    const fgColor =
      props.theme.palette.type === 'light'
        ? props.theme.custom.domainSecondaryColor
        : props.theme.custom.domainColor;

    const bgColor = getCustomDomainContrastText(fgColor);

    if (props.disabled) {
      return `
        && {
          color: ${gray300};
          cursor: not-allowed;
          background-color: ${white}
        }
      `;
    }

    if (props.smallSize) {
      return `
        && {
          color: ${gray900};
          background-color: ${white}
        }
      `;
    }

    return ` 
      && {
        color: ${fgColor};
        background-color: ${bgColor}
      }
      &&.active {
        color: ${bgColor};
        background-color: ${fgColor}
      }
    `;
  }}
`;

const StyledPopper = styled(Popper)`
  position: absolute !important;
  top: 32px !important;
  /* left: auto !important; */
  left: 0 !important;
  z-index: 2;
`;

const StyledPopperContent = styled('div')`
  background-color: ${gray900};
  color: ${gray900};
  padding: 12px 18px;
  white-space: nowrap;
  border-radius: 10px;
  max-width: 400px;
  position: relative;
`;

const StyledArrow = styled('span')`
  width: 1em;
  height: 1em;
  position: absolute;
  box-sizing: border-box;
  right: 8px;
  transform: translateX(-50%);
  &.arrow-top {
    top: -8px;
    margin-bottom: -0.5em;
    &::before {
      width: 100%;
      height: 100%;
      margin: auto;
      content: '';
      display: block;
      transform: rotate(45deg);
      background-color: currentColor;
    }
  }
`;

const StyledPopperTypography = styled(Typography)`
  color: ${white};
  font-size: 1rem;
  line-height: 1.75em;
  white-space: normal;
`;

interface Props {
  isSubmitting: boolean;
  initialFeature: GeofencedFeature;
  onGeometryChange: (
    feature: GeofencedFeature,
    geometryType?: GeoAreaType
  ) => void;
}

const GeofenceMap = ({
  isSubmitting,
  initialFeature,
  onGeometryChange,
}: Props) => {
  const theme = useTheme();

  const { t } = useTranslation();

  const mapRef: any = useRef();
  const hasInitialFeature = Boolean(
    initialFeature?.geometry.coordinates[0].length
  );

  const [activeMapStyle, setActiveMapStyle] = useState(MAP_STYLE_TYPE.MAP);

  const getEditHandleStyleWithTheme = useCallback(
    // Typed as any since the package also does it
    (data: any) =>
      getEditHandleStyle(theme, mapStyleDetailsMapping[activeMapStyle])(data),
    [theme, activeMapStyle]
  );
  const getFeatureStyleWithTheme = useCallback(
    // Typed as any since the package also does it
    (data: any) =>
      getFeatureStyle(theme, mapStyleDetailsMapping[activeMapStyle])(data),
    [theme, activeMapStyle]
  );

  const [mapState, setMapState] = useState({
    viewport: {
      width: '100%',
      height: '100%',
      // Center approximately over the North Atlantic Ocean
      latitude: 41,
      longitude: -17,
      zoom: 2,
      minZoom: 0,
      maxZoom: 22,
    },
  });

  // Center the map on the initially provided feature. This only should happen
  // when editing an existing Geofence.
  const previousWidthAndHeight = usePrevious([
    mapRef?.current?._width,
    mapRef?.current?._height,
  ]);
  useEffect(() => {
    const previousWidth = previousWidthAndHeight?.[0];
    const previousHeight = previousWidthAndHeight?.[1];
    const currentWidth = mapRef?.current?._width;
    const currentHeight = mapRef?.current?._height;

    if (
      !previousWidth &&
      !previousHeight &&
      currentWidth &&
      currentHeight &&
      hasInitialFeature
    ) {
      const coorindates = initialFeature?.geometry.coordinates[0];
      const formattedCoorindates = coorindates?.map((coordinate) => ({
        long: coordinate[0],
        lat: coordinate[1],
      }));
      const boundsForPoints = getBoundsForPoints(
        formattedCoorindates,
        currentWidth,
        currentHeight
      );

      setMapState((prevMapState) => ({
        ...prevMapState,
        viewport: {
          ...prevMapState.viewport,
          latitude: boundsForPoints.latitude,
          longitude: boundsForPoints.longitude,
          zoom: boundsForPoints.zoom,
        },
      }));
    }
  }, [mapRef?.current?._width, mapRef?.current?._height]);
  const handleViewportChange = useCallback(
    (newViewport) => setMapState({ viewport: newViewport }),
    []
  );
  // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };

      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides,
      });
    },
    [handleViewportChange]
  );

  const spanRef = useRef<HTMLSpanElement>(null);
  const [
    popperAnchorEl,
    setPopperAnchorEl,
  ] = React.useState<HTMLSpanElement | null>(null);
  const infoBoxOpen = Boolean(popperAnchorEl);
  const handleInfoClick = () => {
    setPopperAnchorEl(spanRef.current);
  };
  const handleInfoClickAway = () => {
    setPopperAnchorEl(null);
  };

  // Default to EditingMode when an initialFeature is present
  const [mode, setMode] = useState<any>(() =>
    hasInitialFeature ? new EditingMode() : null
  );
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  // TODO: REPLACE drawPolyModeActive AND drawCircleModeActive WITH
  // ActiveDrawMode ENUM FOR BOTH POLYGON AND CIRCLE CASES
  const [drawPolyModeActive, setDrawPolyModeActive] = useState(false);
  const [drawCircleModeActive, setDrawCircleModeActive] = useState(false);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState();
  const [selectedEditHandleIndex, setSelectedEditHandleIndex] = useState();
  const editorRef: any = useRef(null);

  const geoWrapperRef: any = useRef(null);

  const [deleteType, setDeleteType] = useState<'polygon' | 'point' | null>(
    null
  );

  const [mappedGeoAreas, setMappedGeoAreas] = useState<GeofencedFeature[]>(() =>
    hasInitialFeature ? [initialFeature] : []
  );

  // Set up a debounced function to update the geometry. Without this, formik
  // will re-render the map anytime the polygon is dragged a single pixel.
  const delayedGeometryChange = useCallback(
    debounce((feature: GeofencedFeature, geometryType: GeoAreaType) => {
      onGeometryChange(feature, geometryType);
    }, 50),
    []
  );

  const onSelect = useCallback((options) => {
    setSelectedFeatureIndex(options && options.selectedFeatureIndex);
    setSelectedEditHandleIndex(options && options.selectedEditHandleIndex);
  }, []);

  const onDelete = useCallback(
    (
      itemToDelete: string | null,
      geoData: GeofencedFeature[] | [],
      selectedFeature?: number,
      selectedPoint?: number
    ) => {
      setDialogOpen(false);
      if (itemToDelete === 'point') {
        const selectedItemCoordinates =
          geoData[selectedFeatureIndex!]?.geometry?.coordinates[0];
        if (selectedItemCoordinates) {
          if (
            selectedItemCoordinates.length &&
            selectedPoint === selectedItemCoordinates.length - 1 &&
            selectedItemCoordinates[0][0] ===
              selectedItemCoordinates[selectedPoint][0] &&
            selectedItemCoordinates[0][1] ===
              selectedItemCoordinates[selectedPoint][1]
          ) {
            const newCoordinateArray = selectedItemCoordinates.filter(
              (coordinateItem, coordinateIndex) => {
                return (
                  coordinateIndex !== 0 && selectedPoint !== coordinateIndex
                );
              }
            );
            newCoordinateArray.push(newCoordinateArray[0]);
            const newGeoAreaObject: GeofencedFeature = {
              ...geoData[selectedFeature!],
              type: 'Feature',
              properties: {},
              geometry: {
                ...geoData[selectedFeature!]?.geometry,
                type: 'Polygon',
                coordinates: [newCoordinateArray],
              },
            };
            setMappedGeoAreas([newGeoAreaObject]);
            onGeometryChange(newGeoAreaObject);
          }
          // If there are 4 or fewer points, then the shape is a triangle (first and last point always overlap)
          // and deleting one point must delete the whole object
          else if (selectedItemCoordinates.length <= 4) {
            setMappedGeoAreas([]);
            onGeometryChange(null);
          } else {
            //  NOTE/TODO: There must be a more efficient way to do this
            const newCoordinateArray = selectedItemCoordinates.filter(
              (coordinateItem, coordinateIndex) => {
                return selectedPoint !== coordinateIndex;
              }
            );
            const newGeoAreaObject: GeofencedFeature = {
              ...geoData[selectedFeature!],
              type: 'Feature',
              properties: {},
              geometry: {
                ...geoData[selectedFeature!]?.geometry,
                type: 'Polygon',
                coordinates: [newCoordinateArray],
              },
            };
            setMappedGeoAreas([newGeoAreaObject]);
            onGeometryChange(newGeoAreaObject);
          }
        }
      } else if (itemToDelete === 'polygon') {
        setMappedGeoAreas([]);
        onGeometryChange(null);
      }
    },
    [selectedFeatureIndex]
  );

  const onUpdate = useCallback(({ editType, data }) => {
    if (editType === 'addFeature') {
      setMode(new EditingMode());
    }

    const firstGeometryFeature = data?.[0];

    const geometryType =
      firstGeometryFeature &&
      firstGeometryFeature.properties &&
      firstGeometryFeature.properties.shape === MAP_GL_DRAW_SHAPE_TYPES.CIRCLE
        ? GeoAreaType.PointRadius
        : GeoAreaType.Polygon;

    setMappedGeoAreas(data);
    if (firstGeometryFeature) {
      delayedGeometryChange(firstGeometryFeature, geometryType);
    }
  }, []);

  useEffect(() => {
    if (!!selectedFeatureIndex || selectedFeatureIndex === 0) {
      // If a shape is selected, but a point is NOT selected
      // deleteType = 'polygon'. If both shape and point are selected, 'point'
      if (!selectedEditHandleIndex && selectedEditHandleIndex !== 0) {
        setDeleteType('polygon');
      } else {
        setDeleteType('point');
      }
    } else {
      setDeleteType(null);
    }
  }, [selectedFeatureIndex, selectedEditHandleIndex]);

  useEffect(() => {
    if (mode instanceof DrawPolygonMode) {
      setDrawCircleModeActive(false);
      setDrawPolyModeActive(true);
    } else if (mode instanceof DrawCircleFromCenterMode) {
      setDrawPolyModeActive(false);
      setDrawCircleModeActive(true);
    } else if (mode instanceof EditingMode) {
      setDrawCircleModeActive(false);
      setDrawPolyModeActive(false);
    }
  }, [mode]);

  const [reverseGeocoderInput, setReverseGeocoderInput] = useState<string>('');
  const [reverseGeocoderResult, setReverseGeocoderResult] = useState<
    any | null
  >(null);

  const coordinatesGeocoder = (query: string) => {
    // Example taken and adapted from https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-geocoder-accept-coordinates/
    const matches = query.match(
      /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
    );
    if (!matches) {
      return null;
    }

    const coordinateFeature = (lng: number, lat: number) => ({
      center: [lng, lat],
      geometry: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      place_name: `lat: ${lat}; lng: ${lng}`,
      place_type: ['coordinate'],
      properties: {
        filterSafe: true,
      },
      text: `lat: ${lat}, lng: ${lng}`,
      type: 'Feature',
    });

    const coord1 = Number(matches[1]);
    const coord2 = Number(matches[2]);
    const geocodes = [];

    if (coord1 < -90 || coord1 > 90) {
      // must be lng, lat
      geocodes.push(coordinateFeature(coord1, coord2));
    }

    if (coord2 < -90 || coord2 > 90) {
      // must be lat, lng
      geocodes.push(coordinateFeature(coord2, coord1));
    }

    if (geocodes.length === 0) {
      // else could be either lng, lat or lat, lng
      geocodes.push(coordinateFeature(coord1, coord2));
      geocodes.push(coordinateFeature(coord2, coord1));
    }
    return geocodes.reverse();
  };

  const isGeoAreaCircle = (geoarea: GeofencedFeature) =>
    geoarea &&
    geoarea?.properties &&
    geoarea?.properties.shape === MAP_GL_DRAW_SHAPE_TYPES.CIRCLE;

  const tStringDrawPolygonTooltip = t(
    'ui.geofenceManager.drawNewPolygon',
    'Draw New Polygon'
  );
  const tStringDeleteTooltip = t('ui.common.delete', 'Delete');
  const tStringInfoTooltip = t('ui.geofenceManager.moreInfo', 'Info');
  const tStringDrawCircleTooltip = t(
    'ui.geofenceManager.drawNewCircle',
    'Draw New Circle'
  );

  const mainTitle = t(
    'ui.geofenceManager.geofenceDeleteWarning',
    'Geofence Delete Warning'
  );
  const confirmationButtonText = t('ui.common.delete', 'Delete');

  return (
    <Box
      marginX={-4}
      display="flex"
      flex={1}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      position="relative"
    >
      <UpdatedConfirmationDialog
        open={dialogOpen}
        maxWidth="xs"
        disableBackdropClick
        disableEscapeKeyDown
        mainTitle={mainTitle}
        content={
          <>
            <Box padding={2}>
              {deleteType === 'point' ? (
                <StyledText align="center">
                  {t(
                    'ui.geofenceManager.deleteWarningPoint',
                    'Are you sure you want to delete this point?'
                  )}
                </StyledText>
              ) : (
                <StyledText align="center">
                  {t(
                    'ui.geofenceManager.deleteWarningShape',
                    'Are you sure you want to delete this Geofence Area?'
                  )}
                </StyledText>
              )}
            </Box>
          </>
        }
        confirmationButtonText={confirmationButtonText}
        closeDialog={() => {
          setDialogOpen(false);
        }}
        onConfirm={() => {
          onDelete(
            deleteType,
            mappedGeoAreas,
            selectedFeatureIndex,
            selectedEditHandleIndex
          );
        }}
      />

      <ReactMapGL
        {...mapState.viewport}
        ref={mapRef}
        width="100%"
        height="100%"
        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        mapStyle={
          mapStyleDetailsMapping[activeMapStyle].stylesheet[theme.palette.type]
        }
        // @ts-ignore
        onViewportChange={(viewport) => setMapState({ viewport })}
        getCursor={() => {
          if (drawPolyModeActive || drawCircleModeActive) {
            return 'crosshair';
          }
          return 'default';
        }}
      >
        {/* eslint-disable indent */}
        {reverseGeocoderResult &&
          reverseGeocoderResult.center &&
          reverseGeocoderResult.center.length > 0 && (
            <MapboxMarkerWithTitle
              latitude={reverseGeocoderResult?.center[1]}
              longitude={reverseGeocoderResult?.center[0]}
              tooltipString={reverseGeocoderResult.place_name || ''}
            />
          )}
        {/* eslint-enable indent */}
        <div
          className={`editor-css-selector ${
            isGeoAreaCircle(mappedGeoAreas[0]) && 'geoarea-is-circle'
          }`}
        >
          <Editor
            ref={editorRef}
            style={{ width: '100%', height: '100%' }}
            clickRadius={12}
            mode={mode}
            // TODO: Use `features` prop to add/remove features to the map
            // May need to use a specific version. The features prop seems to
            // work from 0.18.4 to 0.21.1, anything after that it doesn't work
            // https://github.com/uber/nebula.gl/issues/295#issuecomment-627494106
            // https://github.com/uber/nebula.gl/issues/510
            // @ts-ignore
            features={mappedGeoAreas}
            onSelect={onSelect}
            onUpdate={onUpdate}
            editHandleShape="circle"
            featureStyle={getFeatureStyleWithTheme}
            editHandleStyle={(handle: any) => {
              if (isGeoAreaCircle(mappedGeoAreas[0])) {
                return null;
              }
              if (handle.index === selectedEditHandleIndex) {
                return getEditHandleStyleWithTheme({
                  state: RENDER_STATE.SELECTED,
                });
              }
              return getEditHandleStyleWithTheme({});
            }}
          />
        </div>
        <Box position="absolute" top={10} left={390} zIndex={2}>
          {/* NOTE: THIS EMPTY SPAN BECOMES THE CONTAINER 
          ELEMENT FOR <Geocoder>*/}
          <span
            ref={geoWrapperRef}
            style={{
              position: 'absolute',
              left: '-380px',
              zIndex: 0,
            }}
            title={t(
              'ui.geofenceManager.coordinateSearchPlaceholder',
              'Place or lat/lng (e.g. "Napa" or 38.29, -122.3)'
            )}
          />

          <Geocoder
            mapRef={mapRef}
            containerRef={geoWrapperRef}
            minLength={1}
            inputValue={reverseGeocoderInput}
            reverseGeocode
            placeholder={t(
              'ui.geofenceManager.coordinateSearchPlaceholder',
              'Place or lat/lng ("Napa" or 38.29, -122.3)'
            )}
            onViewportChange={handleGeocoderViewportChange}
            mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
            position="top-left"
            localGeocoder={coordinatesGeocoder}
            onClear={() => {
              setReverseGeocoderResult(null);
            }}
            onResult={(res: any) => {
              setReverseGeocoderResult(res.result);
              setReverseGeocoderInput('');
            }}
          />

          <Box>
            <Tooltip title={tStringDrawPolygonTooltip}>
              <span>
                {/* NOTE: ABOVE <span> IS NECESSARY HERE IN 
              ORDER TO PROPERLY DISPLAY MUI TOOLTIP */}
                <StyledMapButton
                  style={{
                    padding: '1em',
                    height: '56px',
                    minWidth: 0,
                    borderLeftColor: 'rgba(0,0,0,0.15)',
                    borderRightColor: 'rgba(0,0,0,0.15)',
                    borderRadius: '0',
                  }}
                  aria-label={tStringDrawPolygonTooltip}
                  className={drawPolyModeActive ? 'active' : 'inactive'}
                  disabled={Boolean(mappedGeoAreas.length)}
                  onClick={() => {
                    if (!drawPolyModeActive) {
                      setMode(new DrawPolygonMode());
                    } else {
                      setDrawPolyModeActive(false);
                      if (mappedGeoAreas.length) {
                        setMode(new EditingMode());
                      } else {
                        setMode(null);
                      }
                    }
                  }}
                >
                  <DrawPolygonIcon />
                </StyledMapButton>
              </span>
            </Tooltip>
            <Tooltip title={tStringDrawCircleTooltip}>
              <span>
                <StyledMapButton
                  style={{
                    padding: '1em',
                    height: '56px',
                    minWidth: 0,
                    borderLeftColor: 'rgba(0,0,0,0.15)',
                    borderRightColor: 'rgba(0,0,0,0.15)',
                    borderRadius: '0',
                  }}
                  className={drawCircleModeActive ? 'active' : 'inactive'}
                  disabled={Boolean(mappedGeoAreas.length)}
                  onClick={() => {
                    if (!drawCircleModeActive) {
                      setMode(new DrawCircleFromCenterMode());
                    } else {
                      setDrawCircleModeActive(false);
                      if (mappedGeoAreas.length) {
                        setMode(new EditingMode());
                      } else {
                        setMode(null);
                      }
                    }
                  }}
                >
                  <DrawCircleIcon />
                </StyledMapButton>
              </span>
            </Tooltip>
            <Tooltip title={tStringDeleteTooltip}>
              <span>
                <StyledMapButton
                  style={{
                    padding: '1em',
                    height: '56px',
                    minWidth: 0,
                    borderRightColor: 'rgba(0,0,0,0.15)',
                    borderRadius: '0',
                  }}
                  aria-label={tStringDeleteTooltip}
                  disabled={!deleteType || isSubmitting}
                  onClick={() => setDialogOpen(true)}
                >
                  <TrashIcon />
                </StyledMapButton>
              </span>
            </Tooltip>
            <Tooltip title={tStringInfoTooltip}>
              <span ref={spanRef}>
                <StyledMapButton
                  style={{
                    padding: '1em',
                    height: '56px',
                    minWidth: 0,
                    borderColor: 'transparent',
                    borderRadius: '0 10px 10px 0',
                  }}
                  aria-label={tStringInfoTooltip}
                  className={infoBoxOpen ? 'active' : 'inactive'}
                  onClick={handleInfoClick}
                >
                  <InfoIcon />
                </StyledMapButton>
              </span>
            </Tooltip>

            <StyledPopper
              open={infoBoxOpen}
              // open={open || hoverOpen || hovered}
              anchorEl={popperAnchorEl}
              container={mapRef.current}
              placement="bottom-end"
              transition
            >
              {({ TransitionProps }) => (
                <ClickAwayListener onClickAway={handleInfoClickAway}>
                  <Zoom {...TransitionProps} timeout={100}>
                    <Fade {...TransitionProps} timeout={100}>
                      <StyledPopperContent>
                        <StyledPopperTypography>
                          <Trans
                            i18nKey="ui.geofenceManager.mapDrawingInstructions"
                            defaults="To start drawing a geofence click on the <DrawPolygonIcon /> icon, then click on the map to place the first point. When you draw the final point, double-click to complete the polygon.<LineBreak /> To delete a point, click on a point so it is selected, then press the <TrashIcon /> icon. To delete the entire polygon, click on the shape to select it, then press the <TrashIcon /> icon."
                            components={{
                              DrawPolygonIcon: <DrawPolygonIcon />,
                              LineBreak: <br />,
                              TrashIcon: <TrashIcon />,
                            }}
                          />
                        </StyledPopperTypography>
                        <StyledArrow className="arrow-top" />
                      </StyledPopperContent>
                    </Fade>
                  </Zoom>
                </ClickAwayListener>
              )}
            </StyledPopper>
          </Box>
        </Box>
        <StyledNavControlWrapper>
          <MapControls
            activeMapStyle={activeMapStyle}
            setActiveMapStyle={setActiveMapStyle}
            drawPolyModeActive={drawPolyModeActive}
          />
        </StyledNavControlWrapper>
      </ReactMapGL>
    </Box>
  );
};

export default GeofenceMap;
