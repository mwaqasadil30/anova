import {
  QeerBaseDto,
  ErrorRecordResponseModel,
  QuickEditEventsDto,
  UnitType,
  UnitTypeEnum,
} from 'api/admin/api';
import { TFunction } from 'i18next';
import camelCase from 'lodash/camelCase';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import round from 'lodash/round';
import { isNumber } from 'utils/format/numbers';
import { fieldBetweenNumberRange, fieldIsRequired } from 'utils/forms/errors';
import * as Yup from 'yup';
import {
  QEERInventoryDTOWithPreciseValue,
  QEERLevelDTOWithPreciseValue,
  QuickEditEventsDTOWithPreciseValues,
  RecordIdToErrorsMapping,
  Values,
} from './types';

export const buildValidationSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  return Yup.object().shape({
    dataChannels: Yup.array().of(
      Yup.object().shape({
        missingDataEvent: Yup.object()
          .shape({
            maxDataAgeByHour: Yup.number()
              .typeError(fieldIsRequired(t, translationTexts.hoursText))
              .required(fieldIsRequired(t, translationTexts.hoursText))
              .min(
                0,
                fieldBetweenNumberRange(t, translationTexts.hoursText, 0, 999)
              )
              .max(
                999,
                fieldBetweenNumberRange(t, translationTexts.hoursText, 0, 999)
              ),
            maxDataAgeByMinute: Yup.number()
              .typeError(fieldIsRequired(t, translationTexts.minutesText))
              .required(fieldIsRequired(t, translationTexts.minutesText))
              .min(
                0,
                fieldBetweenNumberRange(t, translationTexts.minutesText, 0, 59)
              )
              .max(
                59,
                fieldBetweenNumberRange(t, translationTexts.minutesText, 0, 59)
              ),
          })
          .nullable(),
      })
    ),
  });
};

const defaultDataChannels: QuickEditEventsDto[] = [];

function roundValueForEvent<T extends QeerBaseDto>(
  event: T | null | undefined,
  decimalPlaces: number
) {
  if (!event) {
    return event;
  }

  return {
    ...event,
    eventValue: isNumber(event.eventValue)
      ? round(event.eventValue!, decimalPlaces)
      : null,
    _precise_eventValue: event.eventValue,
  } as T;
}

export const getUnitText = (
  displayUnit: UnitTypeEnum | undefined,
  scaledUnit: string | null | undefined,
  unitsOfMeasureTextMapping: Record<UnitType, string>
) => {
  if (
    displayUnit === UnitTypeEnum.DefaultScaled ||
    displayUnit === null ||
    displayUnit === undefined
  ) {
    return scaledUnit || '';
  }

  return unitsOfMeasureTextMapping[displayUnit];
};

