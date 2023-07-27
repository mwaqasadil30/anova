import {
  ErrorRecordResponseModel,
  ProblemReportDetailDto,
  ProblemReportStatusDto,
  ProblemReportWorkOrderDto,
} from 'api/admin/api';
import { getIn } from 'formik';
import { TFunction } from 'i18next';
import camelCase from 'lodash/camelCase';
import set from 'lodash/set';
import { errorReasonCodeToMessage } from 'utils/format/errors';
import { isNumber } from 'utils/format/numbers';
import { Values } from './types';

export const formatInitialValues = (
  values?: ProblemReportDetailDto | null
): Values => {
  return {
    problemReportId: values?.problemReportId,
    problemReport: {
      problemNumber: values?.problemReport?.problemNumber || '',
      description: values?.problemReport?.description || '',
      primaryDataChannelInfo:
        values?.problemReport?.primaryDataChannelInfo || null,
      importanceLevelTypeId: isNumber(
        values?.problemReport?.importanceLevelTypeId
      )
        ? values?.problemReport?.importanceLevelTypeId
        : undefined,
      reportedBy: values?.problemReport?.reportedBy || '',
      resolution: values?.problemReport?.resolution || '',
      statusTypeId: values?.problemReport?.statusTypeId,
      isDisableAutoClose: values?.problemReport?.isDisableAutoClose || false,
      currentOpStatus: values?.problemReport?.currentOpStatus || '',
      tags: values?.problemReport?.tags || [],
      statusInformation: {
        openDate: values?.problemReport?.statusInformation?.openDate || null,
        fixDate: values?.problemReport?.statusInformation?.fixDate || null,
        customerPriorityTypeId:
          values?.problemReport?.statusInformation?.customerPriorityTypeId ||
          '',
      } as ProblemReportStatusDto,
      workOrder: {
        workOrderInitiatedDate:
          values?.problemReport?.workOrder?.workOrderInitiatedDate || null,
        workOrderClosedDate:
          values?.problemReport?.workOrder?.workOrderClosedDate || null,
        workOrderNumber:
          values?.problemReport?.workOrder?.workOrderNumber || null,
      } as ProblemReportWorkOrderDto,
    },
    affectedDataChannels: values?.affectedDataChannels || [],
    activityLog: values?.activityLog || [],
  };
};

export const formatValuesForApi = (values: Values): ProblemReportDetailDto => {
  return {
    problemReportId: values?.problemReportId,
    problemReport: {
      problemNumber: values?.problemReport?.problemNumber || '',
      description: values?.problemReport?.description || '',
      primaryDataChannelInfo:
        values?.problemReport?.primaryDataChannelInfo || null,
      importanceLevelTypeId: isNumber(
        values?.problemReport?.importanceLevelTypeId
      )
        ? values?.problemReport?.importanceLevelTypeId
        : undefined,
      reportedBy: values?.problemReport?.reportedBy || '',
      resolution: values?.problemReport?.resolution || '',
      statusTypeId: values?.problemReport?.statusTypeId, // this isnt being used it seems
      isDisableAutoClose: values?.problemReport?.isDisableAutoClose || false,
      currentOpStatus: values?.problemReport?.currentOpStatus || '',
      tags: values?.problemReport?.tags || [],
      statusInformation: {
        openDate: values?.problemReport?.statusInformation?.openDate || null,
        fixDate: values?.problemReport?.statusInformation?.fixDate || null,
        customerPriorityTypeId:
          values?.problemReport?.statusInformation?.customerPriorityTypeId ||
          '',
      } as ProblemReportStatusDto,
      workOrder: {
        workOrderInitiatedDate:
          values?.problemReport?.workOrder?.workOrderInitiatedDate || null,
        workOrderClosedDate:
          values?.problemReport?.workOrder?.workOrderClosedDate || null,
        workOrderNumber:
          values?.problemReport?.workOrder?.workOrderNumber || null,
      } as ProblemReportWorkOrderDto,
    },
    affectedDataChannels: values?.affectedDataChannels || [],
    activityLog: values?.activityLog || [],
  } as ProblemReportDetailDto;
};

export const mapApiErrorsToFields = (t: TFunction, errors: any) => {
  if (!errors) {
    return null;
  }

  // We use a modified version of the "formatApiErrors" helper function here
  // because the back-end returns only the specific property name, and not the
  // path to get to that property.
  if (Array.isArray(errors)) {
    return (errors as ErrorRecordResponseModel[]).reduce<
      Record<string, string[]>
    >((prev, current) => {
      const propertyNameCamelCase = current.propertyName
        ? camelCase(current.propertyName)
        : '';

      const getFieldName = () => {
        if (
          propertyNameCamelCase === 'isPrimary' ||
          propertyNameCamelCase === 'isFaulty'
        ) {
          return (
            camelCase(`affectedDataChannels.${current?.propertyName!}`) || ''
          );
        }

        if (
          propertyNameCamelCase === 'notes' ||
          propertyNameCamelCase === 'isSystem' ||
          propertyNameCamelCase === 'problemReportActivityLogId' ||
          propertyNameCamelCase === 'createdByUserName' ||
          propertyNameCamelCase === 'createdDate' ||
          propertyNameCamelCase === 'lastUpdateUserName' ||
          propertyNameCamelCase === 'lastUpdatedDate'
        ) {
          return camelCase(`activityLog.${current?.propertyName!}`) || '';
        }

        return `problemReport.${camelCase(current?.propertyName!)}` || '';
      };

      const errorMessage = errorReasonCodeToMessage(
        t,
        current?.reasonCodeTypeId,
        current.errorMessage
      );

      if (!getFieldName() || !errorMessage) {
        return prev;
      }

      if (!getIn(prev, getFieldName())) {
        set(prev, getFieldName(), []);
      }

      const fieldErrors = getIn(prev, getFieldName());
      fieldErrors.push(errorMessage);

      return prev;
    }, {});
  }

  return errors;
};
