import {
  AssetDetailGetResp,
  DataChannelDTO,
  UserPermissionType,
} from 'api/admin/api';
import moment from 'moment';
import momentTimezone from 'moment-timezone';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import usePrevious from 'react-use/lib/usePrevious';
import { selectCurrentIanaTimezoneId } from 'redux-app/modules/app/selectors';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import {
  getClosestZoomLevelFromHours,
  getDateBoundsForZoomLevelAndDateRange,
  getReadingsCacheKey,
  isGraphableDataChannelType,
} from '../components/AssetGraph/helpers';
import { DataChannelForGraph, GraphProperties } from '../types';

interface Props {
  assetDetails: AssetDetailGetResp | null;
  selectedDataChannelsForGraph: DataChannelForGraph[];
}

export const useGraphProperties = ({
  assetDetails,
  selectedDataChannelsForGraph,
}: Props): GraphProperties => {
  const initialZoomLevel = getClosestZoomLevelFromHours(
    assetDetails?.userAssetSettings?.graphZoomLevelInHours
  );
  const [zoomLevel, setZoomLevel] = useState(initialZoomLevel);

  const hasPermission = useSelector(selectHasPermission);
  const canViewForecast = hasPermission(
    UserPermissionType.MiscellaneousFeatureViewForecast
  );
  const [showForecast, setShowForecast] = useState(!!canViewForecast);

  // Mobile Asset Map "All GPS" checkbox
  const [showAllGpsReadings, setShowAllGpsReadings] = useState(false);

  const [
    calculatedFromDate,
    calculatedToDate,
  ] = getDateBoundsForZoomLevelAndDateRange(
    zoomLevel,
    assetDetails?.userAssetSettings?.graphStartDate,
    assetDetails?.userAssetSettings?.graphEndDate
  );

  const [fromDate, setFromDate] = useState(() => calculatedFromDate.toDate());
  const [toDate, setToDate] = useState(() => calculatedToDate.toDate());

  // Set up padded dates so we can reduce the chance of gaps appearing on the
  // left and right sides of the graph. This usually happens with data channels
  // that have large logging intervals (eg: every 12 hours instead of every
  // hour). This could also potentially happen in rare cases when the device
  // doesn't send data due to an error (eg: not sending data for 4 days) which
  // is not handled by these padded dates.
  const paddedFromDate = useMemo(
    () => moment(fromDate).subtract(12, 'hours').toDate(),
    [fromDate]
  );
  const paddedToDate = useMemo(() => moment(toDate).add(12, 'hours').toDate(), [
    toDate,
  ]);

  // Update the from and to dates when the timezone changes
  const ianaTimezoneId = useSelector(selectCurrentIanaTimezoneId);
  const prevIanaTimezoneId = usePrevious(ianaTimezoneId);
  useEffect(() => {
    if (prevIanaTimezoneId && ianaTimezoneId) {
      const previousFromDate = momentTimezone(fromDate).tz(prevIanaTimezoneId);
      const previousToDate = momentTimezone(toDate).tz(prevIanaTimezoneId);
      const newFromDate = momentTimezone(previousFromDate).tz(
        ianaTimezoneId,
        true
      );
      const newToDate = momentTimezone(previousToDate).tz(ianaTimezoneId, true);

      if (newFromDate && newToDate) {
        setFromDate(newFromDate.toDate());
        setToDate(newToDate.toDate());
      }
    }
  }, [ianaTimezoneId]);

  // Since the request for user's settings may not be complete by the time we
  // set up the initial from and to dates, we check if we received them and
  // update the from and to dates accordingly
  useEffect(() => {
    const zoomLevelFromSettings =
      assetDetails?.userAssetSettings?.graphZoomLevelInHours;
    const startDateFromSettings =
      assetDetails?.userAssetSettings?.graphStartDate;
    const endDateFromSettings = assetDetails?.userAssetSettings?.graphEndDate;

    if (startDateFromSettings && endDateFromSettings && zoomLevelFromSettings) {
      const [newFromDate, newToDate] = getDateBoundsForZoomLevelAndDateRange(
        zoomLevelFromSettings,
        startDateFromSettings,
        endDateFromSettings
      );
      setFromDate(newFromDate.toDate());
      setToDate(newToDate.toDate());
    } else if (zoomLevelFromSettings) {
      const [newFromDate, newToDate] = getDateBoundsForZoomLevelAndDateRange(
        zoomLevelFromSettings
      );
      setZoomLevel(initialZoomLevel);
      setFromDate(newFromDate.toDate());
      setToDate(newToDate.toDate());
    }
  }, [
    assetDetails?.userAssetSettings?.graphStartDate,
    assetDetails?.userAssetSettings?.graphEndDate,
    assetDetails?.userAssetSettings?.graphZoomLevelInHours,
  ]);

  const [graphMinY, setGraphMinY] = useState<number>();
  // NOTE: When using undefined, highcharts will automatically scale each
  // ySeries depending on its max value
  // IMORTANT NOTE: Each data channel has a graphMin and graphMax. Those values
  // can be used for EACH ySeries so that the zoom level stays consistent
  const [graphMaxY, setGraphMaxY] = useState<number>();

  const graphableDataChannels = selectedDataChannelsForGraph?.filter(
    (channel) => isGraphableDataChannelType(channel.dataChannelTypeId)
  );
  const firstGraphableDataChannel = graphableDataChannels?.[0];

  const firstInitialGraphableDataChannelId =
    assetDetails?.userAssetSettings?.graphedDataChannel?.[0];
  const firstInitialGraphableDataChannel = graphableDataChannels.find(
    (channel) => channel.dataChannelId === firstInitialGraphableDataChannelId
  );
  const initialGraphedDataChannel =
    firstInitialGraphableDataChannel || firstGraphableDataChannel;

  const [manyGraphedDataChannels, setManyGraphedDataChannels] = useState<
    DataChannelDTO[] | undefined
  >(initialGraphedDataChannel ? [initialGraphedDataChannel] : []);

  const dataChannelReadingsKey = graphableDataChannels
    ?.map((channel) => {
      const cacheKey = getReadingsCacheKey(channel);
      return cacheKey;
    })
    .join(' ');
  useEffect(() => {
    const newGraphedDataChannels = graphableDataChannels.length
      ? graphableDataChannels
      : [];
    setManyGraphedDataChannels(newGraphedDataChannels);
  }, [dataChannelReadingsKey]);

  return {
    zoomLevel,
    setZoomLevel,
    showForecast,
    setShowForecast,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    paddedFromDate,
    paddedToDate,
    graphMinY,
    setGraphMinY,
    graphMaxY,
    setGraphMaxY,
    manyGraphedDataChannels,
    setManyGraphedDataChannels,
    // Map-related props
    showAllGpsReadings,
    setShowAllGpsReadings,
    // Additional things required for the graph
    initialZoomLevel,
  };
};
