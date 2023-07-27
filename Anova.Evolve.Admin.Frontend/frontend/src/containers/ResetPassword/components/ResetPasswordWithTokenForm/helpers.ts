import { TFunction } from 'i18next';
import { formatApiErrors } from 'utils/format/errors';
import * as Yup from 'yup';
import { Values } from './types';

export const initialValues: Values = {
  newPassword: '',
  confirmNewPassword: '',
};

export const buildValidationSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  const fieldIsRequired = (field: string) =>
    t('validate.common.isrequired', '{{field}} is required.', { field });

  const passwordsMustMatchText = t(
    'validate.changepassword.passwordsDoNotMatch',
    'Passwords do not match'
  );

  return Yup.object().shape({
    // Other validation for this field is done via the Formik `validate` prop
    newPassword: Yup.string()
      .typeError(fieldIsRequired(translationTexts.password))
      .required(fieldIsRequired(translationTexts.password)),
    confirmNewPassword: Yup.string()
      .typeError(fieldIsRequired(translationTexts.confirmPassword))
      .required(fieldIsRequired(translationTexts.confirmPassword))
      .oneOf([Yup.ref('newPassword'), null], passwordsMustMatchText),
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
