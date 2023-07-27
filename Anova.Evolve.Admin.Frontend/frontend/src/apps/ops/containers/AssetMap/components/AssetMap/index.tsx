import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {
  AssetListFilterOptions,
  AssetDetailDto,
  EvolveAssetLocationDto,
  EvolveAssetMapAssetInfoRecord,
  UnitType,
} from 'api/admin/api';
import { isLatitudeValid, isLongitudeValid } from 'api/mapbox/helpers';
import CircularProgress from 'components/CircularProgress';
import CustomBox from 'components/CustomBox';
import MessageBlock from 'components/MessageBlock';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { MapViewport } from '../../types';
import Map from '../Map';

const StyledMapOverlay = styled.div`
  position: absolute;
  pointer-events: none;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const StyledCircularProgress = styled(CircularProgress)`
  z-index: 1;
`;

interface FilterFormProps {
  filterByColumn: AssetListFilterOptions;
  filterTextValue: string;
  unitSelected: UnitType;
  dataChannelSelected: any;
  inventoryStateSelected: any;
}

interface Props extends FilterFormProps {
  isFetching: boolean;
  hideFilterBar: boolean;
  records?: EvolveAssetLocationDto[] | null;
  responseError?: any;
  selectedSiteMarker?: EvolveAssetLocationDto | null;
  zoomToSelectedSiteKey: string;
  debouncedMapViewport: MapViewport | null;
  initialLocationStateMapViewport: MapViewport | null;
  onClickMarker: (site: EvolveAssetLocationDto | null) => void;
  setSelectedAssetDetails: (asset: AssetDetailDto | null) => void;
  setSelectedSiteAsset: (asset: EvolveAssetMapAssetInfoRecord | null) => void;
  openPanelOnSiteSelection: (arg0: boolean) => void;
  onShowHideFilterBar: (shouldHideFilterBar: boolean) => void;
  setDebouncedMapViewport: React.Dispatch<
    React.SetStateAction<MapViewport | null>
  >;
  setSelectedDataChannelId: (dcId: string) => void;
}

const AssetMap = ({
  isFetching,
  hideFilterBar,
  records,
  responseError,
  selectedSiteMarker,
  zoomToSelectedSiteKey,
  debouncedMapViewport,
  initialLocationStateMapViewport,
  onClickMarker,
  openPanelOnSiteSelection,
  setSelectedAssetDetails,
  setSelectedSiteAsset,
  onShowHideFilterBar,
  setDebouncedMapViewport,
  setSelectedDataChannelId,
}: Props) => {
  const { t } = useTranslation();
  const assetCoordinates = records?.filter((record) => {
    return (
      isLatitudeValid(record.latitude) && isLongitudeValid(record.longitude)
    );
  });

  return (
    <CustomBox
      grayBackground
      p={0}
      height="100%"
      width="100%"
      minHeight="400px"
    >
      <Map
        sites={assetCoordinates}
        isFetchingSites={isFetching}
        onClickMarker={onClickMarker}
        openPanelOnSiteSelection={openPanelOnSiteSelection}
        selectedSiteMarker={selectedSiteMarker}
        zoomToSelectedSiteKey={zoomToSelectedSiteKey}
        setSelectedAssetDetails={setSelectedAssetDetails}
        setSelectedSiteAsset={setSelectedSiteAsset}
        hideFilterBar={hideFilterBar}
        onShowHideFilterBar={onShowHideFilterBar}
        initialLocationStateMapViewport={initialLocationStateMapViewport}
        debouncedMapViewport={debouncedMapViewport}
        setDebouncedMapViewport={setDebouncedMapViewport}
        setSelectedDataChannelId={setSelectedDataChannelId}
      />
      {isFetching && (
        <StyledMapOverlay>
          <MessageBlock height="100%">
            <StyledCircularProgress />
          </MessageBlock>
        </StyledMapOverlay>
      )}
      {!isFetching && responseError && (
        <StyledMapOverlay>
          <MessageBlock height="100%">
            <Paper square>
              <Box p={2}>
                <Typography variant="body2" color="error">
                  {t('ui.assetlist.error', 'Unable to retrieve assets')}
                </Typography>
              </Box>
            </Paper>
          </MessageBlock>
        </StyledMapOverlay>
      )}
    </CustomBox>
  );
};

export default AssetMap;
