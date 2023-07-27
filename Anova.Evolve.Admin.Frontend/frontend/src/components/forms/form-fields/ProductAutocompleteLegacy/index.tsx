import {
  AutocompleteInputChangeReason,
  AutocompleteProps,
  RenderInputParams,
} from '@material-ui/lab/Autocomplete';
import {
  EvolveRetrieveProductNameInfoListByPrefixRequest,
  EvolveRetrieveProductNameInfoListByPrefixResponse,
  ProductDetail,
  ProductNameInfo,
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
import { useUpdateEffect } from 'react-use';
import { useSelector } from 'react-redux';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import { AccessType } from 'types';

// This autocomplete is used with different Product types that may have a name,
// or a description. We need to retrieve a label to display on the autocomplete.
const getFieldLabel = (option: any) => option.name || option.description || '';

const getInitialValue = (
  initialValue?: ProductNameInfo | null,
  fieldValue?: Partial<ProductNameInfo> | null,
  storeObject?: boolean
) => {
  const formattedInitialValue = initialValue || null;
  const formattedFieldValue = fieldValue || null;

  return storeObject ? formattedFieldValue : formattedInitialValue;
};

const getInitialInputValue = (
  initialInputValue: string,
  initialValue?: Partial<ProductNameInfo> | ProductDetail
): string => {
  const formattedInitialInputValue = initialInputValue || '';
  if (!initialValue) {
    return formattedInitialInputValue;
  }

  return getFieldLabel(initialValue) || formattedInitialInputValue;
};
// TODO: Try to type and use the Autocomplete props properly
interface Props<T = any> extends AutocompleteProps<T>, FieldAttributes<any> {
  textFieldProps?: any;
  options: any[];
  domainId?: string;
  selectedOption?: any | null;
  initialValue?: ProductNameInfo | ProductDetail | null;
  initialInputValue?: string | null;
  storeObject?: boolean;
  onChange?: (
    selectedOption: ProductNameInfo | ProductDetail,
    newValue: string
  ) => void;
  // Return true if the onChange callback should be blocked. Otherwise, allow
  // the onChange callback to run normally.
  onChangeBlocking?: (event: ProductNameInfo | ProductDetail | null) => boolean;
}

function ProductAutocomplete({
  textFieldProps,
  domainId,
  selectedOption,
  initialValue,
  initialInputValue,
  storeObject,
  onChange,
  onChangeBlocking,
  ...props
}: any) {
  const hasPermission = useSelector(selectHasPermission);
  const canRead = hasPermission(
    UserPermissionType.ProductAccess,
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
  const [value, setValue] = React.useState<Partial<ProductNameInfo> | null>(
    getInitialValue(
      initialValue,
      field.value as Partial<ProductNameInfo> | null | undefined,
      storeObject
    )
  );
  const [inputValue, setInputValue] = React.useState(() =>
    getInitialInputValue(initialInputValue, initialValue)
  );
  const [options, setOptions] = React.useState<Array<Partial<ProductNameInfo>>>(
    []
  );

  const makeRequest = React.useMemo(
    () =>
      debounce(
        (
          request: { input: string },
          callback: (
            response?: EvolveRetrieveProductNameInfoListByPrefixResponse['retrieveProductNameInfoListByPrefixResult']
          ) => void
        ) => {
          setIsFetching(true);
          AdminApiService.GeneralService.retrieveProductNameInfoListByPrefix_RetrieveProductNameInfoListByPrefix(
            {
              domainId,
              namePrefix: request.input,
              maxRecords: 50,
            } as EvolveRetrieveProductNameInfoListByPrefixRequest
          )
            .then((response) => {
              callback(response.retrieveProductNameInfoListByPrefixResult);
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
    (isActive: boolean) => (results?: Partial<ProductNameInfo>[] | null) => {
      if (isActive) {
        let newOptions: Partial<ProductNameInfo>[] = [];

        // Dont duplicate values in the dropdown
        if (
          value &&
          !results?.find((result) => result.productId === value.productId)
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
  // a Product in a side-drawer), update it here
  useEffect(() => {
    // NOTE: When saving a product, only "id" is returned in the response
    // (typically used with the autocomplete + a drawer). When selecting a
    // product from the autocomplete API, "productId" is returned in the
    // response. This may cause issues down the road since the property to
    // identify a product could be different.
    const cleanedValue = selectedOption?.id || '';

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
  // reset all autocomplete values. Note that useUpdateEffect is used here
  // since we don't want to execute this hook when the component initially
  // mounts
  useUpdateEffect(() => {
    if (!field.value) {
      setValue(null);
      setInputValue('');
    } else if (storeObject) {
      const newAutocompleteValue = getInitialValue(
        initialValue,
        field.value as Partial<ProductNameInfo>,
        storeObject
      );
      const newAutocompleteInputValue = getInitialInputValue(
        initialInputValue,
        field.value as Partial<ProductNameInfo>
      );
      setValue(newAutocompleteValue);
      setInputValue(newAutocompleteInputValue);
    }
  }, [field.value]);

  useEffect(() => {
    let active = true;

    // Uncomment if no options should be initially fetched
    // TODO: Do we need to fetch the details of the selected product?
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
        typeof option === 'string' ? option : getFieldLabel(option)
      }
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      forcePopupIcon
      selectOnFocus
      value={value}
      inputValue={inputValue}
      disableClearable={disabled}
      // TODO: Use onFocus to call makeRequest?
      // onFocus={() => {
      //   makeRequest({ input: '' }, handleRequest(true));
      // }}
      onChange={(event: any, newValue: ProductNameInfo | null) => {
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
          : newValue?.productId || '';
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
        onChange?.(newValue, newValue?.productId);
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
        return <span>{getFieldLabel(option)}</span>;
      }}
    />
  );
}

export default ProductAutocomplete;
