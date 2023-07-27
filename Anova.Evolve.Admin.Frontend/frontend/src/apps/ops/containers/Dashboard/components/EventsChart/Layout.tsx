// external dependencies
import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { EvolveHistoricalActiveEvent } from 'api/admin/api';
import styled from 'styled-components';

// local dependencies
import CustomBox from 'components/CustomBox';
import maxBy from 'lodash/maxBy';
import { Chart, Datum as EventsChartDatum } from './Chart';
import { Legend } from './Legend';
import { getColor } from './Event';

// XXX: "md" here does NOT refer to the theme breakpoint value.
const ChartContainer = styled(Grid)`
  ${(props) => props.theme.breakpoints.down('md')} {
    flex-direction: column-reverse;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    flex-direction: row;
  }
`;
const LegendBox = styled(CustomBox)`
  padding: 1em;
  ${(props) => props.theme.breakpoints.down('md')} {
    border-bottom: 0;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    border-left: 0;
  }
`;

type EventsLayoutProps = {
  data: EventsChartDatum[];
  eventsMapping: Record<string, EvolveHistoricalActiveEvent>;
  eventsTotalsMapping: Record<string, number>;
};

export const Layout = ({
  data,
  eventsMapping,
  eventsTotalsMapping,
}: EventsLayoutProps) => {
  const [activeEvents, setActiveEvents] = useState(
    // enable all Events by default
    Object.keys(eventsMapping).reduce(
      (obj, evt) => ({ ...obj, [evt]: true }),
      {} as Record<string, boolean>
    )
  );

  const eventColorMapping = Object.entries(eventsMapping)
    .map(([eventName, eventDetails], index) => ({
      eventName,
      color: getColor(eventDetails, index),
    }))
    .reduce(
      (prev, current) => ({
        ...prev,
        [current.eventName]: current.color,
      }),
      {}
    );

  const toggleEvent = (eventName: string) =>
    setActiveEvents({
      ...activeEvents,
      [eventName]: !activeEvents[eventName],
    });

  const latestDatum = maxBy(data, (datum) => datum.date);

  return (
    <ChartContainer container>
      {/* 
        // @ts-ignore */}
      <Grid
        item
        xs={12}
        lg={9}
        component={CustomBox}
        alignItems="center"
        display="flex"
      >
        <Chart
          activeEvents={activeEvents}
          eventsMapping={eventsMapping}
          eventColorMapping={eventColorMapping}
          data={data}
        />
      </Grid>
      <Grid item xs={12} lg={3} component={LegendBox}>
        <Legend
          activeEvents={activeEvents}
          toggleEvent={toggleEvent}
          latestDay={latestDatum}
          eventsMapping={eventsMapping}
          eventColorMapping={eventColorMapping}
          eventsTotalsMapping={eventsTotalsMapping}
        />
      </Grid>
    </ChartContainer>
  );
};
