import Box from '@material-ui/core/Box';
import { isLatitudeValid, isLongitudeValid } from 'api/mapbox/helpers';
import CommonMapGL from 'components/CommonMapGL';
import { usePreventMapElementTabbing } from 'hooks/usePreventMapElementTabbing';
import React, { useState } from 'react';
import { Marker } from 'react-map-gl';

interface Props {
  lat: number;
  long: number;
  assetFillLevel: string | null;
  assetColor: string | null;
  activeNonLevelEvent?: boolean | false;
}

function Map({
  lat,
  long,
  assetFillLevel,
  assetColor,
  activeNonLevelEvent,
}: Props) {
  const [mapState, setMapState] = useState({
    viewport: {
      width: '100%',
      height: '100%',
      latitude: lat,
      longitude: long,
      zoom: 12,
      minZoom: 0,
      maxZoom: 22,
    },
  });

  const markerColor = assetColor!;

  usePreventMapElementTabbing();

  const isLatValid = isLatitudeValid(lat);
  const isLongValid = isLongitudeValid(long);

  return (
    // We use a mapbox-wrapper className just so we can select it to set
    // tabindex -1 with `querySelectorAll`
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      className="mapbox-wrapper"
      height="100%"
      width="100%"
    >
      {isLatValid && isLongValid && (
        <CommonMapGL
          {...mapState.viewport}
          width="100%"
          height="100%"
          // @ts-ignore
          onViewportChange={(viewport) => setMapState({ viewport })}
        >
          <Marker
            latitude={lat}
            longitude={long}
            offsetLeft={-20}
            offsetTop={-60}
          >
            {/* TODO: ABSTRACT THIS ICON INTO A COMPONENT */}
            <svg
              data-name="map-marker"
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="60"
              viewBox="0 0 40 60"
            >
              <g>
                <path
                  style={{ fill: markerColor }}
                  d="M40,20c0,11.05-20,40-20,40S0,31.05,0,20a20,20,0,0,1,40,0Z"
                />
                <circle cx="20" cy="19.56" r="16" style={{ fill: '#fff' }} />
                {activeNonLevelEvent && (
                  <circle cx="20" cy="28" r="2" style={{ fill: '#DD4534' }} />
                )}
                <text
                  x="50%"
                  y="33%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    fontFamily: 'Work Sans',
                  }}
                >
                  {assetFillLevel}
                </text>
              </g>
            </svg>
          </Marker>
        </CommonMapGL>
      )}
    </Box>
  );
}

export default Map;
