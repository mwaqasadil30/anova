import { UserProblemReportSettingDto } from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import { useCallback, useState } from 'react';

type RequestObj = UserProblemReportSettingDto;

export const useUpdateUserProblemReportSettings = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any>(null);

  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [
    responseData,
    setResponseData,
  ] = useState<UserProblemReportSettingDto>();

  const updateUserProblemReportSettings = useCallback(
    (request: Omit<RequestObj, 'init' | 'toJSON'>) => {
      setIsFetching(true);
      setResponseError(null);

      return AdminApiService.ProblemReportService.problemReport_SaveUserSettings(
        request as RequestObj
      )
        .then((response) => {
          setResponseData(response);
          return response;
        })
        .catch((error) => {
          setResponseError(error);
          console.error('Failed to update user problem report settings', error);
          throw error;
        })
        .finally(() => {
          setIsFetching(false);
          setIsLoadingInitial(false);
        });
    },
    []
  );

  return {
    isFetching,
    isLoadingInitial,
    data: responseData,
    error: responseError,
    makeRequest: updateUserProblemReportSettings,
  };
};
