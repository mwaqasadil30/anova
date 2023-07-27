import { ScheduledDeliveryDto } from 'api/admin/api';
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
    lateGracePeriodInMinutes: scheduleDeliveryDetails.lateGracePeriodInMinutes,
    dataChannelId: scheduleDeliveryDetails.dataChannelId,
    deliveryScheduleId: scheduleDeliveryDetails.deliveryScheduleId,
    timeCompleted: scheduleDeliveryDetails.timeCompleted,
  };
};

export const formatValuesForApi = (values: Values): ScheduledDeliveryDto => {
  return {
    scheduledTime: moment(values.scheduledTime).toDate(),
    isAutoFill: values.isAutoFill,
    deliveryAmount: values.deliveryAmount,
    lateGracePeriodInMinutes: values.lateGracePeriodInMinutes,
    dataChannelId: values.dataChannelId,
    deliveryScheduleId: values.deliveryScheduleId,
    timeCompleted: values.timeCompleted,
  } as ScheduledDeliveryDto;
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
