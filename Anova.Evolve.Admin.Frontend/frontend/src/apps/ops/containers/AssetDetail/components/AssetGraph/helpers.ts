/* eslint-disable indent */
import {
  DataChannelCategory,
  DataChannelDTO,
  EventRuleCategory,
  EventRuleInventoryStatus,
  EventRuleModel,
  EvolveForecastReadingResponse,
  EvolveGetForecastReadingsByDataChannelIdResponse,
  EvolveReading,
  ScheduledDeliveryDto,
  UnitTypeEnum,
} from 'api/admin/api';
import orderBy from 'lodash/orderBy';
import round from 'lodash/round';
import moment from 'moment';
import { graphColours } from 'styles/colours';
import { DEFAULT_CHART_ZOOM_LEVEL, ReadingsChartZoomLevel } from 'types';
import { getEventComparatorOutcome } from 'utils/api/helpers';
import { isNumber } from 'utils/format/numbers';
import {
  FormattedForecastReadings,
  GraphPoint,
  GraphSeriesData,
} from './types';

export const inventoryStatusToColourMapping = {
  [EventRuleInventoryStatus.Full]: graphColours.fullPlotLine,
  [EventRuleInventoryStatus.Reorder]: graphColours.reorderPlotLine,
  [EventRuleInventoryStatus.Critical]: graphColours.urgentPlotLine,
  [EventRuleInventoryStatus.Empty]: graphColours.urgentPlotLine,
  [EventRuleInventoryStatus.UserDefined]: graphColours.userDefinedPlotLine,
  [EventRuleInventoryStatus.Normal]: graphColours.noInventoryStatusPlotline,
};

export const isGraphableDataChannelType = (
  dataChannelType: DataChannelCategory | null | undefined
) =>
  isNumber(dataChannelType) &&
  // NOTE: Only GPS and RTU data channels can't be graphed
  ![DataChannelCategory.Gps, DataChannelCategory.Rtu].includes(
    dataChannelType!
  );

export const zoomLevelToMomentDuration = {
  [ReadingsChartZoomLevel.NotSet]: null,
  [ReadingsChartZoomLevel.TwoYears]: moment.duration(2, 'years'),
  [ReadingsChartZoomLevel.OneYear]: moment.duration(1, 'years'),
  [ReadingsChartZoomLevel.TwelveWeeks]: moment.duration(12, 'weeks'),
  [ReadingsChartZoomLevel.FourWeeks]: moment.duration(4, 'weeks'),
  [ReadingsChartZoomLevel.TwoWeeks]: moment.duration(2, 'weeks'),
  [ReadingsChartZoomLevel.OneWeek]: moment.duration(1, 'weeks'),
  [ReadingsChartZoomLevel.FourDays]: moment.duration(4, 'days'),
  [ReadingsChartZoomLevel.TwoDays]: moment.duration(2, 'days'),
  [ReadingsChartZoomLevel.OneDay]: moment.duration(1, 'days'),
  [ReadingsChartZoomLevel.TwelveHours]: moment.duration(12, 'hours'),
  [ReadingsChartZoomLevel.SixHours]: moment.duration(6, 'hours'),
  [ReadingsChartZoomLevel.ThreeHour]: moment.duration(3, 'hours'),
};

export const getClosestZoomLevelFromHours = (hours?: number | null) => {
  if (!hours || hours < 0) {
    return DEFAULT_CHART_ZOOM_LEVEL;
  }
  const sortedZoomLevelEntries = Object.entries(ReadingsChartZoomLevel)
    .filter(([_, value]) => isNumber(value))
    .sort(
      ([_keyA, valueA], [_keyB, valueB]) =>
        (valueA as number) - (valueB as number)
    );

  for (let index = 0; index < sortedZoomLevelEntries.length; index += 1) {
    const zoomLevelInHours = sortedZoomLevelEntries[index][1];
    if (hours <= zoomLevelInHours) {
      return zoomLevelInHours as ReadingsChartZoomLevel;
    }
  }

  return DEFAULT_CHART_ZOOM_LEVEL;
};

