/* eslint-disable indent */
import MenuItem from '@material-ui/core/MenuItem';
import {
  DataChannelDTO,
  DataChannelCategory,
  SupportedUOMType,
  UOMParamsDTO,
} from 'api/admin/api';
import { isLatitudeValid, isLongitudeValid } from 'api/mapbox/helpers';
import StyledListSubheader from 'components/StyledListSubheader';
import { TFunction } from 'i18next';
import round from 'lodash/round';
import React from 'react';
import { isNumber } from 'utils/format/numbers';
import {
  buildUnitOfMeasureCategoryMapping,
  UnitOfMeasureCategory,
} from 'utils/i18n/enum-to-text';
import { getDigitalInputDisplayText } from 'utils/ui/digital-input';
import { UOMOption } from './types';

export const getReadingValueDisplayText = (dataChannel: DataChannelDTO) => {
  const latestReadingValue = dataChannel.uomParams?.latestReadingValue;

  switch (dataChannel?.dataChannelTypeId) {
    case DataChannelCategory.Gps: {
      const latitude = latestReadingValue;
      const longitude = dataChannel.uomParams?.latestReadingValue2;
      return isLatitudeValid(latitude) && isLongitudeValid(longitude)
        ? `${round(latitude!, 6)}, ${round(longitude!, 6)}`
        : '';
    }
    case DataChannelCategory.DigitalInput: {
      const digitalInputDisplayText = getDigitalInputDisplayText({
        value: latestReadingValue,
        stateZeroText: dataChannel.digitalState0Text,
        stateOneText: dataChannel.digitalState1Text,
        stateTwoText: dataChannel.digitalState2Text,
        stateThreeText: dataChannel.digitalState3Text,
      });
      return digitalInputDisplayText;
    }
    default: {
      const unitAsText = dataChannel.uomParams?.unit;
      const decimalPlaces = dataChannel.uomParams?.decimalPlaces || 0;
      return isNumber(latestReadingValue) && unitAsText
        ? `${round(latestReadingValue!, decimalPlaces)} ${unitAsText}`
        : '';
    }
  }
};

export const updateDataChannelsWithUOMParamsResponse = (
  dataChannelsToUpdate: DataChannelDTO[] | undefined,
  dataChannelIdToUOMParamsResponse: Record<string, UOMParamsDTO>
) => {
  // Update the data channel's uomParams since the unit conversion API
  // only returns a data channel's uomParams
  let hasUpdatedDataChannels = false;
  const resultingDataChannels = dataChannelsToUpdate?.map((channel) => {
    const updatedUomParamsResponse =
      dataChannelIdToUOMParamsResponse[channel.dataChannelId!];

    // If the channel wasn't updated, don't modify the existing channel
    if (!updatedUomParamsResponse) {
      return channel;
    }

    // Otherwise, update the data channel's UOMParams
    hasUpdatedDataChannels = true;
    const newDataChannel = DataChannelDTO.fromJS({
      ...channel,
      uomParams: updatedUomParamsResponse,
    });
    return newDataChannel;
  });

  return {
    hasUpdatedDataChannels,
    dataChannels: resultingDataChannels,
  };
};

export const buildUOMOptions = (
  supportedUOMTypeId: SupportedUOMType | undefined,
  options: UOMOption[],
  t: TFunction
) => {
  if (
    supportedUOMTypeId === SupportedUOMType.Basic ||
    supportedUOMTypeId === SupportedUOMType.BasicWithPercentFull
  ) {
    return options?.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ));
  }

  const categoryToOptionsMapping = options.reduce((prev, current) => {
    if (!prev[current.type]) {
      prev[current.type] = [];
    }

    prev[current.type].push(current);

    return prev;
  }, {} as Record<UnitOfMeasureCategory, UOMOption[]>);

  const unitOfMeasureCategoryMapping = buildUnitOfMeasureCategoryMapping(t);

  const categorizedSelectMenuItems = [
    // Display options based on this category order
    UnitOfMeasureCategory.Other,
    UnitOfMeasureCategory.Distance,
    UnitOfMeasureCategory.Volume,
    UnitOfMeasureCategory.Mass,
  ]
    .filter((category) => !!categoryToOptionsMapping[category])
    .map((category) => {
      const unitOfMeasureCategoryText = unitOfMeasureCategoryMapping[category];
      const unitOptions = categoryToOptionsMapping[category];
      return [
        <StyledListSubheader>{unitOfMeasureCategoryText}</StyledListSubheader>,
        ...unitOptions?.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        )),
      ];
    });

  return categorizedSelectMenuItems;
};

export const canShowUnitOfMeasureOptionsForDataChannel = (
  dataChannel: DataChannelDTO
) =>
  dataChannel.dataChannelTypeId === DataChannelCategory.Level ||
  dataChannel.dataChannelTypeId === DataChannelCategory.TotalizedLevel;

export const formatScheduledDeliveryAmountValue = (
  scaledUnits?: number,
  displayUnits?: number,
  estimatedValue?: number | null
) => {
  // Scaled Value
  if (scaledUnits && estimatedValue) {
    return round(scaledUnits - estimatedValue, 2);
  }
  // Display Value
  if (displayUnits && estimatedValue) {
    return round(displayUnits - estimatedValue, 2);
  }
  // The data channel estimatedScaleValue is 0 so we need to fill it to the
  // max (Scaled or Display) value
  return scaledUnits
    ? round(scaledUnits, 2)
    : displayUnits
    ? round(displayUnits, 2)
    : null;
};
