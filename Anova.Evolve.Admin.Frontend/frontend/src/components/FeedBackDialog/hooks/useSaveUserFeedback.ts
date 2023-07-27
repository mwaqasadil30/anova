import { EvolveUserFeedbackRequest } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useState } from 'react';
import { parseResponseError } from 'utils/api/handlers';

type RequestObj = EvolveUserFeedbackRequest;

export const useSaveUserFeedback = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any>(null);

  const saveUserFeedback = (request: Omit<RequestObj, 'init' | 'toJSON'>) => {
    setIsFetching(true);
    setResponseError(null);

    return ApiService.GeneralService.saveUserFeedback_SaveUserFeedback(
      request as RequestObj
    )
      .then((response) => {
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
    makeRequest: saveUserFeedback,
  };
};
