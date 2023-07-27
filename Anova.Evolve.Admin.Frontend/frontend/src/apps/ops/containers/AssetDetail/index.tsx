/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {
  AssetDetailDto,
  AssetDetailGetResp,
  DataChannelDTO,
  EvolveAssetDetails,
  EvovleSaveUserAssetDetailsSettingRequest,
  QuickEditEventsDto,
  UOMParamsDTO,
  UserPermissionType,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import CircularProgress from 'components/CircularProgress';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import MessageBlock from 'components/MessageBlock';
import { MAX_GRAPHABLE_DATA_CHANNEL_COUNT } from 'env';
import uniqBy from 'lodash/uniqBy';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import {
  selectActiveDomain,
  selectTopOffset,
} from 'redux-app/modules/app/selectors';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { TableDataForDownload } from 'utils/format/dataExport';
import { getReadingsCacheKey } from './components/AssetGraph/helpers';
import { useCacheReadingsAndForecasts } from './components/AssetGraph/hooks/useCacheReadingsAndForecasts';
import UpdateDisplayPriorityDndDialog from './components/DataChannelsLayout/UpdateDisplayPriorityDndDialog';
import DetailsTab from './components/DetailsTab';
import EventsTabWithUserSettings from './components/EventsTab';
import ForecastTab from './components/ForecastTab';
import MapTab from './components/MapTab';
import PageIntro from './components/PageIntro';
import ReadingsTab from './components/ReadingsTab';
import { updateDataChannelsWithUOMParamsResponse } from './helpers';
import { useConvertDataChannelUOMParams } from './hooks/useConvertDataChannelUOMParams';
import { useGraphProperties } from './hooks/useGraphProperties';
import { useRetrieveScheduledDeliveries } from './hooks/useRetrieveScheduledDeliveries';
import { useSaveUserAssetDetailsSetting } from './hooks/useSaveUserAssetDetailsSetting';
import { ReadingsErrorDialogText } from './styles';
import {
  AssetDetailTab,
  ChangeDataChannelToUnitMappingFunction,
  DataChannelForGraph,
} from './types';

const Wrapper = styled.div<{
  $topOffset: number;
  $isFullPageHeight?: boolean;
}>`
  ${(props) =>
    props.$topOffset &&
    `
    display: flex;
    flex-direction: column;
    ${
      props.$isFullPageHeight &&
      `
    height: calc(100vh - ${props.$topOffset}px - 16px);
    `
    }
  `};
`;

const overflowStyles = {
  // The `overflow: hidden` prevents making the whole page scrollable (only
  // the table). However, it prevents the box-shadow from showing up
  // which is why we have negative spacing to ensure the box shadow is
  // shown.
  overflow: 'hidden',
  paddingLeft: 8,
  paddingRight: 8,
  marginLeft: -8,
  marginRight: 8,
};

interface LocationState {
  tab: AssetDetailTab;
  selectedDataChannelIdsForEventsTable?: string[];
  selectedDataChannelIdsForForecastTable?: string[];
  selectedDataChannelIdsForHistoryTable?: string[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
  style?: any;
}

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`asset-details-tabpanel-${index}`}
      aria-labelledby={`asset-details-tab-${index}`}
      {...other}
    >
      {value === index && <Box height="100%">{children}</Box>}
    </div>
  );
};

interface RouteParams {
  assetId: string;
}

const StyledTabPanel = styled(TabPanel)`
  position: relative;
`;

