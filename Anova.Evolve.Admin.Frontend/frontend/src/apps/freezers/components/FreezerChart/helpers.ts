/* eslint-disable indent */
import { ChartTagBaseDto } from 'api/admin/api';
import { GRAPH_VALUE_ROUND_DECIMAL_PLACES } from 'apps/freezers/constants';
import {
  ChartYAxisPosition,
  GraphSeries,
  GraphSeriesReadings,
} from 'apps/freezers/containers/ChartEditor/types';
import {
  DataChannelIdToColorMapping,
  TagIdToHistoricalReadingsApiMapping,
  TagNameToTimeSeriesDataMapping,
} from 'apps/freezers/types';
import type Highcharts from 'highcharts';
import merge from 'lodash/merge';
import round from 'lodash/round';
import moment from 'moment';
import { defaultFonts } from 'styles/fonts';
import { formatModifiedDatetime } from 'utils/format/dates';
import { isNumber } from 'utils/format/numbers';

export const graphColours = {
  inactiveLegendItem: '#CCCCCC',
  gridLine: '#e6e6e6',
  axisLine: '#bdbdbd',
  nowPlotLine: '#333333',
  fullPlotLine: '#2196f3',
  reorderPlotLine: '#13B15C',
  urgentPlotLine: '#F03737',
  userDefinedPlotLine: '#fb8c00',
  noInventoryStatusPlotline: '#999999',

  pastBand: '#FFFAE4',
  regularBand: 'rgba(203, 203, 211, 0.25)',
  reorderBand: 'rgba(91, 200, 53, 0.25)',
  urgentBand: 'rgba(254, 67, 45, 0.2)',
  userDefinedBand: 'rgba(251, 140, 0, 0.25)',
  futureBand: '#FFFAE4', // Previously using a darker color #FFF1CD
  emptyBand: '#FFFFFF',

  forecastSeriesColour: 'black',

  seriesColours: [
    '#F5FF86',
    '#3DC5FF',
    '#FF6A61',
    '#0FB815',
    '#A772FF',
    '#FD20CC',
    '#F68500',
    '#0D6D8B',
    '#E52D05',
    '#97F84A',
    '#FF90B2',
    '#874CAB',
    '#FFD600',
    '#E1E1E1',
    '#EF51B0',
    '#007CEE',
    '#9C1E1E',
    '#66FFE3',
    '#B86326',
    '#5364FF',
    '#00C0A9',
    '#9F933F',
    '#754D40',
    '#7B7B7B',
    '#467110',
    '#483EB7',
    '#A47373',
    '#555555',
  ],

  // TODO: Add more colours?
  bulkTankDataChannelSeriesColours: [
    '#D9D9D9',
    '#59ead0',
    '#795548',
    '#EFB051',
    '#4caf50',
    '#2196f3',
  ],
};

function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export const generateMockGraphSeriesPoints = () => {
  const numberOfPoints = 5;
  const minValue = getRandomNumber(-50, 50);
  const maxValue = getRandomNumber(50, 100);

  const now = moment();

  const result: GraphSeriesReadings = Array(numberOfPoints)
    .fill(0)
    .map((_, index) => {
      const timestamp = Number(
        moment(now).subtract(numberOfPoints - index, 'days')
      );
      const value = getRandomNumber(minValue, maxValue);
      return [timestamp, value];
    });

  return result;
};

// #region Common graph properties
const commonDataSeriesLineWidth = 1.5;

const commonGridLineWidth = 1;
const commonGridlineProps = {
  gridLineColor: graphColours.gridLine,
};

const commmonAxisLabelProps = {
  style: {
    fontFamily: defaultFonts,
    fontSize: '13px',
    color: '#d2d2d2',
  },
};

const commonAxisLineWidth = 0;
const commonAxisLineProps = {
  lineColor: graphColours.axisLine,
};

