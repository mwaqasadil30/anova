import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

interface Request {
  siteId?: string | null;
}

const getBulkTankTagsBySiteId = ({ siteId }: Request) => {
  if (!siteId) {
    return null;
  }

  return ApiService.FreezerAssetService.freezerAsset_GetBulkTankTagList(siteId);
};

export const useGetBulkTankTagsBySiteId = (request: Request) => {
  return useQuery(
    [APIQueryKey.getBulkTankTagsBySiteId, request],
    () => getBulkTankTagsBySiteId(request),
    { enabled: !!request.siteId }
  );
};
