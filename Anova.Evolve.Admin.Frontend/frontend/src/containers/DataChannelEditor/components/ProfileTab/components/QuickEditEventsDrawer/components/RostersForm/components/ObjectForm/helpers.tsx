import { DropDownListDtoOfLong } from 'api/admin/api';
import { TFunction } from 'i18next';
import { formatApiErrors } from 'utils/format/errors';
import * as Yup from 'yup';
import { RosterInForm, Values } from './types';

export const buildValidationSchema = () => {
  return Yup.object().shape({});
};

export const formatInitialValues = (
  values?: DropDownListDtoOfLong[]
): Values => {
  const formattedRosters = values
    ?.filter((value) => !!value.id)
    .map<RosterInForm>((value) => ({ rosterId: value.id! }));
  return {
    rosters: formattedRosters || [],
  };
};

export const formatValuesForApi = (values: Values) => {
  const formattedRosterIds = values.rosters
    ?.map<number>((roster) => roster.rosterId!)
    .filter(Boolean);
  return {
    rosterIds: formattedRosterIds || [],
  };
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
