import {
  EvolveDeleteAssetGroupsByIdListRequest,
  EvolveDeleteAssetGroupsByIdListResponse,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useState } from 'react';

type RequestObj = EvolveDeleteAssetGroupsByIdListRequest;
type ResponseObj = EvolveDeleteAssetGroupsByIdListResponse;

export const useDeleteAssetGroups = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any>(null);
  const [responseData, setResponseData] = useState<
    ResponseObj | null | undefined
  >();

  const deleteAssetGroups = (request: Omit<RequestObj, 'init' | 'toJSON'>) => {
    setIsFetching(true);
    setResponseError(null);

    return ApiService.AssetService.deleteAssetGroupsByIdList_DeleteAssetGroupsByIdList(
      request as RequestObj
    )
      .then((response) => {
        if (response.deleteAssetGroupsByIdListResult) {
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
    makeRequest: deleteAssetGroups,
  };
};
