/* eslint-disable indent */
import {
  AssetGroupDto,
  DomainUserRolesDTO,
  ReasonCodeEnum,
  UserDomainAssetGroupsDto,
  UserDomainRoleDto,
  UserDto,
  UserTypeEnum,
} from 'api/admin/api';
import { TFunction } from 'i18next';
import camelCase from 'lodash/camelCase';
import moment from 'moment';
import { EMPTY_GUID } from 'utils/api/constants';
import { errorReasonCodeToMessage } from 'utils/format/errors';
import { isNumber } from 'utils/format/numbers';
import {
  fieldAlreadyExists,
  fieldIsRequired,
  fieldMaxLength,
  fieldMustBeAnEmail,
} from 'utils/forms/errors';
import * as Yup from 'yup';
import { DomainWithRoleAndAssetGroup, Values } from './types';

export const buildValidationSchema = (
  t: TFunction,
  isPasswordRequired: boolean,
  translationTexts: Record<string, string>
) => {
  const passwordsMustMatchText = t(
    'validate.changepassword.passwordsDoNotMatch',
    'Passwords do not match'
  );

  return Yup.object().shape({
    userName: Yup.string()
      .matches(/^[^\s@]+$/, {
        message: t(
          'validate.username.cannotContainCharacters',
          'Username cannot contain spaces or the "@" symbol'
        ),
      })
      .typeError(fieldIsRequired(t, translationTexts.usernameText))
      .required(fieldIsRequired(t, translationTexts.usernameText)),
    emailAddress: Yup.string()
      .typeError(fieldIsRequired(t, translationTexts.emailText))
      .required(fieldIsRequired(t, translationTexts.emailText))
      .email(fieldMustBeAnEmail(t, translationTexts.emailText))
      .nullable()
      .max(300, fieldMaxLength(t)),
    firstName: Yup.string()
      .nullable()
      .typeError(fieldIsRequired(t, translationTexts.firstNameText))
      .required(fieldIsRequired(t, translationTexts.firstNameText))
      .max(40, fieldMaxLength(t)),
    lastName: Yup.string()
      .nullable()
      .typeError(fieldIsRequired(t, translationTexts.lastNameText))
      .required(fieldIsRequired(t, translationTexts.lastNameText))
      .max(40, fieldMaxLength(t)),
    companyName: Yup.string()
      .nullable()
      .typeError(fieldIsRequired(t, translationTexts.companyNameText))
      .required(fieldIsRequired(t, translationTexts.companyNameText))
      .max(80, fieldMaxLength(t)),
    mobilePhone: Yup.string().nullable().max(20, fieldMaxLength(t)),
    emailToPhone: Yup.string()
      .nullable()
      .email(fieldMustBeAnEmail(t, translationTexts.emailText))
      .max(300, fieldMaxLength(t)),
    officePhone: Yup.string().nullable().max(20, fieldMaxLength(t)),
    fax: Yup.string().nullable().max(20, fieldMaxLength(t)),
    sms: Yup.string().nullable().max(20, fieldMaxLength(t)),
    userTypeId: Yup.number()
      .typeError(fieldIsRequired(t, translationTexts.userTypeText))
      .required(fieldIsRequired(t, translationTexts.userTypeText)),
    applicationTimeout: Yup.date()
      .nullable()
      .typeError(fieldIsRequired(t, translationTexts.applicationTimeoutText)),
    // Only validate the password fields are required if needed. If they're
    // passed in regardless, they still need to match (even if they aren't
    // required)
    newPassword: isPasswordRequired
      ? Yup.string()
          .typeError(fieldIsRequired(t, translationTexts.newPasswordText))
          .required(fieldIsRequired(t, translationTexts.newPasswordText))
          .oneOf([Yup.ref('confirmNewPassword'), null], passwordsMustMatchText)
      : Yup.mixed().oneOf(
          [Yup.ref('confirmNewPassword'), null],
          passwordsMustMatchText
        ),
    confirmNewPassword: isPasswordRequired
      ? Yup.string()
          .typeError(fieldIsRequired(t, translationTexts.confirmPasswordText))
          .required(fieldIsRequired(t, translationTexts.confirmPasswordText))
          .oneOf([Yup.ref('newPassword'), null], passwordsMustMatchText)
      : Yup.mixed().oneOf(
          [Yup.ref('newPassword'), null],
          passwordsMustMatchText
        ),
  });
};

