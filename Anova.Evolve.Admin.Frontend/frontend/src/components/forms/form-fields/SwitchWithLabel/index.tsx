import StyledSwitchWithLabel from 'components/forms/styled-fields/StyledSwitchWithLabel';
import { FieldProps, getIn } from 'formik';
import { fieldToCheckbox, SwitchProps } from 'formik-material-ui';
import React from 'react';

export interface CustomSwitchWithLabelProps extends SwitchProps, FieldProps {
  label?: React.ReactNode;
  onLabel?: React.ReactNode;
  offLabel?: React.ReactNode;
}

const SwitchWithLabel = (props: CustomSwitchWithLabelProps) => {
  const { field, form } = props;
  const errorMessage = getIn(form.errors, field.name);

  return (
    <StyledSwitchWithLabel
      {...fieldToCheckbox(props)}
      checked={field.value}
      errorMessage={errorMessage}
    />
  );
};

export default SwitchWithLabel;
