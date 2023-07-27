import { RosterUserDto, RosterUserSummaryDto } from 'api/admin/api';
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
    userId: Yup.string()
      .required(fieldIsRequired(t, translationTexts.usernameText))
      .typeError(fieldIsRequired(t, translationTexts.usernameText)),
  });
};

export const formatInitialValues = (
  rosterUser?: RosterUserSummaryDto | null
): Values => {
  return {
    userId: rosterUser?.userId || '',
    // When adding a roster user, default the isEnabled checkbox to true
    isEnabled: rosterUser ? rosterUser?.isEnabled || false : true,
    isEmailSelected: rosterUser?.isEmailSelected || false,
    emailMessageTemplateId: rosterUser?.emailMessageTemplateId || '',
    isPushSelected: rosterUser?.isPushSelected || false,
    emailToPhoneMessageTemplateId:
      rosterUser?.emailToPhoneMessageTemplateId || '',
    isEmailToPhoneSelected: rosterUser?.isEmailToPhoneSelected || false,
  };
};

export const formatValuesForApi = (values: Values): RosterUserDto => {
  // @ts-ignore
  return {
    userId: values.userId || '',
    isEnabled: values.isEnabled || false,
    isEmailSelected: values.isEmailSelected || false,
    emailMessageTemplateId: values.emailMessageTemplateId || null,
    isPushSelected: values.isPushSelected || false,
    isEmailToPhoneSelected: values.isEmailToPhoneSelected || false,
    emailToPhoneMessageTemplateId: values.emailToPhoneMessageTemplateId || null,
  } as RosterUserDto;
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
