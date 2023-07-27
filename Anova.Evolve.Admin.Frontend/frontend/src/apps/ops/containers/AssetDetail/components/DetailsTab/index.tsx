/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { savePDF } from '@progress/kendo-react-pdf';
import {
  AssetDetailDto,
  AssetDetailGetResp,
  DataChannelCategory,
  DataChannelDTO,
  EvolveAssetDetails,
  EvolveForecastReadingResponse,
  EvovleSaveUserAssetDetailsSettingRequest,
  ForecastMode,
  QuickEditEventsDto,
  ScheduledDeliveryDto,
  UnitTypeEnum,
  UserProblemReportSettingDto,
} from 'api/admin/api';
import useProblemReportsListDetails from 'apps/ops/containers/ProblemReportsList/hooks/useProblemReportsListDetails';
import { ReactComponent as DownloadIcon } from 'assets/icons/download.svg';
import { ReactComponent as ExpandIcon } from 'assets/icons/expand-view.svg';
import { ReactComponent as MinimizeIcon } from 'assets/icons/minimize-view.svg';
import CustomBoxRedesign from 'components/CustomBoxRedesign';
import CustomTooltip from 'components/CustomTooltip';
import { usePreserveUserProblemReportSettings } from 'components/PreserveUserProblemReportSettings/hooks/usePreserveUserProblemReportSettings';
import Tab from 'components/Tab';
import Tabs from 'components/Tabs';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import {
  selectActiveDomainName,
  selectIsActiveDomainApciEnabled,
} from 'redux-app/modules/app/selectors';
import { selectCanViewProblemReportsTab } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { AnalyticsEvent, Application, PDFDownloadType } from 'types';
import { ai } from 'utils/app-insights';
import { getExportFilenameForPDFWithDatetime } from 'utils/format/dataExport';
import { accordionBannerSize, expandedRightPanelWidth } from '../../styles';
import {
  AssetDetailTab,
  ChangeDataChannelToUnitMappingFunction,
  DataChannelForGraph,
  GraphProperties,
  ReadingsHookData,
} from '../../types';
import AssetGraph from '../AssetGraph';
import { getReadingsCacheKey } from '../AssetGraph/helpers';
import AssetInformation from '../AssetInformation';
import DataChannelsLayout from '../DataChannelsLayout';
import DeliveryPanel from '../DeliveryPanel';
import AssetDetailProblemReportsTableAndTableOptions from '../DeliveryPanel/components/AssetDetailProblemReportsTableAndTableOptions';
import ScheduleDeliveryDialog from '../ScheduleDeliveryDialog';
import ScheduleDeliveryEditorDialog from '../ScheduleDeliveryEditorDialog';
import { GraphOrProblemReportTab } from './types';

const StyledIconButton = styled(IconButton)`
  margin-top: 8px;
`;

const StyledDownloadIcon = styled(DownloadIcon)`
  color: ${(props) =>
    props.theme.palette.type === 'light'
      ? props.theme.custom.domainSecondaryColor
      : props.theme.custom.domainColor};
`;

const StyledTabs = styled(Tabs)`
  && .MuiTabs-indicator {
    display: none;
  }
  border-bottom: none;
`;

const StyledTab = styled(Tab)`
  &&.Mui-selected {
    background-color: ${(props) =>
      props.theme.palette.type === 'light' ? '#FFFFFF' : '#333333'};
    box-shadow: 0px 2px 13px rgba(0, 0, 0, 0.1);
  }
  padding-top: 10px;
  margin-right: 0px; // Remove spacing between tabs
  border-radius: 10px 10px 0 0;
  color: ${(props) => props.theme.palette.text.primary};
  background-color: ${(props) =>
    props.theme.palette.type === 'light' ? '#EBEBEB' : '#515151'};
`;

interface LocationState {
  tab?: AssetDetailTab;
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
      id={`asset-detail-graph-tabpanel-${index}`}
      aria-labelledby={`asset-detail-graph-tab-${index}`}
      {...other}
    >
      {value === index && <Box height="100%">{children}</Box>}
    </div>
  );
};

