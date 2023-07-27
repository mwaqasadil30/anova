import { RosterDto } from 'api/admin/api';
import { TFunction } from 'i18next';
import { formatApiErrors } from 'utils/format/errors';
import { fieldIsRequired } from 'utils/forms/errors';
import * as Yup from 'yup';
import { Values } from './types';

export const buildValidationSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  return Yup.object().shape({
    description: Yup.string()
      .required(fieldIsRequired(t, translationTexts.descriptionText))
      .typeError(fieldIsRequired(t, translationTexts.descriptionText)),
  });
};

export const formatInitialValues = (
  values?: RosterDto | null,
  isCreating?: boolean
): Values => {
  return {
    description: values?.description || '',
    // Default isEnabled to true if the user's creating a new Roster
    isEnabled: isCreating ? true : values?.isEnabled || false,
    rosterUsers: values?.rosterUsers || [],
  };
};

export const formatValuesForApi = (values: Values): RosterDto => {
  return {
    description: values.description || '',
    isEnabled: values.isEnabled || false,
    rosterUsers: values.rosterUsers || [],
  } as RosterDto;
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
