import { AssetSubTypeEnum } from 'apps/freezers/types';
import { FormikProps } from 'formik';
import { useEffect } from 'react';
import { useUpdateEffect } from 'react-use';
import { Values } from './types';

interface Props {
  values: Values;
  setValues: FormikProps<Values>['setValues'];
  setSelectedFreezerAssetSubType: (freezerType: AssetSubTypeEnum) => void;
}

const DefaultChartEditorFormEffect = ({
  values,
  setValues,
  setSelectedFreezerAssetSubType,
}: Props) => {
  // Set the asset subtype outside of Formik to trigger the API call to fetch
  // freezer tags
  useEffect(() => {
    setSelectedFreezerAssetSubType(values.assetSubTypeId);
  }, [values.assetSubTypeId]);

  // Reset the left and right axis fields
  useUpdateEffect(() => {
    // Using setValues here because of a Formik bug: calling setFieldValue with
    // an empty array removes the field from the form's `values` causing
    // validation errors to not appear. However, using setValues keeps the
    // field in the form's `values`.
    // https://github.com/formium/formik/issues/2151
    setValues({
      ...values,
      leftAxis: [],
      rightAxis: [],
    });
  }, [values.assetSubTypeId]);

  return null;
};

export default DefaultChartEditorFormEffect;
