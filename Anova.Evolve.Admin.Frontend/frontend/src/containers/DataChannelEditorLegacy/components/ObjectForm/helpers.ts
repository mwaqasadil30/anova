/* eslint-disable indent */
import {
  EventRuleType,
  EvolveDataChannelEventRule,
  EvolveDataChannelEventsInfo,
  ForecastModeType,
  LevelDataChannelGeneralInfo,
  ScalingModeType,
  TankType,
} from 'api/admin/api';
import { getIn } from 'formik';
import { isNumber, getNumberOrDefault } from 'utils/format/numbers';
import round from 'lodash/round';
import {
  convertToNumber,
  getBoolValue,
  getNumberValue,
} from 'utils/forms/values';
import { DCEditorEventRule, Values } from './types';
import { SaveRequest } from '../../types';

const getPreciseAndRoundedValue = (value: any, decimalPlaces: number) => {
  const preciseValue = getNumberValue(value);
  const roundedValue = round(preciseValue, decimalPlaces);

  return [preciseValue, getNumberValue(roundedValue)];
};

export const getDecimalPlacesFromValues = (values: Values) => {
  const scaledDecimalPlaces = isNumber(values.scaledDecimalPlaces)
    ? Number(values.scaledDecimalPlaces)
    : 0;
  const displayDecimalPlaces = isNumber(values.displayDecimalPlaces)
    ? Number(values.displayDecimalPlaces)
    : 0;
  const decimalPlaces =
    !values.isTankDimensionsSet && !values.setReadingDisplayOptions
      ? scaledDecimalPlaces
      : displayDecimalPlaces;

  return decimalPlaces;
};

const displayDecimalPlacesFields = [
  'displayMaxProductHeight',
  'graphMin',
  'graphMax',
  'maxDeliverQuantity',
  'manualUsageRate',
];

const scaledDecimalPlacesFields = ['scaledMaxProductHeight'];

const buildPreciseAndRoundedValues = (
  fields: string[],
  values: any,
  decimalPlaces: number
) => {
  return fields.reduce((prev, field) => {
    const [preciseValue, roundedValue] = getPreciseAndRoundedValue(
      getIn(values, field),
      decimalPlaces
    );

    return {
      ...prev,
      [field]: roundedValue,
      [`_precise_${field}`]: preciseValue,
    };
  }, {});
};

