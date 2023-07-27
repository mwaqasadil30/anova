import {
  AutocompleteInputChangeReason,
  AutocompleteProps,
  RenderInputParams,
} from '@material-ui/lab/Autocomplete';
import {
  EvolveRetrieveHeliumISOContainerRtuListByPrefixRequest,
  EvolveRetrieveHeliumISOContainerRtuListByPrefixResponse,
  EvolveRtuDeviceInfo,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import StyledAutocomplete from 'components/forms/styled-fields/StyledAutocomplete';
import StyledAutocompleteCircularProgress from 'components/forms/styled-fields/StyledAutocompleteCircularProgress';
import StyledAutocompleteTextField from 'components/forms/styled-fields/StyledAutocompleteTextField';
import { FieldAttributes, getIn } from 'formik';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect } from 'react';
import { fieldToTextField } from 'utils/forms/field-to-input-field';
import { renderHelperText } from 'utils/forms/renderers';

// TODO: Try to type and use the Autocomplete props properly
interface Props<T = any> extends AutocompleteProps<T>, FieldAttributes<any> {
  textFieldProps?: any;
  options: any[];
  domainId?: string;
  selectedOption?: any | null;
  initialInputValue?: string | null;
  onChange?: (selectedOption: any, newValue: any) => void;
}

function RTUAutoCompleteHeliumISOContainer({
  textFieldProps,
  domainId,
  selectedOption,
  initialInputValue,
  onChange,
  ...props
}: any) {
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
  const [value, setValue] = React.useState<EvolveRtuDeviceInfo | null>(null);
  const [inputValue, setInputValue] = React.useState(initialInputValue || '');
  const [options, setOptions] = React.useState<Array<EvolveRtuDeviceInfo>>([]);

  const makeRequest = React.useMemo(
    () =>
      debounce(
        (
          request: { input: string },
          callback: (
            response?: EvolveRetrieveHeliumISOContainerRtuListByPrefixResponse['rtus']
          ) => void
        ) => {
          setIsFetching(true);
          AdminApiService.RtuService.retrieveHeliumISOContainerRtuListByPrefix_RetrieveHeliumISOContainerRTUListByPrefix(
            {
              options: {
                domainId,
                deviceIdPrefix: request.input,
                maxRecords: 50,
              },
            } as EvolveRetrieveHeliumISOContainerRtuListByPrefixRequest
          )
            .then((response) => {
              callback(response.rtus);
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
    (isActive: boolean) => (results?: EvolveRtuDeviceInfo[] | null) => {
      if (isActive) {
        let newOptions: EvolveRtuDeviceInfo[] = [];

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
  // a RTU in a side-drawer), update it here
  // dont need a side draw for this one.

  useEffect(() => {
    const cleanedValue = selectedOption?.rtuId || '';

    // NOTE: Prevent the form from being marked as invalid initially if no
    // initial value is provided
    if (cleanedValue) {
      setValue(selectedOption);
      setInputValue(selectedOption.deviceId);
      setFieldValue(name, cleanedValue);
    }
  }, [selectedOption]);

  // When the formik field value isn't set (eg: the form was just reset),
  // reset all autocomplete values
  useEffect(() => {
    if (!field.value) {
      setValue(null);
      setInputValue('');
    }
  }, [field.value]);

  useEffect(() => {
    let active = true;

    // Uncomment if no options should be initially fetched
    // TODO: Do we need to fetch the details of the selected RTU?
    // if (inputValue === '') {
    //   setOptions(value ? [value] : []);
    //   return undefined;
    // }

    makeRequest(
      // @ts-ignore
      { input: inputValue },
      handleRequest(active)
    );

    return () => {
      active = false;
    };
  }, [value, inputValue, makeRequest, selectedOption]);

  return (
    // @ts-ignore
    <StyledAutocomplete
      {...props}
      // NOTE: This needs to return a string b/c under the hood material-ui
      // uses .toLowerCase() on the return value
      getOptionLabel={(option: any) => {
        if (typeof option === 'string') {
          return option;
        }

        const { deviceId, description } = option;
        if (description) {
          return `${deviceId} - ${description}`;
        }

        return deviceId;
      }}
      getOptionSelected={(option: any, selectedValue: any) =>
        option && selectedValue && option.rtuId === selectedValue.rtuId
      }
      options={options}
      autoComplete
      includeInputInList
      value={value}
      inputValue={inputValue}
      disableClearable={disabled}
      // TODO: Use onFocus to call makeRequest?
      // onFocus={() => {
      //   makeRequest({ input: '' }, handleRequest(true));
      // }}
      onChange={(event: any, newValue: EvolveRtuDeviceInfo | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        // IMPORTANT NOTE: When setting the formik field value do not use a
        // field value of undefined. Otherwise it prevents validation errors
        // from showing up on the field since formik is unable to mark the
        // field as touched.
        setFieldValue(name, newValue?.rtuId || '');

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
        onChange(newValue, newValue?.rtuId);
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
            {option.deviceId} {option.description && `- ${option.description}`}
          </span>
        );
      }}
    />
  );
}

export default RTUAutoCompleteHeliumISOContainer;