export const getChangedDataChannels = (
  initialDataChannels: QuickEditEventsDTOWithPreciseValues[],
  submittedDataChannels: QuickEditEventsDTOWithPreciseValues[]
) => {
  const changedDataChannels: QuickEditEventsDTOWithPreciseValues[] = [];
  submittedDataChannels.forEach((submittedDataChannel, dataChannelIndex) => {
    const initialDataChannel = initialDataChannels[dataChannelIndex];

    // We omit the rosters property from checking if the event rules are equal
    // since they are edited outside this form and updated dynamically (meaning
    // they haven't changed between the client side on the form, and on the
    // server side in the DB).
    const propertiesToOmitForEqualCheck: Array<keyof QeerBaseDto> = ['rosters'];

    const changedInventoryEvents: QEERInventoryDTOWithPreciseValue[] = [];
    submittedDataChannel.inventoryEvents?.forEach(
      (submittedInventoryEvent, index) => {
        const initialInventoryEvent =
          initialDataChannel.inventoryEvents?.[index];

        const isDifferent = !isEqual(
          omit(initialInventoryEvent, propertiesToOmitForEqualCheck),
          omit(submittedInventoryEvent, propertiesToOmitForEqualCheck)
        );
        if (isDifferent) {
          changedInventoryEvents.push(submittedInventoryEvent);
        }
      }
    );

    const changedLevelEvents: QEERLevelDTOWithPreciseValue[] = [];
    submittedDataChannel.levelEvents?.forEach((submittedLevelEvent, index) => {
      const initialLevelEvent = initialDataChannel.levelEvents?.[index];

      const isDifferent = !isEqual(
        omit(initialLevelEvent, propertiesToOmitForEqualCheck),
        omit(submittedLevelEvent, propertiesToOmitForEqualCheck)
      );
      if (isDifferent) {
        changedLevelEvents.push(submittedLevelEvent);
      }
    });

    const isMissingDataEventDifferent = !isEqual(
      omit(initialDataChannel.missingDataEvent, propertiesToOmitForEqualCheck),
      omit(submittedDataChannel.missingDataEvent, propertiesToOmitForEqualCheck)
    );
    const changedMissingDataEvent = isMissingDataEventDifferent
      ? submittedDataChannel.missingDataEvent
      : null;

    const isUsageRateEventDifferent = !isEqual(
      omit(initialDataChannel.usageRateEvent, propertiesToOmitForEqualCheck),
      omit(submittedDataChannel.usageRateEvent, propertiesToOmitForEqualCheck)
    );
    const changedUsageRateEvent = isUsageRateEventDifferent
      ? submittedDataChannel.usageRateEvent
      : null;

    if (
      changedInventoryEvents.length ||
      changedLevelEvents.length ||
      changedMissingDataEvent ||
      changedUsageRateEvent
    ) {
      changedDataChannels.push({
        ...submittedDataChannel,
        inventoryEvents: changedInventoryEvents,
        levelEvents: changedLevelEvents,
        missingDataEvent: changedMissingDataEvent,
        usageRateEvent: changedUsageRateEvent,
      });
    }
  });

  return changedDataChannels;
};

export const formatDataChannelsForForm = (
  values?: QuickEditEventsDto[] | null
): Values['dataChannels'] => {
  const dataChannels = values?.map((dataChannel) => {
    return {
      ...dataChannel,
      inventoryEvents: dataChannel.inventoryEvents?.map((event) =>
        roundValueForEvent(event, event.decimalPlaces || 0)
      ),
      levelEvents: dataChannel.levelEvents?.map((event) =>
        roundValueForEvent(event, event.decimalPlaces || 0)
      ),
      // deliveryScheduleEvents: dataChannel.deliveryScheduleEvents?.map((event) =>
      //   roundValueForEvent(event, decimalPlaces)
      // ),
      // NOTE: usageRateEvent doesn't include `decimalPlaces`, so we don't
      // round the event values
    } as QuickEditEventsDto;
  });

  return dataChannels || defaultDataChannels;
};

const getEventWithPreciseOrRoundedValue = (
  event:
    | QEERLevelDTOWithPreciseValue
    | QEERInventoryDTOWithPreciseValue
    | null
    | undefined,
  initialEvent?:
    | QEERLevelDTOWithPreciseValue
    | QEERInventoryDTOWithPreciseValue
    | null
    | undefined
) => {
  if (!event) {
    return initialEvent;
  }

  // If no initial event exists, or if the event value hasn't changed, then use
  // the precise event value with a bunch of decimal places.
  if (
    !initialEvent ||
    (event.eventValue === initialEvent.eventValue &&
      isNumber(event._precise_eventValue))
  ) {
    return {
      ...event,
      eventValue: event._precise_eventValue,
    };
  }

  // Otherwise, we return the event with the value the user typed in
  return event;
};

