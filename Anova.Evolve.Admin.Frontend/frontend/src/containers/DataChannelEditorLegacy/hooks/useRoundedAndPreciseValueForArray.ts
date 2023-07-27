import { FormikProps, getIn } from 'formik';
import round from 'lodash/round';
import { useEffect, useState } from 'react';
import usePrevious from 'react-use/lib/usePrevious';
import { isNumber } from 'utils/format/numbers';
import { DCEditorEventRule, Values } from '../components/ObjectForm/types';

interface Props {
  values: Values;
  setFieldValue: FormikProps<Values>['setFieldValue'];
  arrayPropertyName: keyof Pick<
    Values,
    | 'levelEventRules'
    | 'missingDataEventRules'
    | 'scheduledDeliveryEventRules'
    | 'usageRateEventRules'
  >;
  propertyName: keyof Pick<
    DCEditorEventRule,
    'eventValue' | 'hysteresis' | 'usageRate'
  >;
  decimalPlaces: number;
}

const useRoundedAndPreciseValueForArray = ({
  values,
  setFieldValue,
  arrayPropertyName,
  propertyName,
  decimalPlaces,
}: Props) => {
  const [storedRoundedValues, setStoredRoundedValues] = useState<
    Record<string, any>
  >({});

  // Precise values
  const precisePropertyName = `_precise_${propertyName}`;
  const preciseValues = values[arrayPropertyName]?.map(
    // @ts-ignore
    (event) => event[precisePropertyName]
  );
  const joinedPreciseValues = preciseValues?.join('|');
  const prevPreciseValues = usePrevious(joinedPreciseValues);

  // Rounded values
  const roundedValues = values[arrayPropertyName]?.map(
    (event) => event[propertyName]
  );
  const joinedRoundedValues = roundedValues?.join('|');
  const prevRoundedValues = usePrevious(joinedRoundedValues);

  // Reset a field's precise value if the user changed the regular field value
  useEffect(() => {
    const splitPreviousRoundedValues = prevRoundedValues?.split('|');

    joinedRoundedValues?.split('|').forEach((roundedValue, index) => {
      const roundedValueNumber = Number(roundedValue);
      const fieldName = `${arrayPropertyName}.${index}.${propertyName}`;
      const preciseFieldName = `${arrayPropertyName}.${index}.${precisePropertyName}`;
      const storedRoundedValue = storedRoundedValues[fieldName];
      const preciseFieldValue = getIn(values, preciseFieldName);

      // The condition that would've been used in a useEffect hook if we could
      // use the useEffect hook in a loop
      const didRoundedValueChange =
        Number(splitPreviousRoundedValues?.[index]) !== roundedValueNumber;

      if (
        didRoundedValueChange &&
        isNumber(storedRoundedValue) &&
        Number(storedRoundedValue) !== roundedValueNumber &&
        isNumber(preciseFieldValue)
      ) {
        setFieldValue(preciseFieldName, '');
      }
    });
  }, [joinedRoundedValues]);

  // Set the regular field value to be the rounded version of the precise value
  useEffect(() => {
    const splitPreviousPreciseValues = prevPreciseValues?.split('|');

    joinedPreciseValues?.split('|').forEach((preciseValue, index) => {
      const fieldName = `${arrayPropertyName}.${index}.${propertyName}`;

      // The condition that would've been used in a useEffect hook if we could
      // use the useEffect hook in a loop
      const didPreciseValueChange =
        Number(splitPreviousPreciseValues?.[index]) !== Number(preciseValue);

      if (didPreciseValueChange && isNumber(preciseValue)) {
        const roundedValue = round(Number(preciseValue), decimalPlaces);
        setFieldValue(fieldName, roundedValue);
        setStoredRoundedValues((prevState) => ({
          ...prevState,
          [fieldName]: roundedValue,
        }));
      }
    });
  }, [joinedPreciseValues]);

  return null;
};

export default useRoundedAndPreciseValueForArray;