export const dataChannelToFormValues = (
  dataChannelInfo?: LevelDataChannelGeneralInfo | null
): Values => {
  const displayDecimalPlaces =
    getNumberValue(dataChannelInfo?.displayDecimalPlaces) || 0;
  const scaledDecimalPlaces =
    getNumberValue(dataChannelInfo?.scaledDecimalPlaces) || 0;

  const preciseAndRoundedDisplayValues = buildPreciseAndRoundedValues(
    displayDecimalPlacesFields,
    dataChannelInfo,
    displayDecimalPlaces
  );
  const preciseAndRoundedScaledValues = buildPreciseAndRoundedValues(
    scaledDecimalPlacesFields,
    dataChannelInfo,
    scaledDecimalPlaces
  );

  return {
    ...preciseAndRoundedDisplayValues,
    ...preciseAndRoundedScaledValues,
    dataChannelType: dataChannelInfo?.dataChannelType,
    description: dataChannelInfo?.description || '',
    serialNumber: dataChannelInfo?.serialNumber || '',
    isTankDimensionsSet: dataChannelInfo?.isTankDimensionsSet || false,
    tankType: isNumber(dataChannelInfo?.tankType)
      ? dataChannelInfo?.tankType!
      : TankType.HorizontalWith2To1EllipsoidalEnds,
    tankDimensionInfo: dataChannelInfo?.tankDimensionInfo || null,
    tankDimensionId: dataChannelInfo?.tankDimensionInfo?.tankDimensionId || '',
    productInfo: dataChannelInfo?.productInfo || null,
    productId: dataChannelInfo?.productInfo?.productId || '',
    dataSource: dataChannelInfo?.dataSource,
    rtuInfo: dataChannelInfo?.rtuInfo || null,
    rtuId: dataChannelInfo?.rtuInfo?.rtuId || '',
    rtuChannelInfo: dataChannelInfo?.rtuChannelInfo || null,
    rtuChannelId: dataChannelInfo?.rtuChannelInfo?.rtuChannelId || '',
    publishedChannelInfo: dataChannelInfo?.publishedChannelInfo || null,
    dataChannelTemplateInfo: dataChannelInfo?.dataChannelTemplateInfo || null,
    scalingMode: dataChannelInfo?.scalingMode || ScalingModeType.Linear,
    scaledUnitsAsText: dataChannelInfo?.scaledUnitsAsText || '',
    scaledUnits: getNumberValue(dataChannelInfo?.scaledUnits),
    scaledMaxProductHeight: getNumberValue(
      dataChannelInfo?.scaledMaxProductHeight
    ),
    scaledDecimalPlaces,
    // TODO: Will this be provided by the back-end API?
    setReadingDisplayOptions: false,
    displayDecimalPlaces,
    displayUnits: getNumberValue(dataChannelInfo?.displayUnits),
    graphYAxisScaleId: getNumberValue(dataChannelInfo?.graphYAxisScaleId),
    isDisplayGapsInGraph: dataChannelInfo?.isDisplayGapsInGraph || false,
    forecastMode: isNumber(dataChannelInfo?.forecastMode)
      ? dataChannelInfo?.forecastMode!
      : ForecastModeType.ManualUsageRate,
    showHighLowForecast: dataChannelInfo?.showHighLowForecast || false,
    showScheduledDeliveriesInforecast:
      dataChannelInfo?.showScheduledDeliveriesInforecast || false,
    enableIntegration1: dataChannelInfo?.enableIntegration1 || false,
    integration1DomainId: dataChannelInfo?.integration1DomainId || '',
    autoGenerateIntegration1Id:
      dataChannelInfo?.autoGenerateIntegration1Id || false,
    integration1Id: dataChannelInfo?.integration1Id || '',
    autoGenerateIntegration2Id:
      dataChannelInfo?.autoGenerateIntegration2Id || false,
    enableIntegration2: dataChannelInfo?.enableIntegration2 || false,
    integration2DomainId: dataChannelInfo?.integration2DomainId || '',
    integration2Id: dataChannelInfo?.integration2Id || '',
    rawUnits: dataChannelInfo?.rawUnits || '',
    rawUnitsAtZero: getNumberValue(dataChannelInfo?.rawUnitsAtZero),
    rawUnitsAtFullScale: getNumberValue(dataChannelInfo?.rawUnitsAtFullScale),
    rawUnitsAtScaledMin: getNumberValue(dataChannelInfo?.rawUnitsAtScaledMin),
    rawUnitsAtScaledMax: getNumberValue(dataChannelInfo?.rawUnitsAtScaledMax),
    rawUnitsAtUnderRange: getNumberValue(dataChannelInfo?.rawUnitsAtUnderRange),
    rawUnitsAtOverRange: getNumberValue(dataChannelInfo?.rawUnitsAtOverRange),
    isDataInverted: dataChannelInfo?.isDataInverted || false,
    scaledMax: getNumberValue(dataChannelInfo?.scaledMax),
    scaledMin: getNumberValue(dataChannelInfo?.scaledMin),

    // Misc
    lastUpdateUserName: dataChannelInfo?.lastUpdateUserName,
    lastUpdatedDate: dataChannelInfo?.lastUpdatedDate,
  };
};

interface FormatOptions {
  decimalPlaces: number;
}

const formatEventRuleInitialValues = (
  eventRule: EvolveDataChannelEventRule,
  options: FormatOptions
): DCEditorEventRule => {
  let durationPeriodFieldSource: number | null | undefined = null;
  if (eventRule.eventRuleType === EventRuleType.Level) {
    durationPeriodFieldSource = eventRule.delay;
  } else if (eventRule.eventRuleType === EventRuleType.UsageRate) {
    durationPeriodFieldSource = eventRule.minimumReadingPeriod;
  } else if (eventRule.eventRuleType === EventRuleType.MissingData) {
    durationPeriodFieldSource = eventRule.eventValue;
  }

  const hours = isNumber(durationPeriodFieldSource)
    ? Math.floor(durationPeriodFieldSource! / 3600)
    : 0;
  const minutes = isNumber(durationPeriodFieldSource)
    ? Math.floor((durationPeriodFieldSource! % 3600) / 60)
    : 0;

  const preciseAndRoundedValues = buildPreciseAndRoundedValues(
    ['hysteresis', 'eventValue', 'usageRate'],
    eventRule,
    options.decimalPlaces
  );

  return {
    ...eventRule,
    // hysteresis, eventValue, usageRate are within preciseAndRoundedValues
    ...preciseAndRoundedValues,
    id: eventRule.id,
    eventRuleId: eventRule.eventRuleId,
    description: eventRule.description || '',
    inventoryStatus: getNumberValue(eventRule.inventoryStatus),
    eventComparator: getNumberValue(eventRule.eventComparator),
    enabled: getBoolValue(eventRule.enabled),
    setPoint: getNumberValue(eventRule.setPoint),
    alwaysTriggered: getBoolValue(eventRule.alwaysTriggered),
    graphed: getBoolValue(eventRule.graphed),
    summarized: getBoolValue(eventRule.summarized),
    acknowledgment: getBoolValue(eventRule.acknowledgment),
    integrationId: eventRule.integrationId || '',
    rosters: eventRule.rosters || [],
    importanceLevel: getNumberValue(eventRule.importanceLevel),
    delay: getNumberValue(eventRule.delay),
    eventRuleType: eventRule.eventRuleType,
    minimumReadingPeriod: getNumberValue(eventRule.minimumReadingPeriod),

    // Computed fields
    hours,
    minutes,
  } as DCEditorEventRule;
};

