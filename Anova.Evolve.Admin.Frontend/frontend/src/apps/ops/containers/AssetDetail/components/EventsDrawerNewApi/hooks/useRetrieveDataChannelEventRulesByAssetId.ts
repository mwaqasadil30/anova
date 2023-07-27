import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const retrieveDataChannelEventRulesByAssetId = (assetId: string) => {
  return ApiService.DataChannelEventRuleService.dataChannelEventRule_RetrieveEventRulesForAsset(
    assetId
  );
};

export const useRetrieveDataChannelEventRulesByAssetId = (assetId: string) => {
  return useQuery([APIQueryKey.retrieveAssetDetailEventRules, assetId], () =>
    retrieveDataChannelEventRulesByAssetId(assetId)
  );
};
