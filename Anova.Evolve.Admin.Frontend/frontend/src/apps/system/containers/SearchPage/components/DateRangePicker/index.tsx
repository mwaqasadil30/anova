import Box from '@material-ui/core/Box';
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
  && .MuiInputBase-root {
    max-width: 150px;
    border-color: transparent;
    border-radius: 0;
  }
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
    <Box display="inline-block">
      <Grid container spacing={0}>
        <Grid item>
          <StyledDatePicker
            id="startDate-input"
            value={startDate}
            onChange={(date) => {
              if (date) setStartDate?.(date?.toDate()!);
            }}
            label="Start Date"
            disableFuture
            disableTimeOfDay
            disabled={isFetching}
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
            disableTimeOfDay
            disabled={isFetching}
            minDate={startDate ? moment(startDate) : undefined}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
export default DateRangePicker;