export const secondsToDate = (seconds: number) => {
  return moment().startOf('day').seconds(seconds).toDate();
};

export const dateToSeconds = (date: Date | moment.Moment) => {
  const midnightDate = moment().startOf('day');
  const differenceInSeconds = moment(date).diff(midnightDate, 'seconds');

  // Handle the case when the user puts in 24:00. The time picker actually
  // resets the input to show 00:00 but actually uses the next day.
  const differenceInDays = moment(date).diff(midnightDate, 'days');
  if (differenceInDays >= 1) {
    return 0;
  }

  return differenceInSeconds;
};

export const formatInitialValues = (
  values?: UserDto | null,
  domainsWithUserRoles?: DomainUserRolesDTO[],
  isCreating?: boolean
): Values => {
  const applicationTimeoutInSeconds = values?.applicationTimeoutInSeconds || 0;
  const applicationTimeout = secondsToDate(applicationTimeoutInSeconds);

  const username = values?.userName;
  const userNameWithoutDomainSuffix = username?.split('@')[0];

  const startingDomainsValue = domainsWithUserRoles || [];

  const userTypeId = isCreating
    ? UserTypeEnum.WebUser
    : values?.userTypeId || '';

  const migratedToNewUi = isCreating ? true : values?.migratedToNewUi || false;

  return {
    userName: userNameWithoutDomainSuffix || '',
    emailAddress: values?.emailAddress || '',
    firstName: values?.firstName || '',
    lastName: values?.lastName || '',
    companyName: values?.companyName || '',
    mobilePhoneNumber: values?.mobilePhoneNumber || '',
    emailToSmsaddress: values?.emailToSmsaddress || '',
    workPhoneNumber: values?.workPhoneNumber || '',
    faxNumber: values?.faxNumber || '',
    smsNumber: values?.smsnumber || '',
    userTypeId,
    isPrimary: values?.isPrimary || false,
    applicationTimeout,
    migratedToNewUi,
    confirmNewPassword: '',
    newPassword: '',

    // Fields not currently used in the form, but will be passed back to the
    // API
    homePhoneNumber: values?.homePhoneNumber || '',
    isWebLogin: values?.isWebLogin || false,
    isPasswordChangeRequired: values?.isPasswordChangeRequired || false,
    isFederatedAuthentication: values?.isFederatedAuthentication || false,
    showPreviewPage: values?.showPreviewPage || false,

    // Domain + Asset groups
    defaultDomainId: values?.defaultDomainId || '',
    // Build a custom list of domains that includes both user roles + asset
    // groups
    domains: startingDomainsValue
      .filter((domain) => !!domain.domainId)
      .map<DomainWithRoleAndAssetGroup>((domain) => {
        const domainWithAssetGroups = values?.userDomainAssetGroups?.find(
          (assetGroupDomain) => assetGroupDomain.domainId === domain.domainId
        );
        const domainWithUserRoles = values?.userDomainRoles?.find(
          (userRoleDomain) => userRoleDomain.domainId === domain.domainId
        );

        return {
          domainId: domain.domainId!,
          applicationUserRoleId: isNumber(domainWithUserRoles?.roleId)
            ? domainWithUserRoles?.roleId
            : '',
          assetGroupIds:
            domainWithAssetGroups?.domainAssetGroups
              ?.filter((assetGroup) => !!assetGroup.id)
              .map((assetGroup) => assetGroup.id!) || [],
          defaultAssetGroupId:
            domainWithAssetGroups?.defaultAssetGroupId &&
            domainWithAssetGroups.defaultAssetGroupId !== EMPTY_GUID
              ? domainWithAssetGroups.defaultAssetGroupId
              : '',
        };
      }),
  };
};

interface FormatValuesForApiData {
  values: Values;
  usernameDomainSuffix: string;
}

export const formatValuesForApi = ({
  values,
  usernameDomainSuffix,
}: FormatValuesForApiData): Omit<
  UserDto,
  'id' | 'domainId' | 'init' | 'toJSON'
