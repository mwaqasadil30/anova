import { AutocompleteProps } from '@material-ui/lab/Autocomplete';
import {
  EvolveRetrieveSiteLocationInfoAutoCompleteListByOptionsRequest,
  SiteLocationInfoAutoCompleteListType,
  SiteLocationInfoFilterItem,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import StyledAutocomplete from 'components/forms/styled-fields/StyledAutocomplete';
import StyledAutocompleteCircularProgress from 'components/forms/styled-fields/StyledAutocompleteCircularProgress';
import StyledAutocompleteTextField from 'components/forms/styled-fields/StyledAutocompleteTextField';
import { FieldAttributes } from 'formik';
import { fieldToTextField } from 'formik-material-ui';
import debounce from 'lodash/debounce';
import React from 'react';
import { renderHelperText } from 'utils/forms/renderers';

// TODO: Try to type and use the Autocomplete props properly
interface Props<T = any> extends AutocompleteProps<T>, FieldAttributes<any> {
  textFieldProps?: any;
  options: any[];
  searchType: SiteLocationInfoAutoCompleteListType;
  searchCountry?: string | null;
  searchState?: string | null;
}

function AsyncAutocomplete({
  textFieldProps,
  searchType,
  searchCountry,
  searchState,
  ...props
}: any) {
  // Formik props
  // ================================================
  const {
    form: { setFieldTouched, setFieldValue },
  } = props;
  // @ts-ignore
  const { error, helperText, disabled, ...field } = fieldToTextField(props);
  const { name, value: inputValue } = field;
  // ================================================

  const [isFetching, setIsFetching] = React.useState(false);
  const [value, setValue] = React.useState<string | null>(
    inputValue as string | null
  );
  // const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<Array<string>>([]);

  const makeRequest = React.useMemo(
    () =>
      debounce(
        (request: { input: string }, callback: (response?: any) => void) => {
          setIsFetching(true);
          AdminApiService.GeneralService.retrieveSiteLocationInfoAutoCompleteListByOptions_RetrieveSiteLocationInfoAutoCompleteListByOptions(
            {
              options: {
                // See SiteLocationInfoAutoCompleteOptions Type
                searchType,
                prefixText: request.input,
                ...(searchCountry && { country: searchCountry }),
                ...(searchState && { state: searchState }),
              },
            } as EvolveRetrieveSiteLocationInfoAutoCompleteListByOptionsRequest
          )
            .then((response) => {
              callback(
                response.retrieveSiteLocationInfoAutoCompleteListByOptionsResult
              );
            })
            .catch((responseError) => {
              console.error('AsyncAutocomplete error', responseError);
            })
            .finally(() => {
              setIsFetching(false);
            });
        },
        200
      ),
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [searchCountry, searchState]
  );

  React.useEffect(() => {
    let active = true;

    // Uncomment if no options should be initially fetched
    // TODO: A combination of this, and `makeRequest` in this useEffect's
    // dependencies will cause the country dropdown to make an API request on
    // each keypress for the state + city fields.
    // if (inputValue === '') {
    //   setOptions(value ? [value] : []);
    //   return undefined;
    // }

    makeRequest(
      // @ts-ignore
      { input: inputValue },
      (results?: SiteLocationInfoFilterItem[]) => {
        if (active) {
          let newOptions: string[] = [];

          if (value) {
            newOptions = [value];
          }

          if (results) {
            // @ts-ignore
            newOptions = [
              ...newOptions,
              ...results.map((result) => result.text).filter(Boolean),
            ];
          }

          setOptions(newOptions);
        }
      }
    );

    return () => {
      active = false;
    };
  }, [value, inputValue, makeRequest]);

  const uniqueOptions = new Set(options);

  return (
    <StyledAutocomplete
      {...props}
      getOptionLabel={(option: any) =>
        typeof option === 'string' ? option : option.text
      }
      // TODO: The Autocomplete's `filterSelectedOptions` prop is supposed to
      // exclude the selected value from the dropdown, but it doesn't prolly
      // b/c of the way we use value/inputValue
      options={Array.from(uniqueOptions)}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      inputValue={inputValue}
      // TODO: Use onFocus to call makeRequest?
      // onFocus={() => {
      //   console.warn('focused');
      // }}
      onChange={(event: any, newValue: string | null) => {
        const formattedValue = newValue || '';
        setOptions(formattedValue ? [formattedValue, ...options] : options);
        setValue(formattedValue);
        setFieldValue(name, formattedValue);
      }}
      onInputChange={(event, newInputValue) =>
        setFieldValue(name, newInputValue)
      }
      onBlur={() => setFieldTouched(name, true)}
      renderInput={(inputProps) => (
        <StyledAutocompleteTextField
          {...inputProps}
          {...textFieldProps}
          helperText={renderHelperText(helperText)}
          error={error}
          disabled={disabled}
          fullWidth
          InputProps={{
            ...inputProps.InputProps,
            endAdornment: (
              <>
                {isFetching && <StyledAutocompleteCircularProgress />}
                {inputProps?.InputProps?.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(option: any) => {
        return <span>{option}</span>;
      }}
    />
  );
}

export default AsyncAutocomplete;
