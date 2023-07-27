import { TFunction } from 'i18next';
import * as Yup from 'yup';

export const buildValidationSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  const fieldIsRequired = (field: string) =>
    t('validate.common.isrequired', '{{field}} is required.', { field });

  return Yup.object().shape({
    username: Yup.string()
      .typeError(fieldIsRequired(translationTexts.username))
      .required(fieldIsRequired(translationTexts.username)),
  });
};
