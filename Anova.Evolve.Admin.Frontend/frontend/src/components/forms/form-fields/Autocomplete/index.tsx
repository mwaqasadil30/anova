/* eslint-disable indent */
import { TextFieldProps as MuiTextFieldProps } from '@material-ui/core/TextField';
import {
  AutocompleteInputChangeReason,
  AutocompleteProps,
  RenderInputParams,
} from '@material-ui/lab/Autocomplete';
import StyledAutocomplete from 'components/forms/styled-fields/StyledAutocomplete';
import StyledAutocompleteTextField from 'components/forms/styled-fields/StyledAutocompleteTextField';
import { FieldAttributes, getIn } from 'formik';
import { fieldToTextField } from 'utils/forms/field-to-input-field';
import React, { useEffect } from 'react';
import { renderHelperText } from 'utils/forms/renderers';

interface Props<T> extends AutocompleteProps<T>, FieldAttributes<any> {
  textFieldProps?: MuiTextFieldProps;
  options: T[];
  selectedOption?: T | null;
  initialInputValue?: string | null;
  getOptionLabel: (option: T) => string;
  getSelectedValue: (option: T | null) => any;
  isValueSelected: (option: T | null, currentValue: unknown) => any;
  getFormFieldValue?: (option: T | null) => any;
}

function Autocomplete<T>({
  textFieldProps,
  initialInputValue,
  options = [],
  getOptionLabel,
  getSelectedValue,
  isValueSelected,
  getFormFieldValue,
  ...props
}: Props<T>) {
  // Formik props
  // ================================================
  const {
    form: { setFieldTouched, setFieldValue, status = {}, setStatus },
  } = props;
  // @ts-ignore
  const { error, helperText, disabled, ...field } = fieldToTextField(props);
  const { name } = field;
  const statusError = getIn(status.errors, name!);
  // ================================================

  const initialValue = options?.find((option: T) =>
    isValueSelected(option, field.value)
  );
  const [value, setValue] = React.useState<any | null>(initialValue);
  const [inputValue, setInputValue] = React.useState(initialInputValue || '');

  // When the formik field value isn't set (eg: the form was just reset),
  // reset all autocomplete values
  useEffect(() => {
    if (!field.value) {
      setValue(null);
      setInputValue('');
    }
  }, [field.value]);

  return (
    <StyledAutocomplete
      autoHighlight
      {...props}
      getOptionLabel={getOptionLabel}
      options={options}
      autoComplete
      includeInputInList
      // @ts-ignore
      value={value}
      inputValue={inputValue}
      onChange={(event: any, newValue: T | null) => {
        setValue(newValue);

        const selectedValue = getFormFieldValue
          ? getFormFieldValue(newValue)
          : getSelectedValue(newValue);
        setFieldValue(name, selectedValue);

        // Clear server-side validation errors
        if (statusError) {
          setStatus({
            ...status,
            errors: {
              ...status.errors,
              [field.name!]: undefined,
            },
          });
        }
      }}
      onInputChange={(
        event: React.ChangeEvent<{}>,
        newInputValue: string,
        reason: AutocompleteInputChangeReason
      ) => {
        // Somehow the Material UI input resets to '' when it first renders
        // https://github.com/mui-org/material-ui/issues/19423#issuecomment-639659875
        if (
          reason === 'input' ||
          // BUG: When an initial input value is provided, the clear button
          // doesn't show up.
          reason === 'clear' ||
          (reason === 'reset' && newInputValue)
        ) {
          setInputValue(newInputValue);
        }
      }}
      onBlur={() => setFieldTouched(name, true)}
      renderInput={(inputProps: RenderInputParams) => (
        <StyledAutocompleteTextField
          {...inputProps}
          {...textFieldProps}
          helperText={renderHelperText(helperText)}
          error={error}
          disabled={disabled}
          fullWidth
        />
      )}
      // NOTE: Can also render JSX here
      renderOption={(option: T) => getOptionLabel(option)}
    />
  );
}

export default Autocomplete;
