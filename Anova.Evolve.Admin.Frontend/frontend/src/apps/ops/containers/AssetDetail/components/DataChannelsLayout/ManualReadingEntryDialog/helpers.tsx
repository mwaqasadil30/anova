import { DataChannelManualReadingDTO } from 'api/admin/api';
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
  return Yup.object().shape({
    readingValue: Yup.number()
      .typeError(fieldMustBeNumber(t, translationTexts.readingValueText))
      .required(fieldIsRequired(t, translationTexts.readingValueText)),
  });
};

export const formatInitialValues = (): Values => {
  return {
    readingValue: '',
    // readingDate: dataChannelDetails?.latestReadingTimestamp || '',
    readingTime: new Date(),
  };
};

export const formatValuesForApi = (values: Values) => {
  return {
    readingValue: isNumber(values.readingValue) ? values.readingValue : null,
    // reading time includes date + time from the useful DateTimePicker component
    readingTime: values.readingTime || null,
    // chosenUnitType is nullable, will use values once were told to implement unit editing
    chosenUnitType: null,
  } as DataChannelManualReadingDTO;
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
