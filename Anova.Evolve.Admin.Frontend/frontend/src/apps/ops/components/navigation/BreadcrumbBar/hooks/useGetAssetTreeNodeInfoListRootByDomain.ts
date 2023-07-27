import { EvolveRetrieveTreeNodeInfoListRootByDomainRequest } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';

const getAssetTreeNodeInfoListRootByDomain = (
  request: EvolveRetrieveTreeNodeInfoListRootByDomainRequest
) => {
  return ApiService.GeneralService.retrieveTreeNodeInfoListRootByDomain_RetrieveTreeNodeInfoListRootByDomain(
    request as EvolveRetrieveTreeNodeInfoListRootByDomainRequest
  );
};

interface TreeNodeRootApiProps {
  selectedNodeIndex?: number | null | undefined;
  selectedTab?: number;
}

export const useGetAssetTreeNodeInfoListRootByDomain = ({
  selectedNodeIndex,
  selectedTab,
}: TreeNodeRootApiProps) => {
  const activeDomain = useSelector(selectActiveDomain);
  const currentDomainId = activeDomain?.domainId;

  const request = { domainId: currentDomainId! };

  return useQuery(
    [APIQueryKey.getAssetTreeNodeInfoListRootByDomain, request],
    () =>
      getAssetTreeNodeInfoListRootByDomain({
        domainId: currentDomainId!,
      } as EvolveRetrieveTreeNodeInfoListRootByDomainRequest),
    {
      // Only make an api call with the selected node index === 0 (the tree
      // "root" node) or when the selected tab === 2 (Asset Tree Tab).
      enabled: !!request && (selectedNodeIndex === 0 || selectedTab === 2),
      cacheTime: 1000 * 60 * 2,
      staleTime: 1000 * 60 * 2,
    }
  );
};
