import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import DateRangeForm from 'apps/freezers/components/DateRangeForm';
import DateRangePickerWithOptions from 'apps/freezers/components/DateRangePickerWithOptions';
import DownloadPDFButton from 'components/DownloadPDFButton';
import PageHeader from 'components/PageHeader';
import React from 'react';

interface Props {
  headerNavButton?: React.ReactNode;
  freezerName?: string | null;
  startDate: moment.Moment;
  endDate: moment.Moment;
  isFetching: boolean;
  exportPDF: () => void;
  onDateRangeSubmit: (
    startDatetime: moment.Moment,
    endDatetime: moment.Moment
  ) => void;
}

const PageIntro = ({
  headerNavButton,
  freezerName,
  startDate,
  endDate,
  isFetching,
  exportPDF,
  onDateRangeSubmit,
}: Props) => {
  return (
    <Grid container spacing={2} alignItems="center" justify="space-between">
      <Grid item>
        <Grid container alignItems="center" spacing={1}>
          {headerNavButton && (
            <Grid item className="no-print">
              {headerNavButton}
            </Grid>
          )}
          <Grid item>
            <PageHeader dense>{freezerName}</PageHeader>
          </Grid>
        </Grid>
      </Grid>
      <Grid item className="no-print">
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <DownloadPDFButton disabled={isFetching} onClick={exportPDF} />
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
      </Grid>
    </Grid>
  );
};

export default PageIntro;
