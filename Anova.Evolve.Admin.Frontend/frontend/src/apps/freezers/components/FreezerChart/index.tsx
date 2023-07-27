/* eslint-disable indent */
import { ChartTagBaseDto, FreezerTimeSeriesModel } from 'api/admin/api';
import { useGetFreezerTimeSeriesForDataChannels } from 'apps/freezers/hooks/useGetFreezerTimeSeriesForDataChannels';
import {
  DataChannelIdToColorMapping,
  TagIdToHistoricalReadingsApiMapping,
} from 'apps/freezers/types';
import CircularProgress from 'components/CircularProgress';
import DarkFadeOverlay from 'components/DarkFadeOverlay';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsBrokenAxis from 'highcharts/modules/broken-axis';
import highchartsNoDataToDisplay from 'highcharts/modules/no-data-to-display';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentIanaTimezoneId } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import { defaultHighchartsStyles } from 'styles/highcharts';
import { buildOptions } from './helpers';

const StyledWrapper = styled.div`
  ${defaultHighchartsStyles};

  /*
  Override the spacing between each long dash to match designs. Note that the
  graph would need to use xAxis.minorGridLineDashStyle:
  https://api.highcharts.com/highcharts/xAxis.minorGridLineDashStyle
*/
  .highcharts-minor-grid-line {
    stroke-dasharray: 8, 6;
  }
`;

const StyledCircularProgress = styled(CircularProgress)`
  position: absolute;
  top: calc(50% - 20px);
  left: calc(50% - 20px);
`;

// IMPORTANT NOTE: Initialize the broken-axis module for highcharts so we can
// show gaps in the graph which is a requirement for this graph! Otherwise,
// highcharts will automatically link gaps with a line!
highchartsBrokenAxis(Highcharts);

// Allow showing a "No data available" message on highcharts
highchartsNoDataToDisplay(Highcharts);

// This prototype change seems to enable showing the tooltip for values outside
// the graph when hovering over the graph. Note that `tooltip.outside` should
// be set to `false`, otherwise if there are values that are extremely outside
// the graph area, the tooltip can appear way too far away from the graph.
// https://stackoverflow.com/a/39276436/7752479
// @ts-ignore
Highcharts.Series.prototype.directTouch = true;

interface ZoomedRange {
  min: number;
  max: number;
}

interface Props {
  historicalReadingsMapping?: TagIdToHistoricalReadingsApiMapping;
  selectedBulkTankDataChannelIds?: string[];
  freezerId?: string; // Required to fetch more readings when zooming in
  chartDataChannels?: ChartTagBaseDto[] | null | undefined;
  startDate?: moment.Moment;
  endDate?: moment.Moment;
  height?: number;
  tagNameToTimeSeriesDataMapping?: Record<string, FreezerTimeSeriesModel>;
  dataChannelIdToColorMapping: DataChannelIdToColorMapping;
}

