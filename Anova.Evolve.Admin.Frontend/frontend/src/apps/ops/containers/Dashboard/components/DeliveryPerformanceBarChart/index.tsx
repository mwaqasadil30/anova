import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import styled from 'styled-components';
import {
  darkIconColor,
  defaultTextColor,
  lightBorderColor,
  boxBorderColor,
} from 'styles/colours';
import { axisStyle } from 'apps/ops/containers/Dashboard/common';
import Metric from './Metric';
import renderLegend from './renderLegend';
import { HookData } from '../../hooks/useDeliveriesChartData';

const StyledChevronIconButton = styled(IconButton)`
  color: ${darkIconColor};
`;
const StyledMonth = styled(Typography)`
  font-size: 17px;
  font-weight: 500;
  color: ${defaultTextColor};
`;

const CONSISTENT_DATE_FORMAT = 'YYYY-MM-DD';

// fixme: this is a bit brittle
enum DeliveryValue {
  Total = 'total',
  OnTime = 'onTime',
  Early = 'early',
  Late = 'late',
}

interface Props {
  selectedDate: moment.Moment;
  setSelectedDate: (date: moment.Moment) => void;
  deliveryApi: HookData;
}

const DeliveryPerformanceBarChart = ({
  selectedDate,
  setSelectedDate,
  deliveryApi,
}: Props) => {
  const { t } = useTranslation();

  const { deliveries, isLoading, error } = deliveryApi;

  const chartData: Record<string, any> = deliveries.reduce((prev, delivery) => {
    // Exclude `date` since we'll be using a consistent date format to avoid
    // confusion with timezones
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const { date, ...etc } = delivery;

    const formattedDate = moment.utc(date).format(CONSISTENT_DATE_FORMAT);
    // @ts-ignore
    prev[formattedDate] = {
      ...etc,
      name: formattedDate,
    };
    return prev;
  }, {});

  const startOfMonth = moment(selectedDate).startOf('month');
  const daysInMonth = moment(selectedDate).daysInMonth();
  const formattedAndPaddedData = Array(daysInMonth)
    .fill(0)
    .map((_, index) => {
      const currentDate = moment(startOfMonth).add(index, 'days');
      const formattedDate = currentDate.format(CONSISTENT_DATE_FORMAT);

      const matchingData = chartData[formattedDate];
      return matchingData || { name: formattedDate };
    });

  const [displayedValues, setDisplayedValues] = useState({
    [DeliveryValue.Total]: undefined,
    [DeliveryValue.OnTime]: true,
    [DeliveryValue.Early]: true,
    [DeliveryValue.Late]: true,
  });

  const formatXAxis = (tickItem: any) => {
    return moment(tickItem).format('D');
  };

  const handleToggleDisplayedValue = (deliveryValue: DeliveryValue) => (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = !!evt.target?.checked;
    setDisplayedValues((prevValues) => ({
      ...prevValues,
      [deliveryValue]: isChecked,
    }));
  };

  const deliveryCounts = deliveries.reduce(
    (prev, current) => {
      prev[DeliveryValue.Total] +=
        current.onTime + current.early + current.late;
      prev[DeliveryValue.OnTime] += current.onTime;
      prev[DeliveryValue.Early] += current.early;
      prev[DeliveryValue.Late] += current.late;
      return prev;
    },
    {
      [DeliveryValue.Total]: 0,
      [DeliveryValue.OnTime]: 0,
      [DeliveryValue.Early]: 0,
      [DeliveryValue.Late]: 0,
    }
  );

  const onTimeColor = '#4CA02F';
  const earlyColor = '#FF9100';
  const lateColor = '#D93521';

  const renderedDeliveryValues = [
    {
      label: t('ui.assetdashboard.totalDeliveries', 'Total Deliveries'),
      value: DeliveryValue.Total,
    },
    {
      label: t('ui.assetdashboard.onTime', 'On Time'),
      color: onTimeColor,
      value: DeliveryValue.OnTime,
    },
    {
      label: t('ui.assetdashboard.early', 'Early'),
      color: earlyColor,
      value: DeliveryValue.Early,
    },
    {
      label: t('ui.assetdashboard.late', 'Late'),
      color: lateColor,
      value: DeliveryValue.Late,
    },
  ];

  const canViewPreviousMonth = moment()
    .subtract(3, 'months')
    .isBefore(moment(selectedDate).startOf('month'));
  const canViewNextMonth = moment().isAfter(
    moment(selectedDate).endOf('month')
  );

  return (
    <>
      <Box px={2} py={1} borderBottom={`1px solid ${lightBorderColor}`}>
        <Grid container spacing={1} alignItems="center" justify="space-between">
          <Grid item>
            <StyledChevronIconButton
              size="small"
              disabled={!canViewPreviousMonth || isLoading}
              onClick={() =>
                setSelectedDate(moment(selectedDate).subtract(1, 'month'))
              }
            >
              <ChevronLeftIcon />
            </StyledChevronIconButton>
          </Grid>
          <Grid item>
            <StyledMonth>{selectedDate.format('MMMM')}</StyledMonth>
          </Grid>
          <Grid item>
            <StyledChevronIconButton
              size="small"
              disabled={!canViewNextMonth || isLoading}
              onClick={() =>
                setSelectedDate(moment(selectedDate).add(1, 'month'))
              }
            >
              <ChevronRightIcon />
            </StyledChevronIconButton>
          </Grid>
        </Grid>
      </Box>
      <Box pt={2} pb={1} borderBottom={`1px solid ${lightBorderColor}`}>
        <Grid
          container
          spacing={1}
          alignItems="stretch"
          justify="space-between"
        >
          {renderedDeliveryValues.map((deliveryData, index) => {
            const isLast = index === renderedDeliveryValues.length - 1;
            return (
              <Grid item xs={3} key={deliveryData.label}>
                <Box
                  textAlign="center"
                  height="100%"
                  {...(!isLast && {
                    borderRight: `1px solid ${lightBorderColor}`,
                  })}
                >
                  <Metric
                    color={deliveryData.color}
                    label={deliveryData.label}
                    count={error ? '-' : deliveryCounts[deliveryData.value]}
                    isGraphed={displayedValues[deliveryData.value]}
                    setGraphedState={handleToggleDisplayedValue(
                      deliveryData.value
                    )}
                  />
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
      <Box px={3} pt={2} pb={3}>
        <ResponsiveContainer width="100%" height={350}>
          {error ? (
            <Box
              textAlign="center"
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography color="error">
                {t('ui.common.retrieveDataError', 'Unable to retrieve data')}
              </Typography>
            </Box>
          ) : (
            <BarChart
              data={formattedAndPaddedData}
              margin={{
                top: 20,
                right: 50,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="10 0"
                stroke="rgba(242, 242, 242, 0.7)"
                verticalFill={['rgba(242, 242, 242, 0.4)', 'transparent']}
                horizontal={false} // Show/hide the horizontal lines across the y-axis
                // vertical={false} // Show/hide the vertical lines across the x-axis
              />
              <XAxis
                dataKey="name"
                tickFormatter={formatXAxis}
                tickMargin={8}
                tickSize={0} // Hide the tick line
                interval={1} // Show ticks like [1, 3, 5, 7, ...]
                // @ts-ignore
                style={axisStyle}
                stroke={boxBorderColor}
              />
              <YAxis
                tickMargin={8}
                tickSize={0} // Hide the tick line
                // @ts-ignore
                style={axisStyle}
                stroke={boxBorderColor}
              >
                <Label
                  value="Total Deliveries"
                  position="insideLeft"
                  angle={-90}
                  style={{
                    textAnchor: 'middle',
                    fontFamily: 'Work Sans',
                    fontWeight: 500,
                    fontSize: 12,
                    color: defaultTextColor,
                    textTransform: 'uppercase',
                  }}
                />
              </YAxis>
              <Tooltip />
              <Legend content={renderLegend} />
              <Bar
                dataKey="late"
                // @ts-ignore
                name={t('ui.assetdashboard.late', 'Late')}
                stackId="a"
                fill={lateColor}
                hide={!displayedValues[DeliveryValue.Late]}
              />
              <Bar
                dataKey="early"
                // @ts-ignore
                name={t('ui.assetdashboard.early', 'Early')}
                stackId="a"
                fill={earlyColor}
                hide={!displayedValues[DeliveryValue.Early]}
              />
              <Bar
                dataKey="onTime"
                // @ts-ignore
                name={t('ui.assetdashboard.onTime', 'On Time')}
                stackId="a"
                fill={onTimeColor}
                hide={!displayedValues[DeliveryValue.OnTime]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </Box>
    </>
  );
};

export default DeliveryPerformanceBarChart;
