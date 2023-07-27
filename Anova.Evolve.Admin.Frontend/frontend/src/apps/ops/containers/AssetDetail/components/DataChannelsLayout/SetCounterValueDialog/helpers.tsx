import { TFunction } from 'i18next';
import { formatApiErrors } from 'utils/format/errors';
import { isNumber } from 'utils/format/numbers';
import { fieldIsRequired, fieldMustBeNumber } from 'utils/forms/errors';
import * as Yup from 'yup';
import { Values } from './types';

export const buildValidationSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  const counterValueIntegerValidationText = t(
    'ui.setCounterValue.mustNotBeDecimal',
    'Counter Value must not be a decimal value'
  );

  return Yup.object().shape({
    counterValue: Yup.number()
      .typeError(fieldMustBeNumber(t, translationTexts.counterValueText))
      .required(fieldIsRequired(t, translationTexts.counterValueText))
      .integer(counterValueIntegerValidationText),
  });
};

export const formatInitialValues = (): Values => {
  return {
    counterValue: null,
  };
};

export const formatValuesForApi = (values: Values) => {
  return {
    counterValue: isNumber(values.counterValue) ? values.counterValue : null,
  };
};

export const mapApiErrorsToFields = (t: TFunction, errors: any) => {
  if (!errors) {
    return null;
  }

  if (Array.isArray(errors)) {
    return formatApiErrors(t, errors);
  }

  return errors;
};
