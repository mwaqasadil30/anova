import { UserEventSettingGetResp } from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectActiveDomainId } from 'redux-app/modules/app/selectors';
import { selectUserId } from 'redux-app/modules/user/selectors';

type ResponseObj = UserEventSettingGetResp;

export const useRetrieveUserEventSettings = () => {
  const domainId = useSelector(selectActiveDomainId);
  const userId = useSelector(selectUserId);

  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any>(null);

  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [responseData, setResponseData] = useState<ResponseObj>();

  const retrieveUserEventSettings = useCallback(() => {
    setIsFetching(true);
    setResponseError(null);

    return AdminApiService.EventService.event_GetUserEventSettings(
      userId!,
      domainId!
    )
      .then((response) => {
        setResponseData(response);
        return response;
      })
      .catch((error) => {
        setResponseError(error);
        console.error('Failed to retrieve user event settings', error);
        throw error;
      })
      .finally(() => {
        setIsFetching(false);
        setIsLoadingInitial(false);
      });
  }, [domainId, userId]);

  return {
    isFetching,
    isLoadingInitial,
    data: responseData,
    error: responseError,
    makeRequest: retrieveUserEventSettings,
  };
};
