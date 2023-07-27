import React from 'react';
import {
  DataChannelDTO,
  EventRuleModel,
  EventRuleCategory,
} from 'api/admin/api';
import { TFunction } from 'i18next';
import round from 'lodash/round';
import { isNumber } from 'utils/format/numbers';
import { eventComparatorTypeTextMapping } from 'utils/i18n/enum-to-text';

export const formatEvents = (
  dataChannel: DataChannelDTO,
  event: EventRuleModel | undefined | null,
  t: TFunction
) => {
  const displaySymbolForEventComparator =
    eventComparatorTypeTextMapping[event?.comparator!] || '';

  const displayEventValue = isNumber(event?.eventValue)
    ? Number(event?.eventValue)
    : null;

  const decimalPlaces = dataChannel.uomParams?.decimalPlaces;
  const unit = dataChannel?.uomParams?.unit;

  const formattedUsageRateDecimalPlaces =
    decimalPlaces && decimalPlaces > 3 ? decimalPlaces : 3;

  switch (event?.eventRuleType) {
    case EventRuleCategory.MissingData: {
      if (isNumber(displayEventValue)) {
        return `${displaySymbolForEventComparator} ${round(
          displayEventValue!,
          decimalPlaces
        )} ${t('ui.common.mins', 'Min(s)')}`;
      }

      return <em>-</em>;
    }
    case EventRuleCategory.Level:
      if (isNumber(displayEventValue)) {
        return `${displaySymbolForEventComparator} ${round(
          displayEventValue!,
          decimalPlaces
        )} ${unit}`;
      }

      return <em>-</em>;
    case EventRuleCategory.UsageRate: {
      if (isNumber(displayEventValue)) {
        return `${displaySymbolForEventComparator} ${round(
          displayEventValue!,
          // We only want a minimum of 3 decimal places for usage rate events
          formattedUsageRateDecimalPlaces
        )} ${unit}/${t('ui.assetDetail.shortFormHour', 'hr')}`;
      }

      return <em>-</em>;
    }
    case EventRuleCategory.GeoFencing: {
      const displayText = `${displaySymbolForEventComparator} ${displayEventValue} ${unit}`;
      return displayEventValue ? displayText : <em>-</em>;
    }
    case EventRuleCategory.RTUChannelEvent:
      if (isNumber(displayEventValue)) {
        return `${round(displayEventValue!, decimalPlaces)}`;
      }

      return <em>-</em>;
    // We only show enabled events, so scheduled deliveries are always yes
    case EventRuleCategory.ScheduledDeliveryMissed:
    case EventRuleCategory.ScheduledDeliveryTooEarly:
    case EventRuleCategory.ScheduledDeliveryTooLate:
      return (
        !!dataChannel.uomParams?.eventRules?.length && t('ui.common.yes', 'Yes')
      );
    default:
      return <em>-</em>;
  }
};
