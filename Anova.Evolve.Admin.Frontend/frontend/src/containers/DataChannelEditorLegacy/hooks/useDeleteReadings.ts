import {
  EvolveDeleteDataChannelReadingsByDateRangeRequest,
  EvolveDeleteDataChannelReadingsByDateRangeResponse,
  SaveResultType,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useState } from 'react';
import { parseResponseError } from 'utils/api/handlers';

type RequestObj = EvolveDeleteDataChannelReadingsByDateRangeRequest;
type ResponseObj = EvolveDeleteDataChannelReadingsByDateRangeResponse;

export const useDeleteReadings = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any>(null);
  const [responseData, setResponseData] = useState<
    ResponseObj | null | undefined
  >();

  const deleteReadings = (request: Omit<RequestObj, 'init' | 'toJSON'>) => {
    setIsFetching(true);
    setResponseError(null);

    return ApiService.DataChannelService.deleteDataChannelReadingsByDateRange_DeleteDataChannelReadingsByDateRange(
      request as RequestObj
    )
      .then((response) => {
        const isResponseSuccessful =
          response.deleteDataChannelReadingsByDateRangeResult?.result ===
          SaveResultType.Success;
        if (isResponseSuccessful) {
          setResponseData(response);
        } else {
          setResponseError(response);
        }

        return response;
      })
      .catch((error) => {
        const errorResult = parseResponseError(error);
        if (errorResult) {
          setResponseError(errorResult);
        } else {
          setResponseError(error);
        }

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
    makeRequest: deleteReadings,
  };
};
