import {
  QEERInventoryDTOWithPreciseValue,
  QEERLevelDTOWithPreciseValue,
  QEERUsageRateDTOWithPreciseValue,
} from './types';

export const getIsEventRuleDisabled = (
  isTotalizedOrRateOfChangeDataChannel: boolean,
  isVirtualChannelorRtuDataChannel: boolean,
  event:
    | QEERLevelDTOWithPreciseValue
    | QEERInventoryDTOWithPreciseValue
    | QEERUsageRateDTOWithPreciseValue
) => {
  if (event.isLinkedToEventRule) {
    return true;
  }

  if (isVirtualChannelorRtuDataChannel) {
    return true;
  }

  if (
    !event.isSetpointUpdateSupported &&
    event.rtuChannelSetpointIndex !== null
  ) {
    return true;
  }

  if (isTotalizedOrRateOfChangeDataChannel) {
    return false;
  }

  if (event.isSetpointUpdateSupported === true) {
    return false;
  }

  return false;
};
