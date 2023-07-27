import {
  DataChannelSaveIntegrationProfileCollectionDTO,
  ErrorRecordResponseModel,
  IntegrationProfileCollectionDTO,
} from 'api/admin/api';
import { getIn } from 'formik';
import set from 'lodash/set';
import { TFunction } from 'i18next';
import camelCase from 'lodash/camelCase';
import { errorReasonCodeToMessage } from 'utils/format/errors';
import { Values } from './types';

export const formatInitialValues = (
  integration?: IntegrationProfileCollectionDTO | null
): Values => {
  return {
    integrationProfile1: {
      isIntegrationEnabled:
        integration?.integrationProfile1?.isIntegrationEnabled || false,
      integrationId: integration?.integrationProfile1?.integrationId || null,
      integrationDomainId: integration?.integrationProfile1?.domainId || null,
    },
    integrationProfile2: {
      isIntegrationEnabled:
        integration?.integrationProfile2?.isIntegrationEnabled || false,
      integrationId: integration?.integrationProfile2?.integrationId || null,
      integrationDomainId: integration?.integrationProfile2?.domainId || null,
    },
  };
};

export const formatValuesForApi = (
  values: Values
): DataChannelSaveIntegrationProfileCollectionDTO => {
  // @ts-ignore
  return {
    integrationProfile1: {
      isIntegrationEnabled:
        values?.integrationProfile1.isIntegrationEnabled || false,
      integrationId: values?.integrationProfile1?.integrationId || null,
      integrationDomainId:
        values?.integrationProfile1?.integrationDomainId || null,
    },
    integrationProfile2: {
      isIntegrationEnabled:
        values?.integrationProfile2.isIntegrationEnabled || false,
      integrationId: values?.integrationProfile2.integrationId || null,
      integrationDomainId:
        values?.integrationProfile2.integrationDomainId || null,
    },
  } as DataChannelSaveIntegrationProfileCollectionDTO;
};

export const mapApiErrorsToFields = (t: TFunction, errors: any) => {
  if (!errors) {
    return null;
  }

  if (Array.isArray(errors)) {
    const errorsWithDottedPaths = (errors as ErrorRecordResponseModel[]).map(
      (error) => {
        const fieldNamePrefix = `integrationProfile${error.recordId}`;
        return {
          ...error,
          propertyName: `${fieldNamePrefix}.${error.propertyName}`,
        };
      }
    );

    return (errorsWithDottedPaths as ErrorRecordResponseModel[]).reduce<
      Record<string, string[]>
    >((prev, current) => {
      // NOTE: Lodash's camelCase will strip out symbols, including '.' which
      // will affect the dotted path for a field.
      const fieldName =
        (current.propertyName || '').split('.').map(camelCase).join('.') || '';
      const errorMessage = errorReasonCodeToMessage(
        t,
        current?.reasonCodeTypeId,
        current.errorMessage
      );

      if (!fieldName || !errorMessage) {
        return prev;
      }

      if (!getIn(prev, fieldName)) {
        set(prev, fieldName, []);
      }

      const fieldErrors = getIn(prev, fieldName);
      fieldErrors.push(errorMessage);

      return prev;
    }, {});
  }

  return errors;
};
