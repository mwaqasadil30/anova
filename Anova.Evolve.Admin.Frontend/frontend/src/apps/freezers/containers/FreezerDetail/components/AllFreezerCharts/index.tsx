/* eslint-disable indent, react/jsx-indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/Add';
import { AvailableTagBase, ChartDto, DefaultChartDto } from 'api/admin/api';
import routes from 'apps/freezers/routes';
import {
  DataChannelIdToColorMapping,
  TagIdToHistoricalReadingsApiMapping,
  TagNameToTimeSeriesDataMapping,
} from 'apps/freezers/types';
import Button from 'components/Button';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import MessageBlock from 'components/MessageBlock';
import PageSubHeader from 'components/PageSubHeader';
import StyledListSubheader from 'components/StyledListSubheader';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import moment from 'moment';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { UseQueryResult } from 'react-query';
import { generatePath, Link } from 'react-router-dom';
import { CSVProperties, FreezerChartType, RouteState } from '../../types';
import FreezerDetailChart from '../FreezerDetailChart';

interface Props {
  routeState: RouteState;
  canCreateChart?: boolean;
  tagNameToTimeSeriesDataMapping: TagNameToTimeSeriesDataMapping;
  historicalReadingsMapping: TagIdToHistoricalReadingsApiMapping;
  isHistoricalReadingsApiFetching: boolean;
  isDownloadingReadings: boolean;
  deleteChartApiIsLoading: boolean;
  canDeleteChart?: boolean;
  freezerId: string;
  startDate: moment.Moment;
  endDate: moment.Moment;
  dataChannelIdToColorMapping: DataChannelIdToColorMapping;
  editEllipsisAnchorEl: HTMLElement | null;
  getChartsByAssetIdApi: UseQueryResult<ChartDto | null, unknown>;
  deletedChartIdMapping: Record<string, boolean | undefined>;
  getBulkTankTagsBySiteIdApi: UseQueryResult<
    AvailableTagBase[] | null,
    unknown
  >;
  bulkTankTagIdMapping: Record<string, AvailableTagBase> | undefined;
  chartIdToBulkTankDataChannelMapping: Record<string, string[] | undefined>;
  selectedCustomChartId: string;
  setSelectedCustomChartId: (customChartId: string) => void;
  handleBulkTankTagChange: (
    chartId: number | undefined,
    selectedOptions: string[]
  ) => void;
  setEditEllipsisAnchorEl: React.Dispatch<
    React.SetStateAction<HTMLElement | null>
  >;
  setCsvProperties: React.Dispatch<
    React.SetStateAction<CSVProperties | undefined>
  >;
  setSelectedChartForDataDownload: React.Dispatch<
    React.SetStateAction<DefaultChartDto | undefined>
  >;
  setActiveChartForPopover: React.Dispatch<
    React.SetStateAction<DefaultChartDto | null>
  >;
  handleEditChart: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  handleDeleteChart: (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => void;
}

const AllFreezerCharts = ({
  canCreateChart,
  routeState,
  tagNameToTimeSeriesDataMapping,
  historicalReadingsMapping,
  isHistoricalReadingsApiFetching,
  isDownloadingReadings,
  deleteChartApiIsLoading,
  canDeleteChart,
  freezerId,
  startDate,
  endDate,
  dataChannelIdToColorMapping,
  editEllipsisAnchorEl,
  getChartsByAssetIdApi,
  deletedChartIdMapping,
  getBulkTankTagsBySiteIdApi,
  bulkTankTagIdMapping,
  chartIdToBulkTankDataChannelMapping,
  selectedCustomChartId,
  setSelectedCustomChartId,
  handleBulkTankTagChange,
  setEditEllipsisAnchorEl,
  setCsvProperties,
  setSelectedChartForDataDownload,
  setActiveChartForPopover,
  handleEditChart,
  handleDeleteChart,
}: Props) => {
  const { t } = useTranslation();

  // Only show non-deleted user charts
  const availableUserCharts = useMemo(
    () =>
      getChartsByAssetIdApi.data?.userChartList?.filter(
        (chart) => !deletedChartIdMapping[chart.chartId!]
      ),
    [getChartsByAssetIdApi.data]
  );
  // Only show non-deleted default charts
  const availableDefaultCharts = useMemo(
    () =>
      getChartsByAssetIdApi.data?.defaultChartList?.filter(
        (chart) => !deletedChartIdMapping[chart.chartId!]
      ),
    [getChartsByAssetIdApi.data]
  );

  // Wait for charts api data to load before selecting the first chart option in the dropdown
  useEffect(() => {
    if (!selectedCustomChartId) {
      if (availableDefaultCharts?.length) {
        const customChartId = `default-${availableDefaultCharts[0].chartId}`;
        setSelectedCustomChartId(customChartId);
      } else if (availableUserCharts?.length) {
        const customChartId = `user-${availableUserCharts[0].chartId}`;
        setSelectedCustomChartId(customChartId);
      }
    }
  }, [availableDefaultCharts, availableUserCharts, selectedCustomChartId]);

  const availableDefaultChartOptions =
    availableDefaultCharts?.map((option) => (
      <MenuItem key={option.chartId} value={`default-${option.chartId}`}>
        {option.name}
      </MenuItem>
    )) || [];

  const defaultChartOptions = availableDefaultChartOptions.length
    ? [
        <StyledListSubheader key="default-chart-subheader">
          {t('ui.freezer.freezerDetails.defaultCharts', 'Default Charts')}
        </StyledListSubheader>,
        ...availableDefaultChartOptions,
      ]
    : [];

  const availableUserChartOptions =
    availableUserCharts?.map((option) => (
      <MenuItem key={option.chartId} value={`user-${option.chartId}`}>
        {option.name}
      </MenuItem>
    )) || [];

  const userChartOptions = availableUserChartOptions.length
    ? [
        <StyledListSubheader key="user-chart-subheader">
          {t('ui.freezer.freezerDetails.userCharts', 'User Charts')}
        </StyledListSubheader>,
        ...availableUserChartOptions,
      ]
    : [];

  const allChartOptions = defaultChartOptions.concat(userChartOptions);

  const selectedChartType = selectedCustomChartId?.startsWith('default')
    ? FreezerChartType.Default
    : FreezerChartType.User;

  const selectedChartToRender = useMemo(() => {
    const isDefaultChart = selectedCustomChartId?.startsWith('default');
    const cleanedSelectedCustomChartId = selectedCustomChartId?.replace(
      /\D/g,
      ''
    );

    let selectedChart = null;
    if (isDefaultChart) {
      selectedChart = availableDefaultCharts?.find((chart) => {
        return chart.chartId === Number(cleanedSelectedCustomChartId);
      });
    } else {
      selectedChart = availableUserCharts?.find((chart) => {
        return chart.chartId === Number(cleanedSelectedCustomChartId);
      });
    }

    return selectedChart;
  }, [selectedCustomChartId, availableDefaultCharts, availableUserCharts]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={2} alignItems="center" justify="space-between">
          <Grid item>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <PageSubHeader dense>
                  {t('ui.freezer.freezerDetails.charts', 'Charts')}
                </PageSubHeader>
              </Grid>
              {!!allChartOptions?.length && (
                <Grid item className="no-print">
                  <StyledTextField
                    id="chart-input"
                    select
                    label=""
                    onChange={(event) => {
                      setSelectedCustomChartId(event?.target.value);
                    }}
                    value={selectedCustomChartId}
                    style={{ minWidth: 250 }}
                    InputProps={{
                      style: { height: 38, overflow: 'hidden' },
                    }}
                  >
                    {allChartOptions}
                  </StyledTextField>
                </Grid>
              )}
            </Grid>
          </Grid>
          {canCreateChart && (
            <Grid item className="no-print">
              <Button
                variant="contained"
                component={Link}
                to={{
                  pathname: generatePath(routes.charts.create, {
                    freezerId,
                  }),
                  state: routeState,
                }}
                startIcon={<AddIcon />}
              >
                {t(
                  'ui.freezer.freezerDetails.newFreezerChart',
                  'New freezer chart'
                )}
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {!selectedChartToRender ? (
          <MessageBlock>
            <Box m={2}>
              <SearchCloudIcon />
            </Box>
            <LargeBoldDarkText>
              {t('ui.freezer.freezerDetails.noChartsFound', 'No charts found')}
            </LargeBoldDarkText>
          </MessageBlock>
        ) : (
          <FreezerDetailChart
            chart={selectedChartToRender}
            chartType={selectedChartType}
            tagNameToTimeSeriesDataMapping={tagNameToTimeSeriesDataMapping}
            chartIdToBulkTankDataChannelMapping={
              chartIdToBulkTankDataChannelMapping
            }
            historicalReadingsMapping={historicalReadingsMapping}
            getBulkTankTagsBySiteIdApi={getBulkTankTagsBySiteIdApi}
            bulkTankTagIdMapping={bulkTankTagIdMapping}
            editEllipsisAnchorEl={editEllipsisAnchorEl}
            dataChannelIdToColorMapping={dataChannelIdToColorMapping}
            // Booleans
            isDownloadingReadings={isDownloadingReadings}
            deleteChartApiIsLoading={deleteChartApiIsLoading}
            isHistoricalReadingsApiFetching={isHistoricalReadingsApiFetching}
            canDeleteChart={canDeleteChart}
            // Freezer-specific
            freezerId={freezerId}
            startDate={startDate}
            endDate={endDate}
            // Functions
            handleBulkTankTagChange={handleBulkTankTagChange}
            setCsvProperties={setCsvProperties}
            setSelectedChartForDataDownload={setSelectedChartForDataDownload}
            setActiveChartForPopover={setActiveChartForPopover}
            setEditEllipsisAnchorEl={setEditEllipsisAnchorEl}
            handleEditChart={handleEditChart}
            handleDeleteChart={handleDeleteChart}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default AllFreezerCharts;
