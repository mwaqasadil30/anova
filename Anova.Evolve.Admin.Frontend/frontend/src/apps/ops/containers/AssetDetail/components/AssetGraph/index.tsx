// TODO: Remove no-unused-vars when ready
/* eslint-disable indent, @typescript-eslint/no-unused-vars */
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {
  AssetDetailDto,
  DataChannelCategory,
  EventRuleModel,
  EvolveForecastReadingResponse,
  EvolveGetForecastReadingsByDataChannelIdResponse,
  EvovleSaveUserAssetDetailsSettingRequest,
  ForecastMode,
  ScheduledDeliveryDto,
  UserPermissionType,
} from 'api/admin/api';
import DarkFadeOverlay from 'components/DarkFadeOverlay';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsBrokenAxis from 'highcharts/modules/broken-axis';
import { TFunction } from 'i18next';
import max from 'lodash/max';
import merge from 'lodash/merge';
import min from 'lodash/min';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import useDebounce from 'react-use/lib/useDebounce';
import {
  selectActiveDomainName,
  selectCurrentIanaTimezoneId,
} from 'redux-app/modules/app/selectors';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { graphColours } from 'styles/colours';
import { defaultFonts } from 'styles/fonts';
import { defaultHighchartsStyles } from 'styles/highcharts';
import { lightTheme } from 'styles/theme';
import { formatModifiedDatetime } from 'utils/format/dates';
import { isNumber } from 'utils/format/numbers';
import { nonCustomZoomRangeOptions } from 'utils/i18n/enum-to-text';
import { getDataChannelDTODescription } from 'utils/ui/helpers';
import { formatScheduledDeliveryAmountValue } from '../../helpers';
import {
  CachedDataChannelReadings,
  DataChannelForGraph,
  GraphProperties,
  ReadingsHookData,
} from '../../types';
import MobileAssetMap from '../MobileAssetMap';
import ChartOptions from './ChartOptions';
import {
  formatForecastReadingsForGraph,
  formatReadingsForGraph,
  getChartLeftMargin,
  getDateBoundsForZoomLevelAndDateRange,
  getDurationAsSecondsFromZoomLevel,
  getExistingScheduledDeliveryFromClickedPoint,
  getGraphMaxForDataChannel,
  getGraphMinForDataChannel,
  getPlaceholderPanningSeries,
  getPointForScheduledDelivery,
  getReadingsCacheKey,
  getSortedEventRulesFromDataChannel,
  getTooltipValue,
  getXAxisPlotbandsFromForecastReadings,
  getYAxisLabelFormatterForDataChannel,
  inventoryStatusToColourMapping,
  loggingRateToGapSize,
} from './helpers';
import { CenteredCircularProgress } from './styles';
import { GraphPoint } from './types';

const StyledGraphTitleForPdf = styled(Typography)`
  margin-bottom: 8px;
  text-align: center;
  color: ${lightTheme.palette?.text?.primary};
`;

const AssetGraphWrapper = styled.div`
  ${defaultHighchartsStyles};

  .highcharts-grid-line {
    stroke: ${(props) => props.theme.custom.highcharts.gridLineColor};
  }

  /* Axis styles */
  .highcharts-axis-line {
    stroke: ${(props) => props.theme.custom.highcharts.axisLineColor};
  }

  /* PDF export styling */
  .k-pdf-export .no-print {
    display: none;
  }

  .only-print {
    display: none;
  }

  .k-pdf-export .only-print {
    display: block;
  }
`;

const StyledCenteredCircularProgress = styled(CenteredCircularProgress)`
  z-index: 1;
`;

// IMPORTANT NOTE: Initialize the broken-axis module for highcharts so we can
// show gaps in the graph which is a requirement for this graph! Otherwise,
// highcharts will automatically link gaps with a line!
highchartsBrokenAxis(Highcharts);

// This prototype change seems to enable showing the tooltip for values outside
// the graph when hovering over the graph. Note that `tooltip.outside` should
// be set to `false`, otherwise if there are values that are extremely outside
// the graph area, the tooltip can appear way too far away from the graph.
// https://stackoverflow.com/a/39276436/7752479
// @ts-ignore
Highcharts.Series.prototype.directTouch = true;

const commonDataSeriesLineWidth = 1.5;

const commonGridLineWidth = 1;
const commonGridlineProps = {
  gridLineColor: graphColours.gridLine,
};

const commmonAxisLabelProps = {
  style: {
    fontFamily: defaultFonts,
    fontSize: '13px',
  },
};

const commonAxisLineWidth = 3;
const commonAxisLineProps = {
  lineColor: graphColours.axisLine,
};

const commonYAxisPlotLineProps: Highcharts.YAxisPlotLinesOptions = {
  width: 2,
  dashStyle: 'Dash',
  zIndex: 2,
  label: {
    align: 'right',
    x: 2,
    y: -1,
    useHTML: true,
    textAlign: 'left',
    style: {
      fontFamily: defaultFonts,
      fontSize: '13px',
      fontWeight: '600',
      padding: '5px 7px',
      // @ts-ignore
      borderRadius: '2px',
      color: 'white',
      textTransform: 'uppercase',
    },
  },
};

// The default y axis to be displayed if no data channels are graphed.
// Highcharts requires a y-axis if there's at least one series displayed,
// otherwise Highcharts will crash with this error:
// https://www.highcharts.com/errors/18/
const defaultYAxis: Highcharts.YAxisOptions = {
  ...commonGridlineProps,
  ...commonAxisLineProps,
  lineWidth: commonAxisLineWidth,
  title: {
    text: '',
  },
  labels: {
    style: {
      fontSize: '13px',
      fontWeight: '500',
      textTransform: 'uppercase',
      width: 200,
    },
  },
};

const eventRuleToYAxisPlotline = (eventRule: EventRuleModel, index: number) => {
  // A colour seems to be required to render a plot label (may be a highcharts
  // issue?)
  const eventRuleColor =
    inventoryStatusToColourMapping[eventRule.inventoryStatus!] ||
    graphColours.noInventoryStatusPlotline;

  const yAxisPlotLineProps: Highcharts.YAxisPlotLinesOptions = {
    // An id used for identifying the plot line in Axis.removePlotLine. These
    // plotlines are cleared when changing data channels.
    id: `eventRulePlotline-${eventRule.dataChannelEventRuleId}-${index}`,
    value: eventRule.eventValue!,
    color: eventRuleColor,
    label: {
      text: eventRule.description!,
      style: {
        color: eventRuleColor,
      },
    },
  };

  return merge({}, commonYAxisPlotLineProps, yAxisPlotLineProps);
};

interface BuildOptionsProps {
  dataChannels?: DataChannelForGraph[];
  rawCachedReadings: Record<string, CachedDataChannelReadings | undefined>;
  rawCachedForecastReadings: Record<
    string,
    EvolveGetForecastReadingsByDataChannelIdResponse | undefined
  >;
  showForecast?: boolean;
  ianaTimezoneId?: string | null;
  clickedMapMarkerTimeRange?: number[] | null;
  themePaletteType?: string;
  scheduledDeliveries: ScheduledDeliveryDto[] | undefined;
  isMobile?: boolean;
  // TODO: Replace 'any' type
  setHighlighted?: (marker: any | number | null) => void;
  openScheduleDeliveryDialog: (
    deliveryDetails?: EvolveForecastReadingResponse
  ) => void;
  openScheduleDeliveryEditorDialog: (
    deliveryDetails?: ScheduledDeliveryDto
  ) => void;
  t: TFunction;
}

