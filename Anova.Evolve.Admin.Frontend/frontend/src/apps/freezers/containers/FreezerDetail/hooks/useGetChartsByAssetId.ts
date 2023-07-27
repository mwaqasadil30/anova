import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

interface Request {
  assetId?: string;
}

const getChartsByAssetId = ({ assetId }: Request) => {
  if (!assetId) {
    return null;
  }

  return ApiService.ChartService.chart_GetChartsByAssetId(assetId);
};

export const useGetChartsByAssetId = (request: Request) => {
  return useQuery(
    [APIQueryKey.getChartsByAssetId, request],
    () => getChartsByAssetId(request),
    { enabled: !!request.assetId }
  );
};
