/* eslint-disable indent */
import Grid, { GridProps } from '@material-ui/core/Grid';
import { DataChannelDTO, UnitTypeEnum } from 'api/admin/api';
import React from 'react';
import {
  ChangeSelectedDataChannelFunction,
  DataChannelForGraph,
  ReadingsHookData,
} from '../../types';
import CarouselCard from './components/CarouselCard';

export interface Props {
  dataChannels?: DataChannelDTO[] | null;
  selectedDataChannels: DataChannelForGraph[];
  isFetchingDataChannel?: boolean;
  minimumSelectionCount?: number;
  hideUnitOfMeasureButtons?: boolean;
  shouldWrap?: boolean;
  isPublishedAsset?: boolean;
  readingsData?: ReadingsHookData;
  canSelectDataChannel?: (dataChannel: DataChannelDTO) => boolean;
  handleChangeSelectedDataChannel: ChangeSelectedDataChannelFunction;
  handleChangeDataChannelToUnitMapping?: (
    dataChannelId: string,
    unit?: UnitTypeEnum | null
  ) => void;
  openUpdateDisplayPriorityDialog: () => void;
  setDataChannelsResult?: (dataChannels: DataChannelDTO[]) => void;
  fetchRecords: () => void;
}

const AssetCarousel = ({
  dataChannels,
  selectedDataChannels,
  isFetchingDataChannel,
  minimumSelectionCount,
  hideUnitOfMeasureButtons,
  shouldWrap,
  isPublishedAsset,
  readingsData,
  canSelectDataChannel,
  handleChangeSelectedDataChannel,
  handleChangeDataChannelToUnitMapping,
  openUpdateDisplayPriorityDialog,
  setDataChannelsResult,
  fetchRecords,
}: Props) => {
  const cardHeight = 132;
  const gridWrapProps: GridProps = shouldWrap
    ? {}
    : {
        wrap: 'nowrap',
        // Use a min height for the card that includes spacing for box-shadows
        style: { overflowX: 'auto', minHeight: cardHeight + 12 },
      };

  return (
    <Grid container spacing={1} {...gridWrapProps}>
      {dataChannels?.map((dc) => {
        const showCheckbox = canSelectDataChannel
          ? canSelectDataChannel(dc)
          : true;
        const isSelected = !!selectedDataChannels.find(
          (channel) => channel.dataChannelId === dc.dataChannelId!
        );

        const checkboxNeedsToRemainSelected =
          isSelected &&
          !!minimumSelectionCount &&
          selectedDataChannels.length <= minimumSelectionCount;
        const disableCheckbox =
          isFetchingDataChannel || checkboxNeedsToRemainSelected;
        return (
          <Grid item>
            <CarouselCard
              key={dc.dataChannelId!}
              cardHeight={cardHeight}
              dataChannel={dc}
              isSelected={isSelected}
              disableCheckbox={disableCheckbox}
              disableUnitOfMeasureButtons={isFetchingDataChannel}
              showCheckbox={showCheckbox}
              dataChannels={dataChannels}
              isPublishedAsset={isPublishedAsset}
              readingsData={readingsData}
              selectedDataChannels={selectedDataChannels}
              handleChangeSelectedDataChannel={handleChangeSelectedDataChannel}
              handleChangeDataChannelToUnitMapping={
                handleChangeDataChannelToUnitMapping
              }
              hideUnitOfMeasureButtons={hideUnitOfMeasureButtons}
              openUpdateDisplayPriorityDialog={openUpdateDisplayPriorityDialog}
              setDataChannelsResult={setDataChannelsResult}
              fetchRecords={fetchRecords}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default AssetCarousel;
