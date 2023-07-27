import {
  EvolveDeleteTankDimensionsByIdListRequest,
  EvolveDeleteTankDimensionsByIdListResponse,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useState } from 'react';

type RequestObj = EvolveDeleteTankDimensionsByIdListRequest;
type ResponseObj = EvolveDeleteTankDimensionsByIdListResponse;

export const useDeleteTankDimensions = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any>(null);
  const [responseData, setResponseData] = useState<
    ResponseObj | null | undefined
  >();

  const deleteTankDimensions = (
    request: Omit<RequestObj, 'init' | 'toJSON'>
  ) => {
    setIsFetching(true);
    setResponseError(null);

    return ApiService.GeneralService.deleteTankDimensionsByIdList_DeleteTankDimensionsByIdList(
      request as RequestObj
    )
      .then((response) => {
        if (response.deleteTankDimensionsByIdListResult) {
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
    makeRequest: deleteTankDimensions,
  };
};
