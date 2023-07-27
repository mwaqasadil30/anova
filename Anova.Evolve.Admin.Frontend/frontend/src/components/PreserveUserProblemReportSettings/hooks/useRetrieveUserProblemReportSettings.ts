import { UserProblemReportSettingDto } from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import { useCallback, useState } from 'react';

type ResponseObj = UserProblemReportSettingDto;

export const useRetrieveUserProblemReportSettings = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any>(null);

  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [responseData, setResponseData] = useState<ResponseObj>();

  const retrieveUserProblemReportSettings = useCallback(() => {
    setIsFetching(true);
    setResponseError(null);

    return AdminApiService.ProblemReportService.problemReport_GetUserSettings()
      .then((response) => {
        setResponseData(response);
        return response;
      })
      .catch((error) => {
        setResponseError(error);
        console.error('Failed to retrieve user problem report settings', error);
        throw error;
      })
      .finally(() => {
        setIsFetching(false);
        setIsLoadingInitial(false);
      });
  }, []);

  return {
    isFetching,
    isLoadingInitial,
    data: responseData,
    error: responseError,
    makeRequest: retrieveUserProblemReportSettings,
  };
};
