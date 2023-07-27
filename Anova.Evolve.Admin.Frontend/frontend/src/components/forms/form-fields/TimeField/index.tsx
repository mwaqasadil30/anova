import React from 'react';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import {
  KeyboardTimePicker,
  KeyboardTimePickerProps,
} from 'formik-material-ui-pickers';
import { useTranslation } from 'react-i18next';

const TimeField = (props: KeyboardTimePickerProps) => {
  const { t } = useTranslation();

  return (
    <KeyboardTimePicker
      ampm={false}
      TextFieldComponent={StyledTextField}
      invalidDateMessage={t(
        'validate.timeField.invalidFormat',
        'Invalid Time Format'
      )}
      KeyboardButtonProps={{
        disabled: true,
        style: { display: 'none' },
      }}
      {...props}
    />
  );
};

export default TimeField;