const commonXAxisGridLineProps: Highcharts.YAxisOptions = {
  gridLineDashStyle: 'Solid',
  minorGridLineDashStyle: 'LongDash',
  minorGridLineColor: '#717171', // Previously #505050
  minorGridLineWidth: 1,
  minorTickInterval: 'auto', // Previously 6 hours: 1000 * 60 * 60 * 6
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
// #endregion Common graph properties

interface ConvertSeriesTagForHighcharts {
  seriesColor?: string;
  seriesUnit?: string | null;
  seriesDashStyle?: Highcharts.DashStyleValue;
  seriesLabel?: string | null;
  seriesId?: string | number | null;
  showGap?: boolean;
  readings: GraphSeriesReadings | undefined;
  totalTagCount: number;
  isOnOppositeSide: boolean;
}

export const convertSeriesTagForHighcharts = ({
  seriesLabel,
  seriesId,
  seriesColor,
  seriesUnit,
  seriesDashStyle = 'Solid',
  showGap,
  readings,
  totalTagCount,
  isOnOppositeSide,
}: ConvertSeriesTagForHighcharts) => {
  const seriesName = seriesLabel || '';
  const unitText = seriesUnit;
  const seriesNameForLegend = [seriesName, unitText].filter(Boolean).join(' ');

  const yAxisId = `yAxis-${seriesLabel}`;

  const legendSeries: Highcharts.SeriesOptionsType = {
    id: `legend-${seriesId}`,
    color: seriesColor,
    name: seriesNameForLegend,
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
      fillColor: seriesColor,

      itemStyle: {
        fontFamily: defaultFonts,
      },
    },
    yAxis: yAxisId,
  };

  const seriesCustomProperties = {
    unitAsText: unitText || '',
    // TODO: Use decimal places when we receive them from the API
    decimalPlaces: GRAPH_VALUE_ROUND_DECIMAL_PLACES,
  };

  const readingsLength = readings?.length || 0;
  const markerRadius = readingsLength <= 50 ? commonDataSeriesLineWidth : 0;

  const dataSeries: Highcharts.SeriesOptionsType = {
    id: `data-${seriesId}`,
    color: seriesColor,
    name: seriesName,
    dashStyle: seriesDashStyle,
    // Link this data series to the previous legend series
    linkedTo: ':previous',
    data: readings,
    type: 'line',
    // NOTE: Rate of Change Data Channels are displayed using steps. See docs
    // for rendering step lines:
    // https://api.highcharts.com/highcharts/plotOptions.line.step
    // step: tag.type === DataChannelType.RateOfChange ? 'right' : undefined,
    lineWidth: commonDataSeriesLineWidth,
    // Show a gap immediately when there's a break in the data (based on the
    // interval we're getting data for, eg: one per hour)
    // https://api.highcharts.com/highstock/6.0.5/plotOptions.series.gapSize
    // https://api.highcharts.com/highstock/6.0.5/plotOptions.series.gapUnit
    gapSize: showGap ? 1 : undefined,
    marker: {
      symbol: 'circle',
      // IMPORTANT NOTE: When the radius of markers is 0, the performance is
      // greatly improved since no points need to be rendered. As soon as the
      // marker is shown (radius !== 0) then the page could freeze/crash when
      // showing multiple charts with a large number of points (when using a
      // large date range). See enabled and enabledThreshold settings:
      // https://api.highcharts.com/highcharts/plotOptions.series.marker.enabled
      // https://api.highcharts.com/highcharts/plotOptions.series.marker.enabledThreshold
      radius: markerRadius,
      states: {
        hover: {
          radius: markerRadius,
        },
      },
    },
    // This provides the ability to pass anything we want to the series
    // object. It's used to access certain data channel properties in the
    // Highcharts tooltip formatter() function.
    // https://api.highcharts.com/highcharts/series.line.custom
    custom: seriesCustomProperties,
    showInLegend: false,
    yAxis: yAxisId,
  };

  const yAxis: Highcharts.YAxisOptions = {
    ...commonGridlineProps,
    ...commonAxisLineProps,
    // Hide yAxis grid lines
    gridLineColor: 'transparent',
    // Only show one grid line, even when graphing multiple data channels
    gridLineWidth: commonGridLineWidth,
    // Only add the y-axis line for the first axis. Otherwise each axis will
    // be separated with a vertical line which doesn't look great.
    // NOTE: Highcharts seems to order the y-axis differently (and it can't
    // seem to be controlled) so the y-axis line may appear incorrectly
    // when trying to add the line to the FIRST yAxis.
    lineWidth: totalTagCount > 1 ? 0 : commonAxisLineWidth,
    id: yAxisId,
    title: {
      text: seriesName,
      style: {
        // TODO: Change to a reusable variable
        color: '#d2d2d2',
        fontSize: '13px',
        fontWeight: '500',
        textTransform: 'uppercase',
        width: 200,
        fontFamily: 'Work Sans',
      },
    },
    opposite: isOnOppositeSide,
    // Potentially useful properties for the custom y-axis label solution
    // that was set up:
    // tickPixelInterval, tickAmount
    // https://api.highcharts.com/highcharts/yAxis.tickPixelInterval
    // https://api.highcharts.com/highcharts/yAxis.tickAmount
    labels: merge({}, commmonAxisLabelProps, {
      style: {
        // TODO: Change to a reusable variable
        color: '#d2d2d2',
        fontSize: '13px',
        fontWeight: '500',
        textTransform: 'uppercase',
        width: 200,
      },
    } as Highcharts.YAxisLabelsOptions),
  };

  return {
    legendSeries,
    dataSeries,
    yAxis,
  };
};

