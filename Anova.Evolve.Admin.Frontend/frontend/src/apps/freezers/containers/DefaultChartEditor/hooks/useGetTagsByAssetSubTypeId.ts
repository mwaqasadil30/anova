import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

interface Request {
  assetSubTypeId?: number;
}

const getTagListByAssetSubTypeId = ({ assetSubTypeId }: Request) => {
  if (!assetSubTypeId) {
    return null;
  }

  return ApiService.ChartDefaultService.chartDefault_GetChartDefaultTagList(
    assetSubTypeId
  );
};

export const useGetTagListByAssetSubTypeId = (request: Request) => {
  return useQuery(
    [APIQueryKey.getTagListByAssetSubTypeId, request],
    () => getTagListByAssetSubTypeId(request),
    { enabled: !!request.assetSubTypeId }
  );
};
