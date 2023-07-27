import { UpdateB2cUserRequest, UserDto } from 'api/admin/api';
import { secondsToHoursAndMinutes } from 'utils/format/dates';
import { isNumber } from 'utils/format/numbers';
import { Values } from './types';

export const formatInitialValues = (
  userDetails: UserDto | null | undefined
): Values => {
  const splittedEmailAddress = userDetails?.emailAddress?.split('@') || [];
  const splittedUsername = splittedEmailAddress?.[0] || '';
  const splittedEmailDomain = splittedEmailAddress?.[1] || '';
  const emailAddress = userDetails?.associatedEmailSuffixes?.length
    ? splittedUsername
    : userDetails?.emailAddress || '';

  const emailDomain = userDetails?.associatedEmailSuffixes?.length
    ? splittedEmailDomain
    : '';

  const { hours, minutes } = secondsToHoursAndMinutes(
    userDetails?.applicationTimeoutInSeconds
  );

  return {
    emailAddress,
    emailDomain,
    firstName: userDetails?.firstName || '',
    lastName: userDetails?.lastName || '',
    company: userDetails?.companyName || '',
    applicationTimeoutHours: hours,
    applicationTimeoutMinutes: minutes,
  };
};

export const formatValuesForApi = (
  values: Values,
  userDetails: UserDto | null | undefined
): UpdateB2cUserRequest => {
  return {
    id: userDetails?.id,
    authenticationProviderId: userDetails?.authenticationProviderId,
    domainId: userDetails?.domainId,

    // If the identity provider has specific email suffixes, combine the
    // username portion (which is using the `emailAddress` field) with the
    // email suffix/domain. Otherwise, just send the full email address.
    emailAddress: userDetails?.associatedEmailSuffixes?.length
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
  } as UpdateB2cUserRequest;
};
