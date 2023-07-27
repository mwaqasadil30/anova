import {
  AutocompleteInputChangeReason,
  AutocompleteProps,
  RenderInputParams,
} from '@material-ui/lab/Autocomplete';
import {
  EvolveRetrieveTankDimensionDescriptionInfoListByPrefixRequest,
  EvolveRetrieveTankDimensionDescriptionInfoListByPrefixResponse,
  TankDimensionDescriptionInfo,
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
import { useSelector } from 'react-redux';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import { AccessType } from 'types';
import { renderHelperText } from 'utils/forms/renderers';

const getInitialValue = (
  initialValue?: TankDimensionDescriptionInfo | null,
  fieldValue?: Partial<TankDimensionDescriptionInfo> | null,
  storeObject?: boolean
) => {
  const formattedInitialValue = initialValue || null;
  const formattedFieldValue = fieldValue || null;

  return storeObject ? formattedFieldValue : formattedInitialValue;
};

const getInitialInputValue = (
  initialInputValue: string,
  initialValue?: Partial<TankDimensionDescriptionInfo>
): string => {
  const formattedInitialInputValue = initialInputValue || '';
  if (!initialValue) {
    return formattedInitialInputValue;
  }

  return initialValue.description || formattedInitialInputValue;
};

// TODO: Try to type and use the Autocomplete props properly
interface Props<T = any> extends AutocompleteProps<T>, FieldAttributes<any> {
  textFieldProps?: any;
  options: any[];
  domainId?: string;
  selectedOption?: any | null;
  initialValue?: TankDimensionDescriptionInfo | null;
  initialInputValue?: string | null;
  storeObject?: boolean;
  // Return true if the onChange callback should be blocked. Otherwise, allow
  // the onChange callback to run normally.
  onChangeBlocking?: (event: TankDimensionDescriptionInfo | null) => boolean;
}

function TankDimensionAutocomplete({
  textFieldProps,
  domainId,
  selectedOption,
  initialValue,
  initialInputValue,
  storeObject,
  onChangeBlocking,
  ...props
}: any) {
  const hasPermission = useSelector(selectHasPermission);
  const canRead = hasPermission(
    UserPermissionType.TankDimensionAccess,
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
  const [
    value,
    setValue,
  ] = React.useState<Partial<TankDimensionDescriptionInfo> | null>(
    getInitialValue(
      initialValue,
      field.value as Partial<TankDimensionDescriptionInfo> | null | undefined,
      storeObject
    )
  );
  const [inputValue, setInputValue] = React.useState(
    getInitialInputValue(initialInputValue, initialValue)
  );
  const [options, setOptions] = React.useState<
    Array<Partial<TankDimensionDescriptionInfo>>
  >([]);

  const makeRequest = React.useMemo(
    () =>
      debounce(
        (
          request: { input: string },
          callback: (
            response?: EvolveRetrieveTankDimensionDescriptionInfoListByPrefixResponse['retrieveTankDimensionDescriptionInfoListByPrefixResult']
          ) => void
        ) => {
          setIsFetching(true);
          AdminApiService.GeneralService.retrieveTankDimensionDescriptionInfoListByPrefix_RetrieveTankDimensionDescriptionInfoListByPrefix(
            {
              domainId,
              descriptionPrefix: request.input,
              maxRecords: 50,
            } as EvolveRetrieveTankDimensionDescriptionInfoListByPrefixRequest
          )
            .then((response) => {
              callback(
                response.retrieveTankDimensionDescriptionInfoListByPrefixResult
              );
            })
            .catch((responseError) => {
              console.error(
                'TankDimensionAutocomplete response error',
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
    (isActive: boolean) => (
      results?: Partial<TankDimensionDescriptionInfo>[] | null
    ) => {
      if (isActive) {
        let newOptions: Partial<TankDimensionDescriptionInfo>[] = [];

        // Dont duplicate values in the dropdown
        if (
          value &&
          !results?.find(
            (result) => result.tankDimensionId === value.tankDimensionId
          )
        ) {
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
  // a Tank Dimension in a side-drawer), update it here
  useEffect(() => {
    const cleanedValue = selectedOption?.tankDimensionId || '';

    // NOTE: Prevent the form from being marked as invalid initially if no
    // initial value is provided
    if (cleanedValue) {
      setValue(selectedOption);
      setInputValue(cleanedValue);

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
    } else if (storeObject) {
      const newAutocompleteValue = getInitialValue(
        initialValue,
        field.value as Partial<TankDimensionDescriptionInfo>,
        storeObject
      );
      const newAutocompleteInputValue = getInitialInputValue(
        initialInputValue,
        field.value as Partial<TankDimensionDescriptionInfo>
      );
      setValue(newAutocompleteValue);
      setInputValue(newAutocompleteInputValue);
    }
  }, [field.value]);

  useEffect(() => {
    let active = true;

    // Uncomment if no options should be initially fetched
    // TODO: Do we need to fetch the details of the selected Tank Dimension?
    // if (inputValue === '') {
    //   setOptions(value ? [value] : []);
    //   return undefined;
    // }
    if (canRead) {
      makeRequest(
        // @ts-ignore
        { input: inputValue },
        handleRequest(active)
      );
    }

    return () => {
      active = false;
    };
  }, [value, inputValue, makeRequest, selectedOption, canRead]);

  return (
    // @ts-ignore
    <StyledAutocomplete
      {...props}
      getOptionLabel={(option: any) =>
        typeof option === 'string' ? option : option.description
      }
      options={options}
      autoComplete
      includeInputInList
      forcePopupIcon
      selectOnFocus
      value={value}
      inputValue={inputValue}
      disableClearable={disabled}
      // TODO: Use onFocus to call makeRequest?
      // onFocus={() => {
      //   makeRequest({ input: '' }, handleRequest(true));
      // }}
      onChange={(event: any, newValue: TankDimensionDescriptionInfo | null) => {
        const shouldBlockOnChange = onChangeBlocking?.(newValue);
        if (shouldBlockOnChange) {
          return;
        }

        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        // IMPORTANT NOTE: When setting the formik field value do not use a
        // field value of undefined. Otherwise it prevents validation errors
        // from showing up on the field since formik is unable to mark the
        // field as touched.
        const newFieldValue = storeObject
          ? newValue || null
          : newValue?.tankDimensionId || '';
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
      onBlur={() => {
        setFieldTouched(name, true);

        // Reset the input value if there is no selected value
        if (!value) {
          setInputValue('');
        }
      }}
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
        return <span>{option.description}</span>;
      }}
    />
  );
}

export default TankDimensionAutocomplete;
