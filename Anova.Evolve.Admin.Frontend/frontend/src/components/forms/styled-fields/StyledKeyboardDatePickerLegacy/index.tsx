import { TextFieldProps } from '@material-ui/core/TextField';
import {
  KeyboardDatePicker,
  KeyboardDatePickerProps,
} from '@material-ui/pickers';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import React from 'react';

const StyledDatePickerTextField = (textFieldProps: TextFieldProps) => (
  <StyledTextField
    {...textFieldProps}
    InputProps={{ style: { height: 40 }, ...textFieldProps.InputProps }}
  />
);

const StyledKeyboardDatePickerLegacy = ({
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

export default StyledKeyboardDatePickerLegacy;
