import { CreateB2cUserRequest } from 'api/admin/api';
import { isNumber } from 'utils/format/numbers';
import { Values } from './types';

export const formatInitialValues = (): Values => {
  return {
    emailAddress: '',
    emailDomain: '',
    firstName: '',
    lastName: '',
    company: '',
    applicationTimeoutHours: 0,
    applicationTimeoutMinutes: 0,
  };
};

interface FormatValuesForApiOptions {
  authenticationProviderId?: number;
  domainId: string;
  associatedEmailSuffixes?: string[] | null;
}

export const formatValuesForApi = (
  values: Values,
  options: FormatValuesForApiOptions
): CreateB2cUserRequest => {
  const {
    associatedEmailSuffixes,
    authenticationProviderId,
    domainId,
  } = options;

  return {
    authenticationProviderId,
    domainId,

    // If the identity provider has specific email suffixes, combine the
    // username portion (which is using the `emailAddress` field) with the
    // email suffix/domain. Otherwise, just send the full email address.
    emailAddress:
      associatedEmailSuffixes && associatedEmailSuffixes.length > 0
        ? `${values.emailAddress}@${values.emailDomain}`
        : values.emailAddress,
    firstName: values.firstName,
    lastName: values.lastName,
    companyName: values.company,
    applicationTimeoutHours: isNumber(values.applicationTimeoutHours)
      ? (values.applicationTimeoutHours as number)
      : undefined,
    applicationTimeoutMinutes: isNumber(values.applicationTimeoutMinutes)
      ? (values.applicationTimeoutMinutes as number)
      : undefined,
  } as CreateB2cUserRequest;
};
