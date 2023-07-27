import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';
import { isNumber } from 'utils/format/numbers';

const getRosterDetails = (rosterId: number) => {
  return ApiService.RosterService.roster_GetByRosterId(rosterId);
};

export const useGetRosterById = (rosterId: number) => {
  return useQuery(
    [APIQueryKey.getRosterDetails, rosterId],
    () => getRosterDetails(rosterId),
    {
      enabled: isNumber(rosterId),
    }
  );
};
