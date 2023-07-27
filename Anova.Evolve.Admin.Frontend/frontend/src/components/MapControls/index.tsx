import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import MapIcon from '@material-ui/icons/Map';
import SatelliteIcon from '@material-ui/icons/Satellite';
import TerrainIcon from '@material-ui/icons/Terrain';
import Button from 'components/Button';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  GeolocateControl,
  NavigationControl,
  ScaleControl,
} from 'react-map-gl';
import styled from 'styled-components';
import {
  getCustomDomainContrastText,
  gray300,
  gray900,
  white,
} from 'styles/colours';
import { mapStyleDetailsMapping, MAP_STYLE_TYPE } from './types';

const StyledMapStyleWrapper = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
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
        background-color: ${bgColor};
      }
      &&.active {
        color: ${bgColor};
        background-color: ${fgColor};
      }
    `;
  }}
`;

const StyledGeolocateIconWrapper = styled.div`
  position: absolute;
  top: 143px;
  right: 10px;
`;

const StyledScaleBarWrapper = styled.div`
  position: absolute;
  bottom: 40px;
  right: 10px;
`;

const StyledMenuItem = styled(MenuItem)`
  display: flex;
  padding-right: 0.5em;
  color: ${(props) =>
    props.selected
      ? props.theme.custom.domainSecondaryColor
      : props.theme.palette.text.secondary};
`;

const StyledIconWrapper = styled.span`
  display: flex;
  padding-right: 0.5em;
  color: ${(props) => props.theme.palette.text.primary};
`;

const StyledMapStyleText = styled(Typography)`
  color: ${(props) => props.theme.palette.text.primary};
`;

interface MapControlsProps {
  showGeolocateControlOption?: boolean;
  drawPolyModeActive?: boolean;
  activeMapStyle: MAP_STYLE_TYPE;
  setActiveMapStyle: (mapType: MAP_STYLE_TYPE) => void;
}

const MapControls = ({
  showGeolocateControlOption,
  drawPolyModeActive,
  activeMapStyle,
  setActiveMapStyle,
}: MapControlsProps) => {
  const { t } = useTranslation();

  const [
    terrainMenuAnchorEl,
    setTerrainMenuAnchorEl,
  ] = React.useState<null | HTMLElement>(null);

  const handleTerrainMenuAnchorEl = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setTerrainMenuAnchorEl(event.currentTarget);
  };

  const handleTerrainMenuSelection = (mapType: MAP_STYLE_TYPE) => {
    setTerrainMenuAnchorEl(null);
    setActiveMapStyle(mapType);
  };
  const handleMapMenuClickAway = () => {
    setTerrainMenuAnchorEl(null);
  };

  return (
    <>
      <StyledMapStyleWrapper>
        <NavigationControl />

        <Box pt="4px">
          <StyledMapButton
            smallSize
            style={{
              padding: '1.3px',
              height: '30px',
              width: '100%',
              marginTop: '0.33em',
              minWidth: 0,
              boxShadow: '0 0 0 2px rgba(0,0,0,0.1)',
              borderRadius: '4px',
            }}
            className={drawPolyModeActive ? 'active' : 'inactive'}
            onClick={handleTerrainMenuAnchorEl}
          >
            {mapStyleDetailsMapping[activeMapStyle].icon}
          </StyledMapButton>
        </Box>

        <Menu
          id="map-style-menu"
          anchorEl={terrainMenuAnchorEl}
          keepMounted
          onClose={handleMapMenuClickAway}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          style={{
            marginTop: '40px',
          }}
          open={Boolean(terrainMenuAnchorEl)}
        >
          <StyledMenuItem
            onClick={() => handleTerrainMenuSelection(MAP_STYLE_TYPE.MAP)}
            selected={activeMapStyle === MAP_STYLE_TYPE.MAP}
          >
            <StyledIconWrapper>
              <MapIcon />
            </StyledIconWrapper>
            <StyledMapStyleText>
              {t('ui.geofenceManager.streetMap', 'Map')}
            </StyledMapStyleText>
          </StyledMenuItem>
          <StyledMenuItem
            onClick={() => handleTerrainMenuSelection(MAP_STYLE_TYPE.SATELLITE)}
            selected={activeMapStyle === MAP_STYLE_TYPE.SATELLITE}
          >
            <StyledIconWrapper>
              <SatelliteIcon />
            </StyledIconWrapper>
            <StyledMapStyleText>
              {t('ui.geofenceManager.satelliteMap', 'Satellite')}
            </StyledMapStyleText>
          </StyledMenuItem>
          <StyledMenuItem
            onClick={() => handleTerrainMenuSelection(MAP_STYLE_TYPE.TERRAIN)}
            selected={activeMapStyle === MAP_STYLE_TYPE.TERRAIN}
          >
            <StyledIconWrapper>
              <TerrainIcon />
            </StyledIconWrapper>
            <StyledMapStyleText>
              {t('ui.geofenceManager.terrainMap', 'Terrain')}
            </StyledMapStyleText>
          </StyledMenuItem>
        </Menu>
      </StyledMapStyleWrapper>

      {showGeolocateControlOption && (
        <StyledGeolocateIconWrapper>
          <GeolocateControl
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation
          />
        </StyledGeolocateIconWrapper>
      )}

      <StyledScaleBarWrapper>
        <ScaleControl maxWidth={150} unit="metric" />
      </StyledScaleBarWrapper>
    </>
  );
};

export default MapControls;
