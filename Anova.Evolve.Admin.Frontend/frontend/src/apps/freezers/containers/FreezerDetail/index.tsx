import Grid from '@material-ui/core/Grid';
import {
  AvailableTagBase,
  ChartTagBaseDto,
  DefaultChartDto,
  UserChartDto,
} from 'api/admin/api';
import {
  getDataChannelToColorMapping,
  getDetailsInitialEndDate,
  getDetailsInitialStartDate,
} from 'apps/freezers/helpers';
import { useGetFreezerTimeSeriesForDataChannels } from 'apps/freezers/hooks/useGetFreezerTimeSeriesForDataChannels';
import routes from 'apps/freezers/routes';
import {
  LocationState,
  TagIdToHistoricalReadingsApiMapping,
} from 'apps/freezers/types';
import BackIconButton from 'components/buttons/BackIconButton';
import DefaultTransition from 'components/common/animations/DefaultTransition';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import Highcharts from 'highcharts';
import useDateStateWithTimezone from 'hooks/useDateStateWithTimezone';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  generatePath,
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';
import { selectActiveDomainName } from 'redux-app/modules/app/selectors';
import {
  selectCanCreateFreezerChart,
  selectCanDeleteFreezerChart,
} from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { AnalyticsEvent, Application, PDFDownloadType } from 'types';
import { ai } from 'utils/app-insights';
import {
  getExportFilenameForPDFWithDatetime,
  getExportFilenameWithDatetime,
} from 'utils/format/dataExport';
import { defaultPDFOptions, savePDFWithOptions } from 'utils/pdf-export';
import { useGetDataChannelsByAssetId } from '../ChartEditor/hooks/useGetDataChannelsByAssetId';
import AllFreezerCharts from './components/AllFreezerCharts';
import FreezerDetailsBox from './components/FreezerDetailsBox';
import FreezerEventsBox from './components/FreezerEventsBox';
import PageIntro from './components/PageIntro';
import {
  formatChartDataForCsv,
  getDataChannelsOrTagsForChart,
} from './helpers';
import { useDeleteChart } from './hooks/useDeleteChart';
import { useGetBulkTankTagsBySiteId } from './hooks/useGetBulkTankTagsBySiteId';
import { useGetChartsByAssetId } from './hooks/useGetChartsByAssetId';
import { useGetFreezerDetails } from './hooks/useGetFreezerDetails';
import { useGetMultipleHistoricalReadingsByBulkTankTagId } from './hooks/useGetHistoricalReadingsByBulkTankTagId';
import { CSVProperties, RouteState } from './types';

const Wrapper = styled.div`
  @media print {
    .no-print {
      display: none;
    }

    .non-sticky {
      position: relative;
      top: initial;
      margin-bottom: 16px;
    }
  }

  .k-pdf-export {
    background-color: ${(props) => props.theme.palette.background.default};
  }

  .k-pdf-export .no-print {
    display: none;
  }

  .k-pdf-export .highcharts-root {
    width: 100%;
  }

  .k-pdf-export .non-sticky {
    position: relative;
    top: initial;
    margin-bottom: 16px;
  }
`;

interface RouteParams {
  freezerId: string;
}