export const getDurationAsSecondsFromZoomLevel = (
  zoomLevel: ReadingsChartZoomLevel
) => {
  const duration =
    zoomLevelToMomentDuration[zoomLevel] ||
    zoomLevelToMomentDuration[DEFAULT_CHART_ZOOM_LEVEL];
  const durationAsSeconds = duration.asSeconds();

  return durationAsSeconds;
};

/* eslint-disable @typescript-eslint/no-unused-vars */
export const getDateBoundsForZoomLevelAndDateRange = (
  zoomLevel: ReadingsChartZoomLevel,
  fromDate?: Date | null,
  toDate?: Date | null
) => {
  // NOTE: A change request was made to ignore the initial from and to dates.
  // UPDATED NOTE(APR 20-2022): We now default to the initial from and to dates.
  const momentFromDate = moment(fromDate);
  const momentToDate = moment(toDate);
  if (
    fromDate &&
    toDate &&
    fromDate < toDate &&
    momentFromDate.isValid() &&
    momentToDate.isValid()
  ) {
    return [momentFromDate, momentToDate];
  }

  // NOTE(APR 20-2022): A change request was made to start ignoring the graph's
  // zoom level and instead refer to the from and to dates. So for most cases,
  // the code will exit in the first if statement for the momentFromDate and
  // momentToDate, but incase it fails, or if the user goes to an asset they've
  // never accessed before, it will default to a the chart's zoomLevel.
  const durationAsSeconds = getDurationAsSecondsFromZoomLevel(zoomLevel);
  const startDate = moment().subtract(durationAsSeconds / 2, 'seconds');
  const endDate = moment().add(durationAsSeconds / 2, 'seconds');

  return [startDate, endDate];
};
/* eslint-enable @typescript-eslint/no-unused-vars */

export const formatReadingsForGraph = (
  readings?: EvolveReading[] | null
): GraphSeriesData | undefined => {
  return readings?.map((reading) => {
    const date = reading.logTime;
    const readingValue = reading.value;
    return [date?.getTime()!, Number(readingValue)];
  });
};

export const formatForecastReadingsForGraph = (
  readingsBundle:
    | EvolveGetForecastReadingsByDataChannelIdResponse
    | null
    | undefined,
  latestReading?: GraphPoint
): FormattedForecastReadings => {
  const lowForecasts: GraphSeriesData = [];
  const regularForecasts: GraphSeriesData = [];
  const highForecasts: GraphSeriesData = [];

  const shouldSetupHighOrLowForecasts =
    isNumber(readingsBundle?.forecasts?.[0].lowScaledValue) ||
    isNumber(readingsBundle?.forecasts?.[0].highScaledValue);

  const latestReadingTime = latestReading?.[0];
  const latestReadingValue = latestReading?.[1];
  const firstForecastReadingTime = readingsBundle?.forecasts?.[0].logTime?.getTime();
  const firstForecastReadingValue =
    readingsBundle?.forecasts?.[0].estimateScaledValue;

  // If the first forecast reading is BEFORE the latest reading time, then
  // prevent incorrect forecast readings from being shown (by returning no
  // forecast readings). This is a fix made on the front-end to account for an
  // issue on the backend where forecast readings were being returned WAY
  // BEFORE the latest available reading.
  // https://dev.azure.com/anovateam/Evolve/_boards/board/t/Evolve%20Team/Stories/?workitem=18303
  if (
    latestReadingTime &&
    firstForecastReadingTime &&
    firstForecastReadingTime < latestReadingTime
  ) {
    return {
      low: lowForecasts,
      regular: regularForecasts,
      high: highForecasts,
    };
  }

  // Fill a gap (if any) between the latest regular reading value and the first
  // forecast reading value.
  if (
    latestReadingTime &&
    firstForecastReadingTime &&
    // The latest reading is before the first regular forecast reading log time
    latestReadingTime < firstForecastReadingTime &&
    // The forecast reading is within 2 hours of the latest forecast reading
    firstForecastReadingTime - latestReadingTime <= 1000 * 60 * 60 * 2
  ) {
    const startingPoint = [
      latestReadingTime,
      latestReadingValue!,
    ] as GraphPoint;
    const endingPoint = [
      firstForecastReadingTime,
      firstForecastReadingValue!,
    ] as GraphPoint;

    regularForecasts.push(startingPoint, endingPoint);

    if (shouldSetupHighOrLowForecasts) {
      lowForecasts.push(startingPoint, endingPoint);
      highForecasts.push(startingPoint, endingPoint);
    }
  }

  readingsBundle?.forecasts?.forEach((reading) => {
    const date = reading.logTime?.getTime();

    if (isNumber(date)) {
      if (shouldSetupHighOrLowForecasts) {
        lowForecasts.push([date!, reading.lowScaledValue!]);
        highForecasts.push([date!, reading.highScaledValue!]);
      }

      regularForecasts.push([
        date!,
        isNumber(reading.estimateScaledValue)
          ? reading.estimateScaledValue!
          : null,
      ]);
    }
  });

  return {
    low: lowForecasts,
    regular: regularForecasts,
    high: highForecasts,
  };
};

