import React from 'react';
import { FormikProps } from 'formik';
import get from 'lodash/get';
import { EvolveAssetGroupCriteriaOptionInfo } from 'api/admin/api';
import {
  BooleanEnum,
  Comparator,
  DataChannelType_,
  FilterTypesToAssetGroupFilterSearchTypeConverter,
  Options,
  PropertyPath,
  ResponsePayload,
} from '../constants';
import Autocomplete from './AutocompleteField';
import FormSelect from './FormSelect';

export default function ValueField({
  formik,
  index,
  valueOptions,
}: {
  formik: FormikProps<ResponsePayload>;
  index: number;
  valueOptions: Record<string, string[]>;
}) {
  const { values } = formik;
  if (
    get(values, PropertyPath.filter(index)) ===
    FilterTypesToAssetGroupFilterSearchTypeConverter.DataChannelTypeName
  ) {
    return (
      <FormSelect
        options={Options.valueEnum(DataChannelType_)}
        fieldName={PropertyPath.value(index)}
      />
    );
  }

  if (
    get(values, PropertyPath.filter(index)) ===
    FilterTypesToAssetGroupFilterSearchTypeConverter.FtpEnabled
  ) {
    return (
      <FormSelect
        options={Options.valueEnum(BooleanEnum)}
        fieldName={PropertyPath.value(index)}
      />
    );
  }

  if (
    get(values, PropertyPath.comparator(index)) === Comparator[Comparator.EMPTY]
  ) {
    return null;
  }

  const filterValue: string = get(values, PropertyPath.filter(index));
  const safeCriteriaOptions = (values.assetGroupCriteriaOptions || []).filter(
    (el) => el.isCustomField
  );
  const customField: EvolveAssetGroupCriteriaOptionInfo =
    safeCriteriaOptions.find((el) => el.fieldName === filterValue) ||
    ({} as EvolveAssetGroupCriteriaOptionInfo);
  const customFieldName = customField.fieldName;
  const metadataListValues = customField.customFieldMetaDataJson?.listValues;

  if (metadataListValues?.length) {
    return (
      <FormSelect
        options={Options.valueArray(metadataListValues)}
        fieldName={PropertyPath.value(index)}
      />
    );
  }

  return (
    <Autocomplete
      index={index}
      form={formik}
      valueOptions={valueOptions}
      filterValue={filterValue}
      customFieldName={customFieldName}
    />
  );
}