const FreezerDetail = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation<LocationState | undefined>();

  const elementForPdfExportRef = useRef<HTMLDivElement>(null);
  const { freezerId } = useParams<RouteParams>();

  const domainName = useSelector(selectActiveDomainName);
  const canCreateChart = useSelector(selectCanCreateFreezerChart);
  const canDeleteChart = useSelector(selectCanDeleteFreezerChart);

  const [startDate, setStartDate] = useDateStateWithTimezone(() =>
    getDetailsInitialStartDate(location.state?.startDate)
  );
  const [endDate, setEndDate] = useDateStateWithTimezone(() =>
    getDetailsInitialEndDate(location.state?.endDate)
  );

  const [selectedCustomChartId, setSelectedCustomChartId] = useState<string>(
    ''
  );

  const routeState: RouteState = {
    startDate: startDate.toJSON(),
    endDate: endDate.toJSON(),
  };

  useEffect(() => {
    history.replace(location.pathname, routeState);
  }, [startDate, endDate]);

  const [deletedChartIdMapping, setDeletedChartIdMapping] = useState<
    Record<string, boolean | undefined>
  >({});

  const updateStartAndEndDates = (
    startDatetime: moment.Moment,
    endDatetime: moment.Moment
  ) => {
    setStartDate(startDatetime);
    setEndDate(endDatetime);
  };

  const getDataChannelsByAssetIdApi = useGetDataChannelsByAssetId({
    assetId: freezerId,
  });
  const getChartsByAssetIdApi = useGetChartsByAssetId({
    assetId: freezerId,
  });
  const deleteChartApi = useDeleteChart();
  const getFreezerDetailsApi = useGetFreezerDetails({
    freezerId,
    startDate: startDate.toDate(),
    endDate: endDate.toDate(),
  });

  const dataChannelIdToColorMapping = useMemo(
    () => getDataChannelToColorMapping(getDataChannelsByAssetIdApi.data),
    [getDataChannelsByAssetIdApi.data]
  );

  // Flattened user chart data channels
  const flattenedDataChannels = getChartsByAssetIdApi.data?.userChartList
    ?.filter((chart) => chart.chartDataChannels?.length)
    .flatMap<ChartTagBaseDto>((chart) => chart.chartDataChannels!);

  // Flattened default chart tags
  const flattenedDefaultTags = getChartsByAssetIdApi.data?.defaultChartList
    ?.filter((chart) => chart.chartTags?.length)
    .flatMap<ChartTagBaseDto>((chart) => chart.chartTags!);

  const dirtyFlattenedCombinedTags = flattenedDataChannels?.concat(
    flattenedDefaultTags || []
  );

  const flattenedCombinedUniqueTags = uniqBy(
    dirtyFlattenedCombinedTags,
    'tagId'
  );

  const {
    tagNameToTimeSeriesDataMapping,
  } = useGetFreezerTimeSeriesForDataChannels({
    freezerId,
    startDate: startDate.toDate(),
    endDate: endDate.toDate(),
    dataChannels: flattenedCombinedUniqueTags,
  });

  const freezerDetails = getFreezerDetailsApi.data;

  // #region Bulk Tank logic
  const getBulkTankTagsBySiteIdApi = useGetBulkTankTagsBySiteId({
    siteId: freezerDetails?.siteId,
  });

  const bulkTankTagIdMapping = useMemo(() => {
    return getBulkTankTagsBySiteIdApi.data?.reduce<
      Record<string, AvailableTagBase>
    >((prev, current) => {
      prev[current.tagId!] = current;
      return prev;
    }, {});
  }, [getBulkTankTagsBySiteIdApi.data]);

  const [
    chartIdToBulkTankDataChannelMapping,
    setChartIdToBulkTankDataChannelMapping,
  ] = useState<Record<string, string[] | undefined>>({});

  const selectedBulkTankTagIds: string[] = uniq(
    Object.values(chartIdToBulkTankDataChannelMapping)
      .flat()
      // @ts-ignore
      .filter<string>(Boolean)
  );

  const getMultipleHistoricalReadingsByBulkTankTagIdApi = useGetMultipleHistoricalReadingsByBulkTankTagId(
    {
      tagIds: selectedBulkTankTagIds,
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
    }
  );

  const isHistoricalReadingsApiFetching = getMultipleHistoricalReadingsByBulkTankTagIdApi.some(
    (apiCall) => apiCall.isFetching
  );

  const historicalReadingsMapping = useMemo(() => {
    return getMultipleHistoricalReadingsByBulkTankTagIdApi.reduce<TagIdToHistoricalReadingsApiMapping>(
      (prev, current) => {
        if (current.data?.dataChannelId && current.isSuccess) {
          prev[current.data.dataChannelId] = {
            api: current,
            description:
              bulkTankTagIdMapping?.[current.data.dataChannelId].tagName,
          };
        }

        return prev;
      },
      {}
    );
  }, [
    getMultipleHistoricalReadingsByBulkTankTagIdApi,
    bulkTankTagIdMapping,
    selectedBulkTankTagIds,
  ]);

  const handleBulkTankTagChange = (
    chartId: number | undefined,
    selectedOptions: string[]
  ) => {
    if (chartId) {
      setChartIdToBulkTankDataChannelMapping((prevState) => ({
        ...prevState,
        [chartId]: selectedOptions,
      }));
    }
  };
  // #endregion Bulk Tank logic

  // #region CSV data
  // CSV download/export related hooks.
  // The changing of the `csvProperties` state is used to trigger the download
  // of the CSV file.
  const csvLinkRef = useRef<HTMLAnchorElement | null>(null);
  const [csvProperties, setCsvProperties] = useState<CSVProperties>();
  const [
    selectedChartForDataDownload,
    setSelectedChartForDataDownload,
  ] = useState<DefaultChartDto | UserChartDto>();

  const dataChannelsOrTagsForDownload = getDataChannelsOrTagsForChart(
    selectedChartForDataDownload
  );

  const {
    tagNameToTimeSeriesDataMapping: csvDataTagNameToTimeSeriesDataMapping,
    meanApi: csvDataMeanApi,
    sumApi: csvDataSumApi,
  } = useGetFreezerTimeSeriesForDataChannels({
    freezerId,
    startDate: startDate.toDate(),
    endDate: endDate.toDate(),
    // For the CSV export we specify numberOfBuckets to be the exact number of
    // minutes in the date range
    numberOfBuckets: moment(endDate).diff(moment(startDate), 'minutes'),
    dataChannels: dataChannelsOrTagsForDownload,
  });

  // Set the CSV data after the API responses are received (there may be two
  // API responses, one for the mean aggregation, one for the sum aggregation)
  useEffect(() => {
    if (
      !csvDataMeanApi.isFetching &&
      !csvDataSumApi.isFetching &&
      selectedChartForDataDownload &&
      csvDataTagNameToTimeSeriesDataMapping &&
      chartIdToBulkTankDataChannelMapping &&
      historicalReadingsMapping &&
      !csvProperties
    ) {
      const chartNameForFilename = selectedChartForDataDownload.name || 'chart';
      const filename = getExportFilenameWithDatetime(chartNameForFilename);
      const formattedCsvData = formatChartDataForCsv(
        t,
        selectedChartForDataDownload,
        csvDataTagNameToTimeSeriesDataMapping,
        chartIdToBulkTankDataChannelMapping,
        historicalReadingsMapping
      );
      setCsvProperties({
        filename,
        data: formattedCsvData,
      });
      // Reset the selected chart to prevent the CSV data from being downloaded
      // on adjustments to the start/end dates (which trigger a new API call
      // via react-query)
      setSelectedChartForDataDownload(undefined);
    }
  }, [
    csvDataMeanApi,
    csvDataSumApi,
    csvDataTagNameToTimeSeriesDataMapping,
    chartIdToBulkTankDataChannelMapping,
    historicalReadingsMapping,
    csvProperties,
  ]);

  // Trigger the download of the CSV file when csvData changes
  useEffect(() => {
    // @ts-ignore
    if (csvLinkRef.current?.link && csvProperties) {
      // On Safari, the file gets downloaded before the CSV data can be set.
      // Adding a timeout seems to get around the issue.
      setTimeout(() => {
        // @ts-ignore
        csvLinkRef.current.link.click();
      });
    }
  }, [csvProperties]);
  // #endregion CSV data

  const [
    editEllipsisAnchorEl,
    setEditEllipsisAnchorEl,
  ] = useState<null | HTMLElement>(null);
  const handleClose = (event?: any) => {
    event?.stopPropagation?.();
    setEditEllipsisAnchorEl(null);
  };

  const [
    activeChartForPopover,
    setActiveChartForPopover,
  ] = useState<UserChartDto | null>(null);

  const handleEditChart = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    event.stopPropagation();

    const chartId = activeChartForPopover?.chartId;

    if (freezerId && chartId) {
      const chartRoutePath = generatePath(routes.charts.detail, {
        freezerId,
        chartId,
      });
      history.push(chartRoutePath, routeState);
      handleClose();
    }
  };
  const handleDeleteChart = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    event.stopPropagation();

    const chartId = activeChartForPopover?.chartId;

    if (chartId) {
      deleteChartApi.mutateAsync(chartId).then((wasSuccessful) => {
        if (wasSuccessful) {
          handleClose();
          setDeletedChartIdMapping((prevState) => ({
            ...prevState,
            [chartId!]: true,
          }));
        }
      });
    }
  };

  const isDownloadingReadings =
    csvDataMeanApi.isFetching || csvDataSumApi.isFetching;

  const beforePdfExport = () => {
    // Resize the highcharts container to fit in the exported PDF BEFORE the
    // export runs
    const highchartsElements = document.getElementsByClassName(
      'highcharts-container'
    );
    for (let index = 0; index < highchartsElements.length; index += 1) {
      const element = highchartsElements[index].parentElement;
      // Kendo PDF seems to have a consistent PDF width of around 800. This
      // will make the highcharts container fit properly within its container
      // on the PDF
      // @ts-ignore
      element.style.width = `${735 * (1 / defaultPDFOptions.scale)}px`;
    }

    // Redraw highcharts based on the adjusted container width
    Highcharts.charts.forEach((chart) => {
      chart?.reflow();
    });
  };

  const afterPdfExport = () => {
    // Resize the highcharts container to its original size
    const highchartsElements = document.getElementsByClassName(
      'highcharts-container'
    );
    for (let index = 0; index < highchartsElements.length; index += 1) {
      const element = highchartsElements[index].parentElement;
      // @ts-ignore
      element.style.width = '';
    }

    // Redraw highcharts based on the existing container width
    Highcharts.charts.forEach((chart) => {
      chart?.reflow();
    });
  };

  const createPDF = ({ withMultiplePages }: { withMultiplePages: boolean }) => {
    if (elementForPdfExportRef.current) {
      const filenamePrefix = [
        domainName,
        getFreezerDetailsApi.data?.freezerName,
      ]
        .filter(Boolean)
        .join(' ');
      const formattedFilename = getExportFilenameForPDFWithDatetime(
        filenamePrefix
      );

      // When exporting multiple pages, we need to resize the charts BEFORE the
      // export and restore the original sizes after
      if (withMultiplePages) {
        beforePdfExport();
      }

      savePDFWithOptions(elementForPdfExportRef.current, {
        fileName: formattedFilename,
      });

      // Restore sizes after the export
      if (withMultiplePages) {
        afterPdfExport();
      }

      ai.appInsights.trackEvent({
        name: AnalyticsEvent.PDFDownloaded,
        properties: {
          app: Application.Freezers,
          type: PDFDownloadType.FreezerDetail,
          id: freezerId,
          name: getFreezerDetailsApi.data?.freezerName,
        },
      });
    }
  };

  const createPDFWithMultiplePages = () => {
    createPDF({ withMultiplePages: true });
  };

  return (
    <Wrapper>
      {/* CSV Link for chart data export */}
      <CSVLink
        // @ts-ignore
        ref={csvLinkRef}
        data={csvProperties?.data || []}
        filename={csvProperties?.filename}
        style={{ display: 'none' }}
      />

      <div
        ref={elementForPdfExportRef}
        // For some reason KendoReact PDF will export with a white margins on
        // the left and right edges. To remove it, we expand this div to take
        // up as much space as the
        // margins.
        style={{
          marginLeft: -32,
          paddingLeft: 32,
          marginRight: -32,
          paddingRight: 32,
        }}
      >
        <PageIntroWrapper sticky className="non-sticky">
          <PageIntro
            headerNavButton={<BackIconButton />}
            freezerName={freezerDetails?.freezerName}
            startDate={startDate}
            endDate={endDate}
            isFetching={getFreezerDetailsApi.isFetching}
            onDateRangeSubmit={updateStartAndEndDates}
            exportPDF={createPDFWithMultiplePages}
          />
        </PageIntroWrapper>
        <TransitionLoadingSpinner in={getFreezerDetailsApi.isFetching} />
        <TransitionErrorMessage
          in={!getFreezerDetailsApi.isFetching && getFreezerDetailsApi.isError}
        />

        <DefaultTransition
          in={
            !getFreezerDetailsApi.isFetching && getFreezerDetailsApi.isSuccess
          }
          unmountOnExit
        >
          <div>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FreezerEventsBox freezerDetails={freezerDetails} />
              </Grid>
              <Grid item xs={12}>
                <FreezerDetailsBox freezerDetails={freezerDetails} />
              </Grid>

              <Grid item xs={12}>
                <AllFreezerCharts
                  canCreateChart={canCreateChart}
                  routeState={routeState}
                  getChartsByAssetIdApi={getChartsByAssetIdApi}
                  deletedChartIdMapping={deletedChartIdMapping}
                  tagNameToTimeSeriesDataMapping={
                    tagNameToTimeSeriesDataMapping
                  }
                  historicalReadingsMapping={historicalReadingsMapping}
                  isHistoricalReadingsApiFetching={
                    isHistoricalReadingsApiFetching
                  }
                  isDownloadingReadings={isDownloadingReadings}
                  deleteChartApiIsLoading={deleteChartApi.isLoading}
                  canDeleteChart={canDeleteChart}
                  freezerId={freezerId}
                  startDate={startDate}
                  endDate={endDate}
                  dataChannelIdToColorMapping={dataChannelIdToColorMapping}
                  editEllipsisAnchorEl={editEllipsisAnchorEl}
                  getBulkTankTagsBySiteIdApi={getBulkTankTagsBySiteIdApi}
                  bulkTankTagIdMapping={bulkTankTagIdMapping}
                  chartIdToBulkTankDataChannelMapping={
                    chartIdToBulkTankDataChannelMapping
                  }
                  selectedCustomChartId={selectedCustomChartId}
                  setSelectedCustomChartId={setSelectedCustomChartId}
                  handleBulkTankTagChange={handleBulkTankTagChange}
                  setEditEllipsisAnchorEl={setEditEllipsisAnchorEl}
                  setCsvProperties={setCsvProperties}
                  setSelectedChartForDataDownload={
                    setSelectedChartForDataDownload
                  }
                  setActiveChartForPopover={setActiveChartForPopover}
                  handleEditChart={handleEditChart}
                  handleDeleteChart={handleDeleteChart}
                />
              </Grid>
            </Grid>
          </div>
        </DefaultTransition>
      </div>
    </Wrapper>
  );
};

export default FreezerDetail;
