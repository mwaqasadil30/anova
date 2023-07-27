import {
  TableStorageReadingsRetrievalResponse,
  UnitTypeEnum,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useState } from 'react';

type ResponseObj = TableStorageReadingsRetrievalResponse;

export const useRetrieveDataChannelReadings = () => {
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any>(null);
  const [responseData, setResponseData] = useState<
    ResponseObj | null | undefined
  >();

  const retrieveDataChannelReadings = (
    dataChannelId: string,
    startDate?: Date | null | undefined,
    endDate?: Date | null | undefined,
    chosenUnitTypeId?: UnitTypeEnum | null | undefined,
    showSummarizedReadings?: boolean
  ) => {
    setStartTime(new Date());
    setEndTime(undefined);
    setIsFetching(true);
    setResponseError(null);

    return ApiService.GetDataChannelReadingsService.getDataChannelReadings_GetDataChannelReadings(
      dataChannelId,
      startDate,
      endDate,
      chosenUnitTypeId,
      showSummarizedReadings
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
    makeRequest: retrieveDataChannelReadings,
    duration,
  };
};
