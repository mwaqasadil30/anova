/* eslint-disable indent */
import {
  DataChannelEventRulesDTO,
  ErrorRecordResponseModel,
  QeerBaseDto,
  UnitType,
  UnitTypeEnum,
} from 'api/admin/api';
import { TFunction } from 'i18next';
import camelCase from 'lodash/camelCase';
import round from 'lodash/round';
import { secondsToHoursAndMinutes } from 'utils/format/dates';
import { isNumber } from 'utils/format/numbers';
import { fieldBetweenNumberRange, fieldIsRequired } from 'utils/forms/errors';
import { convertToNumber } from 'utils/forms/values';
import * as Yup from 'yup';
import {
  QEERDeliveryScheduleDTOWithPreciseValue,
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

export const formatDataChannelsForForm = (
  dataChannel?: DataChannelEventRulesDTO | undefined
): Values => {
  const formattedInventoryEvents = dataChannel?.inventoryEvents
    ? dataChannel?.inventoryEvents
        ?.map((event) => roundValueForEvent(event, event.decimalPlaces || 0))
        .map((inventoryEvent) => {
          const formattedEventDelay = secondsToHoursAndMinutes(
            inventoryEvent?.delay
          );

          return {
            ...inventoryEvent,
            maxDataAgeByHour: formattedEventDelay.hours,
            maxDataAgeByMinute: formattedEventDelay.minutes,
            rtuChannelSetpointIndex: isNumber(
              inventoryEvent?.rtuChannelSetpointIndex
            )
              ? inventoryEvent?.rtuChannelSetpointIndex
              : 0, // 0 means the setpoint is not set
            tags: inventoryEvent?.tags
              ? inventoryEvent?.tags?.split(',')
              : null,
          };
        })
    : null;
  const formattedLevelEvents = dataChannel?.levelEvents
    ? dataChannel?.levelEvents
        ?.map((event) => roundValueForEvent(event, event.decimalPlaces || 0))
        .map((levelEvent) => {
          const formattedEventDelay = secondsToHoursAndMinutes(
            levelEvent?.delay
          );

          return {
            ...levelEvent,
            maxDataAgeByHour: formattedEventDelay.hours,
            maxDataAgeByMinute: formattedEventDelay.minutes,
            rtuChannelSetpointIndex: isNumber(
              levelEvent?.rtuChannelSetpointIndex
            )
              ? levelEvent?.rtuChannelSetpointIndex
              : 0, // 0 means the setpoint is not set
            tags: levelEvent?.tags?.length
              ? levelEvent?.tags?.split(',')
              : null,
          };
        })
    : null;

  const usageRateSetpointLogicForInitialValues = () => {
    // Backend / silverlight / DOLV3 hardcodes setpoints. Usage rate events start from 10 to 11.
    // The list we render only has items from indexes 0-2, so we need to massage the back-end data
    // to properly match the list items index.
    // For more, see: usageRateSetpointLogicForApi, below.
    if (
      dataChannel?.usageRateEvent?.rtuChannelSetpointIndex &&
      dataChannel?.usageRateEvent?.rtuChannelSetpointIndex > 0
    ) {
      return dataChannel?.usageRateEvent?.rtuChannelSetpointIndex - 10;
    }

    // This will always be 0 in this case
    return 0;
  };

  const formattedUsageRateEvent = dataChannel?.usageRateEvent
    ? {
        ...dataChannel?.usageRateEvent,
        tags: dataChannel?.usageRateEvent?.tags?.length
          ? dataChannel?.usageRateEvent?.tags.split(',')
          : null,
        rtuChannelSetpointIndex: usageRateSetpointLogicForInitialValues(),
      }
    : null;

  const formattedMissingDataEvent = dataChannel?.missingDataEvent
    ? {
        ...dataChannel?.missingDataEvent,
        tags: dataChannel?.missingDataEvent?.tags?.length
          ? dataChannel?.missingDataEvent?.tags.split(',')
          : null,
      }
    : null;

  return {
    ...dataChannel,
    inventoryEvents: formattedInventoryEvents,
    levelEvents: formattedLevelEvents,
    usageRateEvent: formattedUsageRateEvent,
    missingDataEvent: formattedMissingDataEvent,
    deliveryScheduleEvents: dataChannel?.deliveryScheduleEvents,
  } as Values;
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
): DataChannelEventRulesDTO => {
  // The full edit event save api accepts ALL events, edited and unedited.
  // We no longer (for now) need to check for just the edited events.
  // const dataChannelWithChangedEventRules = getChangedDataChannels(
  //   initialValues,
  //   values
  // );

  // const dataChannel = dataChannelWithChangedEventRules;
  const dataChannel = values;

  // return changedDataChannels.map((dataChannel) => {

  // We aren't using the index since we're submitting only the data
  // channels that have changed. This means the lengths of the initial
  // data channels and the changed data channels could be different, so
  // using the index could potentially result in getting the wrong data
  // channel.
  // NOTE: Dont think we need this for the data channel events drawer
  // const associatedInitialDataChannel = initialValues.dataChannel.find(
  //   (initialDataChannel) =>
  //     initialDataChannel.dataChannelId === dataChannel.dataChannelId
  // );

  const usageRateSetpointLogicForApi = () => {
    // Backend / silverlight / DOLV3 hardcodes setpoints. Usage rate events start from 10 to 11
    if (
      dataChannel?.usageRateEvent?.rtuChannelSetpointIndex &&
      dataChannel?.usageRateEvent?.rtuChannelSetpointIndex > 0
    ) {
      return dataChannel?.usageRateEvent?.rtuChannelSetpointIndex + 10;
    }
    // The back-end needs a null instead of a 0 index sent back
    return null;
  };

  return DataChannelEventRulesDTO.fromJS({
    ...dataChannel,
    inventoryEvents: dataChannel.inventoryEvents
      ? dataChannel.inventoryEvents
          ?.map((event) => {
            // Get the initial inventory event so we can compare it with the updated
            // inventory event to see if the eventValue has changed
            const associatedInitialEvent = initialValues?.inventoryEvents?.find(
              (initialEvent) =>
                initialEvent.dataChannelEventRuleId ===
                event.dataChannelEventRuleId
            );

            return getEventWithPreciseOrRoundedValue(
              event,
              associatedInitialEvent
            );
          })
          .map((inventoryEvent) => {
            // @ts-ignore
            const { maxDataAgeByHour, maxDataAgeByMinute } = inventoryEvent;
            const seconds =
              round(maxDataAgeByHour * 3600) + round(maxDataAgeByMinute * 60);
            const formattedSeconds = convertToNumber(seconds, null);
            // @ts-ignore
            const { tags } = inventoryEvent;
            const formattedTags = tags?.join(',');

            return {
              ...inventoryEvent,
              delay:
                // Send null to the back-end if the initial value is null.
                // Noticed that even when we send 0 to the back-end (via formattedSeconds),
                // the back-end would still send back null for the delay. This
                // MIGHT mean that the back-end doesnt yet take into account the
                // difference between null or 0.
                inventoryEvent?.delay === null
                  ? inventoryEvent?.delay
                  : formattedSeconds,
              tags: formattedTags || '',
              rtuChannelSetpointIndex:
                inventoryEvent?.rtuChannelSetpointIndex &&
                inventoryEvent?.rtuChannelSetpointIndex > 0
                  ? inventoryEvent?.rtuChannelSetpointIndex
                  : null, // The back-end needs a null instead of a 0 index sent back
            };
          })
      : null,
    levelEvents: dataChannel.levelEvents
      ? dataChannel.levelEvents
          ?.map((event) => {
            const associatedInitialEvent = initialValues?.levelEvents?.find(
              (initialEvent) =>
                initialEvent.dataChannelEventRuleId ===
                event.dataChannelEventRuleId
            );

            return getEventWithPreciseOrRoundedValue(
              event,
              associatedInitialEvent
            );
          })
          .map((levelEvent) => {
            // @ts-ignore
            const { maxDataAgeByHour, maxDataAgeByMinute } = levelEvent;
            const seconds =
              round(maxDataAgeByHour * 3600) + round(maxDataAgeByMinute * 60);
            const formattedSeconds = convertToNumber(seconds, null);
            // @ts-ignore
            const { tags } = levelEvent;
            const formattedTags = tags?.join(',');

            return {
              ...levelEvent,
              delay:
                // Send null to the back-end if the initial value is null.
                // Noticed that even when we send 0 to the back-end (via formattedSeconds),
                // the back-end would still send back null for the delay. This
                // MIGHT mean that the back-end doesnt yet take into account the
                // difference between null or 0.
                levelEvent?.delay === null
                  ? levelEvent?.delay
                  : formattedSeconds,
              tags: formattedTags || '',
              rtuChannelSetpointIndex:
                levelEvent?.rtuChannelSetpointIndex &&
                levelEvent?.rtuChannelSetpointIndex > 0
                  ? levelEvent?.rtuChannelSetpointIndex
                  : null, // The back-end needs a null instead of a 0 index sent back
            };
          })
      : null,
    usageRateEvent: dataChannel?.usageRateEvent
      ? {
          ...dataChannel.usageRateEvent,
          // @ts-ignore
          tags: dataChannel.usageRateEvent?.tags?.join(',') || '',
          rtuChannelSetpointIndex: usageRateSetpointLogicForApi(),
        }
      : null,
    missingDataEvent: dataChannel?.missingDataEvent
      ? {
          ...dataChannel.missingDataEvent,
          // @ts-ignore
          tags: dataChannel.missingDataEvent?.tags?.join(',') || '',
        }
      : null,
    // Back-end requires these two properties to be null
    setpointSelectionLists: null,
    domainTags: null,
    // NOTE: usageRateEvent doesn't include `decimalPlaces`, so we don't
    // round the event values
    // usageRateEvent: getEventWithPreciseOrRoundedValue(
    //   dataChannel.usageRateEvent,
    //   initialValues?.usageRateEvent
    // ),
    // We use -1 for the "None" option in the <EventRuleGroupAutocomplete />
    eventRuleGroupId:
      isNumber(dataChannel.eventRuleGroupId) &&
      dataChannel.eventRuleGroupId === -1
        ? null
        : dataChannel.eventRuleGroupId,
  });
};

const formatValidationErrorForEventRule = (
  event:
    | QEERLevelDTOWithPreciseValue
    | QEERInventoryDTOWithPreciseValue
    | QEERDeliveryScheduleDTOWithPreciseValue
    | null
    | undefined,
  recordIdToErrorMapping: RecordIdToErrorsMapping
) => {
  const validationErrors =
    recordIdToErrorMapping[String(event?.dataChannelEventRuleId)];

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
  initialDataChannel: QuickEditEventsDTOWithPreciseValues
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

    // const dataChannelErrors = initialDataChannel.map((initialDataChannel) => {
    // });
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
    const deliveryScheduleEventsErrors = initialDataChannel.deliveryScheduleEvents?.map(
      (event) =>
        formatValidationErrorForEventRule(event, recordIdToErrorMapping)
    );

    return {
      levelEvents: levelEventsErrors,
      inventoryEvents: inventoryEventsErrors,
      missingDataEvent: missingDataEventErrors,
      usageRateEvent: usageRateEventErrors,
      deliveryScheduleEvents: deliveryScheduleEventsErrors,
    };
  }

  return errors;
};