const buildOptions = ({
  dataChannels,
  rawCachedReadings,
  rawCachedForecastReadings,
  showForecast,
  ianaTimezoneId,
  clickedMapMarkerTimeRange,
  themePaletteType,
  scheduledDeliveries,
  isMobile,
  setHighlighted,
  openScheduleDeliveryDialog,
  openScheduleDeliveryEditorDialog,
  t,
}: BuildOptionsProps): Highcharts.Options => {
  let hasAddedYAxisPlotLines = false;

  // Set up variables required for the custom y-axis stacking label solution.
  // We also keep track of the index for string label data channels (digital
  // input) and numerical label data channels (non-digital input).
  // This is needed so we can determine how to space labels on the y-axis.
  const totalYAxisTextLabelDataChannels =
    dataChannels?.filter(
      (channel) =>
        channel.dataChannelTypeId === DataChannelCategory.DigitalInput
    ).length || 0;
  const totalYAxisNumericLabelDataChannels =
    dataChannels?.filter(
      (channel) =>
        channel.dataChannelTypeId !== DataChannelCategory.DigitalInput
    ).length || 0;
  const areOnlyYAxisTextLabelsShown =
    totalYAxisTextLabelDataChannels > 0 &&
    totalYAxisNumericLabelDataChannels === 0;
  let textYAxisLabelDataChannelIndex = 0;
  let numericYAxisLabelDataChannelIndex = 0;

  const dataChannelsGraphData = dataChannels
    // Sort by display priority so the highest priority data channel always has
    // the same colour
    ?.sort((a, b) => a.displayPriority! - b.displayPriority!)
    ?.map((channel, index, dataChannelsArray) => {
      // Retrieve cached readings + cached forecast readings
      const graphedCacheKey = getReadingsCacheKey(channel);
      const dataChannelCachedData = rawCachedReadings[graphedCacheKey];
      const dataChannelForecastCachedData =
        rawCachedForecastReadings[graphedCacheKey];
      const readings = formatReadingsForGraph(dataChannelCachedData?.readings);
      const latestReading = readings?.[readings?.length - 1];

      const forecastReadings = formatForecastReadingsForGraph(
        dataChannelForecastCachedData,
        latestReading
      );

      const summarizedReadingsPrefix = dataChannelCachedData?.wereReadingsSummarized
        ? '*'
        : '';

      // Rotating series colour index
      const seriesColoursIndex = index % graphColours.seriesColours.length;
      const seriesColour = graphColours.seriesColours[seriesColoursIndex];

      // TODO: Verify uomParams.unit is what we need to use
      const unitText = channel.uomParams?.unit;

      const seriesName = getDataChannelDTODescription(channel);
      const seriesNameForLegend = [seriesName, unitText]
        .filter(Boolean)
        .join(' ');

      const formattedSeriesNameForLegend = summarizedReadingsPrefix.concat(
        seriesNameForLegend
      );

      const yAxisId = `yAxis-${channel.dataChannelId}`;

      const legendSeries: Highcharts.SeriesOptionsType = {
        id: `legend-${channel.dataChannelId}`,
        color: seriesColour,
        name: formattedSeriesNameForLegend,
        data: [],
        events: {
          legendItemClick(event) {
            event.preventDefault();
          },
        },
        // @ts-ignore
        marker: {
          symbol: 'circle',
          radius: 50,
          // width: 3,
          // height: 3,
          fillColor: seriesColour,

          itemStyle: {
            fontFamily: defaultFonts,
          },
        },
        yAxis: yAxisId,
      };

      // Calculate the gap size
      const isBatteryDataChannel =
        channel.dataChannelTypeId === DataChannelCategory.BatteryVoltage;
      const loggingRate = channel.dataLoggingRate;
      const calculatedGapSize = loggingRateToGapSize(loggingRate);

      const scheduledDeliveryMapping = scheduledDeliveries?.reduce<
        Record<number, ScheduledDeliveryDto>
      >((prev, current) => {
        if (current.scheduledTime) {
          prev[current.scheduledTime.getTime()] = current;
        }
        return prev;
      }, {});

      const seriesCustomProperties = {
        // TODO: Verify this is the right place to use units
        unitAsText: channel.uomParams?.unit || '',
        decimalPlaces: channel.uomParams?.decimalPlaces || 0,
        dataChannelType: channel.dataChannelTypeId,
        digitalState0Text: channel.digitalState0Text,
        digitalState1Text: channel.digitalState1Text,
        digitalState2Text: channel.digitalState2Text,
        digitalState3Text: channel.digitalState3Text,
        // Scheduled delivery-related custom properties
        maxProductHeightInDisplayUnits:
          channel.uomParams?.maxProductHeightInDisplayUnits,
        maxProductHeightInScaledUnits:
          channel.uomParams?.maxProductHeightInScaledUnits,
        scheduledDeliveriesForTooltip: scheduledDeliveryMapping,
      };

      const scheduledDeliveryDates = scheduledDeliveries?.map(
        (scheduledDelivery) => {
          return moment(scheduledDelivery.scheduledTime);
        }
      );

      const nowLineDate = moment();
      // Filter through scheduled deliveries to remove dates that are before
      // the forecast & "now" line.
      const filteredScheduledDeliveryDatesForForecast = scheduledDeliveryDates?.filter(
        (date) => {
          return date > nowLineDate;
        }
      );

      const dataSeries: Highcharts.SeriesOptionsType = {
        id: `data-${channel.dataChannelId}`,
        color: seriesColour,
        name: seriesName,
        // Link this data series to the previous legend series
        linkedTo: ':previous',
        data: readings,
        type: 'line',
        // NOTE: Rate of Change Data Channels are displayed using steps. See docs
        // for rendering step lines:
        // https://api.highcharts.com/highcharts/plotOptions.line.step
        step:
          channel.dataChannelTypeId === DataChannelCategory.RateOfChange
            ? 'right'
            : undefined,
        lineWidth: commonDataSeriesLineWidth,
        marker: {
          symbol: 'circle',
          radius: 0,
          states: {
            hover: {
              radius: 0,
            },
          },
        },
        // This provides the ability to pass anything we want to the series
        // object. It's used to access certain data channel properties in the
        // Highcharts tooltip formatter() function.
        // https://api.highcharts.com/highcharts/series.line.custom
        custom: seriesCustomProperties,
        // IMPORTANT REQUIREMENT: Show gaps in the graph
        // OFFICIAL HIGHCHARTS DOCS (which seem to be incorrect):
        // https://api.highcharts.com/highstock/6.0.5/plotOptions.series.gapUnit
        // TODO: Weird issue with a gap size below 3600 not showing the line
        // series on a certain data channel. Once that value is >= 3600, it
        // seems to work fine. This goes against highchart's docs that mention
        // gapUnit by default is relative which means it wouldn't be using the
        // date for calculations. Also, it meantions if gapUnit is 'value', it
        // calculates using milliseconds, but it seems to be using seconds
        // instead (3600 seconds = 1 hour, which is the typical gap between
        // readings).
        // gapSize: 3600,
        // NOTE: gapUnit: 'value' and gapSize: 3600000 (1 hour in milliseconds)
        // seems to be working. THIS MEANS WE NEED TO KNOW THE READINGS
        // FREQUENCY
        // TEMPORARY WORK-AROUND FOR DEMOABLE CODE: Don't show gaps for battery
        // data channels
        // NOTE: GAPS WERE REQUESTED TO BE REMOVED. IF IT'S NEEDED AGAIN,
        // UNCOMMENT THE FOLLOWING LINES
        // ====================================================================
        // ...(isBatteryDataChannel
        //   ? { gapSize: 0, gapUnit: 'value' }
        //   : {
        //       gapSize: calculatedGapSize,
        //       gapUnit: 'value',
        //     }),
        // ====================================================================
        showInLegend: false,
        yAxis: yAxisId,
      };

      // #region Readings data (before "Now" line) scheduled deliveries
      const formattedPreviousScheduledDeliveryReadingsData = readings?.filter(
        (point) => {
          const formattedXPointDate = moment(point[0]);

          const matchingPoint = !!scheduledDeliveryDates?.find((date) => {
            const isSame = date.isSame(formattedXPointDate);

            return isSame;
          });

          return matchingPoint;
        }
      );

      const dataSeriesWithScheduledDeliveryReadings: Highcharts.SeriesOptionsType = {
        id: `data-${channel.dataChannelId}-scheduled-delivery`,
        color: seriesColour,
        name: seriesName,
        // Link this data series to the previous legend series
        data: formattedPreviousScheduledDeliveryReadingsData,
        type: 'scatter',
        lineWidth: 0,
        marker: {
          symbol:
            'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHKSURBVHgBtVXLbcJAFHxeLE4cnAsnDuSIBCKuIOkgdJCkAkgF2B3QQVJC6CBUYBBCHO0DJy5ZISS+gsyzHIsYfxZhRlpsdr0z+76rUQpc1zWWy2Ubr0+aplWPx2M1WJIYw8Ph0C8Wi1+1Ws1L4tDiJqfTaXW/338wMSkA4p+FQsGOExLRifF43Aa5o0rOgGWvvGc0GnXOxE//TCaTLsy26DpYjUbDPhPgk+PRoxyAQ743m81eKBD4nN1iUD6Quq6bHBM/BrvdzsqRnGEESUJacHqXboBSqXQnttttS3VDuVz2hyoWi0VHR/4+I80yP46Sz+fzzD1CiEeBiD9kfRglV7WEq1/gx1Aln81m/ojOJ4Fbi34JuZQyXKtUKuFamrvYAu9Scn5XtERyHXiUgih5nEgKhjr8NKCYxsZmI81ovV4n7maRzWZDq9Uqdh3e6WuO4xgo6x+6AVDA98I0TQmlb8oZfEeAO+xFb3CVpPwgwem3bF+AlSBgU07A6W3mDAUYQf++WgSdwa7X6+G9cnYn87WHE3SzKjwGHMt/5LECDGRWFU3QwoYXUgAnCcfxzy2ZAqdC6IitoONyUzQCQg8PjtsAqdjjTEzi+AX5lurxGZxiBAAAAABJRU5ErkJggg==)',
          radius: 3,
        },
        // This provides the ability to pass anything we want to the series
        // object. It's used to access certain data channel properties in the
        // Highcharts tooltip formatter() function.
        // https://api.highcharts.com/highcharts/series.line.custom
        custom: seriesCustomProperties,
        showInLegend: false,
        yAxis: yAxisId,
      };
      // #endregion Readings data (before "Now" line) scheduled deliveries

      const commonForecastSeriesConfig: Highcharts.SeriesOptionsType = {
        custom: seriesCustomProperties,
        color:
          themePaletteType === 'light'
            ? graphColours.forecastSeriesColour
            : graphColours.forecastSeriesColourDark,
        name: seriesName,
        type: 'line',
        lineWidth: commonDataSeriesLineWidth,
        showInLegend: false,
        yAxis: yAxisId,
        // Remove markers on hover for forecast line(s)
        marker: {
          symbol: 'circle',
          radius: 0,
          states: {
            hover: {
              radius: 0,
            },
          },
        },
      };

      // #region Forecast data (after "Now" line) scheduled deliveries
      // NOTE: Method below could be used as an alternative if we want a threshold.
      // We should probably get the closet point without having a threshold
      // due to other forecasts possibly not meeting this threshold (have not
      // run into that case yet). If forecasts never go below this threshold,
      // then the smaller code below is maybe worth using.
      // const thresholdForClosestReadingToScheduledDelivery = 10; // minutes
      // const closestDates = forecastReadings?.regular.filter((point) =>
      //   scheduledDeliveryDates?.some(
      //     (delivery) =>
      //       Math.abs(moment(point[0]).diff(delivery, 'minutes')) <
      //       thresholdForClosestReadingToScheduledDelivery
      //   )
      // );

      let forecastReadingsForDates = forecastReadings.regular;

      const closestDates: GraphPoint[] = [];
      filteredScheduledDeliveryDatesForForecast?.forEach(
        (scheduledDeliveryDate) => {
          let closestPointDifference = Number.MAX_VALUE;
          let closestPoint: GraphPoint | null = null;

          for (
            let readingsIndex = 0;
            readingsIndex < forecastReadingsForDates.length;
            readingsIndex++
          ) {
            const reading = forecastReadingsForDates[readingsIndex];

            const differenceInSeconds = Math.abs(
              moment(scheduledDeliveryDate).diff(reading[0], 'seconds')
            );

            // If we find a closer point, continue looking for a smaller value.
            if (differenceInSeconds <= closestPointDifference) {
              closestPointDifference = differenceInSeconds;
              closestPoint = reading;
            } else {
              // If we dont find a closer point, add the current closestPoint to
              // the list of closestDates that will be used for displaying the
              // scheduled delivery icon at that closestPoint.
              closestDates.push(closestPoint!);
              // Reduce size of forecastReadingsForDates by slicing to optimize
              // performance by making the list smaller every time.
              forecastReadingsForDates = forecastReadingsForDates.slice(
                readingsIndex
              );
              break;
            }
          }
        }
      );

      // What helped us slightly to understand and create specific points with
      // custom icons:
      // https://www.highcharts.com/forum/viewtopic.php?t=9232
      // Less relevant but slightly useful to understand:
      // https://www.highcharts.com/forum/viewtopic.php?t=7134#p33649
      const scheduledDeliveryForecastSeries: Highcharts.SeriesOptionsType = merge(
        {},
        commonForecastSeriesConfig,
        // @ts-ignore
        {
          id: `forecastSeries-${channel.dataChannelId}-deliverySchedule`,
          data: closestDates,
          type: 'scatter',
          // Had issue where custom icons for scatter points would appear behind
          // other series (forecast lines).
          // Somewhat relevant thread about using zIndex (we didnt have the zIndex
          // used at all while having this issue):
          // https://www.highcharts.com/forum/viewtopic.php?f=9&t=46979
          zIndex: 3,
          marker: {
            symbol:
              'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHJSURBVHgBtZWtcsJAFIXvhgpkeAPiAoOghqlrZKuaAYGlT0Arq6AOicC3srjWVTHUMZhiGHDBI5rKGui56YYpIT+bIXwzO7v5O+dudvdeQTHYtq1rmtbebrcWLouyMS7aDPff0L+CVZSGiBAuCiGeMLRIAbz7vNlsHsOMcsEbjUajje4FzSR1qjBpmab5s1wuJ5EG9Xq9g2n3MMxTevIwuSqXy7RYLD4ODDhyKX4sFmby7c/EWwP5zz8x1CkbXAR7zmuieS5CdDMUZ3S5SUjI6B06AZhFgWdgq37QbDa9loK7M0R/o/JmUHw4HCZ+A+3LXKlU6lPCtgyKVyoVr5/P55QEG/RUxQeDAU2nU6rVaqomOht0VcVHoxE5jkPr9VrZhA1aFLJFw8R9Upi4vItWFENQ3Ifv8bMEZnwOuljtTthTwzC8aOOIewfn4J4N+NR90QmAgaEhX3DxGFPGcI3Y5SI43dJflcoKlwsQD7x0jdTqcrHgfE4ZgIAfEP37zkCaTGACD2HREUCcS+fu8O5VNJiMuVjA5ILSVzVXRr6XGQ5qspwJZ7ICjKqkxhji1/5v+Y+I+4prBXcy47KZf+JX3CDKtbcvd2Iovxzb3GNbK9UAAAAAAElFTkSuQmCC)',
            radius: 3,
          },
          events: {
            click(event) {
              getExistingScheduledDeliveryFromClickedPoint({
                clickedPoint: event.point.x,
                openScheduleDeliveryEditorDialog,
                scheduledDeliveries,
              });
            },
          },
          custom: {
            seriesCustomProperties,
          },
          lineWidth: 0,
        } as Highcharts.SeriesOptionsType
      );
      // #endregion Forecast data (after "Now" line) scheduled deliveries

      const regularForecastSeries: Highcharts.SeriesOptionsType = merge(
        {},
        commonForecastSeriesConfig,
        {
          id: `forecastSeries-${channel.dataChannelId}-regular`,
          data: forecastReadings?.regular,
        } as Highcharts.SeriesOptionsType
      );
      const highForecastSeries: Highcharts.SeriesOptionsType = merge(
        {},
        commonForecastSeriesConfig,
        {
          id: `forecastSeries-${channel.dataChannelId}-high`,
          name: `${seriesName} - High`,
          // Link this data series to the previous series
          linkedTo: ':previous',
          data: forecastReadings?.high,
        } as Highcharts.SeriesOptionsType
      );
      const lowForecastSeries: Highcharts.SeriesOptionsType = merge(
        {},
        commonForecastSeriesConfig,
        {
          id: `forecastSeries-${channel.dataChannelId}-low`,
          name: `${seriesName} - Low`,
          // Link this data series to the previous series
          linkedTo: ':previous',
          data: forecastReadings?.low,
        } as Highcharts.SeriesOptionsType
      );

      const eventRules = getSortedEventRulesFromDataChannel(
        channel.uomParams?.eventRules,
        'desc'
      );

      const xAxisPlotbands =
        showForecast && forecastReadings
          ? getXAxisPlotbandsFromForecastReadings(forecastReadings, eventRules)
          : [];

      // The yAxis.labels.y value origin or center to align the label with the
      // tick (may depend on font family and font size)
      const yAxisLabelCenterYOrigin = 6;
      // The y axis label height depends on both the font family and font size
      const yAxisLabelHeight = 10;
      const halfYAxisLabelHeight = yAxisLabelHeight / 2;
      const totalYAxisLabelSpecificDataChannels =
        channel.dataChannelTypeId === DataChannelCategory.DigitalInput
          ? totalYAxisTextLabelDataChannels
          : totalYAxisNumericLabelDataChannels;
      const firstYAxisLabelOffset =
        totalYAxisLabelSpecificDataChannels <= 1
          ? 0
          : -(halfYAxisLabelHeight * (totalYAxisLabelSpecificDataChannels - 1));

      const yAxisLabelIndex =
        channel.dataChannelTypeId === DataChannelCategory.DigitalInput
          ? textYAxisLabelDataChannelIndex
          : numericYAxisLabelDataChannelIndex;

      // This centers the y-axis label(s) vertically beside the tick
      const yAxisLabelOffset =
        yAxisLabelCenterYOrigin +
        (firstYAxisLabelOffset + yAxisLabelIndex * 10);

      const cleanGraphMin = getGraphMinForDataChannel(channel);
      const cleanGraphMax = getGraphMaxForDataChannel(channel);
      const yAxis: Highcharts.YAxisOptions = {
        ...commonGridlineProps,
        ...commonAxisLineProps,
        // Only show one grid line, even when graphing multiple data channels
        gridLineWidth:
          dataChannelsArray.length > 1 && index !== 0 ? 0 : commonGridLineWidth,
        // Previously, we were only adding the y-axis line for the first axis.
        // Otherwise each axis will be separated with a vertical line which
        // didn't look great. Highcharts seems to order the y-axis differently
        // (and it can't seem to be controlled) so the y-axis line may appear
        // incorrectly when trying to add the line to the FIRST yAxis. The code
        // used was below:
        // lineWidth: dataChannelsArray.length > 1 ? 0 : commonAxisLineWidth,
        // The code was removed since the issue seemed to stop happening when
        // `reserveSpace: false,` was used on the y-axis
        lineWidth: commonAxisLineWidth,
        id: yAxisId,
        title: {
          text: '',
        },
        // Potentially useful properties for the custom y-axis label solution
        // that was set up:
        // tickPixelInterval, tickAmount
        // https://api.highcharts.com/highcharts/yAxis.tickPixelInterval
        // https://api.highcharts.com/highcharts/yAxis.tickAmount
        labels: merge({}, commmonAxisLabelProps, {
          // Position digital input data channel labels further left than
          // numbered labels
          x:
            !areOnlyYAxisTextLabelsShown &&
            channel.dataChannelTypeId === DataChannelCategory.DigitalInput
              ? -50
              : -10,
          // The calculation for the spacing may be something like:
          // If the y origin is 0 and the height of a label is 10, then:
          // If we have 1 label : y: 0
          // If we have 2 labels: y: -5, 5
          // If we have 3 labels: y: -10, 0, 10
          // If we have 4 labels: y: -15, -5, 5, 15
          y: yAxisLabelOffset,
          align: 'right',
          overflow: 'allow',
          // `reserveSpace` is prolly the most important property for the
          // custom y-axis label solution. It stacks the axes on top of each
          // other instead of putting each of them beside each other.
          // https://api.highcharts.com/highcharts/yAxis.labels.reserveSpace
          reserveSpace: false,
          style: {
            color: seriesColour,
            fontSize: '13px',
            fontWeight: '500',
            textTransform: 'uppercase',
            width: 200,
          },
          formatter: getYAxisLabelFormatterForDataChannel(channel),
        } as Highcharts.YAxisLabelsOptions),
        // NOTE: startOnTick and endOnTick affect min, max values used by the
        // API's graphMin, graphMax properties. The `yAxis.min` docs explain this
        // along with `yAxis.ceiling` and `yAxis.floor`:
        // https://api.highcharts.com/highcharts/yAxis.min
        // It also affects the yAxis.alignTicks setting which is relevant for
        // multiple y axes.
        // We disable both startOnTick and endOnTick for digital data channels
        // so the graph min and max labels are always shown. Note that
        // explicitly setting either `startOnTick` or `endOnTick` to `true` or
        // `false` or `undefined` affects how highcharts renders the labels.
        ...(channel.dataChannelTypeId === DataChannelCategory.DigitalInput && {
          startOnTick: false,
          endOnTick: false,
        }),
        min: cleanGraphMin,
        max: cleanGraphMax,
        floor: cleanGraphMin,
        ceiling: cleanGraphMax,
        // Add yAxis plotlines only for event rules that are set to be
        // displayed on the graph
        ...(!hasAddedYAxisPlotLines && {
          plotLines: eventRules
            .filter((rule) => rule.isDisplayedOnGraph)
            .map(eventRuleToYAxisPlotline),
        }),
      };

      if (!hasAddedYAxisPlotLines) {
        hasAddedYAxisPlotLines = true;
      }

      // Maintain the index of y axis labels
      if (channel.dataChannelTypeId === DataChannelCategory.DigitalInput) {
        textYAxisLabelDataChannelIndex += 1;
      } else {
        numericYAxisLabelDataChannelIndex += 1;
      }

      return {
        legendSeries,
        dataSeriesWithPastScheduledDeliveries: showForecast
          ? [dataSeries, dataSeriesWithScheduledDeliveryReadings]
          : [dataSeries],
        multipleForecastSeries: showForecast
          ? forecastReadings?.low.length || forecastReadings?.high.length
            ? [
                highForecastSeries,
                regularForecastSeries,
                scheduledDeliveryForecastSeries,
                lowForecastSeries,
              ]
            : [regularForecastSeries, scheduledDeliveryForecastSeries]
          : [],
        yAxis,
        xAxisPlotbands,
      };
    });

  const firstDataChannelWithXAxisPlotbands = dataChannelsGraphData?.find(
    (data) => data.xAxisPlotbands.length > 0
  );
  const plotLines: Highcharts.XAxisPlotLinesOptions[] = [
    {
      value: moment().valueOf(),
      color: graphColours.mainPlotLine,
      className: 'custom-main-plotline',
      width: 2,
      zIndex: 1,
      label: {
        className: 'custom-main-plotline',
        text: 'Now',
        useHTML: true,
        verticalAlign: 'top',
        textAlign: 'center',
        align: 'center',
        x: -10,
        y: -13,
        rotation: undefined,
        style: {
          fontFamily: defaultFonts,
          fontSize: '13px',
          fontWeight: '600',
          padding: '5px 7px',
          // @ts-ignore
          borderRadius: '2px',
          textTransform: 'uppercase',
        },
      },
    },
  ];
  const xAxisPlotBands =
    firstDataChannelWithXAxisPlotbands?.xAxisPlotbands || [];

  if (clickedMapMarkerTimeRange) {
    if (clickedMapMarkerTimeRange[0] === clickedMapMarkerTimeRange[1]) {
      plotLines.push({
        value: clickedMapMarkerTimeRange[0],
        color: 'rgba(255, 103, 38, 0.6)',
        width: 2,
        zIndex: 1,
        label: {
          className: 'custom-main-plotline',
          // NOTE/TODO: Should we pass text as a prop, instead?
          text: `${moment(clickedMapMarkerTimeRange[0]).format('ddd MMM DD')}`,
          useHTML: true,
          verticalAlign: 'top',
          textAlign: 'center',
          align: 'center',
          x: -16,
          y: -13,
          rotation: undefined,
          style: {
            fontFamily: defaultFonts,
            fontSize: '13px',
            fontWeight: '500',
            padding: '6px 16px',
            // @ts-ignore
            borderRadius: '5px',
            textTransform: 'normal',
          },
        },
      });
    } else {
      xAxisPlotBands.push({
        from: clickedMapMarkerTimeRange[0],
        to: clickedMapMarkerTimeRange[1],
        color: 'rgba(255, 103, 38, 0.4)',
        zIndex: 2,
        label: {
          // NOTE/TODO: Should we pass text as a prop, instead?
          text: `${moment(clickedMapMarkerTimeRange[0]).format(
            'ddd MMM DD'
          )} - ${moment(clickedMapMarkerTimeRange[1]).format('ddd MMM DD')}`,
          useHTML: true,
          verticalAlign: 'top',
          textAlign: 'center',
          align: 'center',
          x: -24,
          y: -14,
          rotation: undefined,
          style: {
            backgroundColor: graphColours.mainPlotLine,
            fontFamily: defaultFonts,
            fontSize: '13px',
            fontWeight: '500',
            padding: '6px 16px',
            // @ts-ignore
            borderRadius: '5px',
            color: 'white',
            textTransform: 'normal',
          },
        },
      });
    }
  }

  const allYAxes = dataChannelsGraphData?.map(
    (channelGraphData) => channelGraphData.yAxis
  );

  // #region for getPointForScheduledDelivery and <ScheduleDeliveryDialog />.
  const selectedForecastableDataChannelForScheduleDelivery = dataChannels?.find(
    (channel) => channel.forecastMode !== ForecastMode.NoForecast
  );
  const hasForecast = dataChannels?.some((channel) => {
    return channel.forecastMode !== ForecastMode.NoForecast;
  });
  const forecastDataChannelCacheKey = selectedForecastableDataChannelForScheduleDelivery
    ? getReadingsCacheKey(selectedForecastableDataChannelForScheduleDelivery)
    : '';
  const cachedForecastData =
    rawCachedForecastReadings[forecastDataChannelCacheKey];
  const forecastReadingsForScheduleDelivery = cachedForecastData?.forecasts;
  const lastSelectableForecastDate = moment(
    forecastReadingsForScheduleDelivery?.[
      forecastReadingsForScheduleDelivery?.length - 1
    ]?.logTime
  ).toDate();
  const nowLineDate = moment(new Date()).toDate();
  // #endregion

  return {
    colors: graphColours.seriesColours,
    mapNavigation: {
      enableMouseWheelZoom: true,
    },
    rangeSelector: {
      enabled: true,
    },
    chart: {
      events: {
        click(event: any) {
          if (!forecastReadingsForScheduleDelivery) {
            return null;
          }

          if (!hasForecast || !showForecast) {
            return null;
          }

          if (lastSelectableForecastDate < nowLineDate) {
            return null;
          }

          getPointForScheduledDelivery({
            clickedPoint: event.xAxis[0].value,
            forecastReadingsData: forecastReadingsForScheduleDelivery,
            openScheduleDeliveryDialog,
          });

          return null;
        },
      },
      backgroundColor: undefined,
      margin: 75,
      // Margin to account for:
      // - the plotline labels placed outside of the graph on the right side
      // - multiple y-axis labels (digital data channels can have long text)
      marginRight: 110,
      marginLeft: getChartLeftMargin(dataChannels),
      marginTop: 35,
      panning: {
        enabled: true,
        type: 'x',
      },
      panKey: undefined,
      height: 550,
      // BUG: There's a bug with highcharts where zooming always takes priority
      // over panning, even if `zoomKey` is set.
      // zoomType: 'x',
      // zoomKey: 'alt',
    },
    title: {
      text: '',
    },
    // Timezone settings for the chart. Note that moment-timezone needs to be
    // available via window.moment (see src/index.tsx):
    // https://api.highcharts.com/highcharts/time.timezone
    ...(ianaTimezoneId && {
      time: {
        timezone: ianaTimezoneId,
      },
    }),

    // https://api.highcharts.com/highcharts/tooltip
    tooltip: {
      useHTML: true,
      // Prevent the tooltip from appearing outside the graph. Used together
      // with the following change:
      // `Highcharts.Series.prototype.directTouch = true;`
      // which allows showing the tooltip for values outside the graph bounds,
      // while keeping the tooltip within the constraints of the graph.
      // https://stackoverflow.com/a/39276436/7752479
      outside: false,
      borderWidth: 0,
      borderRadius: 0,
      padding: 0,
      enabled: true,

      // Show ALL series data at the current point in the tooltip
      shared: true,
      style: {
        fontFamily: defaultFonts,
      },
      formatter() {
        const date = formatModifiedDatetime(this.x, ianaTimezoneId);
        const dateHtml = `<div style="font-size: 12px; padding: 8px 16px;">${date}</div>`;
        const dividerHtml = `<div class="custom-tooltip-divider" style="margin-top: 0; margin-bottom: 8px;"></div>`;

        const pointsHtmlArray = this.points?.map((point) => {
          const { color, series } = point;
          const { name, userOptions } = series;

          const unitAsText = userOptions.custom?.unitAsText;
          const dataChannelType = userOptions.custom?.dataChannelType;
          const decimalPlaces = userOptions.custom?.decimalPlaces;
          const digitalState0Text = userOptions.custom?.digitalState0Text;
          const digitalState1Text = userOptions.custom?.digitalState1Text;
          const digitalState2Text = userOptions.custom?.digitalState2Text;
          const digitalState3Text = userOptions.custom?.digitalState3Text;

          const legendColorCircle = `<span style="color:${color}">●</span>`;
          const formattedName = name.split('(')?.[0]?.trim();
          const nameHtml = `<span style="font-weight: 600;">${formattedName}</span>`;
          const valueForHtml = isNumber(point?.y)
            ? getTooltipValue(
                dataChannelType,
                point.y!,
                decimalPlaces,
                digitalState0Text,
                digitalState1Text,
                digitalState2Text,
                digitalState3Text
              )
            : '';

          const pointHtmlContent = [
            legendColorCircle,
            nameHtml,
            // We use a string here so it isn't filtered out as a falsy value
            // if it's the number 0.
            String(valueForHtml),
            unitAsText,
          ]
            .filter(Boolean)
            .join(' ');

          return `<div style="font-size: 13px; padding: 0px 16px 8px 16px;">${pointHtmlContent}</div>`;
        });

        // #region scatter points
        const scheduledDeliveriesForTooltip:
          | Record<number, ScheduledDeliveryDto>
          | undefined = this?.point?.series?.options?.custom
          ?.scheduledDeliveriesForTooltip;

        const scheduledDelivery =
          scheduledDeliveriesForTooltip?.[this?.point?.x];

        const isScheduledDeliveryBeforeNowLine =
          scheduledDelivery?.scheduledTime &&
          moment(scheduledDelivery?.scheduledTime) < moment();

        const formattedScheduledDeliveryDate = formatModifiedDatetime(
          this?.point?.x,
          ianaTimezoneId,
          'MMM D HH:mm' // customDateFormat: string
        );
        const formattedFillValue = formatScheduledDeliveryAmountValue(
          this?.point?.series?.options?.custom?.maxProductHeightInScaledUnits,
          this?.point?.series?.options?.custom?.maxProductHeightInDisplayUnits,
          this?.point?.y
        );
        const scheduledDeliveryScatterPointUnitsAsText = this?.point?.series
          ?.options?.custom?.unitAsText;
        const scheduledDeliveryText = t(
          'ui.datachanneleventrule.scheduleddelivery',
          'Scheduled Delivery'
        );
        const missedDeliveryText = t('enum.eventruletype.delivery', 'Delivery');
        const formattedDeliveryText =
          isScheduledDeliveryBeforeNowLine && !scheduledDelivery?.timeCompleted
            ? missedDeliveryText
            : scheduledDeliveryText;

        const displayedDeliveryTextHtml = `<div style="font: 'Work Sans'; font-size: 13px; font-weight: 600; padding: 8px 16px;">${formattedDeliveryText}</div>`;

        const formattedScheduledDeliveryText = [
          formattedScheduledDeliveryDate,
          scheduledDelivery?.isAutoFill
            ? t('ui.scheduleddelivery.autoFill', 'Autofill')
            : '',
          // We use a string here so it isn't filtered out as a falsy value
          // if it's the number 0.
          scheduledDelivery?.isAutoFill
            ? String(formattedFillValue)
            : String(scheduledDelivery?.deliveryAmount),
          scheduledDeliveryScatterPointUnitsAsText,
        ]
          .filter(Boolean)
          .join(' ');
        const formattedDeliveryScheduleScatterPointTooltipText = `<div style="font-size: 13px; padding: 0px 16px 8px 16px;">${formattedScheduledDeliveryText}</div>`;
        // #endregion scatter points

        const allPointsHtml = pointsHtmlArray?.join('');
        // We needed to add the isMobile check below because the app would crash
        // if the user changed the dates for the graph and QUICKLY hovered over
        // the graph points to show a tooltip.
        // RE: TypeError: Cannot read properties of null (reading 'tooltipOptions')
        // NOTE: If the user changes dates, but waits about a second before
        // hovering over the graph, this issue will NOT happen.
        if (isMobile && setHighlighted) {
          setHighlighted(this.x);
        }

        return allPointsHtml
          ? `${dateHtml}${dividerHtml}${allPointsHtml}`
          : this?.point // Does the scheduled delivery icon 'scatter' point exist
          ? `${displayedDeliveryTextHtml}${dividerHtml}${formattedDeliveryScheduleScatterPointTooltipText}`
          : dateHtml;
      },
    },
    legend: {
      itemStyle: {
        fontFamily: defaultFonts,
        fontSize: '12px',
        fontWeight: '500',
      },
      labelFormatter() {
        const color = this.visible
          ? // @ts-ignore
            this.color
          : graphColours.inactiveLegendItem;
        return `<span style="color:${color};">${this.name}</span>`;
      },
    },
    // @ts-ignore
    series: [
      ...(dataChannelsGraphData
        ?.map((channelGraphData) => [
          // NOTE: legendSeries and multipleForecastSeries was causing the
          // graph to crash when graping multiple assets and calling
          // yAxis.remove(). Be careful when associating the index of the yAxis
          // with the series (even if you're using the yAxis index in
          // yAxis.id).
          channelGraphData.legendSeries,
          ...channelGraphData.dataSeriesWithPastScheduledDeliveries,
          ...channelGraphData.multipleForecastSeries,
        ])
        .flat() || []),
      // Hidden series to allow panning outside data range. See this highcharts
      // thread:
      // https://www.highcharts.com/forum/viewtopic.php?t=37223
      getPlaceholderPanningSeries(),
    ],
    plotOptions: {
      series: {
        cursor: 'pointer',
        events: {
          click(event) {
            if (!forecastReadingsForScheduleDelivery) {
              return null;
            }

            if (!hasForecast || !showForecast) {
              return null;
            }

            if (lastSelectableForecastDate < nowLineDate) {
              return null;
            }

            getPointForScheduledDelivery({
              clickedPoint: event.point.options.x,
              forecastReadingsData: forecastReadingsForScheduleDelivery,
              openScheduleDeliveryDialog,
            });

            return null;
          },
        },
      },
      atr: {
        dataGrouping: {
          enabled: false,
        },
      },
    },
    // @ts-ignore
    xAxis: {
      ...commonGridlineProps,
      ...commonAxisLineProps,
      gridLineWidth: commonGridLineWidth,
      // When there are multiple data channels graphed, the first y-axis labels
      // could appear on top of the first x-axis label. We only show the first
      // x-axis label when there are 2 or less graphed data channels.
      showFirstLabel: dataChannels && dataChannels.length <= 2,
      lineWidth: commonAxisLineWidth,
      // The minimum range on the x-axis is 3 hours regardless of the data
      // channel that's graphed. Without this setting, a series with a few
      // points will prevent zooming in at zoom levels like 4 days.
      // https://api.highcharts.com/highcharts/xAxis.minRange
      minRange: 1000 * 60 * 60 * 3,

      // Show a crosshair when hovering over the chart. This is also used with
      // the tooltip functionality
      crosshair: true,
      type: 'datetime',
      tickLength: 0,
      // Prevent x-axis labels from appearing on two lines since we increased
      // the font-size. This happened with the "12 weeks" zoom level where
      // "Oct" would appear on one line and "12" would appear on the next line.
      tickPixelInterval: 120,
      dateTimeLabelFormats: {
        day: '%b %e',
      },
      // Now line
      plotLines,
      // Retrieve the first plotBands that have been set up.
      // NOTE: We default to an empty array since using `undefined` may not
      // clear the plotbands when toggling between data channels that may not
      // have any x-axis plotbands. This seems to be how Highcharts determines
      // whether an update on the graph should be made or not (in this case,
      // `undefined` seems to not override existing settings).
      plotBands: xAxisPlotBands,
      // plotBands: firstDataChannelWithXAxisPlotbands?.xAxisPlotbands || [],
    },
    // We provide a default Y axis if there aren't any since Highcharts
    // requires a y-axis if there's at least one series displayed.
    // Otherwise Highcharts will crash with this error:
    // https://www.highcharts.com/errors/18/
    yAxis: allYAxes?.length ? allYAxes : [defaultYAxis],
  };
};

