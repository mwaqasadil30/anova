import { QuickEditRtuNotesDTO } from 'api/admin/api';
import { TFunction } from 'i18next';
import { formatApiErrors } from 'utils/format/errors';
import { Values } from './types';

export const formatInitialValues = (
  rtuNotesData?: QuickEditRtuNotesDTO | null
): Values => {
  return {
    permanentNotes: rtuNotesData?.permanentNotes || '',
    temporaryNotes: rtuNotesData?.temporaryNotes || '',
    installationDate: rtuNotesData?.installationDate || '',
    modelDescription: rtuNotesData?.modelDescription || '',
    functionalLocation: rtuNotesData?.functionalLocation || '',
    simIccId: rtuNotesData?.simIccId || '',
  };
};

export const formatValuesForApi = (values: Values) => {
  return {
    permanentNotes: values?.permanentNotes || '',
    temporaryNotes: values?.temporaryNotes || '',
    installationDate: values?.installationDate || '',
    modelDescription: values?.modelDescription || '',
    functionalLocation: values?.functionalLocation || '',
    simIccId: values?.simIccId || '',
  } as QuickEditRtuNotesDTO;
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
