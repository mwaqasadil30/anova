import { UnitTypeEnum, UOMParamsDTO } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useState } from 'react';

type ResponseObj = UOMParamsDTO;

export const useConvertDataChannelUOMParams = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any>(null);
  const [responseData, setResponseData] = useState<
    ResponseObj | null | undefined
  >();

  const convertDataChannelUOMParams = (
    dataChannelId: string,
    chosenUnitTypeId?: UnitTypeEnum | null | undefined
  ) => {
    setIsFetching(true);
    setResponseError(null);

    return ApiService.DataChannelService.dataChannel_ConvertUOMParams(
      dataChannelId,
      chosenUnitTypeId
    )
      .then((response) => {
        setResponseData(response);
        return response;
      })
      .catch((error) => {
        setResponseError(error);
        console.error('Failed to convert data channel UOM params', error);
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
    makeRequest: convertDataChannelUOMParams,
  };
};
