import { getIn } from 'formik';
import {
  CommonEventTableRowProps,
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

  // The back-end recieves a 0 for an empty rtuChannelSetpointIndex,
  // because of the Setpoint dropdown options having a '-' (empty) option,
  // which is indexed at position 0
  if (!event.isSetpointUpdateSupported && !!event.rtuChannelSetpointIndex) {
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

export const getAnyFieldErrors = (
  fieldName: string,
  errors: any,
  status: CommonEventTableRowProps['status']
) => {
  const fieldErrors = getIn(errors, fieldName);
  const fieldStatusErrors = getIn(status?.errors, fieldName);

  let anyFieldErrors = null;
  if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
    anyFieldErrors = fieldErrors;
  } else if (Array.isArray(fieldStatusErrors) && fieldStatusErrors.length > 0) {
    anyFieldErrors = fieldStatusErrors;
  }
  return anyFieldErrors;
};
