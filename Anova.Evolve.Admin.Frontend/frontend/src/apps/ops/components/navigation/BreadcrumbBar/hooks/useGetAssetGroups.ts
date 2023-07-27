import { EvolveGetAssetGroupsByUserIdAndDomainIdRequest } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import { selectUserId } from 'redux-app/modules/user/selectors';

const getAssetGroups = (
  request: EvolveGetAssetGroupsByUserIdAndDomainIdRequest
) => {
  return ApiService.GeneralService.getAssetGroupsByUserIdAndDomainId_GetAssetGroupsByUserIdAndDomainId(
    request as EvolveGetAssetGroupsByUserIdAndDomainIdRequest
  );
};

export const useGetAssetGroups = (isEnabled?: boolean) => {
  const activeDomain = useSelector(selectActiveDomain);
  const currentDomainId = activeDomain?.domainId;

  const currentUserId = useSelector(selectUserId);

  const request = { userId: currentUserId, domainId: currentDomainId! };

  return useQuery(
    [APIQueryKey.getAssetGroups, request],
    () =>
      getAssetGroups({
        userId: currentUserId,
        domainId: currentDomainId!,
      } as EvolveGetAssetGroupsByUserIdAndDomainIdRequest),
    {
      enabled: !!request && isEnabled,
      cacheTime: 1000 * 60 * 2,
      staleTime: 1000 * 60 * 2,
    }
  );
};
