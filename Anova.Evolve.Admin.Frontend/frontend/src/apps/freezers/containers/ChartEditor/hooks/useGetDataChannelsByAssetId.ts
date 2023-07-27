import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

interface Request {
  assetId?: string;
}

const getDataChannelsByAssetId = ({ assetId }: Request) => {
  if (!assetId) {
    return null;
  }

  return ApiService.ChartService.chart_GetDataChannelsByAssetId(assetId);
};

export const useGetDataChannelsByAssetId = (request: Request) => {
  return useQuery(
    [APIQueryKey.getDataChannelsByAssetId, request],
    () => getDataChannelsByAssetId(request),
    { enabled: !!request.assetId }
  );
};
