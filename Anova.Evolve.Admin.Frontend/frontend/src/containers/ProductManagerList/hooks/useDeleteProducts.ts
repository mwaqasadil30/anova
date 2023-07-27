import {
  EvolveDeleteProductByIdListRequest,
  EvolveDeleteProductByIdListResponse,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useState } from 'react';

type RequestObj = EvolveDeleteProductByIdListRequest;
type ResponseObj = EvolveDeleteProductByIdListResponse;

export const useDeleteProducts = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any>(null);
  const [responseData, setResponseData] = useState<
    ResponseObj | null | undefined
  >();

  const deleteProducts = (request: Omit<RequestObj, 'init' | 'toJSON'>) => {
    setIsFetching(true);
    setResponseError(null);

    return ApiService.GeneralService.deleteProductByIdList_DeleteProductByIdList(
      request as RequestObj
    )
      .then((response) => {
        if (response.deleteProductByIdListResult) {
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
    makeRequest: deleteProducts,
  };
};