const getLevelEventRuleForReadingValue = (
  readingValue: number | null,
  sortedEventRules: EventRuleModel[]
): EventRuleModel | undefined | null => {
  // NOTE: May need to handle null reading values as a special case if the
  // back-end API decides to send gaps using null values instead of excluding
  // the data point.
  if (!isNumber(readingValue)) {
    return null;
  }

  // NOTE: The comparator should not be used when getting the event rule and a
  // provided value. For example, the following event rules have a gap between
  // 20 and 100:
  // - Full >= 100 WC
  // - Reorder <= 20 Ins WC
  // - Critical <= 15 Ins WC
  // - Empty <= 10 Ins WC
  // In this case, if the `readingValue` is 60, the returned event rule would
  // be "Full".
  const levelEventRules = sortedEventRules.filter(
    (rule) => rule.eventRuleType === EventRuleCategory.Level
  );
  const eventRuleForReading = levelEventRules.find((rule) => {
    return (
      isNumber(readingValue) &&
      isNumber(rule.eventValue) &&
      getEventComparatorOutcome(
        readingValue!,
        rule.comparator,
        rule.eventValue!
      )
    );
  });

  return eventRuleForReading;
};

const getPlotbandColorForEventRule = (eventRule?: EventRuleModel | null) => {
  switch (eventRule?.inventoryStatus) {
    case EventRuleInventoryStatus.Full:
      return graphColours.regularBand;
    case EventRuleInventoryStatus.Reorder:
      return graphColours.reorderBand;
    case EventRuleInventoryStatus.Critical:
      return graphColours.urgentBand;
    case EventRuleInventoryStatus.Empty:
      return graphColours.urgentBand;
    case EventRuleInventoryStatus.UserDefined:
      return graphColours.userDefinedBand;
    default:
      return graphColours.regularBand;
  }
};

export const getSortedEventRulesFromDataChannel = (
  eventRules: EventRuleModel[] | undefined | null,
  order: 'asc' | 'desc' = 'desc'
) => {
  const sortedEventRules = orderBy(eventRules, ['eventValue'], [order]);
  return sortedEventRules;
};

