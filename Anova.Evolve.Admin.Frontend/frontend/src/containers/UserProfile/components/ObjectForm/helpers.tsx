/* eslint-disable indent */
import { ReasonCodeEnum } from 'api/admin/api';
import { TFunction } from 'i18next';
import camelCase from 'lodash/camelCase';
import { errorReasonCodeToMessage } from 'utils/format/errors';
import {
  fieldIsIncorrect,
  fieldMaxLength,
  fieldMustBeAnEmail,
} from 'utils/forms/errors';
import * as Yup from 'yup';
import { UserProfileEditDTO, UserProfileSaveDTO, Values } from './types';

export const buildValidationSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  const passwordsMustMatchText = t(
    'validate.changepassword.passwordsDoNotMatch',
    'Passwords do not match'
  );

  return Yup.object().shape({
    emailAddress: Yup.string()
      .email(fieldMustBeAnEmail(t, translationTexts.emailText))
      .nullable()
      .max(300, fieldMaxLength(t)),
    // NOTE: Because the user cannot edit their first/last name, we
    // temporarily removed any validation for those two disabled fields
    // firstName: Yup.string()
    //   .nullable()
    //   .typeError(fieldIsRequired(t, translationTexts.firstNameText))
    //   .required(fieldIsRequired(t, translationTexts.firstNameText))
    //   .max(40, fieldMaxLength(t)),
    // lastName: Yup.string()
    //   .nullable()
    //   .typeError(fieldIsRequired(t, translationTexts.lastNameText))
    //   .required(fieldIsRequired(t, translationTexts.lastNameText))
    //   .max(40, fieldMaxLength(t)),
    // Only validate the password fields are required if needed. If they're
    // passed in regardless, they still need to match (even if they aren't
    // required)
    newPassword: Yup.mixed().oneOf(
      [Yup.ref('confirmPassword'), null],
      passwordsMustMatchText
    ),
    confirmPassword: Yup.mixed().oneOf(
      [Yup.ref('newPassword'), null],
      passwordsMustMatchText
    ),
  });
};

export const formatInitialValues = (
  values?: UserProfileEditDTO | null
): Values => {
  return {
    emailAddress: values?.emailAddress || '',
    firstName: values?.firstName || '',
    lastName: values?.lastName || '',
    oldPassword: '',
    confirmPassword: '',
    newPassword: '',
  };
};

export const formatValuesForApi = (values: Values): UserProfileSaveDTO => {
  return {
    // firstName: values.firstName,
    // lastName: values.lastName,
    emailAddress: values.emailAddress || '',
    oldPassword: values.oldPassword,
    newPassword: values.newPassword,
    confirmPassword: values.confirmPassword,
  };
};

const customErrorReasonCodeToMessage = (
  t: TFunction,
  fieldName: string,
  code?: ReasonCodeEnum | null
) => {
  if (code === ReasonCodeEnum.UnAuthorized) {
    const errorMessage = fieldIsIncorrect(
      t,
      t('ui.changepassword.oldPassword', 'Old Password')
    );

    return ['oldPassword', errorMessage];
  }

  return [fieldName, errorReasonCodeToMessage(t, code)];
};

export const mapApiErrorsToFields = (t: TFunction, errors: any) => {
  if (!errors) {
    return null;
  }

  if (Array.isArray(errors)) {
    return errors.reduce((prev, current) => {
      const fieldName = camelCase(current?.propertyName) || '';

      const [formattedFieldName, errorMessage] = customErrorReasonCodeToMessage(
        t,
        fieldName,
        current?.reasonCodeTypeId
      );

      if (!formattedFieldName || !errorMessage) {
        return prev;
      }

      if (!prev[formattedFieldName]) {
        prev[formattedFieldName] = [];
      }

      prev[formattedFieldName].push(errorMessage);

      return prev;
    }, {});
  }
  return null;
};
