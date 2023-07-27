import {
  AssetGroupModel,
  DomainUserRolesDTO,
  UserDomainAssetGroupsModel,
  UserDomainRoleModel,
  UserDto,
} from 'api/admin/api';
import { TFunction } from 'i18next';
import { EMPTY_GUID } from 'utils/api/constants';
import { formatApiErrors } from 'utils/format/errors';
import { isNumber } from 'utils/format/numbers';
import { RequestObj as UpdateDomainsAndGroupsRequest } from '../../hooks/updateUserDomainRolesAndAssetGroups';
import { DomainWithRoleAndAssetGroup, Values } from './types';

export const formatInitialValues = (
  values?: UserDto | null,
  domainsWithUserRoles?: DomainUserRolesDTO[]
): Values => {
  const startingDomainsValue = domainsWithUserRoles || [];

  return {
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

export const formatValuesForApi = (
  values: Values,
  userId: string
): UpdateDomainsAndGroupsRequest => {
  const userDomainRoles = values.domains.map((domain) => {
    const { domainId, applicationUserRoleId } = domain;

    return {
      userId,
      domainId,
      applicationUserRoleId: applicationUserRoleId || undefined,
      // NOTE: Is the user type necessary for the back-end API? It should be
      // calculated on the backend based on the `roleId`
      // userRoleTypeId,
    } as UserDomainRoleModel;
  });

  const userDomainAssetGroups = values.domains.map((domain) => {
    const { domainId, defaultAssetGroupId } = domain;

    return {
      domainId,
      defaultAssetGroupId: defaultAssetGroupId || undefined,
      domainAssetGroups: (domain.assetGroupIds || []).map(
        (assetGroupId) =>
          ({
            id: assetGroupId,
            domainId: domain.domainId,
          } as AssetGroupModel)
      ),
    } as UserDomainAssetGroupsModel;
  });

  return {
    userId,
    updateRequest: {
      defaultDomainId: values.defaultDomainId || null,
      // The default domain ID doesn't seem to be a property required in the
      // payload.
      // defaultDomainId: values.defaultDomainId,
      userDomainAssetGroups,
      userDomainRoles,
    },
  } as UpdateDomainsAndGroupsRequest;
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
