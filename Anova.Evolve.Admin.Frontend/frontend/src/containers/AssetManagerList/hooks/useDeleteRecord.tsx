import {
  EvolveDeleteAssetsByIdListRequest,
  EvolveDeleteAssetsByIdListResponse,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useState } from 'react';

type RequestObj = EvolveDeleteAssetsByIdListRequest;
type ResponseObj = EvolveDeleteAssetsByIdListResponse;

export const useDeleteRecords = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any>(null);
  const [responseData, setResponseData] = useState<
    ResponseObj | null | undefined
  >();

  const deleteRecords = (request: Omit<RequestObj, 'init' | 'toJSON'>) => {
    setIsFetching(true);
    setResponseError(null);

    return ApiService.AssetService.deleteAssetsByIdList_DeleteAssetsByIdList(
      request as RequestObj
    )
      .then((response) => {
        if (response.deleteAssetsByIdListResult) {
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
    makeRequest: deleteRecords,
  };
};
