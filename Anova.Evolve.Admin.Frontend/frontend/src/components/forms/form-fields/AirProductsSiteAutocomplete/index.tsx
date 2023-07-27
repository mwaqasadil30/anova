/* eslint-disable indent */
import {
  AutocompleteInputChangeReason,
  AutocompleteProps,
  createFilterOptions,
  RenderInputParams,
} from '@material-ui/lab/Autocomplete';
import { SiteInfoDto } from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import StyledAutocomplete from 'components/forms/styled-fields/StyledAutocomplete';
import StyledAutocompleteCircularProgress from 'components/forms/styled-fields/StyledAutocompleteCircularProgress';
import StyledAutocompleteTextField from 'components/forms/styled-fields/StyledAutocompleteTextField';
import SiteRecordDialog from 'components/SiteRecordDialog';
import { FieldAttributes, FieldProps, getIn } from 'formik';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import { fieldToTextField } from 'utils/forms/field-to-input-field';
import { renderHelperText } from 'utils/forms/renderers';
import { storeSiteIdOrSiteNumber } from './helpers';
import { useGetSiteInfoBySiteNumber } from './hooks/useGetSiteInfoBySiteNumber';

interface DownloadOption extends SiteInfoDto {
  inputValue: string;
}
type AutocompleteOption = SiteInfoDto | DownloadOption;

const getInitialInputValue = (
  initialInputValue: string | null | undefined,
  initialValue?: SiteInfoDto | null
): string => {
  const formattedInitialInputValue = initialInputValue || '';
  if (!initialValue) {
    return formattedInitialInputValue;
  }

  return (
    [
      initialValue.siteNumber,
      initialValue.customerName,
      initialValue.address1,
      initialValue.country,
    ]
      .filter(Boolean)
      .join(', ') || formattedInitialInputValue
  );
};

interface AirProductsSiteAutoCompleteExtraProps {
  storeSiteId?: boolean;
  textFieldProps?: any;
  options: SiteInfoDto[];
  selectedOption?: SiteInfoDto | null;
  initialValue?: SiteInfoDto | null;
  initialInputValue?: string | null;
  onChange?: (
    selectedOption: SiteInfoDto | null,
    newValue: string | undefined
  ) => void;
}
// TODO: For some reason, passing in selectedOption as a type other than the
// one specified below doesn't throw a TypeScript error.
// Example: If selectedOption is typed as SiteInfoDto, passing
// something typed as SiteInfoDto didn't throw a TypeScript error
type Props = AutocompleteProps<SiteInfoDto> &
  FieldAttributes<AirProductsSiteAutoCompleteExtraProps> &
  FieldProps;

