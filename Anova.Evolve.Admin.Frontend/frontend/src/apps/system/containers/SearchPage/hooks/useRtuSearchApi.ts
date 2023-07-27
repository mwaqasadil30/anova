import { RtuSearchDTO, RtuSearchResultSetDTO } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery, UseQueryOptions } from 'react-query';

const searchRtuRecords = (rtuSearchOptions: RtuSearchDTO) => {
  return ApiService.RtuService.rtu_RtuSearch(rtuSearchOptions);
};

export const useSearchRtuRecords = (
  rtuSearchOptions: RtuSearchDTO,
  options?: UseQueryOptions<RtuSearchResultSetDTO>
) => {
  return useQuery(
    [APIQueryKey.rtuSearch, rtuSearchOptions],
    () => searchRtuRecords(rtuSearchOptions),
    options
  );
};
