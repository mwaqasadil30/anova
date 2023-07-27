import React, { useMemo } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { TextFieldProps } from '@material-ui/core/TextField';
import { Field } from 'formik';
import { useTranslation } from 'react-i18next';
import { fadedTextColor } from 'styles/colours';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import { getCopy, Option, TranslationText } from '../constants';

export default function FormSelect({
  options,
  fieldName,
  ...textFieldProps
}: {
  options: Option[];
  fieldName: string;
} & TextFieldProps) {
  const { t } = useTranslation();
  const copy: TranslationText = useMemo(() => getCopy(t), [t]);
  return (
    <Field
      id={`${fieldName}-input`}
      component={CustomTextField}
      select
      name={fieldName}
      {...textFieldProps}
    >
      {options.map((option) => (
        <MenuItem
          key={`${option.fieldName}-${option.displayName}`}
          value={option.fieldName}
        >
          {copy[option.displayName] || option.displayName || copy.NONE}
        </MenuItem>
      ))}
    </Field>
  );
}

export function Select({
  options,
  ...textFieldProps
}: {
  options: Option[];
} & TextFieldProps) {
  return (
    <StyledTextField
      select
      {...textFieldProps}
      SelectProps={{ displayEmpty: true }}
      style={{ textTransform: 'none' }}
    >
      {options.map((option) => {
        const value = option.fieldName || '';
        return (
          <MenuItem key={option.fieldName} value={value}>
            <span style={{ color: value ? 'inherit' : fadedTextColor }}>
              {option.displayName}
            </span>
          </MenuItem>
        );
      })}
    </StyledTextField>
  );
}
