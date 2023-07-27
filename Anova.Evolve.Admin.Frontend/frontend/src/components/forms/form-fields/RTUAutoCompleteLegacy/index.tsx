import {
  AutocompleteInputChangeReason,
  AutocompleteProps,
  RenderInputParams,
} from '@material-ui/lab/Autocomplete';
import {
  EvolveRetrieveRtuDeviceInfoListByPrefixRequest,
  EvolveRetrieveRtuDeviceInfoListByPrefixResponse,
  RTUDeviceInfo,
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

const getInitialValue = (
  initialValue?: RTUDeviceInfo | null,
  fieldValue?: Partial<RTUDeviceInfo> | null,
  storeObject?: boolean
) => {
  const formattedInitialValue = initialValue || null;
  const formattedFieldValue = fieldValue || null;

  return storeObject ? formattedFieldValue : formattedInitialValue;
};

const getInitialInputValue = (
  initialInputValue: string,
  initialValue?: RTUDeviceInfo
): string => {
  const formattedInitialInputValue = initialInputValue || '';
  if (!initialValue) {
    return formattedInitialInputValue;
  }

  return initialValue.deviceId || formattedInitialInputValue;
};

// TODO: Try to type and use the Autocomplete props properly
interface Props<T = any> extends AutocompleteProps<T>, FieldAttributes<any> {
  textFieldProps?: any;
  options: any[];
  domainId?: string;
  selectedOption?: any | null;
  initialValue?: RTUDeviceInfo | null;
  initialInputValue?: string | null;
  storeObject?: boolean;
  onChange?: (selectedOption: any, newValue: any) => void;
}

function RTUAutocompleteLegacy({
  textFieldProps,
  domainId,
  selectedOption,
  initialValue,
  initialInputValue,
  storeObject,
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
  const [value, setValue] = React.useState<Partial<RTUDeviceInfo> | null>(
    getInitialValue(
      initialValue,
      field.value as Partial<RTUDeviceInfo> | null | undefined,
      storeObject
    )
  );
  const [inputValue, setInputValue] = React.useState(
    getInitialInputValue(initialInputValue, initialValue)
  );
  const [options, setOptions] = React.useState<Array<Partial<RTUDeviceInfo>>>(
    []
  );

  const makeRequest = React.useMemo(
    () =>
      debounce(
        (
          request: { input: string },
          callback: (
            response?: EvolveRetrieveRtuDeviceInfoListByPrefixResponse['retrieveRTUDeviceInfoListByPrefixResult']
          ) => void
        ) => {
          setIsFetching(true);
          AdminApiService.RTUService.retrieveRtuDeviceInfoListByPrefix_RetrieveRtuDeviceInfoListByPrefix(
            {
              options: {
                domainId,
                deviceIdPrefix: request.input,
                maxRecords: 50,
                isTemplateSearch: false,
                categories: null,
                rtuType: null,
              },
            } as EvolveRetrieveRtuDeviceInfoListByPrefixRequest
          )
            .then((response) => {
              callback(response.retrieveRTUDeviceInfoListByPrefixResult);
            })
            .catch((responseError) => {
              console.error(
                'RTUAutocompleteLegacy response error',
                responseError
              );
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
    (isActive: boolean) => (results?: Partial<RTUDeviceInfo>[] | null) => {
      if (isActive) {
        let newOptions: Partial<RTUDeviceInfo>[] = [];

        // Dont duplicate values in the dropdown
        if (value && !results?.find((result) => result.rtuId === value.rtuId)) {
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

      const newFieldValue = storeObject ? selectedOption || null : cleanedValue;
      setFieldValue(name, newFieldValue);
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
      value={value}
      inputValue={inputValue}
      disableClearable={disabled}
      // TODO: Use onFocus to call makeRequest?
      // onFocus={() => {
      //   makeRequest({ input: '' }, handleRequest(true));
      // }}
      onChange={(event: any, newValue: RTUDeviceInfo | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        // IMPORTANT NOTE: When setting the formik field value do not use a
        // field value of undefined. Otherwise it prevents validation errors
        // from showing up on the field since formik is unable to mark the
        // field as touched.
        const newFieldValue = storeObject
          ? newValue || null
          : newValue?.rtuId || '';
        setFieldValue(name, newFieldValue);

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
        onChange?.(newValue, newValue?.rtuId);
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

export default RTUAutocompleteLegacy;
