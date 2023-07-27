import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

interface RetrieveFreezerDetailsRequest {
  freezerId: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

const getFreezerDetails = ({
  freezerId,
  startDate,
  endDate,
}: RetrieveFreezerDetailsRequest) => {
  return ApiService.FreezerAssetService.freezerAsset_GetFreezerDetail(
    freezerId,
    startDate,
    endDate
  );
};

export const useGetFreezerDetails = (
  request: RetrieveFreezerDetailsRequest
) => {
  return useQuery([APIQueryKey.getFreezerDetails, request], () =>
    getFreezerDetails(request)
  );
};
