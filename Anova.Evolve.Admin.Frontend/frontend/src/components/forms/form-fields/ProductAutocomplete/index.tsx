/* eslint-disable indent */
import {
  AutocompleteInputChangeReason,
  AutocompleteProps,
  RenderInputParams,
} from '@material-ui/lab/Autocomplete';
import { ProductNameInfoDto, UserPermissionType } from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import StyledAutocomplete from 'components/forms/styled-fields/StyledAutocomplete';
import StyledAutocompleteCircularProgress from 'components/forms/styled-fields/StyledAutocompleteCircularProgress';
import StyledAutocompleteTextField from 'components/forms/styled-fields/StyledAutocompleteTextField';
import { FieldAttributes, FieldProps, getIn } from 'formik';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import { AccessType } from 'types';
import { fieldToTextField } from 'utils/forms/field-to-input-field';
import { renderHelperText } from 'utils/forms/renderers';

const getInitialInputValue = (
  initialInputValue: string | null | undefined,
  initialValue?: ProductNameInfoDto | null
): string => {
  const formattedInitialInputValue = initialInputValue || '';
  if (!initialValue) {
    return formattedInitialInputValue;
  }

  return initialValue.name || formattedInitialInputValue;
};

interface ProductAutoCompleteExtraProps {
  textFieldProps?: any;
  options: ProductNameInfoDto[];
  selectedOption?: ProductNameInfoDto | null;
  initialValue?: ProductNameInfoDto | null;
  initialInputValue?: string | null;
  onChange?: (
    selectedOption: ProductNameInfoDto | null,
    newValue: string | undefined
  ) => void;
}
// TODO: For some reason, passing in selectedOption as a type other than the
// one specified below doesn't throw a TypeScript error.
// Example: If selectedOption is typed as ProductNameInfoDto, passing
// something typed as ProductNameInfoDto didn't throw a TypeScript error
type Props = AutocompleteProps<ProductNameInfoDto> &
  FieldAttributes<ProductAutoCompleteExtraProps> &
  FieldProps;

function ProductAutocomplete({
  textFieldProps,
  selectedOption,
  initialValue,
  initialInputValue,
  onChange,
  ...props
}: Props) {
  const hasPermission = useSelector(selectHasPermission);
  const canRead = hasPermission(
    UserPermissionType.ProductAccess,
    AccessType.Read
  );

  // Formik props
  // ================================================
  const {
    form: { setFieldTouched, setFieldValue, status = {}, setStatus },
    field,
  } = props;
  // @ts-ignore
  const { error, helperText, disabled } = fieldToTextField(props);
  const { name } = field;
  const statusError = getIn(status.errors, name!);
  // ================================================

  const [isFetching, setIsFetching] = React.useState(false);
  const [value, setValue] = React.useState<ProductNameInfoDto | null>(
    initialValue || null
  );
  const [inputValue, setInputValue] = React.useState(() =>
    getInitialInputValue(initialInputValue, initialValue)
  );
  const [options, setOptions] = React.useState<ProductNameInfoDto[]>([]);

  const makeRequest = React.useMemo(
    () =>
      debounce(
        (
          request: { input: string },
          callback: (response?: ProductNameInfoDto[]) => void
        ) => {
          setIsFetching(true);
          AdminApiService.ProductService.product_RetrieveProductNamesByPrefix(
            request.input
          )
            .then((response) => {
              callback(response);
            })
            .catch((responseError) => {
              console.error(
                'ProductAutocomplete response error',
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
    (isActive: boolean) => (results?: ProductNameInfoDto[] | null) => {
      if (isActive) {
        let newOptions: ProductNameInfoDto[] = [];

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

  // NOTE/TODO: Does the message below still apply to rtus?
  // If a value is selected in an external component (like when creating/editing
  // a rtu in a side-drawer), update it here
  useEffect(() => {
    const cleanedValue = selectedOption?.productId || '';

    // NOTE: Prevent the form from being marked as invalid initially if no
    // initial value is provided
    if (cleanedValue) {
      setValue(selectedOption!);
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
    // NOTE/TODO: is the message below still needed?
    // TODO: Do we need to fetch the details of the selected rtu?
    // if (inputValue === '') {
    //   setOptions(value ? [value] : []);
    //   return undefined;
    // }
    // Only fetch data if there's text in the input (the API will 404 when
    // passing in nothing)
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
      getOptionLabel={(option: ProductNameInfoDto) =>
        typeof option === 'string' ? option : option.name || ''
      }
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      // @ts-ignore
      value={value}
      inputValue={inputValue}
      disableClearable={disabled}
      // TODO: Use onFocus to call makeRequest?
      // onFocus={() => {
      //   makeRequest({ input: '' }, handleRequest(true));
      // }}
      onChange={(event: any, newValue: ProductNameInfoDto | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        // IMPORTANT NOTE: When setting the formik field value do not use a
        // field value of undefined. Otherwise it prevents validation errors
        // from showing up on the field since formik is unable to mark the
        // field as touched.
        setFieldValue(name, newValue?.productId || '');

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
        onChange?.(newValue, newValue?.name!);
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
      renderOption={(option: ProductNameInfoDto) => {
        return <span>{option.name}</span>;
      }}
    />
  );
}

export default ProductAutocomplete;
