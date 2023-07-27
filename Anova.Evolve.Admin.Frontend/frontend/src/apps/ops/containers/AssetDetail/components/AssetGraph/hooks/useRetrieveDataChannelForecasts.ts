import { ForecastDTO, UnitTypeEnum } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useState } from 'react';

type ResponseObj = ForecastDTO;

export const useRetrieveDataChannelForecasts = () => {
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any>(null);
  const [responseData, setResponseData] = useState<
    ResponseObj | null | undefined
  >();

  const retrieveDataChannelForecasts = (
    dataChannelId: string,
    chosenUnitTypeId?: UnitTypeEnum | null | undefined
  ) => {
    setStartTime(new Date());
    setEndTime(undefined);
    setIsFetching(true);
    setResponseError(null);

    return ApiService.DataChannelService.dataChannel_GetForecasts(
      dataChannelId,
      chosenUnitTypeId
    )
      .then((response) => {
        setEndTime(new Date());
        setResponseData(response);
        return response;
      })
      .catch((error) => {
        setEndTime(new Date());
        setResponseError(error);
        console.error('Failed to retrieve data channel readings', error);
        throw error;
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  const duration =
    startTime && endTime ? Number(endTime) - Number(startTime) : null;

  return {
    isFetching,
    error: responseError,
    data: responseData,
    makeRequest: retrieveDataChannelForecasts,
    duration,
  };
};