const AssetDetail = () => {
  const { t } = useTranslation();
  const location = useLocation<LocationState | undefined>();
  const params = useParams<RouteParams>();

  const hasPermission = useSelector(selectHasPermission);
  const canViewEvents = hasPermission(UserPermissionType.ViewTabEvents);
  const canViewMap = hasPermission(
    UserPermissionType.MiscellaneousFeatureViewMap
  );
  const canViewReadings = hasPermission(UserPermissionType.ViewTabAssetSummary);

  const [activeTab, setActiveTab] = React.useState(
    location.state?.tab || AssetDetailTab.Details
  );
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: unknown) => {
    setActiveTab(newValue as AssetDetailTab);
  };

  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any | null>(null);
  const [assetDetails, setApiResponse] = useState<AssetDetailGetResp | null>(
    null
  );
  const dataChannelsDefault: DataChannelDTO[] = [];
  const [dataChannelsResult, setDataChannelsResult] = useState<
    DataChannelDTO[]
  >([]);
  const [assetResult, setAssetResult] = useState<
    AssetDetailDto | null | undefined
  >();

  const [selectedDataChannelIds, setSelectedDataChannelIds] = useState<
    string[]
  >([]);

  // Forecast tab is the only one where selected data channels remains in its
  // own state.
  const [
    selectedDataChannelIdsForForecastTable,
    setSelectedDataChannelIdsForForecastTable,
  ] = useState<string[]>(
    location.state?.selectedDataChannelIdsForForecastTable || []
  );
  const selectedDataChannelsForForecastTable = useMemo(
    () =>
      dataChannelsResult.filter((channel) =>
        selectedDataChannelIdsForForecastTable.includes(channel.dataChannelId!)
      ),
    [dataChannelsResult, selectedDataChannelIdsForForecastTable]
  );

  const selectedDataChannelsForReadingsTable = useMemo(
    () =>
      dataChannelsResult.filter((channel) =>
        selectedDataChannelIds.includes(channel.dataChannelId!)
      ),
    [dataChannelsResult, selectedDataChannelIds]
  );
  const selectedDataChannelsForEventsTable = useMemo(
    () =>
      dataChannelsResult.filter((channel) =>
        selectedDataChannelIds.includes(channel.dataChannelId!)
      ),
    [dataChannelsResult, selectedDataChannelIds]
  );

  const selectedDataChannelsForGraph = dataChannelsResult.filter((channel) =>
    selectedDataChannelIds.includes(channel.dataChannelId!)
  );

  const activeDomain = useSelector(selectActiveDomain);

  const domainId = activeDomain?.domainId;

  const saveUserAssetDetailsSettingsApi = useSaveUserAssetDetailsSetting();

  const saveUserAssetDetailsSettings = useCallback(
    (request: Partial<EvovleSaveUserAssetDetailsSettingRequest>) => {
      return saveUserAssetDetailsSettingsApi
        .makeRequest({
          assetId: params.assetId,
          domainId,
          ...request,
        })
        .catch(() => {});
    },
    [domainId, params.assetId]
  );

  const fetchRecords = () => {
    setIsFetching(true);

    AdminApiService.AssetService.asset_GetDetails(params.assetId)
      .then((response) => {
        setApiResponse(response);
        setAssetResult(response.asset);

        const dataChannels =
          response.asset?.dataChannels || dataChannelsDefault;
        setDataChannelsResult(dataChannels);

        const limitedUserSettingsDataChannelIds = response.userAssetSettings?.graphedDataChannel?.slice(
          0,
          MAX_GRAPHABLE_DATA_CHANNEL_COUNT
        );

        const userSettingsDataChannels = dataChannels.filter((channel) =>
          limitedUserSettingsDataChannelIds?.includes(channel.dataChannelId!)
        );
        const fallbackDataChannel = dataChannels[0];
        const dataChannelsForGraph = userSettingsDataChannels.length
          ? userSettingsDataChannels
          : fallbackDataChannel
          ? [fallbackDataChannel]
          : [];

        const dataChannelIdsForGraph = dataChannelsForGraph
          .map((channel) => channel.dataChannelId)
          .filter(Boolean) as string[];
        setSelectedDataChannelIds(dataChannelIdsForGraph);

        const forecastableGraphedDataChannelIds = dataChannelsForGraph
          .filter((channel) => channel.forecastMode)
          .map((channel) => channel.dataChannelId)
          .filter(Boolean) as string[];
        const anyForecastableDataChannelIdsForForecastTable = dataChannels
          .filter((channel) => channel.forecastMode)
          .map((channel) => channel.dataChannelId)
          .filter(Boolean) as string[];

        // Select the initial selected data channels for the Forecast tab.
        // The specific order this is done in is:
        // 1. Use the selected data channel IDs from the route state (i.e. the
        //    user refreshed the page).
        // 2. Use the list of graphed data channel IDs that are forecastable.
        // 3. Use the first data channel ID that is forecastable.
        let dataChannelIdsForForecastTable: string[] = [];
        if (location.state?.selectedDataChannelIdsForForecastTable?.length) {
          dataChannelIdsForForecastTable =
            location.state?.selectedDataChannelIdsForForecastTable;
        } else if (forecastableGraphedDataChannelIds.length) {
          dataChannelIdsForForecastTable = forecastableGraphedDataChannelIds;
        } else if (anyForecastableDataChannelIdsForForecastTable.length) {
          dataChannelIdsForForecastTable = [
            anyForecastableDataChannelIdsForForecastTable[0],
          ];
        }

        setSelectedDataChannelIdsForForecastTable(
          dataChannelIdsForForecastTable
        );
      })
      .catch((error) => {
        setResponseError(error);
      })
      .finally(() => {
        setIsFetching(false);
        setIsLoadingInitial(false);
      });
  };

  // Redirect away from the current tab if the user doesn't have permission to
  // view the tab
  useEffect(() => {
    if (
      (activeTab === AssetDetailTab.Events && !canViewEvents) ||
      (activeTab === AssetDetailTab.Readings && !canViewReadings) ||
      (activeTab === AssetDetailTab.Map && !canViewMap)
    ) {
      setActiveTab(AssetDetailTab.Details);
    }
  }, [activeTab, canViewEvents, canViewMap, canViewReadings]);

  const handleChangeSelectedDataChannelsForGraph = (
    dataChannel: DataChannelForGraph,
    checked: boolean
  ) => {
    if (checked) {
      setSelectedDataChannelIds((prevState) => {
        const graphedDataChannels = [...prevState, dataChannel.dataChannelId!];

        // We limit the amount of graphed data channels via an environment
        // variable
        const slicedGraphedDataChannels = graphedDataChannels.slice(
          Math.max(
            graphedDataChannels.length - MAX_GRAPHABLE_DATA_CHANNEL_COUNT,
            0
          )
        );
        return slicedGraphedDataChannels;
      });
    } else {
      setSelectedDataChannelIds((prevState) =>
        prevState.filter(
          (existingDataChannelId) =>
            existingDataChannelId !== dataChannel.dataChannelId
        )
      );
    }
  };

  const updateAssetInformation = (asset?: EvolveAssetDetails | null) => {
    // The types of these assets are different, so we need to make sure we
    // merge them correctly
    const mergedAsset = AssetDetailDto.fromJS({
      ...assetResult,
      // Only update properties that can be updated via the asset information
      // drawer
      assetNotes: asset?.assetNotes,
      siteInfo: asset?.siteInfo,
      customProperties: asset?.customProperties,
      assetDescription: asset?.assetDescription,
      technician: asset?.technician,
      integrationId: asset?.integrationId,
      referenceDocumentUrl: asset?.referenceDocumentUrl,
    });
    setAssetResult(mergedAsset);
  };

  const topOffset = useSelector(selectTopOffset);

  // #region Graph-related state
  const graphProperties = useGraphProperties({
    assetDetails,
    selectedDataChannelsForGraph,
  });

  const dataChannelsToCacheReadingsAndForecasts = useMemo(() => {
    const dataChannels = graphProperties.manyGraphedDataChannels
      ?.concat(selectedDataChannelsForReadingsTable)
      .concat(selectedDataChannelsForForecastTable);
    return uniqBy(dataChannels || [], 'dataChannelId');
  }, [
    graphProperties.manyGraphedDataChannels,
    selectedDataChannelsForReadingsTable,
    selectedDataChannelsForForecastTable,
  ]);
  const retrieveScheduleDeliveriesApi = useRetrieveScheduledDeliveries(
    {
      dataChannelId: selectedDataChannelIdsForForecastTable?.[0],
      beginDate: graphProperties.fromDate,
      endDate: graphProperties.toDate,
    },
    { enabled: !!selectedDataChannelIdsForForecastTable.length }
  );

  const scheduledDeliveriesForSelectedForecastableDataChannel =
    retrieveScheduleDeliveriesApi.data;

  const [
    isReadingsApiFailureDialogOpen,
    setIsReadingsApiFailureDialogOpen,
  ] = useState(false);
  const closeReadingsApiFailureDialog = () => {
    setIsReadingsApiFailureDialogOpen(false);
  };

  const openReadingsApiFailureDialog = () => {
    setIsReadingsApiFailureDialogOpen(true);
  };

  const [
    isSummarizedReadingsCheckboxSelected,
    setIsSummarizedReadingsCheckboxSelected,
  ] = useState(true);

  const [
    isSummarizedReadingsSelected,
    setIsSummarizedReadingsSelected,
  ] = useState(true);

  const toggleIsSummarizedReadingsSelected = () => {
    setIsSummarizedReadingsSelected((prevState) => !prevState);
  };

  const readingsData = useCacheReadingsAndForecasts({
    // Use the padded dates to prevent data from appearing to be disconnected
    // on the left/right sides of the graph. This happens in some cases when
    // data channels don't log data frequently (eg: 12 hours vs 1 hour)
    fromDate: graphProperties.paddedFromDate,
    toDate: graphProperties.paddedToDate,
    manyGraphedDataChannels: dataChannelsToCacheReadingsAndForecasts,
    isSummarizedReadingsSelected,
    openReadingsApiFailureDialog,
  });

  // Table state/data to perform a CSV download/export
  const [
    tableStateForCsvDownload,
    setTableStateForCsvDownload,
  ] = useState<TableDataForDownload<any> | null>(null);

  const [
    graphedDataChannelsForCsvDownload,
    setGraphedDataChannelsForCsvDownload,
  ] = useState<DataChannelDTO[]>();

  const readingsDataForCsv = useCacheReadingsAndForecasts({
    // Use the padded dates to prevent data from appearing to be disconnected
    // on the left/right sides of the graph. This happens in some cases when
    // data channels don't log data frequently (eg: 12 hours vs 1 hour)
    fromDate: graphProperties.paddedFromDate,
    toDate: graphProperties.paddedToDate,
    manyGraphedDataChannels: graphedDataChannelsForCsvDownload,
    isSummarizedReadingsSelected: false,
  });

  // Set the Summarized Readings checkbox to true or false based off api response.
  useUpdateEffect(() => {
    if (
      Object.values(readingsData.cachedReadings).some((cachedReading) => {
        return cachedReading?.wereReadingsSummarized === true;
      })
    ) {
      setIsSummarizedReadingsCheckboxSelected(true);
    } else {
      setIsSummarizedReadingsCheckboxSelected(false);
    }
  }, [readingsData.cachedReadings]);

  // #endregion Graph-related state

  const refetchRecords = () => {
    readingsData.clearCache();
    fetchRecords();
  };

  useEffect(() => {
    refetchRecords();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [domainId, params.assetId, isSummarizedReadingsSelected]);

  const convertDataChannelUOMParamsApi = useConvertDataChannelUOMParams();
  const handleChangeDataChannelToUnitMapping: ChangeDataChannelToUnitMappingFunction = (
    dataChannelsWithUnit
  ) => {
    const apiPromises = dataChannelsWithUnit.map((dataChannelWithUnit) => {
      const { dataChannelId, unit } = dataChannelWithUnit;

      return convertDataChannelUOMParamsApi.makeRequest(dataChannelId, unit);
    });

    // Wait until we get an API response from ALL data channel conversions,
    // then update the list of data channels as needed
    Promise.allSettled(apiPromises).then((results) => {
      // Create a mapping of data channel IDs to successful API responses
      // containing the updated event rules
      const dataChannelIdToResponseMapping = results.reduce<
        Record<string, UOMParamsDTO>
      >((prev, current, index) => {
        if (current.status === 'fulfilled') {
          const { dataChannelId } = dataChannelsWithUnit[index];
          prev[dataChannelId] = current.value;
        }
        return prev;
      }, {});

      // Update the data channel's uomParams since the unit conversion API
      // only returns a data channel's uomParams
      const {
        dataChannels: newDataChannels,
        hasUpdatedDataChannels: hasUpdatedDataChannelsResult,
      } = updateDataChannelsWithUOMParamsResponse(
        dataChannelsResult,
        dataChannelIdToResponseMapping
      );

      if (hasUpdatedDataChannelsResult && newDataChannels) {
        setDataChannelsResult(newDataChannels);
      }

      // Update the list of graphed data channels if the user updated a
      // data channel that's currently being graphed
      const {
        dataChannels: newGraphedDataChannels,
        hasUpdatedDataChannels: hasUpdatedGraphedDataChannels,
      } = updateDataChannelsWithUOMParamsResponse(
        graphProperties.manyGraphedDataChannels,
        dataChannelIdToResponseMapping
      );

      if (hasUpdatedGraphedDataChannels && newGraphedDataChannels) {
        graphProperties.setManyGraphedDataChannels(newGraphedDataChannels);
      }
    });
  };

  const updateEventsOnAsset = (updatedDataChannels: QuickEditEventsDto[]) => {
    const dataChannelsToRefetch = dataChannelsResult
      .filter((dataChannel) =>
        updatedDataChannels.find(
          (updatedDataChannel) =>
            updatedDataChannel.dataChannelId === dataChannel.dataChannelId
        )
      )
      .filter((dataChannel) => dataChannel.dataChannelId);

    // Call the unit conversion API to receive updated event values for each
    // data channel
    const dataChannelDataForUnitConversion = dataChannelsToRefetch.map(
      (dataChannel) => ({
        dataChannelId: dataChannel.dataChannelId!,
        unit: dataChannel.uomParams?.unitTypeId,
      })
    );
    handleChangeDataChannelToUnitMapping(dataChannelDataForUnitConversion);
  };

  const forecastableDataChannels = useMemo(
    () =>
      dataChannelsResult.filter((dataChannel) => {
        return dataChannel.forecastMode;
      }),
    [dataChannelsResult]
  );

  // Update display priority dialog for Drag and drop (In <DataChannelsLayout />)
  const [
    isUpdateDisplayPriorityDialogOpen,
    setIsUpdateDisplayPriorityDialogOpen,
  ] = useState(false);
  const closeUpdateDisplayPriorityDialog = () => {
    setIsUpdateDisplayPriorityDialogOpen(false);
  };

  const openUpdateDisplayPriorityDialog = () => {
    setIsUpdateDisplayPriorityDialogOpen(true);
  };

  const dataChannelsWithReadingsApiError = dataChannelsToCacheReadingsAndForecasts.filter(
    (dataChannel) => {
      const cacheKey = getReadingsCacheKey(dataChannel);
      const hasError = readingsData.cachedReadings[cacheKey]?.hasError;

      return hasError;
    }
  );

  return (
    <Wrapper
      $topOffset={topOffset}
      $isFullPageHeight={activeTab !== AssetDetailTab.Details}
    >
      <UpdateDisplayPriorityDndDialog
        assetId={assetResult?.assetId!}
        dataChannelResult={dataChannelsResult}
        isUpdateDisplayPriorityDialogOpen={isUpdateDisplayPriorityDialogOpen}
        closeUpdateDisplayPriorityDialog={closeUpdateDisplayPriorityDialog}
        setDataChannelsResult={setDataChannelsResult}
      />

      <UpdatedConfirmationDialog
        maxWidth="xs"
        open={isReadingsApiFailureDialogOpen}
        mainTitle={t('ui.assetDetail.readingsApiError', 'Readings error')}
        content={
          <>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <ReadingsErrorDialogText>
                  {t(
                    'ui.assetDetail.readingsApiErrorMessage',
                    'Readings data for the following data channels could not be retrieved'
                  )}
                  :
                </ReadingsErrorDialogText>
              </Grid>
              {!!dataChannelsWithReadingsApiError.length && (
                <ul>
                  {dataChannelsWithReadingsApiError.map((dataChannel) => {
                    return (
                      <Grid item xs={12}>
                        <li>
                          <ReadingsErrorDialogText>
                            {dataChannel?.description}
                          </ReadingsErrorDialogText>
                        </li>
                      </Grid>
                    );
                  })}
                </ul>
              )}
            </Grid>
          </>
        }
        hideCancelButton
        confirmationButtonText={t('ui.common.ok', 'OK')}
        onConfirm={closeReadingsApiFailureDialog}
        isError={false}
      />

      <Fade in={isLoadingInitial || isFetching} unmountOnExit>
        <div>
          {(isLoadingInitial || isFetching) && (
            <MessageBlock>
              <CircularProgress />
            </MessageBlock>
          )}
        </div>
      </Fade>
      <Fade
        in={!isLoadingInitial && !isFetching && !!responseError}
        unmountOnExit
      >
        <div>
          {!isLoadingInitial && !isFetching && !!responseError && (
            <MessageBlock>
              <Typography variant="body2" color="error">
                {t('Unable to retrieve data')}
              </Typography>
            </MessageBlock>
          )}
        </div>
      </Fade>
      <Fade
        in={!isLoadingInitial && !isFetching && !responseError}
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <Box height="100%">
          {!isLoadingInitial && !isFetching && !responseError && (
            <>
              <PageIntroWrapper
                sticky
                topOffset={topOffset}
                divider={null}
                verticalPaddingFactor={0}
                // Make this component appear over things like the dynamic
                // pressure gauge's numbers
                zIndex={4}
              >
                <PageIntro
                  assetTitle={assetResult?.assetTitle}
                  activeTab={activeTab}
                  handleTabChange={handleTabChange}
                  refetchRecords={refetchRecords}
                  canViewEvents={canViewEvents}
                  canViewMap={canViewMap}
                  canViewReadings={canViewReadings}
                  assetDetails={assetDetails}
                />
              </PageIntroWrapper>

              <TabPanel value={activeTab} index={AssetDetailTab.Details}>
                <DetailsTab
                  assetResult={assetResult}
                  assetDetails={assetDetails}
                  setActiveTab={setActiveTab}
                  dataChannels={dataChannelsResult}
                  selectedDataChannelsForGraph={selectedDataChannelsForGraph}
                  graphProperties={graphProperties}
                  readingsData={readingsData}
                  isFetchingDataChannel={
                    convertDataChannelUOMParamsApi.isFetching ||
                    readingsData.isCachedReadingsApiFetching ||
                    readingsData.dataChannelForecastsApi.isFetching
                  }
                  scheduledDeliveries={
                    scheduledDeliveriesForSelectedForecastableDataChannel
                  }
                  updateAssetInformation={updateAssetInformation}
                  handleChangeSelectedDataChannelsForGraph={
                    handleChangeSelectedDataChannelsForGraph
                  }
                  handleChangeDataChannelToUnitMapping={
                    handleChangeDataChannelToUnitMapping
                  }
                  saveUserAssetDetailsSettings={saveUserAssetDetailsSettings}
                  updateEventsOnAsset={updateEventsOnAsset}
                  setDataChannelsResult={setDataChannelsResult}
                  fetchRecords={fetchRecords}
                  openUpdateDisplayPriorityDialog={
                    openUpdateDisplayPriorityDialog
                  }
                  refetchRecords={refetchRecords}
                />
              </TabPanel>

              {canViewEvents && (
                <StyledTabPanel
                  value={activeTab}
                  index={AssetDetailTab.Events}
                  style={
                    activeTab === AssetDetailTab.Events
                      ? {
                          display: 'flex',
                          flexDirection: 'column',
                          flexGrow: 1,
                          ...overflowStyles,
                        }
                      : {}
                  }
                >
                  <EventsTabWithUserSettings
                    dataChannels={dataChannelsResult}
                    selectedDataChannels={selectedDataChannelsForEventsTable}
                    setSelectedDataChannelIdsForEventsTable={
                      setSelectedDataChannelIds
                    }
                    isFetchingDataChannel={
                      convertDataChannelUOMParamsApi.isFetching
                    }
                    fetchRecords={fetchRecords}
                    openUpdateDisplayPriorityDialog={
                      openUpdateDisplayPriorityDialog
                    }
                  />
                </StyledTabPanel>
              )}

              {canViewReadings && (
                <StyledTabPanel
                  value={activeTab}
                  index={AssetDetailTab.Readings}
                  style={
                    activeTab === AssetDetailTab.Readings
                      ? {
                          display: 'flex',
                          flexDirection: 'column',
                          flexGrow: 1,
                          ...overflowStyles,
                        }
                      : {}
                  }
                >
                  {/* Readings tab also known as "History" Tab */}
                  <ReadingsTab
                    assetTitle={assetResult?.assetTitle}
                    dataChannels={dataChannelsResult}
                    selectedDataChannelsForReadingsTable={
                      selectedDataChannelsForReadingsTable
                    }
                    setSelectedDataChannelIdsForReadingsTable={
                      setSelectedDataChannelIds
                    }
                    graphProperties={graphProperties}
                    readingsData={readingsData}
                    readingsDataForCsv={readingsDataForCsv}
                    isFetchingReadingsCsvData={
                      readingsDataForCsv.isCachedReadingsApiFetching
                    }
                    graphedDataChannelsForCsvDownload={
                      graphedDataChannelsForCsvDownload
                    }
                    tableStateForCsvDownload={tableStateForCsvDownload}
                    setTableStateForCsvDownload={setTableStateForCsvDownload}
                    isFetchingDataChannel={
                      convertDataChannelUOMParamsApi.isFetching
                    }
                    handleChangeDataChannelToUnitMapping={
                      handleChangeDataChannelToUnitMapping
                    }
                    fetchRecords={fetchRecords}
                    openUpdateDisplayPriorityDialog={
                      openUpdateDisplayPriorityDialog
                    }
                    isSummarizedReadingsSelected={isSummarizedReadingsSelected}
                    isSummarizedReadingsCheckboxSelected={
                      isSummarizedReadingsCheckboxSelected
                    }
                    toggleIsSummarizedReadingsSelected={
                      toggleIsSummarizedReadingsSelected
                    }
                    dataChannelsToCacheReadingsAndForecasts={
                      dataChannelsToCacheReadingsAndForecasts
                    }
                    setGraphedDataChannelsForCsvDownload={
                      setGraphedDataChannelsForCsvDownload
                    }
                  />
                </StyledTabPanel>
              )}

              {canViewReadings && (
                <StyledTabPanel
                  value={activeTab}
                  index={AssetDetailTab.Forecast}
                  style={
                    activeTab === AssetDetailTab.Forecast
                      ? {
                          display: 'flex',
                          flexDirection: 'column',
                          flexGrow: 1,
                          ...overflowStyles,
                        }
                      : {}
                  }
                >
                  <ForecastTab
                    assetTitle={assetResult?.assetTitle}
                    dataChannels={forecastableDataChannels}
                    selectedDataChannelsForForecastTable={
                      selectedDataChannelsForForecastTable
                    }
                    setSelectedDataChannelIdsForForecastTable={
                      setSelectedDataChannelIdsForForecastTable
                    }
                    graphProperties={graphProperties}
                    readingsData={readingsData}
                    isFetchingDataChannel={
                      convertDataChannelUOMParamsApi.isFetching
                    }
                    handleChangeDataChannelToUnitMapping={
                      handleChangeDataChannelToUnitMapping
                    }
                    fetchRecords={fetchRecords}
                    openUpdateDisplayPriorityDialog={
                      openUpdateDisplayPriorityDialog
                    }
                  />
                </StyledTabPanel>
              )}

              {canViewMap && (
                <StyledTabPanel
                  value={activeTab}
                  index={AssetDetailTab.Map}
                  style={
                    activeTab === AssetDetailTab.Map
                      ? {
                          display: 'flex',
                          flexDirection: 'column',
                          flexGrow: 1,
                        }
                      : {}
                  }
                >
                  <MapTab
                    asset={assetResult}
                    dataChannels={dataChannelsResult}
                  />
                </StyledTabPanel>
              )}
            </>
          )}
        </Box>
      </Fade>
    </Wrapper>
  );
};
export default AssetDetail;
