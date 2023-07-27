import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const getEventRuleGroupByEventRuleGroupId = (
  dataChannelId: string,
  eventRuleGroupId: number
) => {
  return ApiService.EventRuleGroupService.eventRuleGroup_RetrieveEventRuleGroups(
    dataChannelId,
    eventRuleGroupId
  );
};

export const useGetEventRuleGroupByEventRuleGroupId = (
  dataChannelId: string,
  eventRuleGroupId: number
) => {
  return useQuery(
    [
      APIQueryKey.getEventRuleGroupsByEventRuleGroupId,
      dataChannelId,
      eventRuleGroupId,
    ],
    () => getEventRuleGroupByEventRuleGroupId(dataChannelId, eventRuleGroupId),
    {
      enabled: !!dataChannelId && !!eventRuleGroupId && eventRuleGroupId !== -1,
    }
  );
};
