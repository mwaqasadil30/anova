import React, { useCallback, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import MuiAutocomplete, {
  AutocompleteProps,
} from '@material-ui/lab/Autocomplete';
import {
  EvolveRetrieveRtuDeviceInfoListByPrefixRequest,
  EvolveRetrieveRtuDeviceInfoListByPrefixResponse,
  RTUDeviceInfo,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import CircularProgress from 'components/CircularProgress';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import { FieldAttributes } from 'formik';
import { fieldToTextField } from 'formik-material-ui';
import debounce from 'lodash/debounce';

// TODO: Try to type and use the Autocomplete props properly
interface Props<T = any> extends AutocompleteProps<T>, FieldAttributes<any> {
  textFieldProps?: any;
  options: any[];
  domainId?: string;
  selectedOption?: RTUDeviceInfo | null;
  onChange?: (selectedOption: any, newValue: any) => void;
}

function RTUAutocomplete({
  textFieldProps,
  domainId,
  selectedOption,
  ...props
}: any) {
  const { onChange } = props;
  // Formik props
  // ================================================
  const {
    form: { setFieldTouched, setFieldValue },
  } = props;
  // @ts-ignore
  const { error, helperText, ...field } = fieldToTextField(props);
  const { name, value: formikFieldValue } = field;
  // ================================================

  const [isFetching, setIsFetching] = React.useState(false);
  const [value, setValue] = React.useState<RTUDeviceInfo | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<Array<RTUDeviceInfo>>([]);

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
                deviceIdPrefix: request.input,
                domainId,
                maxRecords: 50,
                // categories?: RTUCategoryType[] | null;
                // rtuType?: RTUType | null;
                // isTemplateSearch?: boolean;
              },
            } as EvolveRetrieveRtuDeviceInfoListByPrefixRequest
          )
            .then((response) => {
              callback(response.retrieveRTUDeviceInfoListByPrefixResult);
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
    (isActive: boolean) => (results?: RTUDeviceInfo[] | null) => {
      if (isActive) {
        let newOptions: RTUDeviceInfo[] = [];

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

  useEffect(() => {
    const newInputValue = (formikFieldValue as string) || '';
    setInputValue(newInputValue);
  }, [formikFieldValue]);

  // If a value is selected in an external component, update it here
  useEffect(() => {
    setValue(selectedOption);
    setInputValue(selectedOption?.deviceId || '');
  }, [selectedOption]);

  useEffect(() => {
    let active = true;

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
    <MuiAutocomplete
      {...props}
      getOptionLabel={(option: RTUDeviceInfo | string) =>
        typeof option === 'string' ? option : `${option.deviceId}`
      }
      options={options}
      // loading={isFetching}
      autoComplete
      includeInputInList
      value={value}
      inputValue={inputValue}
      // TODO: Use onFocus to call makeRequest?
      // onFocus={() => {
      //   makeRequest({ input: '' }, handleRequest(true));
      // }}
      onChange={(event: any, newValue: RTUDeviceInfo | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        setFieldValue(name, newValue?.deviceId);
        onChange(newValue, newValue?.deviceId);
      }}
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
      onBlur={() => setFieldTouched(name, true)}
      renderInput={(inputProps) => (
        <StyledTextField
          {...inputProps}
          {...textFieldProps}
          helperText={helperText}
          error={error}
          fullWidth
          InputProps={{
            ...inputProps.InputProps,
            endAdornment: (
              <>
                {isFetching ? (
                  <Box mr={2}>
                    <CircularProgress color="inherit" size={20} />
                  </Box>
                ) : null}
                {inputProps?.InputProps?.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(option: RTUDeviceInfo) => {
        return <span>{option.deviceId}</span>;
      }}
    />
  );
}

export default RTUAutocomplete;
