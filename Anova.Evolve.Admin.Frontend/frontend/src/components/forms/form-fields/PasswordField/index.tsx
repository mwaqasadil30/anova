import CustomTextField, {
  Props as CustomTextFieldProps,
} from 'components/forms/form-fields/CustomTextField';
import StyledPasswordField from 'components/forms/styled-fields/StyledPasswordField';
import React from 'react';

const PasswordField = (props: CustomTextFieldProps) => {
  return (
    <CustomTextField {...props} TextFieldComponent={StyledPasswordField} />
  );
};

export default PasswordField;
