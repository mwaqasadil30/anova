import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const getRosters = (dataChannelEventRuleId: number) => {
  return ApiService.DataChannelEventRuleService.dataChannelEventRule_GetRosters(
    dataChannelEventRuleId
  );
};

export const useGetRosters = (dataChannelEventRuleId: number) => {
  return useQuery(
    [APIQueryKey.getDataChannelEventRuleRosters, dataChannelEventRuleId],
    () => getRosters(dataChannelEventRuleId)
  );
};
