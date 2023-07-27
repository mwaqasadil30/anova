import { TextFieldProps } from '@material-ui/core/TextField';
import {
  KeyboardDatePicker,
  KeyboardDatePickerProps,
} from '@material-ui/pickers';
import { ReactComponent as CalendarIcon } from 'assets/icons/calendar.svg';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import React from 'react';
import styled from 'styled-components';

const StyledCalendarIcon = styled(CalendarIcon)`
  width: 18px;
  height: 18px;
`;

const StyledDatePickerTextField = (textFieldProps: TextFieldProps) => (
  <StyledTextField
    {...textFieldProps}
    InputProps={{ style: { height: 48 }, ...textFieldProps.InputProps }}
  />
);

const StyledKeyboardDatePicker = ({
  KeyboardButtonProps,
  PopoverProps,
  ...props
}: KeyboardDatePickerProps) => {
  return (
    <KeyboardDatePicker
      disableToolbar
      format="MM/DD/YYYY"
      margin="none"
      variant="inline"
      TextFieldComponent={StyledDatePickerTextField}
      keyboardIcon={<StyledCalendarIcon />}
      KeyboardButtonProps={{
        'aria-label': 'change date',
        style: {
          padding: 10,
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
      {...props}
    />
  );
};

export default StyledKeyboardDatePicker;