export const getXAxisPlotbandsFromForecastReadings = (
  forecastReadings: FormattedForecastReadings,
  eventRules: EventRuleModel[]
) => {
  const sortedEventRules = getSortedEventRulesFromDataChannel(
    eventRules,
    'asc'
  );

  const xAxisPlotbands: Highcharts.XAxisPlotBandsOptions[] = [];
  let currentEventRule: EventRuleModel | undefined | null;

  let startDate: number | null = null;
  let endDate: number | null = null;

  forecastReadings.regular.forEach((reading) => {
    const [timestamp, value] = reading;

    const eventRule = getLevelEventRuleForReadingValue(value, sortedEventRules);

    // Start the first plotband
    if (!currentEventRule && !startDate && !endDate) {
      startDate = timestamp;
      currentEventRule = eventRule;
    } else if (
      currentEventRule?.dataChannelEventRuleId !==
        eventRule?.dataChannelEventRuleId &&
      // To keep TypeScript happy we check if startDate exists
      startDate
    ) {
      // TODO: Get precise timestamp
      endDate = timestamp;

      const bandColour = getPlotbandColorForEventRule(currentEventRule);

      xAxisPlotbands.push({
        from: startDate,
        to: endDate,
        color: bandColour,
      });

      // Restart the startDate since we'll be starting a new plotband
      startDate = endDate;
      currentEventRule = eventRule;
    }

    // Update the endDate as we move along each point. This is needed once we
    // reach the end of the forecast readings so we can set up the last
    // plotband
    endDate = timestamp;
  });

  // Close off the final plotband. Note that it's possible for there to be no
  // plotbands at this point, in which case a single plotband will be created.
  // This case happens when all received readings only apply to one event rule
  // (example: the Critical event rule applies to values <= 20 and all forecast
  // reading points are actually <= 20).
  const bandColour = getPlotbandColorForEventRule(currentEventRule);
  if (startDate && endDate && bandColour) {
    xAxisPlotbands.push({
      from: startDate,
      to: endDate,
      color: bandColour,
    });
  }

  return xAxisPlotbands;
};

export const loggingRateToGapSize = (loggingRate: number | null | undefined) =>
  isNumber(loggingRate) && Number(loggingRate) > 0 ? loggingRate! * 1000 : 0;

/**
 * Return a hidden series to allow panning before and after the graph's plotted
 * points. See this highcharts thread:
 * https://www.highcharts.com/forum/viewtopic.php?t=37223
 */
export const getPlaceholderPanningSeries = (): Highcharts.SeriesOptionsType => {
  // TODO: The back-end has a max graph days (or is it max data age?)
  // property that determines how far back the data goes.
  // Only allow panning as far BACK this specified date.
  const startDate = moment('2013-01-01', 'YYYY-MM-DD');
  // Only allow panning as far FORWARD as this specified date
  const endDate = moment().add(1, 'year');

  const paddedDates = [];
  for (
    let m = moment(startDate);
    // NOTE: We pad by a month so that if the user is zoomed out far enough,
    // they'll still see a tick on the x-axis for each month. If they're zoomed
    // in too closely (eg: 4 weeks or even less like 1 week) then the user
    // could potentially see 1 or no ticks at all on the x-axis.
    m.diff(endDate, 'months') <= 0;
    m.add(1, 'month')
  ) {
    paddedDates.push({ x: m.valueOf(), y: 0 });
  }

  return {
    type: 'line',
    data: paddedDates,
    color: 'rgba(0,0,0,0)',
    enableMouseTracking: false,
    showInLegend: false,
  };
};

// Note that we return a regular function here so that `this` contain's
// Highcharts context for the label foramtter.
const getYAxisLabelFormatterForDigitalDataChannel = (
  dataChannel: DataChannelDTO | undefined
): Highcharts.AxisLabelsFormatterCallbackFunction =>
  function formatter() {
    // This is used to get the default label Highcharts would provide
    const defaultLabel = this.axis.defaultLabelFormatter.call(this);

    if (this.value === 0) {
      return dataChannel?.digitalState0Text || defaultLabel;
    }
    if (this.value === 1) {
      return dataChannel?.digitalState1Text || defaultLabel;
    }
    if (this.value === 2) {
      return dataChannel?.digitalState2Text || defaultLabel;
    }
    if (this.value === 3) {
      return dataChannel?.digitalState3Text || defaultLabel;
    }

    // Dont show a label if the value isn't 0, 1, 2 or 3 since digital data
    // channels only support a maximum of 4 states.
    return '';
  };

