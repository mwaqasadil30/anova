import { TFunction } from 'i18next';
import { fieldIsRequired } from 'utils/forms/errors';
import * as Yup from 'yup';

export const buildValidationSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  return Yup.object().shape({
    note: Yup.object().shape({
      notes: Yup.string().required(
        fieldIsRequired(t, translationTexts.noteText)
      ),
    }),
  });
};
