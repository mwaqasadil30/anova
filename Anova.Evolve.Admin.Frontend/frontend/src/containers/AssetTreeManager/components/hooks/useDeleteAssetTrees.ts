import {
  EvolveDeleteAssetTreesByIdListRequest,
  EvolveDeleteAssetTreesByIdListResponse,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useState } from 'react';

type RequestObj = EvolveDeleteAssetTreesByIdListRequest;
type ResponseObj = EvolveDeleteAssetTreesByIdListResponse;

export const useDeleteAssetTrees = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any>(null);
  const [responseData, setResponseData] = useState<
    ResponseObj | null | undefined
  >();

  const deleteAssetTrees = (request: Omit<RequestObj, 'init' | 'toJSON'>) => {
    setIsFetching(true);
    setResponseError(null);

    return ApiService.AssetService.deleteAssetTreesByIdList_DeleteAssetTreesByIdList(
      request as RequestObj
    )
      .then((response) => {
        if (response.deleteAssetTreesByIdListResult) {
          setResponseData(response);
        } else {
          setResponseError(response);
        }

        return response;
      })
      .catch((error) => {
        setResponseError(error);
        console.error('Failed to delete records', error);
        throw error;
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  return {
    isFetching,
    error: responseError,
    data: responseData,
    makeRequest: deleteAssetTrees,
  };
};
