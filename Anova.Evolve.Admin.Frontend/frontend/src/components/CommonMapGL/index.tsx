import { useTheme } from '@material-ui/core/styles';
import MapControls from 'components/MapControls';
import {
  mapStyleDetailsMapping,
  MAP_STYLE_TYPE,
} from 'components/MapControls/types';
import { MAPBOX_ACCESS_TOKEN } from 'env';
import React, { useState } from 'react';
import ReactMapGL, { InteractiveMapProps } from 'react-map-gl';

interface Props extends InteractiveMapProps {
  showGeolocateControlOption?: boolean;
  children?: React.ReactNode;
}

const CommonMapGL = React.forwardRef(
  (props: Props, ref: React.LegacyRef<ReactMapGL> | undefined) => {
    const theme = useTheme();
    const [activeMapStyle, setActiveMapStyle] = useState(MAP_STYLE_TYPE.MAP);

    return (
      <ReactMapGL
        // Potentially also include height="100%" width="100%"
        // only if it'll work everywhere this map is used.
        // There's only 1 place in the app where height="100%" width="100%"
        // isn't used. Verify that map works when we pass that in.
        ref={ref}
        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        mapStyle={
          // Technically, the app theme will always either be light or dark.
          // If we ever add a new theme, we also need to update the
          // `mapStyleDetailsMapping` to support the new theme.
          mapStyleDetailsMapping[activeMapStyle].stylesheet[theme.palette.type]
        }
        {...props}
      >
        {props.children}

        <MapControls
          activeMapStyle={activeMapStyle}
          setActiveMapStyle={setActiveMapStyle}
          showGeolocateControlOption={props.showGeolocateControlOption}
        />
      </ReactMapGL>
    );
  }
);

export default CommonMapGL;
