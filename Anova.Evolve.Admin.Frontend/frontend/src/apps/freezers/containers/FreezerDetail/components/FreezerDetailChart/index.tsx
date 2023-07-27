/* eslint-disable indent, react/jsx-indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { AvailableTagBase, DefaultChartDto, UserChartDto } from 'api/admin/api';
import FreezerChart from 'apps/freezers/components/FreezerChart';
import {
  DataChannelIdToColorMapping,
  TagIdToHistoricalReadingsApiMapping,
  TagNameToTimeSeriesDataMapping,
} from 'apps/freezers/types';
import { ReactComponent as CaretIcon } from 'assets/icons/caret.svg';
import Accordion from 'components/Accordion';
import AccordionDetails from 'components/AccordionDetails';
import AccordionSummary from 'components/AccordionSummary';
import DownloadButton from 'components/DownloadButton';
import MultiSelect from 'components/forms/styled-fields/MultiSelect';
import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UseQueryResult } from 'react-query';
import styled from 'styled-components';
import { getDataChannelsOrTagsForChart } from '../../helpers';
import { CSVProperties, FreezerChartType } from '../../types';

const StyledAccordionSummary = styled(AccordionSummary)`
  && {
    height: initial;
    min-height: 58px;
  }

  .MuiAccordionSummary-content {
    margin: 8px 0;
  }
`;

const StyledAccordion = styled(Accordion)`
  .MuiAccordionSummary-root:hover {
    cursor: default;
  }
`;
const ChartDownloadButton = styled(DownloadButton)`
  /*
    Prevent the accordion behind the button from collapsing when clicking on
    the disabled button (sort of like performing event.stopPropagation()).
  */
  ${(props) =>
    props.disabled &&
    `
    && {
      pointer-events: auto;
    }

    & .MuiButton-label{
      pointer-events: none;
    }
  `}
  padding: 2px 10px;

  & .MuiButton-startIcon > svg {
    width: 21px;
    height: 16px;
  }