interface BuildOptionsProps {
  startDate?: moment.Moment;
  endDate?: moment.Moment;
  chartDataChannels: ChartTagBaseDto[];
  seriesTags?: GraphSeries[];
  tagReadingsMapping?: TagNameToTimeSeriesDataMapping;
  selectedBulkTankDataChannelIds?: string[];
  historicalReadingsMapping?: TagIdToHistoricalReadingsApiMapping;
  ianaTimezoneId?: string | null;
  height?: number;
  dataChannelIdToColorMapping: DataChannelIdToColorMapping;
  handleSetExtremes: Highcharts.AxisSetExtremesEventCallbackFunction;
}

export const buildOptions = ({
  startDate,
  endDate,
  seriesTags,
  chartDataChannels,
  tagReadingsMapping,
  selectedBulkTankDataChannelIds,
  historicalReadingsMapping,
  dataChannelIdToColorMapping,
  ianaTimezoneId,
  height = 550,
  handleSetExtremes,
}: BuildOptionsProps): Highcharts.Options => {
  const numberOfDataChannelsInLeftYAxis = chartDataChannels
    .map((dataChannel) => dataChannel.chartYAxisPosition)
    .filter(
      (cleanDataChannels) => cleanDataChannels === ChartYAxisPosition.Left
    ).length;

  let numberOfItemsLeftYAxisCount = numberOfDataChannelsInLeftYAxis;

  // Historical Bulk Tank Data Channel Readings
  const historicalBulkTankDataChannelsGraphData = selectedBulkTankDataChannelIds?.map(
    (dataChannelId, index, dataChannelIdsArray) => {
      numberOfItemsLeftYAxisCount += index;

      const timeSeriesInfo = historicalReadingsMapping?.[dataChannelId!];
      const readings = timeSeriesInfo?.api.data.readings?.map<[number, number]>(
        (reading) => [moment(reading.logTime).valueOf(), reading.value!]
      );

      const seriesColoursIndex =
        index % graphColours.bulkTankDataChannelSeriesColours.length;
      const seriesColor =
        graphColours.bulkTankDataChannelSeriesColours[seriesColoursIndex];
      const seriesUnit = timeSeriesInfo?.api.data.unitOfMeasureAsText;

      return convertSeriesTagForHighcharts({
        readings: readings || [],
        seriesColor,
        seriesUnit,
        seriesLabel: timeSeriesInfo?.description || '',
        seriesId: dataChannelId,
        seriesDashStyle: 'Dash',
        showGap: false,
        totalTagCount: dataChannelIdsArray.length,
        // NOTE: If numberOfItemsLeftYAxisCount is >= 4, place item on right side of yAxis
        // If the rightYAxis has 4 items, it will still be added to it
        isOnOppositeSide: numberOfItemsLeftYAxisCount >= 4,
      });
    }
  );

  // Tag-related graph data
  const chartDataChannelsGraphData = chartDataChannels?.map(
    (tag, index, tagsArray) => {
      const timeSeriesData = tagReadingsMapping?.[tag.description!];
      const readings = timeSeriesData?.data?.map<[number, number]>(
        (reading) => [moment(reading[0] as string).valueOf(), reading[1]]
      );

      const seriesColor = dataChannelIdToColorMapping?.[tag.tagId!];
      const seriesUnit = timeSeriesData?.units;

      return convertSeriesTagForHighcharts({
        readings: readings || [],
        seriesColor,
        seriesUnit,
        seriesLabel: tag.description,
        seriesId: tag.tagId,
        seriesDashStyle: 'Solid',
        showGap: true,
        totalTagCount: tagsArray.length,
        isOnOppositeSide: tag.chartYAxisPosition === ChartYAxisPosition.Right,
      });
    }
  );

  const dataChannelsGraphData = chartDataChannelsGraphData;

  // Combine Y Axes
  const bulkTankDataYAxes =
    historicalBulkTankDataChannelsGraphData?.map(
      (channelGraphData) => channelGraphData.yAxis
    ) || [];
  const tagGraphDataYAxes =
    dataChannelsGraphData?.map((channelGraphData) => channelGraphData.yAxis) ||
    [];
  const allYAxes = bulkTankDataYAxes.concat(tagGraphDataYAxes);

  // Combine series
  const bulkTankGraphSeries =
    historicalBulkTankDataChannelsGraphData
      ?.map((channelGraphData) => [
        channelGraphData.legendSeries,
        channelGraphData.dataSeries,
      ])
      .flat() || [];
  const tagGraphSeries =
    dataChannelsGraphData
      ?.map((channelGraphData) => [
        channelGraphData.legendSeries,
        channelGraphData.dataSeries,
      ])
      .flat() || [];

  const allGraphSeries = bulkTankGraphSeries.concat(tagGraphSeries);

  return {
    colors: graphColours.seriesColours,
    mapNavigation: {
      enableMouseWheelZoom: false,
    },
    rangeSelector: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    noData: {
      attr: {
        zIndex: 1,
      },
      style: {
        color: '#c5c5c5',
        fontSize: '20px',
      },
    },
    exporting: {
      enabled: false,
      allowHTML: true,
      sourceWidth: 1440,
      fallbackToExportServer: false,
    },
    chart: {
      className: 'freezer-chart',

      // Width of the inner chart/plot area border
      // https://api.highcharts.com/highcharts/chart.plotBorderColor
      plotBorderWidth: 1,
      plotBorderColor: '#717171',
      plotBackgroundColor: '#1d1d1d',
      // NOTE: Margin shouldn't be set since it's calculated dynamically based
      // on what chart elements are used (y-axes on both sides, legend, chart
      // title, etc.).
      // https://api.highcharts.com/highcharts/chart.margin
      // If additional spacing is needed, use highchart's spacing
      // properties:
      // https://api.highcharts.com/highcharts/chart.spacing
      panning: {
        enabled: false,
        type: 'x',
      },
      panKey: undefined,
      height,
      // BUG: There's a bug with highcharts where zooming always takes priority
      // over panning, even if `zoomKey` is set.
      // NOTE: When zoomType is set, the same value is used for pinchType,
      // which allows touch devices to zoom by pinching.
      // https://api.highcharts.com/highcharts/chart.zoomType
      // https://api.highcharts.com/highcharts/chart.pinchType
      zoomType: 'x',
      // zoomKey: 'alt',
      resetZoomButton: {
        theme: {
          style: {
            // Prevent highcharts from styling the button so we can style it
            // using our theme with styled-components
            color: undefined,
            fontWeight: undefined,
          },
        },
      },
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
      padding: 0,
      // backgroundColor: '#333333',
      enabled: true,

      // Show ALL series data at the current point in the tooltip
      shared: true,
      style: {
        color: 'white',
        fontFamily: defaultFonts,
      },
      // @ts-ignore
      formatter() {
        const date = formatModifiedDatetime(this.x, ianaTimezoneId);
        const dateHtml = `<div style="font-size: 12px; padding: 8px 16px;">${date}</div>`;
        const dividerHtml = `<div class="custom-tooltip-divider" style="margin-top: 0; margin-bottom: 8px;"></div>`;

        const pointsHtmlArray = this.points?.map((point) => {
          const { color, series } = point;
          const { name, userOptions } = series;

          const unitAsText = userOptions.custom?.unitAsText;
          const decimalPlaces =
            userOptions.custom?.decimalPlaces ||
            GRAPH_VALUE_ROUND_DECIMAL_PLACES;

          const legendColorCircle = `<span style="color:${color}">●</span>`;
          const formattedName = name.split('(')?.[0]?.trim();
          const nameHtml = `<span style="font-weight: 600;">${formattedName}</span>`;
          const valueForHtml = isNumber(point?.y)
            ? round(point.y!, decimalPlaces)
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

          return `<div style="font-size: 13px; padding: 0px 16px 8px 16px; border-radius: 10px;">${pointHtmlContent}</div>`;
        });

        const allPointsHtml = pointsHtmlArray?.join('');

        return allPointsHtml
          ? `${dateHtml}${dividerHtml}${allPointsHtml}`
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
    series: allGraphSeries,
    plotOptions: {
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
      ...commonXAxisGridLineProps,

      // Limit the min and max of the xAxis. Without this, highcharts will
      // automatically try to fit all points on the full width of the chart.
      min: startDate?.valueOf(),
      max: endDate?.valueOf(),

      // TODO: maybe change colour into a variable name since its used >1 times
      gridLineColor: '#717171',
      lineColor: '#717171',
      gridLineWidth: commonGridLineWidth,
      // When there are multiple data channels graphed, the first y-axis labels
      // could appear on top of the first x-axis label. We only show the first
      // x-axis label when there are 2 or less graphed data channels.
      showFirstLabel: seriesTags && seriesTags.length <= 2,
      lineWidth: commonAxisLineWidth,
      // The minimum range on the x-axis is 1 hour regardless of the data
      // channel that's graphed. Without this setting, a series with a few
      // points will prevent zooming in at zoom levels like 4 days.
      // https://api.highcharts.com/highcharts/xAxis.minRange
      minRange: 1000 * 60 * 60 * 1,

      // Show a crosshair when hovering over the chart. This is also used with
      // the tooltip functionality
      crosshair: true,
      type: 'datetime',
      tickLength: 0,
      // Prevent x-axis labels from appearing on two lines since we increased
      // the font-size. This happened with the "12 weeks" zoom level where
      // "Oct" would appear on one line and "12" would appear on the next line.
      tickPixelInterval: 120,
      labels: commmonAxisLabelProps,
      dateTimeLabelFormats: {
        day: '%b %e',
      },

      // Now line
      // plotLines: [
      //   {
      //     value: moment().valueOf(),
      //     color: graphColours.nowPlotLine,
      //     width: 2,
      //     zIndex: 1,
      //     label: {
      //       text: 'Now',
      //       useHTML: true,
      //       verticalAlign: 'top',
      //       textAlign: 'center',
      //       align: 'center',
      //       x: -10,
      //       y: -13,
      //       rotation: undefined,
      //       style: {
      //         backgroundColor: graphColours.nowPlotLine,
      //         fontFamily: defaultFonts,
      //         fontSize: '13px',
      //         fontWeight: '600',
      //         padding: '5px 7px',
      //         // @ts-ignore
      //         borderRadius: '2px',
      //         color: 'white',
      //         textTransform: 'uppercase',
      //       },
      //     },
      //   },
      // ],

      events: {
        setExtremes: handleSetExtremes,
      },
    },
    // We provide a default Y axis if there aren't any since Highcharts
    // requires a y-axis if there's at least one series displayed.
    // Otherwise Highcharts will crash with this error:
    // https://www.highcharts.com/errors/18/
    yAxis: allYAxes?.length ? allYAxes : [defaultYAxis],
  };
};
