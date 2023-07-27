import { FormikProps } from 'formik';
import round from 'lodash/round';
import { useEffect, useState } from 'react';
import { isNumber } from 'utils/format/numbers';
import { Values } from '../components/ObjectForm/types';

interface Props {
  values: Values;
  setFieldValue: FormikProps<Values>['setFieldValue'];
  fieldName: keyof Values;
  decimalPlaces: number;
}

const useRoundedAndPreciseValue = ({
  values,
  setFieldValue,
  fieldName,
  decimalPlaces,
}: Props) => {
  const preciseFieldName = `_precise_${fieldName}`;
  const roundedFieldValue = values[fieldName];
  // @ts-ignore
  const preciseFieldValue = values[preciseFieldName];

  const [storedRoundedValue, setStoredRoundedValue] = useState<number | null>();

  // Reset a field's precise value if the user changed the regular field value
  useEffect(() => {
    if (
      isNumber(storedRoundedValue) &&
      Number(storedRoundedValue) !== Number(roundedFieldValue) &&
      isNumber(preciseFieldValue)
    ) {
      setFieldValue(preciseFieldName, '');
    }
  }, [roundedFieldValue]);
  // Set the regular field value to be the rounded version of the precise value
  useEffect(() => {
    const preciseValue = preciseFieldValue;
    if (isNumber(preciseValue)) {
      const roundedValue = round(preciseValue!, decimalPlaces);
      setFieldValue(fieldName, roundedValue);
      setStoredRoundedValue(roundedValue);
    }
  }, [preciseFieldValue]);

  return null;
};

export default useRoundedAndPreciseValue;
