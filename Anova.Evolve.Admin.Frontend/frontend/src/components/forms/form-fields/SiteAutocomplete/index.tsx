/* eslint-disable indent */
import {
  AutocompleteInputChangeReason,
  AutocompleteProps,
  RenderInputParams,
} from '@material-ui/lab/Autocomplete';
import {
  EvolveRetrieveSiteInfoRecordsByAutoCompleteOptionsRequest,
  EvolveRetrieveSiteInfoRecordsByAutoCompleteOptionsResponse,
  SiteInfoRecord,
  UserPermissionType,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import StyledAutocomplete from 'components/forms/styled-fields/StyledAutocomplete';
import StyledAutocompleteCircularProgress from 'components/forms/styled-fields/StyledAutocompleteCircularProgress';
import StyledAutocompleteTextField from 'components/forms/styled-fields/StyledAutocompleteTextField';
import { FieldAttributes, getIn } from 'formik';
import { fieldToTextField } from 'utils/forms/field-to-input-field';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect } from 'react';
import { renderHelperText } from 'utils/forms/renderers';
import { useSelector } from 'react-redux';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import { AccessType } from 'types';
import { useUpdateEffect } from 'react-use';

const getInitialInputValue = (
  initialInputValue: string,
  initialValue?: SiteInfoRecord
): string => {
  const formattedInitialInputValue = initialInputValue || '';
  if (!initialValue) {
    return formattedInitialInputValue;
  }

  const siteInfo = [
    initialValue.customerName,
    initialValue.city,
    initialValue.state,
  ]
    .filter(Boolean)
    .join(' ');
  return siteInfo || formattedInitialInputValue;
};

// TODO: Try to type and use the Autocomplete props properly
interface Props<T = any> extends AutocompleteProps<T>, FieldAttributes<any> {
  textFieldProps?: any;
  options: any[];
  domainId?: string;
  userId?: string;
  selectedOption?: any | null;
  initialValue?: SiteInfoRecord | null;
  initialInputValue?: string | null;
  onChange?: (selectedOption: SiteInfoRecord, newValue: string) => void;
}

function SiteAutocomplete({
  textFieldProps,
  domainId,
  userId,
  selectedOption,
  initialValue,
  initialInputValue,
  onChange,
  ...props
}: any) {
  const hasPermission = useSelector(selectHasPermission);
  const canReadSite = hasPermission(
    UserPermissionType.SiteGlobal,
    AccessType.Read
  );

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

  const [isFetching, setIsFetching] = React.useState(false);
  const [value, setValue] = React.useState<SiteInfoRecord | null>(
    initialValue || null
  );
  const [inputValue, setInputValue] = React.useState(() =>
    getInitialInputValue(initialInputValue, initialValue)
  );
  const [options, setOptions] = React.useState<Array<SiteInfoRecord>>([]);

  const makeRequest = React.useMemo(
    () =>
      debounce(
        (
          request: { input: string },
          callback: (
            response?: EvolveRetrieveSiteInfoRecordsByAutoCompleteOptionsResponse['retrieveSiteInfoRecordsByAutoCompleteOptionsResult']
          ) => void
        ) => {
          setIsFetching(true);
          AdminApiService.GeneralService.retrieveSiteInfoRecordsByAutoCompleteOptions_RetrieveSiteInfoRecordsByAutoCompleteOptions(
            {
              options: {
                userId,
                domainId,
                prefixText: request.input,
                resultCount: 50, // Maximum number of results to return
              },
            } as EvolveRetrieveSiteInfoRecordsByAutoCompleteOptionsRequest
          )
            .then((response) => {
              callback(
                response.retrieveSiteInfoRecordsByAutoCompleteOptionsResult
              );
            })
            .catch((responseError) => {
              console.error('SiteAutocomplete response error', responseError);
            })
            .finally(() => {
              setIsFetching(false);
            });
        },
        200
      ),
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    []
  );

  const handleRequest = useCallback(
    (isActive: boolean) => (results?: SiteInfoRecord[] | null) => {
      if (isActive) {
        let newOptions: SiteInfoRecord[] = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    },
    []
  );

  // If a value is selected in an external component (like when creating/editing
  // a Site in a side-drawer), update it here
  useEffect(() => {
    const cleanedValue = selectedOption?.siteId || '';

    // NOTE: Prevent the form from being marked as invalid initially if no
    // initial value is provided
    if (cleanedValue) {
      setValue(selectedOption);
      const newInputValue = getInitialInputValue('', selectedOption);
      setInputValue(newInputValue);
      setFieldValue(name, cleanedValue);
    }
  }, [selectedOption]);

  // When the formik field value isn't set (eg: the form was just reset),
  // reset all autocomplete values. Note that useUpdateEffect is used here
  // since we don't want to execute this hook when the component initially
  // mounts
  useUpdateEffect(() => {
    if (!field.value) {
      setValue(null);
      setInputValue('');
    }
  }, [field.value]);

  useEffect(() => {
    let active = true;

    // Uncomment if no options should be initially fetched
    // TODO: Do we need to fetch the details of the selected site?
    // if (inputValue === '') {
    //   setOptions(value ? [value] : []);
    //   return undefined;
    // }
    if (canReadSite) {
      makeRequest(
        // @ts-ignore
        { input: inputValue },
        handleRequest(active)
      );
    }

    return () => {
      active = false;
    };
  }, [value, inputValue, makeRequest, selectedOption, canReadSite]);

  return (
    // @ts-ignore
    <StyledAutocomplete
      {...props}
      getOptionLabel={(option: any) =>
        typeof option === 'string'
          ? option
          : [option.customerName, option.city, option.state]
              .filter(Boolean)
              .join(' ')
      }
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      inputValue={inputValue}
      disableClearable={disabled}
      // TODO: Use onFocus to call makeRequest?
      // onFocus={() => {
      //   makeRequest({ input: '' }, handleRequest(true));
      // }}
      onChange={(event: any, newValue: SiteInfoRecord | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        // IMPORTANT NOTE: When setting the formik field value do not use a
        // field value of undefined. Otherwise it prevents validation errors
        // from showing up on the field since formik is unable to mark the
        // field as touched.
        setFieldValue(name, newValue?.siteId || '');

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
        // The form may need access to the value that was changed
        onChange?.(newValue, newValue?.siteId);
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
        return (
          <span>
            {option.customerName} {option.city} {option.state}
          </span>
        );
      }}
    />
  );
}

export default SiteAutocomplete;