/**
 * Return a callback function to customize the y-axis labels on the graph for
 * the provided data channel if needed. If no customization is needed, return
 * `undefined`.
 * See highcharts `yAxis.labels.formatter` docs here:
 * https://api.highcharts.com/highcharts/yAxis.labels.formatter
 * @param dataChannel The data channel being graphed.
 */
export function getYAxisLabelFormatterForDataChannel(
  dataChannel: DataChannelDTO | undefined
) {
  return dataChannel?.dataChannelTypeId === DataChannelCategory.DigitalInput
    ? getYAxisLabelFormatterForDigitalDataChannel(dataChannel)
    : undefined;
}

export const getTooltipValue = (
  type: DataChannelDTO['dataChannelTypeId'],
  value: number,
  decimalPlaces: number,
  digitalState0Text?: string | null,
  digitalState1Text?: string | null,
  digitalState2Text?: string | null,
  digitalState3Text?: string | null
) => {
  switch (type) {
    case DataChannelCategory.DigitalInput:
      if (value === 0) {
        return digitalState0Text?.toUpperCase() || 0;
      }
      if (value === 1) {
        return digitalState1Text?.toUpperCase() || 1;
      }
      if (value === 2) {
        return digitalState2Text?.toUpperCase() || 2;
      }
      if (value === 3) {
        return digitalState3Text?.toUpperCase() || 3;
      }
      return value;
    default:
      return round(value, decimalPlaces);
  }
};

export const getGraphMinForDataChannel = (
  dataChannel: DataChannelDTO | undefined
) => {
  // Digital channels always range from 0 to 3
  if (dataChannel?.dataChannelTypeId === DataChannelCategory.DigitalInput) {
    return 0;
  }

  const newGraphMin = isNumber(dataChannel?.uomParams?.graphMin)
    ? dataChannel?.uomParams?.graphMin!
    : undefined;

  return newGraphMin;
};

export const getGraphMaxForDataChannel = (
  dataChannel: DataChannelDTO | undefined
) => {
  // Digital channels always range from 0 to 3. Select the appropriate max
  // based on the larger state text.
  if (dataChannel?.dataChannelTypeId === DataChannelCategory.DigitalInput) {
    return dataChannel?.digitalState3Text
      ? 3
      : dataChannel?.digitalState2Text
      ? 2
      : dataChannel?.digitalState1Text
      ? 1
      : 0;
  }

  const newGraphMax = isNumber(dataChannel?.uomParams?.graphMax)
    ? dataChannel?.uomParams?.graphMax!
    : undefined;

  return newGraphMax;
};

interface GetReadingsCacheKeyOverrides {
  unit?: UnitTypeEnum | null;
}

export const getReadingsCacheKey = (
  dataChannel: DataChannelDTO,
  overrides?: GetReadingsCacheKeyOverrides
) => {
  // IMPORTANT: Check for overrides first, otherwise default to values from the
  // data channel. This is because you may end up with either one of these cache
  // keys:
  // '1234-1234|null' OR '1234-1234|undefined'
  // Since they're completely separate keys that will be used to access the
  // cache object, it may cause no data to be returned from the cache.
  const unit = isNumber(overrides?.unit)
    ? overrides?.unit
    : dataChannel.uomParams?.unitTypeId;

  const eventRuleValues = dataChannel.uomParams?.eventRules?.map(
    (eventRule) => eventRule.eventValue
  );
  const eventRuleValuesKey = eventRuleValues?.join('_') || '';

  return `${dataChannel.dataChannelId}|${unit}|${eventRuleValuesKey}`;
};

/**
 * Return the chart's left margin as a number in pixels. Note that digital data
 * channels will have labels as text, so they should appear wider than
 * data channel labels that are numerical.
 * @param graphedDataChannels The data channels being graphed
 */
