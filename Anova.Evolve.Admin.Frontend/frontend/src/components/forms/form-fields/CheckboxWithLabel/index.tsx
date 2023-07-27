import React from 'react';
import { FieldProps } from 'formik';
import { fieldToCheckbox, CheckboxProps } from 'formik-material-ui';
import FormControlLabel, {
  FormControlLabelProps as MuiFormControlLabelProps,
} from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import StyledCheckbox from 'components/forms/styled-fields/Checkbox';
import styled from 'styled-components';

const StyledFormControlLabel = styled(({ withTopMargin, ...props }) => (
  <FormControlLabel {...props} />
))`
  & .MuiFormControlLabel-label {
    font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  }
  ${(props) =>
    props.withTopMargin &&
    `
    margin-top: 26px;
  `}
`;

/**
 * Exclude props that are passed directly to the control
 * https://github.com/mui-org/material-ui/blob/v3.1.1/packages/material-ui/src/FormControlLabel/FormControlLabel.js#L71
 */
export interface CheckboxWithLabelProps extends FieldProps, CheckboxProps {
  // Add a top margin to the label to align it beside a text field
  withTopMargin?: boolean;
  Label: Omit<
    MuiFormControlLabelProps,
    'checked' | 'name' | 'onChange' | 'value' | 'control'
  >;
}

const CheckboxWithLabel = ({
  Label,
  withTopMargin,
  ...props
}: CheckboxWithLabelProps) => {
  const { field, form } = props;
  const errorMessage = form.errors[field.name];

  return (
    <>
      <StyledFormControlLabel
        className="styled-form-control-label"
        control={
          <StyledCheckbox
            {...fieldToCheckbox(props)}
            // `formik-material-ui` didn't seem to set the checked prop, so it's
            // added here manually.
            // NOTE: This may be because the <Field> using this component isn't
            // passing type="checkbox"
            checked={field.value}
          />
        }
        withTopMargin={withTopMargin}
        {...Label}
      />
      {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
    </>
  );
};

export default CheckboxWithLabel;