interface Props {
  assetResult?: AssetDetailDto | null;
  assetDetails: AssetDetailGetResp | null;
  dataChannels: DataChannelDTO[];
  selectedDataChannelsForGraph: DataChannelForGraph[];
  graphProperties: GraphProperties;
  readingsData: ReadingsHookData;
  isFetchingDataChannel?: boolean;
  scheduledDeliveries: ScheduledDeliveryDto[] | undefined;
  updateAssetInformation: (asset?: EvolveAssetDetails | null) => void;
  handleChangeSelectedDataChannelsForGraph: (
    dataChannel: DataChannelForGraph,
    checked: boolean
  ) => void;
  handleChangeDataChannelToUnitMapping: ChangeDataChannelToUnitMappingFunction;

  saveUserAssetDetailsSettings: (
    request: Partial<EvovleSaveUserAssetDetailsSettingRequest>
  ) => void;
  updateEventsOnAsset: (updatedDataChannels: QuickEditEventsDto[]) => void;
  setActiveTab: (tab: AssetDetailTab) => void;
  setDataChannelsResult: (dataChannels: DataChannelDTO[]) => void;
  fetchRecords: () => void;
  openUpdateDisplayPriorityDialog: () => void;
  userProblemReportSettings?: UserProblemReportSettingDto | undefined;
  saveUserProblemReportSettings?: (
    request: Omit<UserProblemReportSettingDto, 'init' | 'toJSON'>
  ) => Promise<UserProblemReportSettingDto>;
  refetchRecords: () => void;
}

