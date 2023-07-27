import { UserProblemReportSettingDto } from 'api/admin/api';
import { useEffect } from 'react';
import { useRetrieveUserProblemReportSettings } from './useRetrieveUserProblemReportSettings';
import { useUpdateUserProblemReportSettings } from './useUpdateUserProblemReportSettings';

export interface PreserveUserProblemReportSettingsData {
  userProblemReportSettings?: UserProblemReportSettingDto;
  saveUserProblemReportSettings: (
    request: Omit<UserProblemReportSettingDto, 'init' | 'toJSON'>
  ) => Promise<UserProblemReportSettingDto>;
  isUserProblemReportSettingsLoadingInitial?: boolean;
}

interface Props {
  isAirProductsDomain?: boolean;
}

export const usePreserveUserProblemReportSettings = ({
  isAirProductsDomain,
}: Props): PreserveUserProblemReportSettingsData => {
  const retrieveUserProblemReportSettingsApi = useRetrieveUserProblemReportSettings();
  const updateUserProblemReportSettingsApi = useUpdateUserProblemReportSettings();

  useEffect(() => {
    // We only make this api call if the user is on an air products domain.
    // For more details, see 'DetailsTabWithUserSettings'.
    if (isAirProductsDomain) {
      retrieveUserProblemReportSettingsApi.makeRequest().catch(() => {});
    }
  }, [retrieveUserProblemReportSettingsApi.makeRequest]);

  return {
    userProblemReportSettings: retrieveUserProblemReportSettingsApi.data,
    saveUserProblemReportSettings:
      updateUserProblemReportSettingsApi.makeRequest,
    isUserProblemReportSettingsLoadingInitial:
      retrieveUserProblemReportSettingsApi.isLoadingInitial,
  };
};
