import {
  ErrorRecordResponseModel,
  ReasonCodeEnum,
  ValidationErrorInfo,
} from 'api/admin/api';
import { TFunction } from 'i18next';
import camelCase from 'lodash/camelCase';

export const formatValidationErrors = (
  validationErrors?: ValidationErrorInfo[] | null
) => {
  if (!validationErrors || validationErrors.length === 0) {
    return null;
  }

  const formattedValidationErrors = validationErrors.reduce(
    (prev, currentError) => {
      const { propertyName } = currentError;
      if (propertyName) {
        const formattedPropertyName =
          propertyName.charAt(0).toLowerCase() + propertyName.slice(1);
        // @ts-ignore
        prev[formattedPropertyName] = currentError.errorDescription; // eslint-disable-line no-param-reassign
      }
      return prev;
    },
    {}
  );

  return formattedValidationErrors;
};

export const errorReasonCodeToMessage = (
  t: TFunction,
  code?: ErrorRecordResponseModel['reasonCodeTypeId'] | null,
  errorMessage?: ErrorRecordResponseModel['errorMessage']
) => {
  switch (code) {
    case ReasonCodeEnum.RequiredField:
      return t('validate.common.required', 'Required');
    case ReasonCodeEnum.NotFound:
      return t('validate.common.notFound', 'Not found');
    case ReasonCodeEnum.RosterUser_CommunicationMissing:
      return t(
        'validate.rosterEditor.rosterUserRequiredCommunicationMethod',
        'At least one communication method must be enabled.'
      );
    case ReasonCodeEnum.RosterUser_MissingEmailAddress:
      return t(
        'validate.rosterEditor.rosterUserMissingEmailAddress',
        'Email address is required if email communication is enabled.'
      );
    case ReasonCodeEnum.RecordAlreadyExists:
      return t('validate.common.recordAlreadyExists', 'Record already exists');
    default:
      return errorMessage || '';
  }
};

export const formatApiErrors = (t: TFunction, errors: any) => {
  if (!errors) {
    return null;
  }

  if (Array.isArray(errors)) {
    return (errors as ErrorRecordResponseModel[]).reduce<
      Record<string, string[]>
    >((prev, current) => {
      const fieldName = camelCase(current?.propertyName!) || '';
      const errorMessage = errorReasonCodeToMessage(
        t,
        current?.reasonCodeTypeId,
        current.errorMessage
      );

      if (!fieldName || !errorMessage) {
        return prev;
      }

      if (!prev[fieldName]) {
        prev[fieldName] = [];
      }

      prev[fieldName].push(errorMessage);

      return prev;
    }, {});
  }

  // If we run into old validation errors that were given as an object instead
  // of an array (which shouldnt happen from the API), we handle them here.
  return errors;
};
