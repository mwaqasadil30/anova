import Grid from '@material-ui/core/Grid';
import DateTimePicker from 'components/forms/styled-fields/StyledDateTimePicker';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';

type DateRangePickerProps = {
  isFetching?: boolean;
  startDate?: Date;
  startTime?: Date;
  setStartDate?: React.Dispatch<React.SetStateAction<Date>>;
  endDate?: Date;
  endTime?: Date;
  setEndDate?: React.Dispatch<React.SetStateAction<Date>>;
};

/* eslint-disable indent */
const StyledDatePicker = styled(DateTimePicker)`
  && .MuiInput-root {
    background-color: ${(props) =>
      props.theme.palette.type === 'light' ? '#F0F0F0' : '#333333'};
  }
`;
/* eslint-enable indent */

const DateRangePicker = ({
  isFetching,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: DateRangePickerProps) => {
  return (
    <Grid container spacing={1}>
      <Grid item>
        <StyledDatePicker
          id="startDate-input"
          value={startDate}
          onChange={(date) => {
            if (date) setStartDate?.(date?.toDate()!);
          }}
          label="Start Date"
          disableFuture
          disabled={isFetching}
          // Prevent a bug where selecting a start date without an end date
          // would throw an error. The same applies to the end date
          maxDate={endDate ? moment(endDate) : undefined}
        />
      </Grid>
      <Grid item>
        <StyledDatePicker
          id="endDate-input"
          value={endDate}
          onChange={(date) => {
            if (date) setEndDate?.(date?.toDate()!);
          }}
          label="End Date"
          disableFuture
          disabled={isFetching}
          // Prevent a bug where selecting a start date without an end date
          // would throw an error. The same applies to the end date
          minDate={startDate ? moment(startDate) : undefined}
        />
      </Grid>
    </Grid>
  );
};
export default DateRangePicker;