export const getChartLeftMargin = (graphedDataChannels?: DataChannelDTO[]) => {
  if (!graphedDataChannels) {
    return 90;
  }

  const hasAtLeastOneRegularChannel = !!graphedDataChannels.find(
    (channel) => channel.dataChannelTypeId !== DataChannelCategory.DigitalInput
  );
  const hasAtLeastOneDigitalChannel = !!graphedDataChannels.find(
    (channel) => channel.dataChannelTypeId === DataChannelCategory.DigitalInput
  );

  if (hasAtLeastOneRegularChannel && hasAtLeastOneDigitalChannel) {
    return 190;
  }
  if (hasAtLeastOneRegularChannel && !hasAtLeastOneDigitalChannel) {
    return 90;
  }
  if (!hasAtLeastOneRegularChannel && hasAtLeastOneDigitalChannel) {
    return 150;
  }

  return 90;
};

interface GetPointForScheduledDeliveryProps {
  forecastReadingsData?: EvolveForecastReadingResponse[] | null | undefined;
  clickedPoint?: any;
  openScheduleDeliveryDialog: (
    deliveryDetails?: EvolveForecastReadingResponse | undefined
  ) => void;
}

export function getPointForScheduledDelivery({
  forecastReadingsData,
  clickedPoint,
  openScheduleDeliveryDialog,
}: GetPointForScheduledDeliveryProps) {
  const formattedSelectedXValueToDate = moment(clickedPoint).toDate();
  const nowLineDate = moment(new Date()).toDate();

  const forecastLimitObject =
    forecastReadingsData?.[forecastReadingsData?.length - 1];

  const latestForecastReadingLogTime = forecastLimitObject?.logTime;

  let closestPointDifference: number | null = null;
  let closestPointDetails: EvolveForecastReadingResponse | undefined;

  forecastReadingsData?.forEach((forecastReadings) => {
    const differenceInMinutes = Math.abs(
      moment(forecastReadings?.logTime)?.diff(
        formattedSelectedXValueToDate,
        'minutes'
      )
    );

    if (
      closestPointDifference === null ||
      closestPointDifference > differenceInMinutes
    ) {
      closestPointDifference = differenceInMinutes;
      closestPointDetails = forecastReadings;
    }
  });

  const firstSelectableForecastDate = moment(
    forecastReadingsData?.[0]?.logTime
  ).toDate();

  // Do not allow scheduling deliveries before "now" unless the user
  // clicks anywhere on the forecast (right) side of the graph.
  if (
    formattedSelectedXValueToDate < firstSelectableForecastDate ||
    // The check below is required because the forecast data could sometimes
    // be before the "now" line.
    formattedSelectedXValueToDate < nowLineDate
  ) {
    return null;
  }

  if (
    latestForecastReadingLogTime &&
    formattedSelectedXValueToDate > latestForecastReadingLogTime
  ) {
    return openScheduleDeliveryDialog(forecastLimitObject);
  }

  return openScheduleDeliveryDialog(closestPointDetails);
}

interface GetScheduledDeliveryFromClickedPointProps {
  clickedPoint?: any;
  openScheduleDeliveryEditorDialog: (
    deliveryDetails?: ScheduledDeliveryDto | undefined
  ) => void;
  scheduledDeliveries?: ScheduledDeliveryDto[];
}

export function getExistingScheduledDeliveryFromClickedPoint({
  clickedPoint,
  openScheduleDeliveryEditorDialog,
  scheduledDeliveries,
}: GetScheduledDeliveryFromClickedPointProps) {
  const formattedSelectedXValueToDate = moment(clickedPoint).toDate();

  let closestPointDifference: number | null = null;
  let selectedScheduledDelivery: ScheduledDeliveryDto | undefined;

  scheduledDeliveries?.forEach((scheduledDelivery) => {
    const differenceInMinutes = Math.abs(
      moment(scheduledDelivery?.scheduledTime)?.diff(
        formattedSelectedXValueToDate,
        'minutes'
      )
    );

    if (
      closestPointDifference === null ||
      closestPointDifference > differenceInMinutes
    ) {
      closestPointDifference = differenceInMinutes;
      selectedScheduledDelivery = scheduledDelivery;
    }
  });

  return openScheduleDeliveryEditorDialog(selectedScheduledDelivery);
}
