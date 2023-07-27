import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const getDataChannelEventsByDataChannelId = (dataChannelId: string) => {
  return ApiService.DataChannelEventRuleService.dataChannelEventRule_RetrieveEventRulesForDataChennel(
    dataChannelId
  );
};

export const useGetDataChannelEventsByDataChannelId = (
  dataChannelId: string
) => {
  return useQuery(
    [APIQueryKey.getDataChannelEventsByDataChannelId, dataChannelId],
    () => getDataChannelEventsByDataChannelId(dataChannelId),
    {
      enabled: !!dataChannelId,
    }
  );
};
