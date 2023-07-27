import {
  EvolveSaveUserAssetDetailsSettingResponse,
  EvovleSaveUserAssetDetailsSettingRequest,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useState } from 'react';

type RequestObj = EvovleSaveUserAssetDetailsSettingRequest;
type ResponseObj = EvolveSaveUserAssetDetailsSettingResponse;

export const useSaveUserAssetDetailsSetting = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any>(null);
  const [responseData, setResponseData] = useState<
    ResponseObj | null | undefined
  >();

  const saveUserAssetDetailsSettings = (
    request: Omit<RequestObj, 'init' | 'toJSON'>
  ) => {
    setIsFetching(true);
    setResponseError(null);

    return ApiService.AssetService.saveUserAssetDetailsSetting_SaveUserAssetDetailsSetting(
      request as RequestObj
    )
      .then((response) => {
        setResponseData(response);
        return response;
      })
      .catch((error) => {
        setResponseError(error);
        console.error('Failed to save user asset details settings', error);
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
    makeRequest: saveUserAssetDetailsSettings,
  };
};
