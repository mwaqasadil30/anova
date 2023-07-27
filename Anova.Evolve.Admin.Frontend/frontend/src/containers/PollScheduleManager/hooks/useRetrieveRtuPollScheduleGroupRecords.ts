import {
  EvolveRetrieveRtuPollScheduleGroupRecordsByOptionsRequest,
  EvolveRetrieveRtuPollScheduleGroupRecordsByOptionsResponse,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery, UseQueryOptions } from 'react-query';

const retrieveRtuPollScheduleGroupRecords = (
  filterOptions: EvolveRetrieveRtuPollScheduleGroupRecordsByOptionsRequest
) => {
  return ApiService.RTUService.retrieveRtuPollScheduleGroupRecordsByOptions_RetrieveRtuPollScheduleGroupRecordsByOptions(
    filterOptions
  );
};

export const useRetrieveRtuPollScheduleGroupRecords = (
  filterOptions: EvolveRetrieveRtuPollScheduleGroupRecordsByOptionsRequest,
  options?: UseQueryOptions<EvolveRetrieveRtuPollScheduleGroupRecordsByOptionsResponse>
) => {
  return useQuery(
    [APIQueryKey.retrieveRtuPollScheduleGroupRecords, filterOptions],
    () => retrieveRtuPollScheduleGroupRecords(filterOptions),
    options
  );
};
