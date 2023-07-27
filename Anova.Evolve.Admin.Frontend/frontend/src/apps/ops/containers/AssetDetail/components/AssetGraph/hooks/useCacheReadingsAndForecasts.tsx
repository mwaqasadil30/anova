import {
  DataChannelDTO,
  ForecastModeType,
  UserPermissionType,
} from 'api/admin/api';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDebounce } from 'react-use';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import { ReadingsHookData } from '../../../types';
import { getReadingsCacheKey } from '../helpers';
import { CachedForecastReadings, CachedReadings } from '../types';
import {
  UpdateForecastReadingsCacheParams,
  UpdateReadingsCacheParams,
} from './types';
import { useRetrieveDataChannelForecasts } from './useRetrieveDataChannelForecasts';
import { useRetrieveDataChannelReadings } from './useRetrieveDataChannelReadings';

interface Props {
  fromDate: Date;
  toDate: Date;
  manyGraphedDataChannels?: DataChannelDTO[];
  isSummarizedReadingsSelected?: boolean;
  openReadingsApiFailureDialog?: (hasError: boolean) => void;
}

export const useCacheReadingsAndForecasts = ({
  fromDate,
  toDate,
  manyGraphedDataChannels,
  isSummarizedReadingsSelected,
  openReadingsApiFailureDialog,
}: Props): ReadingsHookData => {
  const hasPermission = useSelector(selectHasPermission);
  const canViewForecast = hasPermission(
    UserPermissionType.MiscellaneousFeatureViewForecast
  );

  const [cacheLastClearedOn, setCacheLastClearedOn] = useState<Date>();
  const [cachedReadings, setCachedReadings] = useState<CachedReadings>({});

  const [
    cachedForecastReadings,
    setCachedForecastReadings,
  ] = useState<CachedForecastReadings>({});

  const clearCache = useCallback(() => {
    setCachedReadings({});
    setCachedForecastReadings({});
    setCacheLastClearedOn(new Date());
  }, []);

  // #region Retrieve readings
  const dataChannelReadingsApi = useRetrieveDataChannelReadings();
  const updateReadingsCache = ({
    dataChannel,
    unitType,
    showSummarizedReadings,
  }: UpdateReadingsCacheParams) => {
    if (dataChannel?.dataChannelId) {
      const cacheKey = getReadingsCacheKey(dataChannel, { unit: unitType });
      const dataChannelCachedData = cachedReadings[cacheKey];

      // Don't make an API call if we already have readings for the provided
      // date range. Provide the readings to be displayed from the cache
      if (
        dataChannelCachedData &&
        // From date within bounds
        fromDate >= dataChannelCachedData.fromDate &&
        fromDate < dataChannelCachedData.toDate &&
        // To date within bounds
        toDate <= dataChannelCachedData.toDate &&
        toDate > dataChannelCachedData.fromDate
      ) {
        return;
      }

      // Set the initial isFetching state for this specific data channel
      setCachedReadings((prevState) => ({
        ...prevState,
        [cacheKey]: {
          // NOTE: It may be possible that reponse.readings is outdated
          // (and null or undefined) since we're using the setState
          // callback syntax
          readings: [],
          fromDate,
          toDate,
          isFetching: true,
          hasError: false,
          hasCachedData: false,
        },
      }));

      dataChannelReadingsApi
        .makeRequest(
          // dataChannelId.toUpperCase(),
          dataChannel?.dataChannelId,
          fromDate,
          toDate,
          unitType,
          showSummarizedReadings
        )
        .then((response) => {
          // Handle the first time we receive data for this data channel
          // (first-time cache)
          if (!dataChannelCachedData || !dataChannelCachedData.hasCachedData) {
            setCachedReadings((prevState) => ({
              ...prevState,
              [cacheKey]: {
                // NOTE: It may be possible that reponse.readings is outdated
                // (and null or undefined) since we're using the setState
                // callback syntax
                readings: response.readings!,
                fromDate,
                toDate,
                wereReadingsSummarized: response.wereReadingsSummarized,
                isFetching: false,
                hasError: false,
                hasCachedData: true,
              },
            }));
            return;
          }

          if (response) {
            // Update the from and to dates by extending the dates already in
            // the cache. For example, if the user fetched a from date in the
            // past that we haven't recorded readings for, then update the
            // cached fromDate to match the fromDate the user just fetched.
            const newCachedFromDate =
              fromDate < dataChannelCachedData.fromDate
                ? fromDate
                : dataChannelCachedData.fromDate;
            const newCachedToDate =
              toDate > dataChannelCachedData.toDate
                ? toDate
                : dataChannelCachedData.toDate;

            // Update cached readings by prepending or appending readings from
            // this response depending if the readings are before the cached
            // fromDate or after the cached toDate.
            // Handle prepending dates BEFORE the cached fromDate
            let newReadings = dataChannelCachedData.readings;
            if (fromDate < dataChannelCachedData.fromDate) {
              const readingsToPrepend =
                response?.readings?.filter(
                  (reading) =>
                    reading.logTime &&
                    reading.logTime < dataChannelCachedData.fromDate
                ) || [];

              newReadings = readingsToPrepend.concat(newReadings);
            }

            // Handle appending dates AFTER the cached toDate.
            // IMPORTANT NOTE:
            // Usually the toDate is ahead of the current date and time by a
            // couple days, which means very recent data that just came in
            // would be excluded. To get around this, when the user clicks on
            // the "Refresh" button, the cache is completely cleared so the
            // latest data is stored in the cache.
            if (toDate > dataChannelCachedData.toDate) {
              const readingsToAppend =
                response?.readings?.filter(
                  (reading) =>
                    reading.logTime &&
                    reading.logTime > dataChannelCachedData.toDate
                ) || [];

              newReadings = newReadings.concat(readingsToAppend);
            }

            setCachedReadings((prevState) => ({
              ...prevState,
              [cacheKey]: {
                // NOTE: It may be possible that reponse.readings is outdated
                // (and null or undefined) since we're using the setState
                // callback syntax
                readings: newReadings!,
                fromDate: newCachedFromDate,
                toDate: newCachedToDate,
                wereReadingsSummarized: response.wereReadingsSummarized,
                isFetching: false,
                hasError: false,
                hasCachedData: true,
              },
            }));
          }
        })
        .catch((error) => {
          console.error('Error while attempting to cache readings', error);

          setCachedReadings((prevState) => ({
            ...prevState,
            [cacheKey]: {
              // NOTE: It may be possible that reponse.readings is outdated
              // (and null or undefined) since we're using the setState
              // callback syntax
              readings: [],
              fromDate,
              toDate,
              wereReadingsSummarized: false,
              isFetching: false,
              hasError: true, // Set error state for the UpdatedConfirmationDialog for readings errors.
              hasCachedData: false,
            },
          }));

          if (openReadingsApiFailureDialog) {
            openReadingsApiFailureDialog(true);
          }
        });
    }
  };

  const isCachedReadingsApiFetching = Object.values(cachedReadings).some(
    (cachedReading) => {
      return cachedReading?.isFetching;
    }
  );

  const dataChannelReadingsKey = manyGraphedDataChannels
    ?.map((channel) => {
      const cacheKey = getReadingsCacheKey(channel);
      return cacheKey;
    })
    .join(' ');

  // NOTE: This was converted from a useEffect hook to a useDebounce hook
  // since the fromDate and toDate changes didn't seem to be done at the same
  // time (one was received first, followed by the other immediately) causing
  // the useEffect hook to be run twice. Looking into the code, they seem to be
  // called one right after the other (which React should be batching into one
  // call) but the useEffect picks up the fromDate change first, then the
  // toDate change.
  useDebounce(
    () => {
      manyGraphedDataChannels?.forEach((channel) => {
        updateReadingsCache({
          dataChannel: channel,
          unitType: channel.uomParams?.unitTypeId,
          showSummarizedReadings: isSummarizedReadingsSelected,
        });
      });
    },
    25,
    [
      dataChannelReadingsKey,
      cacheLastClearedOn,
      fromDate.toISOString(),
      toDate.toISOString(),
      isSummarizedReadingsSelected,
    ]
  );
  // #endregion Retrieve readings

  // #region Retrieve forecast readings
  const dataChannelForecastsApi = useRetrieveDataChannelForecasts();
  const updateForecastReadingsCache = ({
    dataChannel,
    forecastMode,
    unitType,
  }: UpdateForecastReadingsCacheParams) => {
    if (
      !dataChannel?.dataChannelId ||
      !canViewForecast ||
      // If the data channel has no forecast mode, we dont make the API call
      forecastMode === ForecastModeType.NoForecast ||
      !forecastMode
    ) {
      return;
    }

    const cacheKey = getReadingsCacheKey(dataChannel, { unit: unitType });
    const dataChannelCachedForecastData = cachedForecastReadings[cacheKey];
    if (dataChannelCachedForecastData) {
      return;
    }

    dataChannelForecastsApi
      .makeRequest(dataChannel?.dataChannelId, unitType)
      .then((response) => {
        setCachedForecastReadings((prevState) => ({
          ...prevState,
          [cacheKey]: response,
        }));
      })
      .catch((error) => {
        console.error(
          'Error while attempting to cache forecast readings',
          error
        );
      });
  };
  useEffect(() => {
    manyGraphedDataChannels?.forEach((channel) => {
      updateForecastReadingsCache({
        dataChannel: channel,
        forecastMode: channel.forecastMode,
        unitType: channel.uomParams?.unitTypeId,
      });
    });
  }, [dataChannelReadingsKey, cacheLastClearedOn]);
  // #endregion

  return {
    cachedReadings,
    cachedForecastReadings,
    isCachedReadingsApiFetching,
    dataChannelForecastsApi,
    clearCache,
  };
};
