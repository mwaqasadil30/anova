import { TextFieldProps } from '@material-ui/core/TextField';
import StyledDateTimePicker from 'components/forms/styled-fields/StyledDateTimePicker';
import { FieldProps } from 'formik';
import React from 'react';
import { fieldToTextField } from 'utils/forms/field-to-input-field';

export interface DateTimePickerProps
  extends FieldProps,
    Omit<TextFieldProps, 'variant' | 'onError' | 'value'> {}

const DateTimePicker = (props: DateTimePickerProps) => {
  const { field, form } = props;

  const mappedProps = fieldToTextField(props);

  return (
    <StyledDateTimePicker
      {...mappedProps}
      value={field.value}
      onChange={(newDate) => {
        form.setFieldValue(field.name, newDate);
      }}
      handleClose={() => {
        form.setFieldTouched(field.name, true);
      }}
    />
  );
};

export default DateTimePicker;
