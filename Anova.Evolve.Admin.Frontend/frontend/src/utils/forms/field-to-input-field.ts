import { TextFieldProps as MuiTextFieldProps } from '@material-ui/core/TextField';
import { getIn } from 'formik';
import {
  fieldToTextField as formikFieldToTextField,
  TextFieldProps,
} from 'formik-material-ui';

interface FieldToTextFieldProps extends TextFieldProps {
  // Return true if the onChange callback should be blocked. Otherwise, allow
  // the onChange callback to run normally. This prop is used to prevent
  // changing the field value. Useful in cases where you want to provide the
  // user with a confirmation dialog before confirming changing the value.
  onChangeBlocking?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => boolean;
}

/**
 * Helper to enhance formik-material-ui's fieldToTextField to also handle
 * back-end errors.
 */
export const fieldToTextField = (props: FieldToTextFieldProps) => {
  const { onChangeBlocking, ...nonCustomProps } = props;
  const mappedProps = formikFieldToTextField(nonCustomProps);
  const {
    form: { errors, touched, status = {}, setStatus },
    field,
    helperText,
  } = nonCustomProps;
  const statusError = getIn(status.errors, field.name);
  const fieldError = getIn(errors, field.name) || statusError;
  const showError = getIn(touched, field.name) && !!fieldError;

  const fieldHelperText = showError ? fieldError : helperText;

  const textFieldProps: MuiTextFieldProps = {
    ...mappedProps,
    // There's an issue with formik where setting back-end errors via
    // `formik.setErrors` shows the errors on all the affected fields, but
    // blurring ANY field on the form will clear all the errors.
    // At the moment we're using setStatus to keep track of back-end errors
    // so they persist even after blurring fields.
    // https://github.com/formium/formik/issues/150
    error: showError,
    helperText: fieldHelperText,
    // NOTE: If we want to clear the back-end error after blurring/changing,
    // then we can include this block which will clear the error after
    // blurring/changing the field
    onChange: (evt) => {
      const shouldBlockOnChange = onChangeBlocking?.(evt);
      if (shouldBlockOnChange) {
        return;
      }

      field.onChange(evt);

      // NOTE: May need to handle the status change outside manually if the
      // change is prevented via onChangeBlocking
      if (statusError) {
        setStatus({
          ...status,
          errors: {
            ...status.errors,
            [field.name]: undefined,
          },
        });
      }
    },
    onBlur: (event) => {
      mappedProps.onBlur?.(event);
      props.onBlur?.(event);
    },
  };

  return textFieldProps;
};