export const dataChannelEventInfoToFormValues = (
  dataChannelEventInfo: EvolveDataChannelEventsInfo | null | undefined,
  options: FormatOptions
): Partial<Values> => {
  const levelEventRules = dataChannelEventInfo?.levelEventRules?.length
    ? dataChannelEventInfo.levelEventRules.map((rule) =>
        formatEventRuleInitialValues(rule, options)
      )
    : [];
  const missingDataEventRules = dataChannelEventInfo?.missingDataEventRules
    ?.length
    ? dataChannelEventInfo.missingDataEventRules.map((rule) =>
        formatEventRuleInitialValues(rule, options)
      )
    : [];
  const scheduledDeliveryEventRules = dataChannelEventInfo
    ?.scheduledDeliveryEventRules?.length
    ? dataChannelEventInfo.scheduledDeliveryEventRules.map((rule) =>
        formatEventRuleInitialValues(rule, options)
      )
    : [];
  const usageRateEventRules = dataChannelEventInfo?.usageRateEventRules?.length
    ? dataChannelEventInfo.usageRateEventRules.map((rule) =>
        formatEventRuleInitialValues(rule, options)
      )
    : [];

  return {
    levelEventRules,
    missingDataEventRules,
    scheduledDeliveryEventRules,
    usageRateEventRules,
  };
};

/**
 * Prefix the provided fieldName with "_precise_".
 * Examples:
 * graphMin --> _precise_graphMin
 * levelEventRule.0.eventValue --> levelEventRule.0._precise_eventValue
 * @param fieldName The field name to be prefixed with _precise_
 */
export const getPreciseFieldName = (fieldName: string) => {
  const splitFieldName = fieldName.split('.');
  const parentFields = splitFieldName.slice(0, -1);
  const preciseFieldName = splitFieldName.slice(-1);
  const fullPreciseFieldName = [
    ...parentFields,
    `_precise_${preciseFieldName}`,
  ].join('.');

  return fullPreciseFieldName;
};

export const getPreciseOrRoundedValue = (values: Values, fieldName: string) => {
  const preciseFieldName = getPreciseFieldName(fieldName);

  const roundedFieldValue = getIn(values, fieldName);
  const preciseFieldValue = getIn(values, preciseFieldName);
  return getNumberOrDefault(preciseFieldValue, roundedFieldValue);
};