interface Props {
  asset?: AssetDetailDto | null;
  initialFromDate?: Date | null;
  initialToDate?: Date | null;
  graphProperties: GraphProperties;
  readingsData: ReadingsHookData;
  scheduledDeliveries: ScheduledDeliveryDto[] | undefined;
  saveUserAssetDetailsSettings?: (
    request: Partial<EvovleSaveUserAssetDetailsSettingRequest>
  ) => void;
  isMobile?: boolean;
  gpsDataChannelId?: string;
  toggleIsGraphExpanded: () => void;
  isTableOrGraphExpanded: boolean;
  pdfExportElement: React.MutableRefObject<any>;
  createPDF: () => void;
  openScheduleDeliveryDialog: (deliveryDetails?: any) => void;
  openScheduleDeliveryEditorDialog: (
    deliveryDetails?: ScheduledDeliveryDto
  ) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AssetGraph = ({
  asset,
  initialFromDate,
  initialToDate,
  graphProperties,
  readingsData,
  scheduledDeliveries,
  saveUserAssetDetailsSettings,
  isMobile,
  gpsDataChannelId,
  toggleIsGraphExpanded,
  isTableOrGraphExpanded,
  pdfExportElement,
  createPDF,
  openScheduleDeliveryDialog,
  openScheduleDeliveryEditorDialog,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const domainName = useSelector(selectActiveDomainName);
  const ianaTimezoneId = useSelector(selectCurrentIanaTimezoneId);

  const hasPermission = useSelector(selectHasPermission);
  const canViewForecast = hasPermission(
    UserPermissionType.MiscellaneousFeatureViewForecast
  );
  const chartRef = useRef<{ chart: Highcharts.Chart }>(null);

  // Map/Graph Interactions
  const [highlightedGraphTime, setHighlightedGraphTime] = useState<
    number | null
  >(null);
  const [selectedMapMarker, setSelectedMapMarker] = useState<number | null>(
    null
  );
  const [clickedMapMarkerTimeRange, setClickedMapMarkerTimeRange] = useState<
    number[] | null
  >(null);
  // END OF Map/Graph Interactions

  const {
    zoomLevel,
    setZoomLevel,
    showForecast,
    setShowForecast,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    graphMinY,
    graphMaxY,
    manyGraphedDataChannels,
    initialZoomLevel,
    showAllGpsReadings,
    setShowAllGpsReadings,
  } = graphProperties;

  const {
    cachedReadings,
    cachedForecastReadings,
    dataChannelForecastsApi,
    isCachedReadingsApiFetching,
  } = readingsData;

  const areSomeReadingsSummarized = manyGraphedDataChannels?.some((channel) => {
    const channelCacheKey = getReadingsCacheKey(channel);
    const wereReadingsSummarizedForDataChannel =
      cachedReadings[channelCacheKey]?.wereReadingsSummarized;

    return wereReadingsSummarizedForDataChannel;
  });

  const highestPriorityGraphedDataChannel = manyGraphedDataChannels?.sort(
    (a, b) => a.displayPriority! - b.displayPriority!
  )?.[0];

  const [chartOptions, setChartOptions] = useState({
    title: { text: '' },
    credits: {
      enabled: areSomeReadingsSummarized,
      text: t('ui.assetdetail.summarizedreadings', '*Summarized Readings'),
      href: '',
      style: {
        fontSize: '12px',
        fontFamily: 'Work Sans',
        cursor: 'default',
      },
    },
    lang: {
      noData: '',
    },
    chart: {
      // Prevent using the default white background while loading chart data
      // using the dark theme
      backgroundColor: undefined,
    },
  } as Highcharts.Options);

  const graphedDataChannelsKey = manyGraphedDataChannels
    ?.map((channel) => {
      const channelCacheKey = getReadingsCacheKey(channel);
      const channelCachedReadings = cachedReadings[channelCacheKey];
      const channelCachedForecasts = cachedForecastReadings[channelCacheKey];

      return [
        channelCacheKey,
        channelCachedReadings?.readings.length,
        channelCachedForecasts?.forecasts?.length,
      ].join('_');
    })
    .join(' ');

  useEffect(() => {
    if (isCachedReadingsApiFetching || dataChannelForecastsApi.isFetching) {
      return;
    }

    // Clear existing series. Note that without this, the tooltip shown when
    // hovering over the chart wouldn't display values over some series
    // occasionally (even though the series is shown on the graph).
    chartRef.current?.chart.series?.forEach((series) => {
      series.remove();
    });

    // Remove existing yAxis plotlines
    // NOTE: THIS WAS CAUSING HIGHCHARTS ERROR "The requested axis does not
    // exist" WHEN GRAPHING MULTIPLE DATA CHANNELS
    // (https://www.highcharts.com/errors/18/).
    // It may be related to using yAxis and indicies in yAxis.id (see comment
    // above about yAxis.remove())
    chartRef.current?.chart.yAxis.forEach((yAxis) => {
      // Highcharts type doesn't seem to include plotLinesAndBands in the yAxis
      // even though it exists
      // @ts-ignore
      yAxis.plotLinesAndBands.forEach((plotline) => {
        yAxis.removePlotLine(plotline.id);
      });

      yAxis.remove();
    });

    const newChartOptions = buildOptions({
      dataChannels: manyGraphedDataChannels || [],
      rawCachedReadings: cachedReadings,
      rawCachedForecastReadings: cachedForecastReadings,
      showForecast,
      ianaTimezoneId,
      clickedMapMarkerTimeRange,
      themePaletteType: theme.palette.type,
      scheduledDeliveries,
      isMobile,
      setHighlighted: setHighlightedGraphTime,
      openScheduleDeliveryDialog,
      openScheduleDeliveryEditorDialog,
      t,
    });
    const allChartOptions = {
      ...newChartOptions,
      credits: {
        enabled: areSomeReadingsSummarized,
        text: t('ui.assetdetail.summarizedreadings', '*Summarized Readings'),
        href: '',
        style: {
          fontSize: '12px',
          fontFamily: 'Work Sans',
        },
      },
    };
    setChartOptions(allChartOptions);
    // Fix for "chart.update didn't update events given in options.chart.events"
    // https://github.com/highcharts/highcharts/pull/15801
    // Note that that PR fix is live in version 10.1.0 of highcharts, but we're
    // currently on 8.2.2
    Highcharts.removeEvent(chartRef.current?.chart, 'click');
    if (chartRef.current?.chart && allChartOptions.chart?.events?.click) {
      Highcharts.addEvent(
        chartRef.current?.chart,
        'click',
        allChartOptions.chart?.events?.click
      );
    }
    // IMPORTANT NOTE: This manual chart.update call seems to resolve issues
    // where stale chart elements (like y-axis plotlines) would remain even
    // though they were explicitly removed from the graph (via new options
    // created via buildOptions and even via Highchart's direct API like
    // yAxis.removePlotLine()). Another issue fixed by this is the legend
    // disppearing and re-appearing when switching between data channels. Note
    // that using chart.update may have also required using the `id` property
    // on things like the legend, series, and yAxis.
    chartRef.current?.chart.update(allChartOptions);
  }, [
    isCachedReadingsApiFetching,
    dataChannelForecastsApi.isFetching,
    graphedDataChannelsKey,
    showForecast,
    ianaTimezoneId,
    clickedMapMarkerTimeRange,
    theme.palette.type,
    scheduledDeliveries,
  ]);

  const currentZoomLevelIndex = nonCustomZoomRangeOptions.indexOf(zoomLevel);

  const updateStartAndEndDates = (
    startDatetime: moment.Moment,
    endDatetime: moment.Moment
  ) => {
    const formattedFromDate = moment(startDatetime).startOf('day');
    setFromDate(formattedFromDate.toDate());
    chartRef.current?.chart.xAxis.forEach((xAxis) =>
      xAxis.setExtremes(Number(formattedFromDate), Number(toDate))
    );
    // We used to get the .endOf('day') for the toDate but this forced the graph's
    // 'now' line to be misaligned (the forecast would always be a few hours -
    // max a day, longer). Removing the .endOf('day') allows for the 'now' line
    // to remain in the center of the graph and have a symmetrical readings (left)
    // side and forecast (right) side.
    const formattedToDate = moment(endDatetime);

    const startAndEndDateTotal = moment.duration(
      formattedToDate.diff(formattedFromDate)
    );

    const startAndEndDateTotalInHours = startAndEndDateTotal.asHours();

    // We do the following math so when the user selects a date that goes past
    // the 90 day forecast, we limit the forecast to 90 days but continue to go
    // back to one year for the graph readings (left side of graph).
    // 2184 = 91 days in hours to show the full forecast + some space to let
    // the user clearly see that the forecast has ended around the 90 day mark.
    const addHoursOrEndDateForForecast =
      startAndEndDateTotalInHours > 2184
        ? 2184
        : // When users want to view only hours within a single day (e.g.: 3 hours)
        // then we don't want to add any time to their date selection, otherwise
        // we would be doubling for example, 3 hours to 6 hours.
        startAndEndDateTotalInHours > 23
        ? startAndEndDateTotal
        : 0;

    const formattedToDateForForecast = moment(formattedToDate).add(
      addHoursOrEndDateForForecast,
      'hours'
    );

    setToDate(formattedToDateForForecast.toDate());
    chartRef.current?.chart.xAxis.forEach((xAxis) =>
      xAxis.setExtremes(Number(fromDate), Number(formattedToDateForForecast))
    );
  };

  // NOTE/TODO: Remove all zoom-related functions for graph once we get the
  // confirmation to not re-add the zoom buttons re: what customers want.
  // Includes the "goTo" functions.
  // Update the graph's x axis extremes (left/right range) when the from/to
  // dates are updated outside this component (example: changing timezone)
  useEffect(() => {
    // Set min/max extremes for the x axis (horizontal)
    chartRef.current?.chart.xAxis.forEach((xAxis) =>
      xAxis.setExtremes(fromDate.getTime(), toDate.getTime())
    );
  }, [fromDate, toDate]);

  const zoomOut = () => {
    const nextZoomLevel = nonCustomZoomRangeOptions[currentZoomLevelIndex - 1];
    if (nextZoomLevel) {
      setZoomLevel(nextZoomLevel);

      const durationAsSeconds = getDurationAsSecondsFromZoomLevel(
        nextZoomLevel
      );

      const oldFromDate = moment(fromDate);
      const oldToDate = moment(toDate);
      // @ts-ignore
      const middleDate = moment((oldFromDate + oldToDate) / 2);
      const newFromDate = moment(middleDate).subtract(
        durationAsSeconds / 2,
        'seconds'
      );
      const newToDate = moment(middleDate).add(
        durationAsSeconds / 2,
        'seconds'
      );
      setFromDate(newFromDate.toDate());
      setToDate(newToDate.toDate());

      chartRef.current?.chart.xAxis.forEach((xAxis) =>
        xAxis.setExtremes(newFromDate.valueOf(), newToDate.valueOf())
      );
    }
  };
  const zoomIn = () => {
    const nextZoomLevel = nonCustomZoomRangeOptions[currentZoomLevelIndex + 1];
    if (nextZoomLevel) {
      setZoomLevel(nextZoomLevel);

      const durationAsSeconds = getDurationAsSecondsFromZoomLevel(
        nextZoomLevel
      );

      const oldFromDate = moment(fromDate);
      const oldToDate = moment(toDate);
      // @ts-ignore
      const middleDate = moment((oldFromDate + oldToDate) / 2);
      const newFromDate = moment(middleDate).subtract(
        durationAsSeconds / 2,
        'seconds'
      );
      const newToDate = moment(middleDate).add(
        durationAsSeconds / 2,
        'seconds'
      );
      setFromDate(newFromDate.toDate());
      setToDate(newToDate.toDate());

      chartRef.current?.chart.xAxis.forEach((xAxis) =>
        xAxis.setExtremes(newFromDate.valueOf(), newToDate.valueOf())
      );
    }
  };

  const goToNow = () => {
    const [
      xAxisLeftExtreme,
      xAxisRightExtreme,
    ] = getDateBoundsForZoomLevelAndDateRange(zoomLevel);

    setFromDate(xAxisLeftExtreme.toDate());
    setToDate(xAxisRightExtreme.toDate());

    chartRef.current?.chart.xAxis.forEach((xAxis) =>
      xAxis.setExtremes(xAxisLeftExtreme.valueOf(), xAxisRightExtreme.valueOf())
    );
  };

  const goBackwards = () => {
    const durationAsSeconds = getDurationAsSecondsFromZoomLevel(zoomLevel);

    chartRef.current?.chart.xAxis.forEach((xAxis) => {
      const extremes = xAxis.getExtremes();

      const currentMin = extremes.min || extremes.userMin;
      const currentMax = extremes.max || extremes.userMax;

      const newMin = moment(currentMin).subtract(
        durationAsSeconds / 2,
        'seconds'
      );
      const newMax = moment(currentMax).subtract(
        durationAsSeconds / 2,
        'seconds'
      );

      setFromDate(newMin.toDate());
      setToDate(newMax.toDate());

      xAxis.setExtremes(newMin.valueOf(), newMax.valueOf());
    });
  };

  const goForwards = () => {
    const durationAsSeconds = getDurationAsSecondsFromZoomLevel(zoomLevel);

    chartRef.current?.chart.xAxis.forEach((xAxis) => {
      const extremes = xAxis.getExtremes();

      // NOTE: extremes.min/max may be undefined in some cases, so we use
      // userMin/max instead
      // https://api.highcharts.com/class-reference/Highcharts.ExtremesObject#toc2
      const currentMin = extremes.min || extremes.userMin;
      const currentMax = extremes.max || extremes.userMax;

      const newMin = moment(currentMin).add(durationAsSeconds / 2, 'seconds');
      const newMax = moment(currentMax).add(durationAsSeconds / 2, 'seconds');

      setFromDate(newMin.toDate());
      setToDate(newMax.toDate());

      xAxis.setExtremes(newMin.valueOf(), newMax.valueOf());
    });
  };

  const goToEnd = () => {
    const durationAsSeconds = getDurationAsSecondsFromZoomLevel(zoomLevel);

    const allLatestReadingTimes = manyGraphedDataChannels
      ?.map((channel) => {
        const cacheKey = getReadingsCacheKey(channel);
        const cachedData = cachedReadings[cacheKey];
        const cachedForecastData = cachedForecastReadings[cacheKey];
        const readings = cachedData?.readings;
        const forecastReadings = cachedForecastData?.forecasts;

        const latestReadingLogTime = readings?.[readings?.length - 1].logTime;
        const latestForecastReadingLogTime = showForecast
          ? forecastReadings?.[forecastReadings?.length - 1].logTime
          : null;

        return [
          latestReadingLogTime?.getTime(),
          latestForecastReadingLogTime?.getTime(),
        ].filter(Boolean);
      })
      .flat();

    const latestGlobalReadingLogTime = max(allLatestReadingTimes);
    if (!latestGlobalReadingLogTime) {
      return;
    }

    chartRef.current?.chart.xAxis.forEach((xAxis) => {
      const newMin = moment(latestGlobalReadingLogTime).subtract(
        durationAsSeconds,
        'seconds'
      );
      const newMax = moment(latestGlobalReadingLogTime);

      setFromDate(newMin.toDate());
      setToDate(newMax.toDate());

      xAxis.setExtremes(newMin.valueOf(), newMax.valueOf());
    });
  };

  // Go to the earliest reading received from the API SO FAR
  const goToBeginning = () => {
    const durationAsSeconds = getDurationAsSecondsFromZoomLevel(zoomLevel);

    const allEarliestReadingTimes = manyGraphedDataChannels
      ?.map((channel) => {
        const cacheKey = getReadingsCacheKey(channel);
        const cachedData = cachedReadings[cacheKey];
        const readings = cachedData?.readings;

        const earliestReadingLogTime = readings?.[0].logTime;

        return earliestReadingLogTime;
      })
      .filter(Boolean);

    const earliestGlobalReadingLogTime = min(allEarliestReadingTimes);
    if (!earliestGlobalReadingLogTime) {
      return;
    }

    chartRef.current?.chart.xAxis.forEach((xAxis) => {
      const newMin = moment(earliestGlobalReadingLogTime);
      const newMax = moment(earliestGlobalReadingLogTime).add(
        durationAsSeconds,
        'seconds'
      );

      setFromDate(newMin.toDate());
      setToDate(newMax.toDate());

      xAxis.setExtremes(newMin.valueOf(), newMax.valueOf());
    });
  };

  // Update the from/to date when the user finishes panning (via mouse
  // dragging)
  const handleMouseUp = useCallback(() => {
    chartRef.current?.chart.xAxis.forEach((xAxis) => {
      const extremes = xAxis.getExtremes();
      const newFromDate = moment(extremes.min);
      const newToDate = moment(extremes.max);
      if (
        newFromDate.isValid() &&
        newToDate.isValid() &&
        newFromDate.toISOString() !== fromDate.toISOString() &&
        newToDate.toISOString() !== toDate.toISOString() &&
        newFromDate < newToDate
      ) {
        setFromDate(newFromDate.toDate());
        setToDate(newToDate.toDate());
      }
    });
  }, []);

  useEffect(() => {
    // Set min/max extremes for the x axis (horizontal)
    chartRef.current?.chart.xAxis.forEach((xAxis) =>
      xAxis.setExtremes(fromDate.getTime(), toDate.getTime())
    );
    // Set min/max extremes for the y axis (vertical)
    chartRef.current?.chart.yAxis.forEach((yAxis) =>
      yAxis.setExtremes(graphMinY, graphMaxY)
    );

    chartRef.current?.chart.container.addEventListener(
      'mouseup',
      handleMouseUp
    );

    return () => {
      chartRef.current?.chart.container.removeEventListener(
        'mouseup',
        handleMouseUp
      );
    };
  }, []);

  // Update the user's asset detail settings
  const allGraphedDataChannelIds = manyGraphedDataChannels
    ?.filter((channel) => !!channel.dataChannelId)
    .map((channel) => channel.dataChannelId) as string[] | undefined;
  const joinedGraphedDataChannelIds = allGraphedDataChannelIds?.join(' ');
  const previousGraphedDataChannelId = useRef(joinedGraphedDataChannelIds);
  useDebounce(
    () => {
      if (
        fromDate.getTime() !== initialFromDate?.getTime() ||
        toDate.getTime() !== initialToDate?.getTime() ||
        zoomLevel !== initialZoomLevel ||
        previousGraphedDataChannelId.current !== joinedGraphedDataChannelIds
      ) {
        // Update the previous data channel ID so we dont call the API next
        // time it's the same as the previous graphed data channel
        previousGraphedDataChannelId.current = joinedGraphedDataChannelIds;

        saveUserAssetDetailsSettings?.({
          graphStartDate: fromDate,
          graphEndDate: toDate,
          graphZoomLevelInHours: zoomLevel,
          graphedDataChannel: allGraphedDataChannelIds?.length
            ? allGraphedDataChannelIds
            : [],
        });
      }
    },
    2000,
    [
      fromDate.toISOString(),
      toDate.toISOString(),
      zoomLevel,
      joinedGraphedDataChannelIds,
    ]
  );

  const atLeastOneDataChannelHasForecastMode = !!manyGraphedDataChannels?.find(
    (channel) => channel.forecastMode
  );

  return (
    <AssetGraphWrapper
      // Safely nullifies active graph-to-map interactions when user is no longer interacting with graph
      onMouseOut={() => setHighlightedGraphTime(null)}
      onBlur={() => setHighlightedGraphTime(null)}
    >
      <Box m={1}>
        <ChartOptions
          fromDate={fromDate}
          toDate={toDate}
          updateStartAndEndDates={updateStartAndEndDates}
          zoomLevel={zoomLevel}
          showForecast={showForecast}
          setShowForecast={setShowForecast}
          showAllGpsReadings={showAllGpsReadings}
          setShowAllGpsReadings={setShowAllGpsReadings}
          shouldShowForecastCheckbox={
            atLeastOneDataChannelHasForecastMode && canViewForecast
          }
          showAllGpsCheckbox={isMobile}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          goToBeginning={goToBeginning}
          goBackwards={goBackwards}
          goToNow={goToNow}
          goForwards={goForwards}
          goToEnd={goToEnd}
          isFetching={isCachedReadingsApiFetching}
          exportGraphPDF={createPDF}
          toggleIsGraphExpanded={toggleIsGraphExpanded}
          isTableOrGraphExpanded={isTableOrGraphExpanded}
        />
      </Box>
      <Box mx={1}>
        <Divider />
      </Box>
      <div ref={pdfExportElement}>
        <DarkFadeOverlay darken={isCachedReadingsApiFetching} preventClicking>
          {isCachedReadingsApiFetching && <StyledCenteredCircularProgress />}
          <Box hidden={!isMobile} className="no-print">
            {gpsDataChannelId && (
              <MobileAssetMap
                readingsData={readingsData}
                dataChannels={manyGraphedDataChannels || []}
                setClickedMapMarkerTimeRange={setClickedMapMarkerTimeRange}
                highlightedGraphTime={highlightedGraphTime}
                setHighlightedGraphTime={setHighlightedGraphTime}
                selectedMarker={selectedMapMarker}
                setSelectedMapMarker={setSelectedMapMarker}
                dataChannelId={gpsDataChannelId}
                startDate={fromDate}
                endDate={toDate}
                graphIsFetching={isCachedReadingsApiFetching}
                showAllGpsReadings={showAllGpsReadings}
              />
            )}
          </Box>

          <StyledGraphTitleForPdf className="only-print">
            {asset?.assetTitle}
          </StyledGraphTitleForPdf>

          <HighchartsReact
            // @ts-ignore
            ref={chartRef}
            highcharts={Highcharts}
            options={chartOptions}
          />
        </DarkFadeOverlay>
      </div>
    </AssetGraphWrapper>
  );
};

export default AssetGraph;
