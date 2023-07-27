import Box from '@material-ui/core/Box';
import RoomIcon from '@material-ui/icons/Room';
import { isLatitudeValid, isLongitudeValid } from 'api/mapbox/helpers';
import CommonMapGL from 'components/CommonMapGL';
import { usePreventMapElementTabbing } from 'hooks/usePreventMapElementTabbing';
import React, { useState } from 'react';
import { Marker } from 'react-map-gl';
import styled from 'styled-components';

const StyledMarkerIcon = styled(RoomIcon)`
  color: ${(props) => props.theme.custom.domainColor};
  font-size: 40px;
`;

const StyledCommonMapGL = styled(CommonMapGL)`
  border-radius: ${(props) => props.theme.shape.borderRadius}px;
`;

interface Props {
  lat: number;
  long: number;
}

function Map({ lat, long }: Props) {
  const [mapState, setMapState] = useState({
    viewport: {
      width: '100%',
      height: '100%',
      latitude: lat,
      longitude: long,
      zoom: 12,
    },
  });

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
    >
      {isLatValid && isLongValid && (
        <StyledCommonMapGL
          {...mapState.viewport}
          // @ts-ignore
          onViewportChange={(viewport) => setMapState({ viewport })}
        >
          <Marker
            latitude={lat}
            longitude={long}
            offsetLeft={-20}
            offsetTop={-30}
          >
            <StyledMarkerIcon />
          </Marker>
        </StyledCommonMapGL>
      )}
    </Box>
  );
}

export default Map;