function AirProductsSiteAutocomplete({
  storeSiteId,
  textFieldProps,
  selectedOption,
  initialValue,
  initialInputValue,
  onChange,
  ...props
}: Props) {
  const { t } = useTranslation();
  const canRead = true;
  // const hasPermission = useSelector(selectHasPermission);
  // const canRead = hasPermission(
  //   UserPermissionType.ProductAccess,
  //   AccessType.Read
  // );

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
  const [value, setValue] = React.useState<SiteInfoDto | null>(
    initialValue || null
  );
  const [inputValue, setInputValue] = React.useState(() =>
    getInitialInputValue(initialInputValue, initialValue)
  );
  const [options, setOptions] = React.useState<AutocompleteOption[]>([]);

  const [isSiteRecordDialogOpen, setIsSiteRecordDialogOpen] = React.useState(
    false
  );
  // Site Info Download
  const [siteNumberRequest, setSiteNumberRequest] = useState('');
  const closeSiteRecordDialog = () => {
    setSiteNumberRequest('');
    setIsSiteRecordDialogOpen(false);
  };

  const openSiteRecordDialog = (siteNumber: string) => {
    setSiteNumberRequest(siteNumber);
    setIsSiteRecordDialogOpen(true);
  };

  const makeRequest = React.useMemo(
    () =>
      debounce(
        (
          request: { input: string },
          callback: (response?: SiteInfoDto[]) => void
        ) => {
          setIsFetching(true);
          AdminApiService.SiteService.site_SearchForSites(request.input)
            .then((response) => {
              callback(response);
            })
            .catch((responseError) => {
              console.error(
                'AirProductsSiteAutocomplete response error',
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
    (isActive: boolean) => (results?: SiteInfoDto[] | null) => {
      if (isActive) {
        let newOptions: SiteInfoDto[] = [];

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
  // a rtu in a side-drawer), update it here
  useEffect(() => {
    const cleanedValue = storeSiteIdOrSiteNumber(storeSiteId, selectedOption);

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
        // When a site is selected, get only the siteNumber before the first comma.
        // This is to prevent the api from returning an error when sending the site number
        // along with the site details in the inputValue
        // @ts-ignore
        { input: inputValue ? inputValue.split(',')[0] : '' },
        handleRequest(active)
      );
    }

    return () => {
      active = false;
    };
  }, [value, inputValue, makeRequest, selectedOption, canRead]);

  const filter = createFilterOptions<SiteInfoDto>();

  // Only make an api call to search if a site exists under a siteNumber
  // once the siteRecordDialog is open -- after the user clicks "download"
  // In the autocomplete dropdown option

  const getSiteInfoBySiteNumberApi = useGetSiteInfoBySiteNumber(
    siteNumberRequest
  );

  return (
    <>
      <SiteRecordDialog
        storeSiteId={storeSiteId}
        isSiteRecordDialogOpen={isSiteRecordDialogOpen}
        closeSiteRecordDialog={closeSiteRecordDialog}
        isSiteInfoDownloadLoading={getSiteInfoBySiteNumberApi.isLoading}
        siteInfoApiData={getSiteInfoBySiteNumberApi.data}
        siteNumberRequest={siteNumberRequest}
        setValue={setValue}
        setFieldValue={setFieldValue}
        fieldName={name}
        apiError={getSiteInfoBySiteNumberApi.error}
        isFetching={getSiteInfoBySiteNumberApi.isFetching}
        onChange={onChange}
      />
      {/* // @ts-ignore */}
      <StyledAutocomplete
        {...props}
        getOptionLabel={(option: SiteInfoDto | DownloadOption) => {
          if (typeof option === 'string') {
            return option;
          }

          if ('inputValue' in option && option.inputValue) {
            return option.inputValue;
          }

          const siteOption = option as SiteInfoDto;

          return (
            [
              siteOption.siteNumber,
              siteOption.customerName,
              siteOption.address1,
              siteOption.country,
            ]
              .filter(Boolean)
              .join(', ') || ''
          );
        }}
        options={options}
        autoComplete
        includeInputInList
        filterOptions={(existingOptions, params) => {
          const filtered = filter(
            existingOptions,
            params
          ) as AutocompleteOption[];

          // Only display the download option when there are no existingOptions
          if (
            params.inputValue !== '' &&
            !filtered.find((option) => option.siteNumber === params.inputValue)
          ) {
            // @ts-ignore
            filtered.push({
              siteNumber: t(
                'ui.common.downloadSiteNumber',
                'Download... "{{siteNumber}}"',
                { siteNumber: `${params.inputValue}` }
              ),
              inputValue: params.inputValue,
            });
          }

          return filtered;
        }}
        filterSelectedOptions
        // @ts-ignore
        value={value}
        inputValue={inputValue}
        disableClearable={disabled}
        // TODO: Use onFocus to call makeRequest?
        // onFocus={() => {
        //   makeRequest({ input: '' }, handleRequest(true));
        // }}
        onChange={(event: any, newValue: AutocompleteOption | null) => {
          if (newValue && 'inputValue' in newValue && newValue.inputValue) {
            openSiteRecordDialog(inputValue);
          } else {
            const typedValue = newValue as SiteInfoDto;
            setOptions(typedValue ? [typedValue, ...options] : options);
            setValue(typedValue);
            // IMPORTANT NOTE: When setting the formik field value do not use a
            // field value of undefined. Otherwise it prevents validation errors
            // from showing up on the field since formik is unable to mark the
            // field as touched.
            setFieldValue(
              name,
              storeSiteIdOrSiteNumber(storeSiteId, typedValue)
            );

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
            onChange?.(typedValue, typedValue?.customerName!);
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
        renderOption={(option) => {
          // It seems like getOptionLabel and renderOption are both needed
          // when adding custom options, i.e. the Download "123456" option
          return (
            [
              option?.siteNumber,
              option?.customerName,
              option?.address1,
              option?.country,
            ]
              .filter(Boolean)
              .join(', ') || ''
          );
        }}
      />
    </>
  );
}

export default AirProductsSiteAutocomplete;
