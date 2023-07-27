import {
  EvolveUnitsConverterWithConversionInfoRequest,
  EvolveUnitsConverterWithConversionInfoResponse,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useState } from 'react';
import { parseResponseError } from 'utils/api/handlers';

type RequestObj = EvolveUnitsConverterWithConversionInfoRequest;
type ResponseObj = EvolveUnitsConverterWithConversionInfoResponse;

export const useUnitConverter = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any>(null);
  const [responseData, setResponseData] = useState<
    ResponseObj | null | undefined
  >();

  const convertUnits = (request: Omit<RequestObj, 'init' | 'toJSON'>) => {
    setIsFetching(true);
    setResponseError(null);

    return ApiService.UnitsConverterService.unitsConverterWithConversionInfo_UnitsConverterWithConversionInfo(
      request as RequestObj
    )
      .then((response) => {
        setResponseData(response);
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
    makeRequest: convertUnits,
  };
};