`;

interface Props {
  chart?: UserChartDto | DefaultChartDto;
  chartType?: FreezerChartType;
  tagNameToTimeSeriesDataMapping: TagNameToTimeSeriesDataMapping;
  chartIdToBulkTankDataChannelMapping: Record<string, string[] | undefined>;
  historicalReadingsMapping: TagIdToHistoricalReadingsApiMapping;
  getBulkTankTagsBySiteIdApi: UseQueryResult<
    AvailableTagBase[] | null,
    unknown
  >;
  bulkTankTagIdMapping: Record<string, AvailableTagBase> | undefined;
  editEllipsisAnchorEl: HTMLElement | null;
  dataChannelIdToColorMapping: DataChannelIdToColorMapping;

  // booleans
  isDownloadingReadings: boolean;
  deleteChartApiIsLoading: boolean;
  canDeleteChart?: boolean;
  isHistoricalReadingsApiFetching: boolean;

  // Freezer-related
  freezerId: string;
  startDate: moment.Moment;
  endDate: moment.Moment;

  // Functions
  handleBulkTankTagChange: (
    chartId: number | undefined,
    selectedOptions: string[]
  ) => void;
  setCsvProperties: React.Dispatch<
    React.SetStateAction<CSVProperties | undefined>
  >;
  // NOTE: DefaultChartDto and UserChartDto have different but similar properties that
  // are required for the function below (see: ChartBaseDTO), but we use the
  // getDataChannelsOrTagsForChart helper to access the correct property based
  // on the type
  setSelectedChartForDataDownload: React.Dispatch<
    React.SetStateAction<DefaultChartDto | undefined>
  >;
  setActiveChartForPopover: React.Dispatch<
    React.SetStateAction<DefaultChartDto | null>
  >;
  setEditEllipsisAnchorEl: React.Dispatch<
    React.SetStateAction<HTMLElement | null>
  >;
  handleEditChart: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  handleDeleteChart: (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => void;
}

const FreezerDetailChart = ({
  chart,
  chartType,
  tagNameToTimeSeriesDataMapping,
  chartIdToBulkTankDataChannelMapping,
  historicalReadingsMapping,
  getBulkTankTagsBySiteIdApi,
  bulkTankTagIdMapping,
  editEllipsisAnchorEl,
  dataChannelIdToColorMapping,

  // booleans
  isDownloadingReadings,
  deleteChartApiIsLoading,
  canDeleteChart,
  isHistoricalReadingsApiFetching,

  // Freezer-specific
  freezerId,
  startDate,
  endDate,

  // Functions
  handleBulkTankTagChange,
  setCsvProperties,
  setSelectedChartForDataDownload,
  setActiveChartForPopover,
  setEditEllipsisAnchorEl,
  handleEditChart,
  handleDeleteChart,
}: Props) => {
  const { t } = useTranslation();

  const [accordionExpandedMapping, setAccordionExpandedMapping] = useState<
    Record<number, boolean>
  >({});

  const dataChannelsOrTags = getDataChannelsOrTagsForChart(chart);

  const hasReadings = dataChannelsOrTags?.find((channel) => {
    const readings = tagNameToTimeSeriesDataMapping?.[channel.description!];
    return readings?.data?.length;
  });

  const isChartAccordionExpanded = accordionExpandedMapping[chart?.chartId!];

  const selectedDataChannels =
    chartIdToBulkTankDataChannelMapping[chart?.chartId!] || [];

  const hasBulkTankReadings = selectedDataChannels?.map((dataChannelId) => {
    const timeSeriesInfo = historicalReadingsMapping?.[dataChannelId!];
    const readings = timeSeriesInfo?.api.data.readings;
    if (readings) {
      return true;
    }
    return false;
  });

  const canDownload =
    hasReadings || (selectedDataChannels.length > 0 && hasBulkTankReadings);

  const bulkTankTagOptions =
    getBulkTankTagsBySiteIdApi.data?.map((tag) => {
      return tag.tagId!;
    }) || [];

  const toggleAccordionExpansion = (chartId: number) => {
    setAccordionExpandedMapping((prevState) => ({
      ...prevState,
      [chartId]: !prevState[chartId],
    }));
  };

  const handleChartDownloadButtonClick = (
    selectedChart: UserChartDto | DefaultChartDto
  ) => (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    setCsvProperties(undefined);
    setSelectedChartForDataDownload(selectedChart);
  };

  const handleChartEllipsisClick = (selectedChart: UserChartDto) => (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    setActiveChartForPopover(selectedChart);
    setEditEllipsisAnchorEl(event.currentTarget);
  };

  const handleClose = (event?: any) => {
    event?.stopPropagation?.();
    setEditEllipsisAnchorEl(null);
  };

  return (
    <StyledAccordion
      expanded={accordionExpandedMapping[chart?.chartId!]}
      defaultExpanded
      className="prevent-split"
    >
      <StyledAccordionSummary>
        <Grid container alignItems="center" spacing={2} justify="space-between">
          <Grid item>
            <Grid
              container
              alignItems="center"
              spacing={1}
              justify="space-between"
            >
              <Grid item className="no-print">
                <IconButton
                  onClick={() => {
                    toggleAccordionExpansion(chart?.chartId!);
                  }}
                >
                  <CaretIcon
                    style={{
                      transform: isChartAccordionExpanded
                        ? 'rotate(0deg)'
                        : 'rotate(-180deg)',
                    }}
                  />
                </IconButton>
              </Grid>
              <Grid item>
                <Typography>{chart?.name}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item className="no-print">
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Typography>
                      {t(
                        'ui.freezer.freezerDetails.nitrogenBulkTank',
                        'Nitrogen Bulk Tank'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <MultiSelect<string>
                      id="nitrogenBulkTank-input"
                      options={bulkTankTagOptions}
                      value={selectedDataChannels}
                      setValue={(newValue) => {
                        handleBulkTankTagChange(chart?.chartId, newValue);
                      }}
                      label=""
                      onClick={(event) => event.stopPropagation()}
                      renderValue={(option) => {
                        return bulkTankTagIdMapping?.[option]?.tagName || '';
                      }}
                      style={{ width: 300 }}
                      InputProps={{
                        style: {
                          height: 38,
                          overflow: 'hidden',
                        },
                      }}
                      disabled={false}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <ChartDownloadButton
                  disabled={
                    !canDownload ||
                    isDownloadingReadings ||
                    isHistoricalReadingsApiFetching
                  }
                  onClick={handleChartDownloadButtonClick(chart!)}
                >
                  {t('ui.common.download', 'Download')}
                </ChartDownloadButton>
              </Grid>
              {chartType === FreezerChartType.User && (
                <Grid item>
                  <IconButton
                    aria-label="Chart options"
                    size="small"
                    onClick={handleChartEllipsisClick(chart!)}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                  <Menu
                    getContentAnchorEl={null}
                    anchorEl={editEllipsisAnchorEl}
                    keepMounted
                    open={Boolean(editEllipsisAnchorEl)}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'center',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <MenuItem
                      onClick={handleEditChart}
                      disabled={deleteChartApiIsLoading}
                    >
                      {t('ui.common.edit', 'Edit')}
                    </MenuItem>
                    {canDeleteChart && (
                      <MenuItem
                        onClick={handleDeleteChart}
                        disabled={deleteChartApiIsLoading}
                      >
                        {t('ui.common.delete', 'Delete')}
                      </MenuItem>
                    )}
                  </Menu>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </StyledAccordionSummary>
      <AccordionDetails>
        <Box width="100%">
          <FreezerChart
            selectedBulkTankDataChannelIds={selectedDataChannels}
            historicalReadingsMapping={historicalReadingsMapping}
            freezerId={freezerId}
            startDate={startDate}
            endDate={endDate}
            tagNameToTimeSeriesDataMapping={tagNameToTimeSeriesDataMapping}
            dataChannelIdToColorMapping={dataChannelIdToColorMapping}
            chartDataChannels={dataChannelsOrTags}
            height={350}
          />
        </Box>
      </AccordionDetails>
    </StyledAccordion>
  );
};

export default FreezerDetailChart;