const FreezerChart = (props: Props) => {
  const {
    historicalReadingsMapping,
    selectedBulkTankDataChannelIds,
    freezerId,
    startDate,
    endDate,
    chartDataChannels,
    height,
    tagNameToTimeSeriesDataMapping,
    dataChannelIdToColorMapping,
  } = props;
  const ianaTimezoneId = useSelector(selectCurrentIanaTimezoneId);

  const chartRef = useRef<{ chart: Highcharts.Chart }>(null);

  const [zoomedRange, setZoomedRange] = useState<ZoomedRange>();
  const [chartOptions, setChartOptions] = useState({
    title: { text: '' },
    credits: {
      enabled: false,
    },
    chart: {
      backgroundColor: 'transparent',
    },
  } as Highcharts.Options);

  // We only fetch a more detailed timeseries under certain conditions (ex: the
  // range is less than 4 hours)
  const zoomedStartDate = zoomedRange ? moment(zoomedRange.min) : undefined;
  const zoomedEndDate = zoomedRange ? moment(zoomedRange.max) : undefined;
  const shouldUseDateRange =
    zoomedStartDate &&
    zoomedEndDate &&
    zoomedEndDate.diff(zoomedStartDate, 'hours') <= 4;
  const detailedStartDate = shouldUseDateRange
    ? moment(zoomedStartDate).subtract(2, 'hours')
    : undefined;
  const detailedEndDate = shouldUseDateRange
    ? moment(zoomedEndDate).add(2, 'hours')
    : undefined;

  const {
    meanApi,
    sumApi,
    tagNameToTimeSeriesDataMapping: detailedTagNameToTimeSeriesDataMapping,
  } = useGetFreezerTimeSeriesForDataChannels({
    freezerId,
    // If the startDate/endDate is undefined, the API won't be called
    startDate: detailedStartDate?.toDate(),
    endDate: detailedEndDate?.toDate(),
    dataChannels: chartDataChannels,
    numberOfBuckets: detailedEndDate?.diff(detailedStartDate, 'minutes'),
  });

  const handleSetExtremes: Highcharts.AxisSetExtremesEventCallbackFunction = useCallback(
    (event) => {
      if (event.trigger === 'zoom') {
        if (!event.min || !event.max) {
          // The user zoomed out completely
          setZoomedRange(undefined);
        } else if (moment(event.max).diff(moment(event.min), 'minutes') <= 15) {
          // The user zoomed in too close, prevent zooming in. NOTE: Highcharts
          // may shift the y-axis event when event.preventDefault() is called.
          // Prevent default will however prevent the x-axis from shifting.
          event.preventDefault();
        } else {
          // The user zoomed in a valid amount, adjust the zoomed range (which
          // will trigger an API call).
          setZoomedRange({
            min: event.min,
            max: event.max,
          });
        }
      }
    },
    []
  );

  useEffect(() => {
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

    // Clear existing xAxis. Highcharts was adding a new
    // xAxis.events.setExtremes callback everytime the chart options were
    // changed. This may have been fixed via this GitHub issue + PR (which
    // hasn't been released at the time this comment was made):
    // https://github.com/highcharts/highcharts/issues/6538
    // https://github.com/highcharts/highcharts/pull/15801
    chartRef.current?.chart.xAxis.forEach((xAxis) => {
      // @ts-ignore
      xAxis.remove();
    });

    const newChartOptions = buildOptions({
      // Use the zoomed range's data, only if we're zoomed in, otherwise,
      // fallback to the default, un-zoomed data
      startDate: shouldUseDateRange ? zoomedStartDate : startDate,
      endDate: shouldUseDateRange ? zoomedEndDate : endDate,
      tagReadingsMapping: shouldUseDateRange
        ? detailedTagNameToTimeSeriesDataMapping
        : tagNameToTimeSeriesDataMapping,
      selectedBulkTankDataChannelIds,
      historicalReadingsMapping,
      dataChannelIdToColorMapping,
      chartDataChannels: chartDataChannels || [],
      ianaTimezoneId,
      height,
      handleSetExtremes,
    });
    setChartOptions(newChartOptions);
    // IMPORTANT NOTE: This manual chart.update call seems to resolve issues
    // where stale chart elements (like y-axis plotlines) would remain even
    // though they were explicitly removed from the graph (via new options
    // created via buildOptions and even via Highchart's direct API like
    // yAxis.removePlotLine()). Another issue fixed by this is the legend
    // disppearing and re-appearing when switching between data channels. Note
    // that using chart.update may have also required using the `id` property
    // on things like the legend, series, and yAxis.
    chartRef.current?.chart.update(newChartOptions);
  }, [
    ianaTimezoneId,
    chartDataChannels,
    detailedTagNameToTimeSeriesDataMapping,
    tagNameToTimeSeriesDataMapping,
    historicalReadingsMapping,
    dataChannelIdToColorMapping,
  ]);

  // Adjust the highcharts chart to fit within the change in size (mainly
  // width) when printing
  const mediaListener = useCallback((event: MediaQueryListEvent) => {
    if (event.media === 'print') {
      chartRef.current?.chart.reflow();
    }
  }, []);
  useEffect(() => {
    const mediaQueryList = window.matchMedia('print');
    mediaQueryList.addEventListener('change', mediaListener);

    return () => mediaQueryList.removeEventListener('change', mediaListener);
  }, []);

  return (
    <StyledWrapper>
      <DarkFadeOverlay
        darken={meanApi.isFetching || sumApi.isFetching}
        darkOpacity={0.3}
        preventClicking
      >
        <HighchartsReact
          // @ts-ignore
          ref={chartRef}
          highcharts={Highcharts}
          options={chartOptions}
        />
        {(meanApi.isFetching || sumApi.isFetching) && (
          <StyledCircularProgress />
        )}
      </DarkFadeOverlay>
    </StyledWrapper>
  );
};

export default FreezerChart;