> => {
  const fullUsernameWithDomainSuffix = values?.userName?.concat(
    usernameDomainSuffix
  );
  const applicationTimeoutInSeconds = values.applicationTimeout
    ? dateToSeconds(values.applicationTimeout)
    : 0;

  const userDomainRoles = values.domains.map((domain) => {
    const { domainId, applicationUserRoleId } = domain;

    return {
      domainId,
      ...(applicationUserRoleId && { roleId: applicationUserRoleId }),
      // NOTE: Is the user type necessary for the back-end API? It should be
      // calculated on the backend based on the `roleId`
      // userRoleTypeId,
    } as UserDomainRoleDto;
    // return UserDomainRoleDto.fromJS({});
  });

  const userDomainAssetGroups = values.domains.map((domain) => {
    const { domainId, defaultAssetGroupId } = domain;

    return {
      domainId,
      ...(defaultAssetGroupId && { defaultAssetGroupId }),
      domainAssetGroups: domain.assetGroupIds?.map((assetGroupId) =>
        AssetGroupDto.fromJS({
          id: assetGroupId,
        })
      ),
    } as UserDomainAssetGroupsDto;
  });

  return {
    userName: fullUsernameWithDomainSuffix,
    password: values.newPassword,
    firstName: values.firstName,
    lastName: values.lastName,
    emailAddress: values.emailAddress,
    companyName: values.companyName,
    emailToSmsaddress: values.emailToSmsaddress,
    smsnumber: values.smsNumber,
    homePhoneNumber: values.homePhoneNumber,
    workPhoneNumber: values.workPhoneNumber,
    mobilePhoneNumber: values.mobilePhoneNumber,
    faxNumber: values.faxNumber,
    isWebLogin: values.isWebLogin,
    isPasswordChangeRequired: values.isPasswordChangeRequired,
    // NOTE: These should probably be calculated on the back-end instead
    // lastUpdatedDate: values.lastUpdatedDate,
    // lastUpdateUserId: values.lastUpdateUserId,
    // lastLoginDate: values.lastLoginDate,
    applicationTimeoutInSeconds,
    // We ignore this since technically the user can not submit a User Type in
    // which case the back-end would return a validation error
    // @ts-ignore
    userTypeId: values.userTypeId,
    isPrimary: values.isPrimary,
    isFederatedAuthentication: values.isFederatedAuthentication,
    defaultDomainId: values.defaultDomainId,
    showPreviewPage: values.showPreviewPage,
    migratedToNewUi: values.migratedToNewUi,
    userDomainRoles,
    userDomainAssetGroups,
  };
};

const customErrorReasonCodeToMessage = (
  t: TFunction,
  fieldName: string,
  code?: ReasonCodeEnum | null,
  errorMessage?: string | null
) => {
  // TODO: Find a better way to handle error messages with parameters when we
  // have more time
  if (fieldName === 'userName' && code === ReasonCodeEnum.RecordAlreadyExists) {
    return fieldAlreadyExists(t, t('ui.common.username', 'Username'));
  }

  return errorReasonCodeToMessage(t, code, errorMessage);
};

const getFormFieldNameFromApiPropertyName = (
  apiPropertyName: string | null | undefined
) => {
  const apiPropertyNameToFormFieldName: Record<string, string> = {
    password: 'newPassword',
  };

  const camelCaseApiPropertyName = camelCase(apiPropertyName!) || '';
  return (
    apiPropertyNameToFormFieldName[camelCaseApiPropertyName] ||
    camelCaseApiPropertyName ||
    ''
  );
};

export const mapApiErrorsToFields = (t: TFunction, errors: any) => {
  if (!errors) {
    return null;
  }

  if (Array.isArray(errors)) {
    return errors.reduce((prev, current) => {
      const fieldName = getFormFieldNameFromApiPropertyName(
        current?.propertyName
      );
      const errorMessage = customErrorReasonCodeToMessage(
        t,
        fieldName,
        current?.reasonCodeTypeId,
        current?.errorMessage
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

  const {
    // Pull out errors that don't map 1 to 1 to form fields
    applicationTimeoutInSeconds,
    ...restOfErrors
  } = errors;

  return {
    // @ts-ignore
    ...(restOfErrors as Record<Partial<keyof Values>, string | string[]>),
    applicationTimeoutInSeconds: errors.applicationTimeout,
  };
};