const formatOneEventRuleForApiPayload = (
  eventRule: DCEditorEventRule
): EvolveDataChannelEventRule => {
  const { hours, minutes } = eventRule;
  const seconds = round(hours * 3600) + round(minutes * 60);
  const formattedSeconds = convertToNumber(seconds, null);

  let durationPeriodFieldSource = {};
  if (eventRule.eventRuleType === EventRuleType.Level) {
    durationPeriodFieldSource = { delay: formattedSeconds };
  } else if (eventRule.eventRuleType === EventRuleType.UsageRate) {
    durationPeriodFieldSource = { minimumReadingPeriod: formattedSeconds };
  } else if (eventRule.eventRuleType === EventRuleType.MissingData) {
    durationPeriodFieldSource = { eventValue: formattedSeconds };
  }

  const isScheduledDeliveryRule = [
    EventRuleType.ScheduledDeliveryMissed,
    EventRuleType.ScheduledDeliveryTooEarly,
    EventRuleType.ScheduledDeliveryTooLate,
  ].includes(eventRule.eventRuleType!);

  const eventValue = getNumberOrDefault(
    eventRule._precise_eventValue,
    eventRule.eventValue
  );
  const hysteresis = getNumberOrDefault(
    eventRule._precise_hysteresis,
    eventRule.hysteresis
  );
  const usageRate = getNumberOrDefault(
    eventRule._precise_usageRate,
    eventRule.usageRate
  );

  return {
    id: eventRule.id,
    enabled: eventRule.enabled,
    setPoint: convertToNumber(eventRule.setPoint, null),
    hysteresis: convertToNumber(hysteresis),
    alwaysTriggered: eventRule.alwaysTriggered,
    graphed: eventRule.graphed,
    summarized: eventRule.summarized,
    acknowledgment: eventRule.acknowledgment,
    integrationId: eventRule.integrationId || null,
    sortOrderIndex: eventRule.sortOrderIndex,
    description: eventRule.description,
    inventoryStatus: convertToNumber(eventRule.inventoryStatus, null),
    eventComparator: convertToNumber(eventRule.eventComparator, null),
    eventValue: isScheduledDeliveryRule
      ? null
      : convertToNumber(eventValue, null),
    rosters: eventRule.rosters,
    importanceLevel: convertToNumber(eventRule.importanceLevel, null),
    delayEnabled: eventRule.delayEnabled,
    delay: convertToNumber(eventRule.delay, null),
    eventRuleType: eventRule.eventRuleType,
    usageRate: convertToNumber(usageRate),
    minimumReadingPeriod: convertToNumber(eventRule.minimumReadingPeriod, null),
    eventRuleId: eventRule.eventRuleId,
    tags: eventRule.tags,
    dataChannelId: eventRule.dataChannelId,
    isEventRuleEnabled: eventRule.isEventRuleEnabled,
    isLinkedToEventRule: eventRule.isLinkedToEventRule,
    isAutoCloseProblemReport: eventRule.isAutoCloseProblemReport,
    isAutoCreateProblemReport: eventRule.isAutoCreateProblemReport,
    problemReportImportanceLevel: eventRule.problemReportImportanceLevel,
    descriptionAbbreviation: eventRule.descriptionAbbreviation,

    // delay, minimumReadingPeriod or eventValue fields
    ...durationPeriodFieldSource,
  } as EvolveDataChannelEventRule;
};

export const eventFormValuesToApiPayload = (
  values: Values
): Pick<
  SaveRequest,
  | 'levelEventRules'
  | 'missingDataEventRules'
  | 'scheduledDeliveryEventRules'
  | 'usageRateEventRules'
> => {
  return {
    levelEventRules: values.levelEventRules?.map(
      formatOneEventRuleForApiPayload
    ),
    missingDataEventRules: values.missingDataEventRules?.map(
      formatOneEventRuleForApiPayload
    ),
    scheduledDeliveryEventRules: values.scheduledDeliveryEventRules?.map(
      formatOneEventRuleForApiPayload
    ),
    usageRateEventRules: values.usageRateEventRules?.map(
      formatOneEventRuleForApiPayload
    ),
  };
};

export const eventRuleFormValueToUnitConversionPayload = (values: Values) => {
  const levelEventRulePayload = values.levelEventRules?.reduce(
    (prev, eventRule, index) => {
      const eventValueFieldName = `levelEventRules.${index}.eventValue`;
      const hysteresisFieldName = `levelEventRules.${index}.hysteresis`;
      const eventValue = getPreciseOrRoundedValue(values, eventValueFieldName);
      const hysteresis = getPreciseOrRoundedValue(values, hysteresisFieldName);
      return {
        ...prev,
        ...(isNumber(eventValue) && {
          [eventValueFieldName]: [Number(eventValue)],
        }),
        ...(isNumber(hysteresis) && {
          [hysteresisFieldName]: [Number(hysteresis)],
        }),
      };
    },
    {}
  ) as Record<string, number>;

  const usageRateEventRulePayload = values.usageRateEventRules?.reduce(
    (prev, eventRule, index) => {
      const usageRateFieldName = `usageRateEventRules.${index}.usageRate`;
      const usageRate = getPreciseOrRoundedValue(values, usageRateFieldName);
      return {
        ...prev,
        ...(isNumber(usageRate) && {
          [usageRateFieldName]: [Number(usageRate)],
        }),
      };
    },
    {}
  ) as Record<string, number>;

  return {
    ...levelEventRulePayload,
    ...usageRateEventRulePayload,
  };
};
