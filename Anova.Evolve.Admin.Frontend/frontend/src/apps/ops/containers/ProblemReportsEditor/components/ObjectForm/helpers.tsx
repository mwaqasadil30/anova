import {
  ProblemReportStatusDto,
  ProblemReportWorkOrderDto,
  ProblemReportDto,
} from 'api/admin/api';
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
    description: Yup.string()
      .required(fieldIsRequired(t, translationTexts.descriptionText))
      .typeError(fieldIsRequired(t, translationTexts.descriptionText)),
    workOrder: Yup.object().shape({
      workOrderNumber: Yup.number()
        .nullable()
        .typeError(fieldMustBeNumber(t, translationTexts.workOrderNumberText)),
    }),
  });
};

export const formatInitialValues = (
  values?: ProblemReportDto | null
): Values => {
  return {
    problemNumber: values?.problemNumber || '',
    description: values?.description || '',
    primaryDataChannelInfo: values?.primaryDataChannelInfo || null,
    importanceLevelTypeId: isNumber(values?.importanceLevelTypeId)
      ? values?.importanceLevelTypeId
      : '',
    reportedBy: values?.reportedBy || '',
    resolution: values?.resolution || '',
    statusTypeId: values?.statusTypeId,
    isDisableAutoClose: values?.isDisableAutoClose || false,
    currentOpStatus: values?.currentOpStatus || '',
    tags: values?.tags || [],
    statusInformation: {
      openDate: values?.statusInformation?.openDate || null,
      fixDate: values?.statusInformation?.fixDate || null,
      customerPriorityTypeId:
        values?.statusInformation?.customerPriorityTypeId || '',
    } as ProblemReportStatusDto,
    workOrder: {
      workOrderInitiatedDate: values?.workOrder?.workOrderInitiatedDate || null,
      workOrderClosedDate: values?.workOrder?.workOrderClosedDate || null,
      workOrderNumber: values?.workOrder?.workOrderNumber || '',
    } as ProblemReportWorkOrderDto,
  };
};

export const formatValuesForApi = (values: Values): ProblemReportDto => {
  return {
    domainId: values?.domainId,
    description: values?.description || '',
    primaryDataChannelInfo: values?.primaryDataChannelInfo || null,
    importanceLevelTypeId: isNumber(values?.importanceLevelTypeId)
      ? values?.importanceLevelTypeId
      : undefined,
    reportedBy: values?.reportedBy || '',
    resolution: values?.resolution || null,
    isDisableAutoClose: values?.isDisableAutoClose || false,
    currentOpStatus: values?.currentOpStatus || '',
    tags: values?.tags || [],
    statusInformation: {
      openDate: values?.statusInformation?.openDate || null,
      fixDate: values?.statusInformation?.fixDate || null,
      customerPriorityTypeId:
        values?.statusInformation?.customerPriorityTypeId || null,
    } as ProblemReportStatusDto,
    workOrder: {
      workOrderInitiatedDate: values?.workOrder?.workOrderInitiatedDate || null,
      workOrderClosedDate: values?.workOrder?.workOrderClosedDate || null,
      workOrderNumber: values?.workOrder?.workOrderNumber || '',
    } as ProblemReportWorkOrderDto,
  } as ProblemReportDto;
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
