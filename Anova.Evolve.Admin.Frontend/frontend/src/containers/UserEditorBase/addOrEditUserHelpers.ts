import { TFunction } from 'i18next';
import { formatApiErrors } from 'utils/format/errors';
import * as Yup from 'yup';

export const buildValidationSchema = (t: TFunction) => {
  const minimum = 0;
  const maximumMinutes = 59;
  const minimumText = t(
    'validate.common.minimum',
    'Must be at least {{minimum}}',
    { minimum }
  );
  const minutesRangeText = t(
    'validate.common.betweenMinAndMax',
    'Must be between {{minimum}} and {{maximum}}',
    { minimum, maximum: maximumMinutes }
  );

  return Yup.object().shape({
    applicationTimeoutHours: Yup.number()
      .typeError(minimumText)
      .min(0, minimumText),
    applicationTimeoutMinutes: Yup.number()
      .typeError(minutesRangeText)
      .min(0, minutesRangeText)
      .max(59, minutesRangeText),
  });
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
