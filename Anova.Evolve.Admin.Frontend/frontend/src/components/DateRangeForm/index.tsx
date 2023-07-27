/* eslint-disable indent */
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from 'components/Button';
import StyledKeyboardDatePickerLegacy from 'components/forms/styled-fields/StyledKeyboardDatePickerLegacy';
import StyledTimeField from 'components/forms/styled-fields/StyledTimeField';
import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const StyledKeyboardTimePicker = styled(StyledTimeField)`
  width: 110px;
  && .MuiInput-root {
    height: 40px;
    background-color: ${(props) =>
      props.theme.palette.type === 'light' ? '#F0F0F0' : '#333333'};
  }
  & .MuiInputBase-input {
    text-align: center;
  }
`;

const StyledDatePicker = styled(StyledKeyboardDatePickerLegacy)`
  && .MuiInput-root {
    background-color: ${(props) =>
      props.theme.palette.type === 'light' ? '#F0F0F0' : '#333333'};
  }
`;

const StyledFieldLabel = styled(Typography)`
  line-height: 2.5;
`;

interface Props {
  isFetching?: boolean;
  initialStartDate: moment.Moment;
  initialEndDate: moment.Moment;
  onSubmit: (startDatetime: moment.Moment, endDatetime: moment.Moment) => void;
  isAssetDetailGraph?: boolean;
}

const DateRangeForm = ({
  isFetching,
  initialStartDate,
  initialEndDate,
  isAssetDetailGraph,
  onSubmit,
}: Props) => {
  const { t } = useTranslation();

  const [startDate, setStartDate] = useState<moment.Moment | null | undefined>(
    initialStartDate
  );
  const [endDate, setEndDate] = useState<moment.Moment | null | undefined>(
    initialEndDate
  );
  const [startTime, setStartTime] = useState<moment.Moment | null | undefined>(
    initialStartDate
  );
  const [endTime, setEndTime] = useState<moment.Moment | null | undefined>(
    initialEndDate
  );

  const isStartTimeValid = startTime && moment(startTime).isValid();
  const isEndTimeValid = endTime && moment(endTime).isValid();
  const isStartDateValid = startDate && moment(startDate).isValid();
  const isEndDateValid = endDate && moment(endDate).isValid();
  const startDateTime =
    startDate && startTime
      ? moment(startDate)
          .set('hour', startTime.hour())
          .set('minute', startTime.minute())
          .set('seconds', 0)
          .set('milliseconds', 0)
      : null;
  const endDateTime =
    endDate && endTime
      ? moment(endDate)
          .set('hour', endTime.hour())
          .set('minute', endTime.minute())
          .set('seconds', 0)
          .set('milliseconds', 0)
      : null;
  const isDateRangeValid =
    isStartTimeValid &&
    isEndTimeValid &&
    isStartDateValid &&
    isEndDateValid &&
    startDateTime?.isBefore(endDateTime);

  const handleSubmit = () => {
    if (
      isStartDateValid &&
      isEndDateValid &&
      isStartTimeValid &&
      isEndTimeValid &&
      startTime &&
      endTime
    ) {
      const formattedStartDateTime = moment(startDate)
        .set('hour', startTime.hour())
        .set('minute', startTime.minute())
        .set('seconds', 0)
        .set('milliseconds', 0);
      const formattedEndDateTime = moment(endDate)
        .set('hour', endTime.hour())
        .set('minute', endTime.minute())
        .set('seconds', 0)
        .set('milliseconds', 0);

      onSubmit(formattedStartDateTime, formattedEndDateTime);
    }
  };

  return (
    <Grid container spacing={2} alignItems="flex-start">
      <Grid item xs={12} sm="auto">
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item>
            <StyledFieldLabel>{t('ui.common.from', 'From')}</StyledFieldLabel>
          </Grid>
          <Grid item>
            <StyledDatePicker
              id="startDate-input"
              KeyboardButtonProps={{
                'aria-label': 'change start date',
              }}
              PopoverProps={{ id: 'start date popover' }}
              value={startDate}
              onChange={setStartDate}
              disabled={isFetching}
              disableFuture
              // Prevent a bug where selecting a start date without an end date
              // would throw an error. The same applies to the end date
              maxDate={endDate || undefined}
            />
          </Grid>
          <Grid item>
            <StyledKeyboardTimePicker
              value={startTime}
              onChange={setStartTime}
              disabled={isFetching}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm="auto">
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item>
            <StyledFieldLabel>{t('ui.common.to', 'To')}</StyledFieldLabel>
          </Grid>
          <Grid item>
            <StyledDatePicker
              id="endDate-input"
              KeyboardButtonProps={{ 'aria-label': 'change end date' }}
              PopoverProps={{ id: 'end date popover' }}
              value={endDate}
              onChange={setEndDate}
              disabled={isFetching}
              disableFuture={!isAssetDetailGraph}
              minDate={startDate || undefined}
            />
          </Grid>
          <Grid item>
            <StyledKeyboardTimePicker
              value={endTime}
              onChange={setEndTime}
              disabled={isFetching}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} md="auto">
        <Button
          variant="outlined"
          disabled={isFetching || !isDateRangeValid}
          onClick={handleSubmit}
          fullWidth
        >
          {t('ui.common.apply', 'Apply')}
        </Button>
      </Grid>
    </Grid>
  );
};

export default DateRangeForm;
