// external dependencies
import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Label,
  CartesianGrid,
} from 'recharts';

// local dependencies
import { axisStyle } from 'apps/ops/containers/Dashboard/common';
import { boxBorderColor, defaultTextColor } from 'styles/colours';

import { EvolveHistoricalActiveEvent } from 'api/admin/api';

export type Datum = { date: Date } & Record<string, number>;

type EventsChartProps = {
  data: Datum[];
  activeEvents: Record<string, boolean>;
  eventsMapping: Record<string, EvolveHistoricalActiveEvent>;
  eventColorMapping: Record<string, string>;
};

// XXX: recharts does not allow us to wrap the <Line> component;
//      it must be a direct descendant of <LineChart>.

export const Chart = ({
  data,
  activeEvents,
  eventsMapping,
  eventColorMapping,
}: EventsChartProps) => {
  const { t } = useTranslation();
  const rechartData = data.map((datum) => ({
    name: moment(datum.date).format('MMM D'),
    ...datum,
  }));

  // styling values
  const chartMargins = { top: 50, right: 50, bottom: 30, left: 30 };
  const strokeWidth = 2;
  const chartHeight = 350;

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <LineChart data={rechartData} margin={chartMargins}>
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={false} // Show/hide the horizontal lines across the y-axis
        />
        <XAxis
          dataKey="name"
          tickMargin={8}
          tickSize={0} // Hide the tick line
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
            value={t('ui.dashboard.eventsChartTotalEvents', 'Total Events')!}
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
        {Object.keys(eventsMapping)
          .filter((eventName) => activeEvents[eventName])
          .map((eventName) => {
            return (
              <Line
                key={eventName}
                dataKey={eventName}
                stroke={eventColorMapping[eventName]}
                strokeWidth={strokeWidth}
                dot={false}
              />
            );
          })}
      </LineChart>
    </ResponsiveContainer>
  );
};
