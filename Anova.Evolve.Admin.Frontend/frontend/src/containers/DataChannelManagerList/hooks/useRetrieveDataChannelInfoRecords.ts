import {
  EvolveRetrieveDataChannelInfoRecordsByOptionsRequest,
  EvolveRetrieveDataChannelInfoRecordsByOptionsResponse,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery, UseQueryOptions } from 'react-query';

const retrieveDataChannelInfoRecords = (
  filterOptions: EvolveRetrieveDataChannelInfoRecordsByOptionsRequest
) => {
  return ApiService.DataChannelService.retrieveDataChannelInfoRecordsByOptions_RetrieveDataChannelInfoRecordsByOptions(
    filterOptions
  );
};

export const useRetrieveDataChannelInfoRecords = (
  filterOptions: EvolveRetrieveDataChannelInfoRecordsByOptionsRequest,
  options?: UseQueryOptions<EvolveRetrieveDataChannelInfoRecordsByOptionsResponse>
) => {
  return useQuery(
    [APIQueryKey.retrieveDataChannelInfoRecords, filterOptions],
    () => retrieveDataChannelInfoRecords(filterOptions),
    options
  );
};
