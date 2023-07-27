import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const useRtuPollScheduleGroups = () => {
  return useQuery(APIQueryKey.retrievePollScheduleGroups, () =>
    ApiService.RtuService.rtu_RetrievePollScheduleGroups()
  );
};
export default useRtuPollScheduleGroups;
