import StyledKeyboardDatePicker from 'components/forms/styled-fields/StyledKeyboardDatePicker';
import {
  fieldToKeyboardDatePicker,
  KeyboardDatePickerProps,
} from 'formik-material-ui-pickers';
import React from 'react';

const KeyboardDatePicker = (props: KeyboardDatePickerProps) => {
  const fieldProps = fieldToKeyboardDatePicker(props);
  return <StyledKeyboardDatePicker {...fieldProps} />;
};

export default KeyboardDatePicker;
