import {
  AssetGroupCriteriaFilterAutoCompleteOptions,
  AssetGroupFilterSearchType,
  EvolveRetrieveAssetGroupCriteriaAutoCompleteFilterItemsByOptionsRequest,
} from 'api/admin/api';
import StyledAutocomplete from 'components/forms/styled-fields/StyledAutocomplete';
import StyledAutocompleteCircularProgress from 'components/forms/styled-fields/StyledAutocompleteCircularProgress';
import StyledAutocompleteTextField from 'components/forms/styled-fields/StyledAutocompleteTextField';
import { Field, FormikProps } from 'formik';
import get from 'lodash/get';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  callApiForValueOptions,
  Comparator,
  FilterTypesToAssetGroupFilterSearchTypeConverter,
  getOptionsHashKey,
  PropertyPath,
  ResponsePayload,
} from '../constants';

const getSearchType = (filterValue: string): number => {
  if (filterValue in FilterTypesToAssetGroupFilterSearchTypeConverter) {
    return FilterTypesToAssetGroupFilterSearchTypeConverter[filterValue];
  }

  return AssetGroupFilterSearchType.CustomProperties;
};

export default function Autocomplete({
  form,
  valueOptions,
  customFieldName,
  filterValue,
  index,
}: {
  form: FormikProps<ResponsePayload>;
  valueOptions: Record<string, string[]>;
  filterValue: keyof typeof FilterTypesToAssetGroupFilterSearchTypeConverter;
  customFieldName: string | null | undefined;
  index: number;
}) {
  const { t } = useTranslation();
  const { values, errors, getFieldMeta, setFieldValue } = form;

  const fieldPath = PropertyPath.value(index);
  const field = getFieldMeta(fieldPath);
  const fieldError = field.touched && get(errors, fieldPath);

  const selectedOption: string = get(values, fieldPath) || '';
  const [options, setOptions] = useState<Record<string, string[]>>(
    valueOptions
  );
  const [prefixText, setPrefixText] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const requestOptions: AssetGroupCriteriaFilterAutoCompleteOptions = {
    searchType: getSearchType(filterValue),
    fieldName: customFieldName,
    prefixText,
  } as AssetGroupCriteriaFilterAutoCompleteOptions;
  const hashKey = getOptionsHashKey(requestOptions);

  useEffect(() => {
    if (!options[hashKey]) {
      setOptions((old: Record<string, string[]>) => ({
        ...old,
        [hashKey]: [] as string[],
      }));
    }
  }, [hashKey]);

  const loadSuggestions = () => {
    if (
      !Number.isInteger(requestOptions.searchType) ||
      get(values, PropertyPath.comparator(index)) === Comparator.EMPTY
    ) {
      return;
    }
    const isInCache = callApiForValueOptions.cache.has(hashKey);
    if (!isInCache) {
      setIsFetching(true);
    }

    return void callApiForValueOptions({
      options: requestOptions,
    } as EvolveRetrieveAssetGroupCriteriaAutoCompleteFilterItemsByOptionsRequest)
      .then(
        (response) =>
          response.retrieveAssetGroupCriteriaAutoCompleteFilterItemsByOptionsResult
      )
      .then((unsafeOptions) => {
        const safeOptions = unsafeOptions || [];
        setOptions((prev) => {
          setIsFetching(false);
          if (prev[hashKey]?.length === safeOptions.length) {
            return prev;
          }
          prev[hashKey] = safeOptions.map((_) => _.text as string);
          return { ...prev };
        });
      })
      .catch(() => {
        setIsFetching(false);
      });
  };

  useEffect(loadSuggestions, [
    requestOptions.prefixText,
    requestOptions.searchType,
    requestOptions.fieldName,
  ]);

  return (
    <Field id={`${fieldPath}-input`} name={fieldPath} required as="div">
      <StyledAutocomplete
        options={options[hashKey] || []}
        noOptionsText={t('ui.common.noOptions', 'No options')}
        autoComplete
        // @ts-ignore
        value={selectedOption}
        inputValue={prefixText}
        onChange={(event: ChangeEvent<{}>, value: string | null) => {
          setFieldValue(fieldPath, value || '');
        }}
        onInputChange={(event: ChangeEvent<{}> | null, value) => {
          if (value !== prefixText) {
            setPrefixText(value);
            // In addition to allowing the selection of an autocomplete option,
            // we also allow any free-form text to be used so we update the
            // field value here
            setFieldValue(fieldPath, value || '');
          }
        }}
        renderInput={(params) => (
          <StyledAutocompleteTextField
            {...params}
            placeholder={selectedOption}
            fullWidth
            helperText={fieldError}
            error={!!fieldError}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isFetching && <StyledAutocompleteCircularProgress />}
                  {params?.InputProps?.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </Field>
  );
}
