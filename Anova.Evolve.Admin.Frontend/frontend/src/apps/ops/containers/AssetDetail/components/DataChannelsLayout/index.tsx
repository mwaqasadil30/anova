/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ListIcon from '@material-ui/icons/Reorder';
import GridIcon from '@material-ui/icons/ViewModule';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { DataChannelDTO } from 'api/admin/api';
import { ReactComponent as DragAndDropItemIcon } from 'assets/icons/drag-and-drop-item-icon.svg';
import Button from 'components/Button';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { getCustomDomainContrastText } from 'styles/colours';
import { CommonGraphDataChannelProps, ReadingsHookData } from '../../types';
import AssetCarousel, { Props as CarouselProps } from '../AssetCarousel';
import DataChannelsTable from '../DataChannelsTable';

const StyledPanelTitle = styled(Typography)`
  && {
    color: ${(props) => props.theme.palette.text.primary};
    font-size: 16px;
    font-weight: 500;
  }
`;

const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
  border: 0;

  ${(props) => {
    const dominantDomainColor =
      props.theme.palette.type === 'light'
        ? props.theme.custom.domainSecondaryColor
        : props.theme.custom.domainColor;
    const textColorForDominantColor = getCustomDomainContrastText(
      dominantDomainColor
    );
    return `
      & .MuiToggleButton-root {
        border: 0;
        background: ${props.theme.custom.palette.background.buttonBackground};
        padding: 4px 8px;
      }

      & .MuiToggleButton-root.Mui-selected {
        background: ${dominantDomainColor};
        color: ${textColorForDominantColor};
      }
    `;
  }}
`;

interface RouteParams {
  assetId: string;
}

interface Props {
  carouselProps: Partial<CarouselProps>;
  dataChannelResult: CommonGraphDataChannelProps['dataChannels'];
  isPublishedAsset: CommonGraphDataChannelProps['isPublishedAsset'];
  selectedDataChannels: CommonGraphDataChannelProps['selectedDataChannels'];
  minimumSelectionCount: CommonGraphDataChannelProps['minimumSelectionCount'];
  isFetchingDataChannel: CommonGraphDataChannelProps['isFetchingDataChannel'];
  readingsData: ReadingsHookData;
  canSelectDataChannel: CommonGraphDataChannelProps['canSelectDataChannel'];
  handleChangeSelectedDataChannel: CommonGraphDataChannelProps['handleChangeSelectedDataChannel'];
  handleChangeDataChannelToUnitMapping: CommonGraphDataChannelProps['handleChangeDataChannelToUnitMapping'];
  setDataChannelsResult: (dataChannels: DataChannelDTO[]) => void;
  fetchRecords: () => void;
  openUpdateDisplayPriorityDialog: () => void;
}

const DataChannelsLayout = ({
  carouselProps,
  dataChannelResult,
  isPublishedAsset,
  selectedDataChannels,
  minimumSelectionCount,
  isFetchingDataChannel,
  readingsData,
  canSelectDataChannel,
  handleChangeSelectedDataChannel,
  handleChangeDataChannelToUnitMapping,
  setDataChannelsResult,
  fetchRecords,
  openUpdateDisplayPriorityDialog,
}: Props) => {
  const { t } = useTranslation();

  const [isListViewActive, setIsListViewActive] = useState(true);
  const handleChangeDataChannelsLayout = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    isChecked: boolean | null
  ) => {
    if (isChecked !== null) {
      setIsListViewActive(isChecked);
    }
  };

  const commonLayoutProps = {
    dataChannels: dataChannelResult,
    selectedDataChannels,
    isPublishedAsset,
    isFetchingDataChannel,
    minimumSelectionCount,
    readingsData,
    canSelectDataChannel,
    handleChangeSelectedDataChannel,
    handleChangeDataChannelToUnitMapping,
    openUpdateDisplayPriorityDialog,
    setDataChannelsResult,
    fetchRecords,
  };

  return (
    <Box width="100%">
      <Grid container spacing={1} alignItems="center" justify="space-between">
        <Grid item>
          <StyledPanelTitle>
            {t('ui.common.datachannels', 'Data Channels')} (
            {dataChannelResult.length})
          </StyledPanelTitle>
        </Grid>
        <Grid item>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Button
                startIcon={<DragAndDropItemIcon />}
                useDomainColorForIcon
                onClick={openUpdateDisplayPriorityDialog}
              >
                {t(
                  'ui.assetdetail.updatedisplaypriority',
                  'Update Display Priority'
                )}
              </Button>
            </Grid>
            <Grid item>
              <StyledToggleButtonGroup
                exclusive
                value={isListViewActive}
                onChange={handleChangeDataChannelsLayout}
                aria-label="Data channels layout"
              >
                <ToggleButton value>
                  <ListIcon />
                </ToggleButton>
                <ToggleButton value={false}>
                  <GridIcon />
                </ToggleButton>
              </StyledToggleButtonGroup>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {isListViewActive ? (
            <DataChannelsTable {...commonLayoutProps} />
          ) : (
            <AssetCarousel {...carouselProps} {...commonLayoutProps} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default DataChannelsLayout;
