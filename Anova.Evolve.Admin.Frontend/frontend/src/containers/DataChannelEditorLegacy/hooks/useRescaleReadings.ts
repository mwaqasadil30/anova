import {
  EvolveExecuteRescaleDataChannelReadingsByDateRangeRequest,
  EvolveExecuteRescaleDataChannelReadingsByDateRangeResponse,
  SaveResultType,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useState } from 'react';
import { parseResponseError } from 'utils/api/handlers';

type RequestObj = EvolveExecuteRescaleDataChannelReadingsByDateRangeRequest;
type ResponseObj = EvolveExecuteRescaleDataChannelReadingsByDateRangeResponse;

export const useRescaleReadings = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any>(null);
  const [responseData, setResponseData] = useState<
    ResponseObj | null | undefined
  >();

  const rescaleReadings = (request: Omit<RequestObj, 'init' | 'toJSON'>) => {
    setIsFetching(true);
    setResponseError(null);

    return ApiService.DataChannelService.executeRescaleDataChannelReadingsByDateRange_ExecuteRescaleDataChannelReadingsByDateRange(
      request as RequestObj
    )
      .then((response) => {
        const isResponseSuccessful =
          response.executeRescaleDataChannelReadingsByDateRangeResult
            ?.result === SaveResultType.Success;
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
    makeRequest: rescaleReadings,
  };
};
