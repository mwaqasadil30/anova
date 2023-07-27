/**
 * An autocomplete that allows free-form text (freeSolo according to
 * material-ui) with no async API calls.
 */
import { AutocompleteProps } from '@material-ui/lab/Autocomplete';
import StyledAutocomplete from 'components/forms/styled-fields/StyledAutocomplete';
import StyledAutocompleteTextField from 'components/forms/styled-fields/StyledAutocompleteTextField';
import { FieldAttributes } from 'formik';
import { fieldToTextField } from 'formik-material-ui';
import React from 'react';

// TODO: Try to type and use the Autocomplete props properly
interface Props<T = any> extends AutocompleteProps<T>, FieldAttributes<any> {
  textFieldProps?: any;
  options: any[];
}

function FreeSoloAutocomplete({ options, textFieldProps, ...props }: any) {
  // Formik props
  // ================================================
  const {
    form: { setFieldTouched, setFieldValue },
  } = props;
  // @ts-ignore
  const { error, helperText, ...field } = fieldToTextField(props);
  const { name, value: inputValue } = field;
  // ================================================

  const [value, setValue] = React.useState<string | null>(
    inputValue as string | null
  );
  const uniqueOptions = new Set(options);

  return (
    // @ts-ignore
    <StyledAutocomplete
      {...props}
      freeSolo
      forcePopupIcon
      autoHighlight
      selectOnFocus
      getOptionLabel={(option: any) =>
        typeof option === 'string' ? option : option.text
      }
      options={Array.from(uniqueOptions)}
      autoComplete
      includeInputInList
      value={value}
      inputValue={inputValue}
      onChange={(event: any, newValue: string | null) => {
        const formattedValue = newValue || '';
        setValue(formattedValue);
        setFieldValue(name, formattedValue);
      }}
      onInputChange={(event: any, newInputValue: any) =>
        setFieldValue(name, newInputValue)
      }
      onBlur={() => setFieldTouched(name, true)}
      renderInput={(inputProps: any) => (
        <StyledAutocompleteTextField
          {...inputProps}
          {...textFieldProps}
          helperText={helperText}
          error={error}
          style={{ marginRight: 16 }}
        />
      )}
      renderOption={(option: any) => {
        return <span>{option}</span>;
      }}
    />
  );
}

export default FreeSoloAutocomplete;