const DetailsTab = ({
  assetResult,
  assetDetails,
  dataChannels,
  selectedDataChannelsForGraph,
  graphProperties,
  readingsData,
  isFetchingDataChannel,
  scheduledDeliveries,
  updateAssetInformation,
  handleChangeSelectedDataChannelsForGraph,
  handleChangeDataChannelToUnitMapping,
  saveUserAssetDetailsSettings,
  updateEventsOnAsset,
  setActiveTab,
  setDataChannelsResult,
  fetchRecords,
  openUpdateDisplayPriorityDialog,
  userProblemReportSettings,
  saveUserProblemReportSettings,
  refetchRecords,
}: Props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();

  const canViewProblemReportsTab = useSelector(selectCanViewProblemReportsTab);

  const isAirProductsEnabledDomain = useSelector(
    selectIsActiveDomainApciEnabled
  );
  const domainName = useSelector(selectActiveDomainName);

  const [isDeliveryOpen, setIsDeliveryOpen] = useState<boolean>(true);
  const [isTableOrGraphExpanded, setIsTableOrGraphExpanded] = useState<boolean>(
    false
  );
  const [graphOrProblemReportTab, setGraphOrProblemReportTab] = useState(
    GraphOrProblemReportTab.ProblemReports
  );

  const isGraphTabActive =
    graphOrProblemReportTab === GraphOrProblemReportTab.Graph;

  const toggleIsGraphExpanded = () => {
    setIsTableOrGraphExpanded((prevState) => !prevState);
  };

  useEffect(() => {
    // Trigger the browser resize event so that the Highcharts graph can resize
    // to take up the full width of it's container.
    // https://stackoverflow.com/a/36158314/7752479
    window.dispatchEvent(new Event('resize'));
  }, [isDeliveryOpen, isTableOrGraphExpanded]);

  const gpsDataChannelId = dataChannels.find(
    (channel) => channel.dataChannelTypeId === DataChannelCategory.Gps
  )?.dataChannelId;
  // TODO: Replace/remove if/when proper isMobile flag is reliable
  const isMobileAsset = !!gpsDataChannelId;

  useEffect(() => {
    history.replace(location.pathname, {
      tab: AssetDetailTab.Details,
    } as LocationState);
  }, []);

  const handleSelectedDataChannelUnitChange = (
    dataChannelId: string,
    unit?: UnitTypeEnum | null
  ) => {
    handleChangeDataChannelToUnitMapping([{ dataChannelId, unit }]);
  };

  const handleChangeGraphOrProblemReportTab = (
    event: React.ChangeEvent<{}> | undefined,
    newValue: GraphOrProblemReportTab
  ) => {
    event?.stopPropagation();
    setGraphOrProblemReportTab(newValue);
  };

  const problemReportListDetails = useProblemReportsListDetails({
    assetId: assetResult?.assetId,
    userProblemReportSettings,
    saveUserProblemReportSettings,
  });

  const pdfExportElement = useRef<any>(null);
  const createPDF = () => {
    if (pdfExportElement.current) {
      const domainNameForExport =
        assetResult?.isPublishedAsset && assetResult.publishedDomainName
          ? assetResult.publishedDomainName
          : domainName;
      const filenamePrefix = [domainNameForExport, assetResult?.assetTitle]
        .filter(Boolean)
        .join(' ');
      const formattedFilename = getExportFilenameForPDFWithDatetime(
        filenamePrefix
      );

      savePDF(pdfExportElement.current, {
        paperSize: 'auto',
        fileName: formattedFilename,
        margin: 16,
      });

      ai.appInsights.trackEvent({
        name: AnalyticsEvent.PDFDownloaded,
        properties: {
          app: Application.Operations,
          type: PDFDownloadType.AssetDetailGraph,
          id: assetResult?.assetId,
          name: assetResult?.assetTitle,
        },
      });
    }
  };

  // Add Scheduled Delivery
  const [
    scheduleDeliveryDetails,
    setScheduleDeliveryDetails,
  ] = useState<EvolveForecastReadingResponse>();
  const [
    isScheduleDeliveryDialogOpen,
    setIsScheduleDeliveryDialogOpen,
  ] = useState(false);
  const closeScheduleDeliveryDialog = () => {
    setIsScheduleDeliveryDialogOpen(false);
  };
  const openScheduleDeliveryDialog = (
    deliveryDetails?: EvolveForecastReadingResponse
  ) => {
    setScheduleDeliveryDetails(deliveryDetails);
    setIsScheduleDeliveryDialogOpen(true);
  };

  // Edit Scheduled Delivery
  const [
    scheduleDeliveryEditorDetails,
    setScheduleDeliveryEditorDetails,
  ] = useState<ScheduledDeliveryDto>();
  const [
    isScheduleDeliveryEditorDialogOpen,
    setIsScheduleDeliveryEditorDialogOpen,
  ] = useState(false);
  const closeScheduleDeliveryEditorDialog = () => {
    setIsScheduleDeliveryEditorDialogOpen(false);
  };
  const openScheduleDeliveryEditorDialog = (
    deliveryDetails?: ScheduledDeliveryDto
  ) => {
    setScheduleDeliveryEditorDetails(deliveryDetails);
    setIsScheduleDeliveryEditorDialogOpen(true);
  };

  const selectedForecastableDataChannelForScheduleDelivery = selectedDataChannelsForGraph.find(
    (channel) => channel.forecastMode !== ForecastMode.NoForecast
  );

  const forecastDataChannelCacheKey = selectedForecastableDataChannelForScheduleDelivery
    ? getReadingsCacheKey(selectedForecastableDataChannelForScheduleDelivery)
    : '';
  const cachedForecastData =
    readingsData.cachedForecastReadings[forecastDataChannelCacheKey];
  const forecastReadingsForScheduleDelivery = cachedForecastData?.forecasts;

  const problemReportAndGraphTabs = (
    <StyledTabs
      dense
      value={graphOrProblemReportTab}
      // @ts-ignore
      onChange={handleChangeGraphOrProblemReportTab}
      aria-label="Asset detail graph and problem report tabs"
      style={{
        // Reduce margin to align the bottom of the tabs for 2 cases:
        // 1. With an un-expanded CustomBoxRedesign, and
        // 2. When if the user presses the expand button to have a larger view
        // of the tabs or graph.
        marginBottom: isTableOrGraphExpanded ? '-11px' : '-24px',
      }}
    >
      <StyledTab
        label={t('ui.problemreport.problemreports', 'Problem Reports')}
        value={GraphOrProblemReportTab.ProblemReports}
      />
      <StyledTab
        label={t('ui.assetdetail.graph', 'Graph')}
        value={GraphOrProblemReportTab.Graph}
      />
    </StyledTabs>
  );

  const downloadPdfButton = (
    <CustomTooltip title={t('ui.common.downloadGraph', 'Download Graph')}>
      <StyledIconButton
        onClick={createPDF}
        disabled={readingsData.isCachedReadingsApiFetching}
        aria-label="Download graph"
      >
        <StyledDownloadIcon />
      </StyledIconButton>
    </CustomTooltip>
  );

  const toggleExpandButton = (
    <StyledIconButton
      onClick={toggleIsGraphExpanded}
      disabled={readingsData.isCachedReadingsApiFetching}
    >
      {isTableOrGraphExpanded ? (
        <MinimizeIcon title="Minimize Graph" aria-label="minimize graph icon" />
      ) : (
        <ExpandIcon title="Expand Graph" aria-label="expand graph icon" />
      )}
    </StyledIconButton>
  );

  const problemReportsTable = (
    <CustomBoxRedesign
      borderRadius={
        isTableOrGraphExpanded
          ? 0
          : isAirProductsEnabledDomain && canViewProblemReportsTab
          ? '0px 0px 0px 10px'
          : '10px 0 0 10px'
      }
      px="0"
      pt="2px"
      mt={isTableOrGraphExpanded ? '0px' : '7px'}
      mx={isTableOrGraphExpanded ? '-32px' : 'inherit'}
    >
      <Box p={2} height="100%">
        <AssetDetailProblemReportsTableAndTableOptions
          problemReportsListDetails={problemReportListDetails}
        />
      </Box>
    </CustomBoxRedesign>
  );

  const assetGraph = (
    <CustomBoxRedesign
      borderRadius={
        isTableOrGraphExpanded
          ? 0
          : isAirProductsEnabledDomain && canViewProblemReportsTab
          ? '0px 0px 0px 10px'
          : '10px 0 0 10px'
      }
      px="0"
      pt="2px"
      mt={isTableOrGraphExpanded ? '0px' : '7px'}
      mx={isTableOrGraphExpanded ? '-32px' : 'inherit'}
    >
      <AssetGraph
        asset={assetResult}
        initialFromDate={assetDetails?.userAssetSettings?.graphStartDate}
        initialToDate={assetDetails?.userAssetSettings?.graphEndDate}
        saveUserAssetDetailsSettings={saveUserAssetDetailsSettings}
        graphProperties={graphProperties}
        readingsData={readingsData}
        scheduledDeliveries={scheduledDeliveries}
        isMobile={isMobileAsset}
        toggleIsGraphExpanded={toggleIsGraphExpanded}
        isTableOrGraphExpanded={isTableOrGraphExpanded}
        gpsDataChannelId={gpsDataChannelId}
        pdfExportElement={pdfExportElement}
        createPDF={createPDF}
        openScheduleDeliveryDialog={openScheduleDeliveryDialog}
        openScheduleDeliveryEditorDialog={openScheduleDeliveryEditorDialog}
      />
    </CustomBoxRedesign>
  );

  return (
    <Box mt={3} width="100%">
      <ScheduleDeliveryDialog
        isDialogOpen={isScheduleDeliveryDialogOpen}
        closeDialog={closeScheduleDeliveryDialog}
        initialSelectedScheduleDeliveryDetails={scheduleDeliveryDetails}
        dataChannelForScheduleDelivery={
          selectedForecastableDataChannelForScheduleDelivery
        }
        forecastApiData={forecastReadingsForScheduleDelivery}
        refetchRecords={refetchRecords}
      />
      <ScheduleDeliveryEditorDialog
        isDialogOpen={isScheduleDeliveryEditorDialogOpen}
        closeDialog={closeScheduleDeliveryEditorDialog}
        selectedScheduledDelivery={scheduleDeliveryEditorDetails}
        dataChannelForScheduleDelivery={
          selectedForecastableDataChannelForScheduleDelivery
        }
        forecastApiData={forecastReadingsForScheduleDelivery}
        refetchRecords={refetchRecords}
      />
      <Grid container>
        <Grid
          item
          style={{
            width: isTableOrGraphExpanded
              ? '100%'
              : `calc(100% - ${
                  isDeliveryOpen ? expandedRightPanelWidth : accordionBannerSize
                }px)`,
          }}
        >
          {!isTableOrGraphExpanded && (
            <AssetInformation
              assetResult={assetResult}
              updateAssetInformation={updateAssetInformation}
            />
          )}

          {isAirProductsEnabledDomain && canViewProblemReportsTab ? (
            <>
              <Grid item>
                <Grid container justify="space-between" alignItems="center">
                  <Grid item xs>
                    {problemReportAndGraphTabs}
                  </Grid>

                  <Grid item xs="auto" style={{ paddingRight: '8px' }}>
                    <Grid container spacing={2} alignItems="center">
                      {isGraphTabActive && (
                        <Grid item xs>
                          {downloadPdfButton}
                        </Grid>
                      )}
                      <Grid item xs>
                        {toggleExpandButton}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <TabPanel
                value={graphOrProblemReportTab}
                index={GraphOrProblemReportTab.ProblemReports}
              >
                {problemReportsTable}
              </TabPanel>
              <TabPanel
                value={graphOrProblemReportTab}
                index={GraphOrProblemReportTab.Graph}
              >
                {assetGraph}
              </TabPanel>
            </>
          ) : (
            assetGraph
          )}
        </Grid>

        {!isTableOrGraphExpanded && (
          <Grid
            item
            style={{
              flexBasis: isDeliveryOpen
                ? expandedRightPanelWidth
                : accordionBannerSize,
              minWidth: isDeliveryOpen
                ? expandedRightPanelWidth
                : accordionBannerSize,
              position: 'relative',
            }}
          >
            <DeliveryPanel
              setActiveTab={setActiveTab}
              assetId={assetResult?.assetId}
              domainId={assetResult?.domainId}
              isPublishedAsset={assetResult?.isPublishedAsset}
              publishedDomainName={assetResult?.publishedDomainName}
              dataChannelResult={dataChannels}
              isDeliveryOpen={isDeliveryOpen}
              setIsDeliveryOpen={setIsDeliveryOpen}
              gpsDataChannelId={gpsDataChannelId}
              updateEventsOnAsset={updateEventsOnAsset}
              fetchRecords={fetchRecords}
            />
          </Grid>
        )}
      </Grid>

      <Box mt={1}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <DataChannelsLayout
              dataChannelResult={dataChannels}
              isPublishedAsset={assetResult?.isPublishedAsset}
              selectedDataChannels={selectedDataChannelsForGraph}
              isFetchingDataChannel={isFetchingDataChannel}
              minimumSelectionCount={1}
              readingsData={readingsData}
              canSelectDataChannel={(channel) =>
                channel.dataChannelTypeId !== DataChannelCategory.Gps
              }
              handleChangeSelectedDataChannel={
                handleChangeSelectedDataChannelsForGraph
              }
              handleChangeDataChannelToUnitMapping={
                handleSelectedDataChannelUnitChange
              }
              carouselProps={{
                shouldWrap: true,
              }}
              setDataChannelsResult={setDataChannelsResult}
              fetchRecords={fetchRecords}
              openUpdateDisplayPriorityDialog={openUpdateDisplayPriorityDialog}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const DetailsTabWithUserSettings = (props: any) => {
  const canAccessProblemReports = useSelector(selectCanViewProblemReportsTab);

  const {
    userProblemReportSettings,
    isUserProblemReportSettingsLoadingInitial,
    saveUserProblemReportSettings,
  } = usePreserveUserProblemReportSettings({
    isAirProductsDomain: canAccessProblemReports,
  });

  const fullProps = {
    ...props,
    userProblemReportSettings,
    saveUserProblemReportSettings,
  };

  if (!canAccessProblemReports) {
    return <DetailsTab {...props} />;
  }

  return isUserProblemReportSettingsLoadingInitial ? null : (
    <DetailsTab {...fullProps} />
  );
};

export default DetailsTabWithUserSettings;
