import {
  UserEventSettingGetResp,
  UserEventSettingUpdateReq,
} from 'api/admin/api';
import { useEffect } from 'react';
import { useRetrieveUserEventSettings } from './useRetrieveUserEventSettings';
import { useUpdateUserEventSettings } from './useUpdateUserEventSettings';

export interface PreserveUserEventSettingsData {
  userEventSettings?: UserEventSettingGetResp;
  saveUserEventSettings: (
    request: Omit<UserEventSettingUpdateReq, 'init' | 'toJSON'>
  ) => Promise<number>;
  isUserEventSettingsLoadingInitial?: boolean;
}

export const usePreserveUserEventSettings = (): PreserveUserEventSettingsData => {
  const retrieveUserEventSettingsApi = useRetrieveUserEventSettings();
  const updateUserEventSettingsApi = useUpdateUserEventSettings();

  useEffect(() => {
    retrieveUserEventSettingsApi.makeRequest().catch(() => {});
  }, [retrieveUserEventSettingsApi.makeRequest]);

  return {
    userEventSettings: retrieveUserEventSettingsApi.data,
    saveUserEventSettings: updateUserEventSettingsApi.makeRequest,
    isUserEventSettingsLoadingInitial:
      retrieveUserEventSettingsApi.isLoadingInitial,
  };
};
