/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import DateRangeForm from 'apps/freezers/components/DateRangeForm';
import DateRangePickerWithOptions from 'apps/freezers/components/DateRangePickerWithOptions';
import PageHeader from 'components/PageHeader';
import moment from 'moment';
import React from 'react';

interface Props {
  headerNavButton?: React.ReactNode;
  siteName?: string | null;
  startDate: moment.Moment;
  endDate: moment.Moment;
  isFetching: boolean;
  onDateRangeSubmit: (
    startDatetime: moment.Moment,
    endDatetime: moment.Moment
  ) => void;
}

const PageIntro = ({
  headerNavButton,
  siteName,
  startDate,
  endDate,
  isFetching,
  onDateRangeSubmit,
}: Props) => {
  return (
    <Grid container spacing={2} alignItems="center" justify="space-between">
      <Grid item>
        <Grid container alignItems="center" spacing={1}>
          {headerNavButton && <Grid item>{headerNavButton}</Grid>}
          <Grid item>
            <PageHeader dense>{siteName}</PageHeader>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <DateRangePickerWithOptions
          isFetching={isFetching}
          startDate={startDate}
          endDate={endDate}
          onSubmit={onDateRangeSubmit}
          customRangeComponent={
            <Box p={4}>
              <DateRangeForm
                isFetching={isFetching}
                initialStartDate={startDate}
                initialEndDate={endDate}
                onSubmit={onDateRangeSubmit}
              />
            </Box>
          }
        />
      </Grid>
    </Grid>
  );
};

export default PageIntro;
