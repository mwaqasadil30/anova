import {
  EvolveDeleteSitesByIdListRequest,
  EvolveDeleteSitesByIdListResponse,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useState } from 'react';

type RequestObj = EvolveDeleteSitesByIdListRequest;
type ResponseObj = EvolveDeleteSitesByIdListResponse;

export const useDeleteSites = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any>(null);
  const [responseData, setResponseData] = useState<
    ResponseObj | null | undefined
  >();

  const deleteSites = (request: Omit<RequestObj, 'init' | 'toJSON'>) => {
    setIsFetching(true);
    setResponseError(null);

    return ApiService.GeneralService.deleteSitesByIdList_DeleteSitesByIdList(
      request as RequestObj
    )
      .then((response) => {
        if (response.deleteSitesByIdListResult) {
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
    makeRequest: deleteSites,
  };
};
