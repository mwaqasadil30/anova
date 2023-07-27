import {
  EvolveSaveUserShowPreviewPageRequest,
  EvolveSaveUserShowPreviewPageResponse,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useState } from 'react';

type RequestObj = EvolveSaveUserShowPreviewPageRequest;
type ResponseObj = EvolveSaveUserShowPreviewPageResponse;

export const useSetShowPreviewPage = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any>(null);
  const [responseData, setResponseData] = useState<
    ResponseObj | null | undefined
  >();

  const saveSetShowPreviewPage = (
    request: Omit<RequestObj, 'init' | 'toJSON'>
  ) => {
    setIsFetching(true);
    setResponseError(null);

    return ApiService.GeneralService.saveUserShowPreviewPage_SaveUserShowPreviewPage(
      request as RequestObj
    )
      .then((response) => {
        setResponseData(response);
        return response;
      })
      .catch((error) => {
        setResponseError(error);
        console.error('Failed to submit feedback', error);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  return {
    isFetching,
    error: responseError,
    data: responseData,
    makeRequest: saveSetShowPreviewPage,
  };
};
