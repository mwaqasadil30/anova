/* eslint-disable indent */
import { MessageTemplateDto } from 'api/admin/api';
import { TFunction } from 'i18next';
import { formatApiErrors } from 'utils/format/errors';
import { Values } from './types';

export const formatInitialValues = (): Values => {
  return {
    messageTemplateId: undefined,
    subjectTemplate: '',
    bodyTemplate: '',
    replyTo: '',
    sendToAddressList: '',
    sendToCcAddressList: '',
    sendToBccAddressList: '',
  };
};

export const formatValuesForApi = (values: Values): MessageTemplateDto => {
  return {
    messageTemplateId: values?.messageTemplateId
      ? values?.messageTemplateId
      : undefined,
    subjectTemplate: values?.subjectTemplate,
    bodyTemplate: values?.bodyTemplate,
    replyTo: values?.replyTo,
    sendToAddressList: values?.sendToAddressList,
    sendToCcAddressList: values?.sendToCcAddressList,
    sendToBccAddressList: values?.sendToBccAddressList,
  } as MessageTemplateDto;
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
