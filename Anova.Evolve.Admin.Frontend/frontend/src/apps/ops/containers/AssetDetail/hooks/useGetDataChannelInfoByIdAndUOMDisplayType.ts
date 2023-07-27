import {
  EvolveGetDataChannelInfoByIdAndUOMDisplayTypeRequest,
  EvolveGetDataChannelInfoByIdAndUOMDisplayTypeResponse,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useState } from 'react';

type RequestObj = EvolveGetDataChannelInfoByIdAndUOMDisplayTypeRequest;
type ResponseObj = EvolveGetDataChannelInfoByIdAndUOMDisplayTypeResponse;

export const useGetDataChannelInfoByIdAndUOMDisplayType = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any>(null);
  const [responseData, setResponseData] = useState<
    ResponseObj | null | undefined
  >();

  const retrieveDataChannelInfoByIdAndUOMDisplayType = (
    request: Omit<RequestObj, 'init' | 'toJSON'>
  ) => {
    setIsFetching(true);
    setResponseError(null);

    return ApiService.DataChannelService.getDataChannelInfoByIdAndUOMDisplayType_GetDataChannelInfoByIdAndUOMDisplayType(
      request as RequestObj
    )
      .then((response) => {
        setResponseData(response);
        return response;
      })
      .catch((error) => {
        setResponseError(error);
        console.error(
          'Failed to retrieve data channel info by id and UOM display type',
          error
        );
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
    makeRequest: retrieveDataChannelInfoByIdAndUOMDisplayType,
  };
};
