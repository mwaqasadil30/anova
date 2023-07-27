import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import CircularProgress from 'components/CircularProgress';
import CustomBox from 'components/CustomBox';
import MessageBlock from 'components/MessageBlock';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useEventsChartData } from '../../hooks/useEventsChartData';
import { Layout } from './Layout';
import NoDataFound from '../NoDataFound';

type Datum = { date: Date } & Record<string, number>;

const CONSISTENT_DATE_FORMAT = 'YYYY-MM-DD';

export default () => {
  const { t } = useTranslation();
  const { events, isLoading, error } = useEventsChartData();

  const eventsMapping = events.reduce(
    (prev, current) => ({
      ...prev,
      [current.eventName!]: current,
    }),
    {}
  );

  const eventsTotalsMapping = events.reduce((prev, current) => {
    // @ts-ignore
    prev[current.eventName] =
      // @ts-ignore
      (prev[current.eventName] || 0) + current.eventTotal;
    return prev;
  }, {});

  const aMonthAgo = moment().subtract(30, 'days');
  const past30Days = Array(30)
    .fill(0)
    .map((_, index) => moment(aMonthAgo).add(index + 1, 'days'));

  // @ts-ignore
  const formattedDataMapping: Datum[] = events.reduce((prev, current) => {
    const startOfDay = moment(current.eventDate).startOf('day');
    const isoDateKey = startOfDay.format(CONSISTENT_DATE_FORMAT);

    const zeroInitializerValues = Object.keys(eventsMapping).reduce(
      (initializerMapping, eventName) => ({
        ...initializerMapping,
        // @ts-ignore
        [eventName]: prev[isoDateKey!]?.[eventName] || 0,
      }),
      {}
    );

    return {
      ...prev,
      [isoDateKey!]: {
        // @ts-ignore
        ...prev[isoDateKey!],
        ...zeroInitializerValues,
        [current.eventName!]: current.eventTotal,
        date: startOfDay.toDate(),
      },
    };
  }, {});

  const formattedAndPaddedDataMapping = past30Days.map((day) => {
    const startOfDay = moment(day).startOf('day');
    const dateFormatForCurrentDay = startOfDay.format(CONSISTENT_DATE_FORMAT);

    // @ts-ignore
    const formattedValues = formattedDataMapping[dateFormatForCurrentDay];
    if (formattedValues) {
      return formattedValues;
    }

    const zeroInitializerValues = Object.keys(eventsMapping).reduce(
      (initializerMapping, eventName) => ({
        ...initializerMapping,
        date: startOfDay.toDate(),
        // @ts-ignore
        [eventName]: 0,
      }),
      {}
    );

    return zeroInitializerValues;
  });

  const formattedData = Object.values(formattedAndPaddedDataMapping);

  return (
    <div>
      <Fade in={isLoading} unmountOnExit>
        <div>
          {isLoading && (
            <CustomBox px={3} pt={2} pb={3} display="flex" alignItems="center">
              <MessageBlock width="100%">
                <CircularProgress />
              </MessageBlock>
            </CustomBox>
          )}
        </div>
      </Fade>
      <Fade in={!isLoading && !error} unmountOnExit>
        <div>
          {!isLoading &&
            !error &&
            (events.length ? (
              <Layout
                data={formattedData}
                eventsMapping={eventsMapping}
                eventsTotalsMapping={eventsTotalsMapping}
              />
            ) : (
              <CustomBox
                p={3}
                textAlign="center"
                height="135px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <NoDataFound />
              </CustomBox>
            ))}
        </div>
      </Fade>
      <Fade in={!!error} unmountOnExit>
        <div>
          {error && (
            <CustomBox
              p={3}
              textAlign="center"
              height="135px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography color="error">
                {t('ui.common.retrieveDataError', 'Unable to retrieve data')}
              </Typography>
            </CustomBox>
          )}
        </div>
      </Fade>
    </div>
  );
};
