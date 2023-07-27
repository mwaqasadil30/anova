import TextField, {
  TextFieldProps as MuiTextFieldProps,
} from '@material-ui/core/TextField';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import { FieldProps } from 'formik';
import React from 'react';
import { fieldToTextField } from 'utils/forms/field-to-input-field';
import { renderHelperText } from 'utils/forms/renderers';

// Override the default formik-material-ui TextFieldProps to keep the `error`
// prop. This way, we can control when a field should be in the error state
// (with a red border) without relying on Formik field error state.
interface TextFieldProps
  extends FieldProps,
    Omit<MuiTextFieldProps, 'name' | 'value'> {}

export interface Props extends TextFieldProps {
  TextFieldComponent?: typeof TextField;
}

const CustomTextField = ({
  TextFieldComponent = StyledTextField, // customize styling if needed
  ...props
}: Props) => {
  const { select, SelectProps, error, helperText } = props;
  const isMultiSelect = select && SelectProps?.multiple;

  const mappedProps = fieldToTextField(props);

  // Allow passing the `error` prop to manually set the field's error state.
  // Without this, the error state is entirely controlled via formik.
  const hasError = error || mappedProps.error;

  // Allow passing the `helperText` prop to hide error messages so they can be
  // shown elsewhere
  const shownHelperText =
    helperText !== undefined ? helperText : mappedProps.helperText;

  return (
    <TextFieldComponent
      {...mappedProps}
      error={hasError}
      // Fix the following material-ui specific error:
      // Uncaught Error: Material-UI: the `value` prop must be an array when using the `Select` component with `multiple`.
      {...(isMultiSelect && !mappedProps.value && { value: [] })}
      helperText={renderHelperText(shownHelperText)}
    />
  );
};

export default CustomTextField;