export const formatValuesForApi = (
  values: Values,
  initialValues: Values
): QuickEditEventsDto[] => {
  const changedDataChannels = getChangedDataChannels(
    initialValues.dataChannels,
    values.dataChannels
  );

  return changedDataChannels.map((dataChannel) => {
    // We aren't using the index since we're submitting only the data
    // channels that have changed. This means the lengths of the initial
    // data channels and the changed data channels could be different, so
    // using the index could potentially result in getting the wrong data
    // channel.
    const associatedInitialDataChannel = initialValues.dataChannels.find(
      (initialDataChannel) =>
        initialDataChannel.dataChannelId === dataChannel.dataChannelId
    );

    return QuickEditEventsDto.fromJS({
      ...dataChannel,
      inventoryEvents: dataChannel.inventoryEvents?.map((event) => {
        // Same note about not using the data channel index above, except
        // this time with the event rule index
        const associatedInitialEvent = associatedInitialDataChannel?.inventoryEvents?.find(
          (initialEvent) =>
            initialEvent.dcerEventRuleId === event.dcerEventRuleId
        );

        return getEventWithPreciseOrRoundedValue(event, associatedInitialEvent);
      }),
      levelEvents: dataChannel.levelEvents?.map((event) => {
        const associatedInitialEvent = associatedInitialDataChannel?.levelEvents?.find(
          (initialEvent) =>
            initialEvent.dcerEventRuleId === event.dcerEventRuleId
        );

        return getEventWithPreciseOrRoundedValue(event, associatedInitialEvent);
      }),
      usageRateEvent: getEventWithPreciseOrRoundedValue(
        dataChannel.usageRateEvent,
        associatedInitialDataChannel?.usageRateEvent
      ),
    });
  });
};

const formatValidationErrorForEventRule = (
  event:
    | QEERLevelDTOWithPreciseValue
    | QEERInventoryDTOWithPreciseValue
    | null
    | undefined,
  recordIdToErrorMapping: RecordIdToErrorsMapping
) => {
  const validationErrors =
    recordIdToErrorMapping[String(event?.dcerEventRuleId)];

  const validValidationErrors = validationErrors?.filter(
    (error) => error.propertyName && error.errorMessage
  );

  if (!validValidationErrors?.length) {
    return null;
  }

  // Build a mapping of field names to a list of errors for that field name
  const formattedErrors = validValidationErrors.reduce<
    Record<string, string[]>
  >((prev, current) => {
    // propertyName and errorMessage should be strings since they're filtered
    // to be non-empty above
    const { propertyName, errorMessage } = current;

    const camelCasePropertyName = camelCase(propertyName!);
    prev[camelCasePropertyName!] = prev[camelCasePropertyName]
      ? prev[camelCasePropertyName].concat(errorMessage!)
      : [errorMessage!];

    return prev;
  }, {});

  return formattedErrors;
};

export const mapApiErrorsToFields = (
  t: TFunction,
  errors: any,
  initialDataChannels: QuickEditEventsDTOWithPreciseValues[]
) => {
  if (!errors) {
    return null;
  }

  if (Array.isArray(errors)) {
    // Build a mapping of recordIds to a list of errors for that recordId
    const recordIdToErrorMapping = (errors as ErrorRecordResponseModel[]).reduce<RecordIdToErrorsMapping>(
      (prev, current) => {
        if (current.recordId) {
          prev[current.recordId] = prev[current.recordId]
            ? prev[current.recordId].concat(current)
            : [current];
        }

        return prev;
      },
      {}
    );

    const dataChannelErrors = initialDataChannels.map((initialDataChannel) => {
      const levelEventsErrors = initialDataChannel.levelEvents?.map((event) =>
        formatValidationErrorForEventRule(event, recordIdToErrorMapping)
      );
      const inventoryEventsErrors = initialDataChannel.inventoryEvents?.map(
        (event) =>
          formatValidationErrorForEventRule(event, recordIdToErrorMapping)
      );
      const missingDataEventErrors = formatValidationErrorForEventRule(
        initialDataChannel.missingDataEvent,
        recordIdToErrorMapping
      );
      const usageRateEventErrors = formatValidationErrorForEventRule(
        initialDataChannel.usageRateEvent,
        recordIdToErrorMapping
      );

      return {
        levelEvents: levelEventsErrors,
        inventoryEvents: inventoryEventsErrors,
        missingDataEvent: missingDataEventErrors,
        usageRateEvent: usageRateEventErrors,
      };
    });

    return {
      dataChannels: dataChannelErrors,
    };
  }

  return errors;
};
