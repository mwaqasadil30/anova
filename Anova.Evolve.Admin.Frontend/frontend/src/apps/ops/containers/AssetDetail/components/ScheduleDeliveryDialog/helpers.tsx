import { TFunction } from 'i18next';
import moment from 'moment';
import { formatApiErrors } from 'utils/format/errors';
import { isNumber } from 'utils/format/numbers';
import { Values } from './types';

export const formatInitialValues = (
  scheduleDeliveryDetails: Values
): Values => {
  return {
    date: scheduleDeliveryDetails.date,
    scheduledTime: scheduleDeliveryDetails.scheduledTime || undefined,
    isAutoFill: scheduleDeliveryDetails.isAutoFill,
    deliveryAmount: isNumber(scheduleDeliveryDetails.deliveryAmount)
      ? scheduleDeliveryDetails.deliveryAmount
      : null,
    lateGracePeriodInMinutes: 60,
  };
};

export const formatValuesForApi = (values: Values) => {
  return {
    date: values.date,
    scheduledTime: moment(values.scheduledTime).toDate(),
    isAutoFill: values.isAutoFill,
    deliveryAmount: values.deliveryAmount,
    lateGracePeriodInMinutes: values.lateGracePeriodInMinutes,
  };
};

export const mapApiErrorsToFields = (t: TFunction, errors: any) => {
  if (!errors) {
    return null;
  }

  if (Array.isArray(errors)) {
    return formatApiErrors(t, errors);
  }

  return errors;
};
