import {
  EvolveLevelDataChannelLoadDefaultValuesRequest,
  LevelDataChannelGeneralInfo,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useState } from 'react';
import { parseResponseError } from 'utils/api/handlers';

export const useLoadDefaultValues = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any>(null);
  const [responseData, setResponseData] = useState<
    LevelDataChannelGeneralInfo | null | undefined
  >();

  const loadDefaultValues = (
    request: Omit<
      EvolveLevelDataChannelLoadDefaultValuesRequest,
      'init' | 'toJSON'
    >
  ) => {
    setIsFetching(true);
    setResponseError(null);

    ApiService.DataChannelService.levelDataChannelLoadDefaultValues_LevelDataChannelLoadDefaultValues(
      request as EvolveLevelDataChannelLoadDefaultValuesRequest
    )
      .then((response) => {
        setResponseData(response.dataChannel);
      })
      .catch((error) => {
        const errorResult = parseResponseError(error);
        if (errorResult) {
          setResponseError(errorResult);
        } else {
          setResponseError(error);
        }
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  return {
    isFetching,
    error: responseError,
    data: responseData,
    makeRequest: loadDefaultValues,
  };
};
