import Grid from '@material-ui/core/Grid';
import { TextFieldProps } from '@material-ui/core/TextField';
import {
  KeyboardDatePicker,
  KeyboardDatePickerProps,
} from '@material-ui/pickers';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import FieldLabel from 'components/forms/labels/FieldLabel';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';

const StyledDatePickerTextField = (textFieldProps: TextFieldProps) => (
  <StyledTextField
    {...textFieldProps}
    InputProps={{ ...textFieldProps.InputProps }}
  />
);

const StyledKeyboardDatePicker = ({
  KeyboardButtonProps,
  PopoverProps,
  ...props
}: KeyboardDatePickerProps) => (
  <KeyboardDatePicker
    disableToolbar
    format="MM/DD/YYYY"
    margin="none"
    variant="inline"
    TextFieldComponent={StyledDatePickerTextField}
    KeyboardButtonProps={{
      'aria-label': 'change date',
      style: {
        padding: 4,
      },
      ...KeyboardButtonProps,
    }}
    leftArrowButtonProps={{
      'aria-label': 'Previous month',
    }}
    rightArrowButtonProps={{
      'aria-label': 'Next month',
    }}
    PopoverProps={{
      ...PopoverProps,
      PaperProps: {
        ...PopoverProps?.PaperProps,
        style: { padding: '8px 8px 16px' },
      },
    }}
    style={{ width: 170 }}
    {...props}
  />
);

interface Props {
  startDate: moment.Moment | null;
  endDate: moment.Moment | null;
  handleChangeStartDate: (newDate: moment.Moment | null) => void;
  handleChangeEndDate: (newDate: moment.Moment | null) => void;
}

const FilterForm = ({
  startDate,
  endDate,
  handleChangeStartDate,
  handleChangeEndDate,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid item>
        <FieldLabel>{t('ui.common.daterange', 'Date Range')}</FieldLabel>
      </Grid>
      <Grid item>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <StyledKeyboardDatePicker
              id="startDate-input"
              KeyboardButtonProps={{ 'aria-label': 'change start date' }}
              PopoverProps={{ id: 'start date popover' }}
              value={startDate}
              onChange={handleChangeStartDate}
            />
          </Grid>
          <Grid item>
            <FieldLabel>{t('ui.common.to', 'To')}</FieldLabel>
          </Grid>
          <Grid item>
            <StyledKeyboardDatePicker
              id="endDate-input"
              KeyboardButtonProps={{ 'aria-label': 'change end date' }}
              PopoverProps={{ id: 'end date popover' }}
              value={endDate}
              onChange={handleChangeEndDate}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FilterForm;
