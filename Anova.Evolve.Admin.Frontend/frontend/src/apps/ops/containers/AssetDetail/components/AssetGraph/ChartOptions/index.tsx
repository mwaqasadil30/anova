/* eslint-disable indent */
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ReactComponent as DownloadIcon } from 'assets/icons/download.svg';
import { ReactComponent as ExpandIcon } from 'assets/icons/expand-view.svg';
import { ReactComponent as MinimizeIcon } from 'assets/icons/minimize-view.svg';
import CustomTooltip from 'components/CustomTooltip';
import DateRangeForm from 'components/DateRangeForm';
import DateRangePickerWithOptions from 'components/DateRangePickerWithOptions';
import FilterBox from 'components/FilterBox';
import Checkbox from 'components/forms/styled-fields/Checkbox';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectIsActiveDomainApciEnabled } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import { ReadingsChartZoomLevel } from 'types';

const StyledFilterBox = styled(FilterBox)`
  background-color: ${(props) =>
    props.theme.palette.type === 'light' ? '#FFFFFF' : '#515151'};
`;

const GridWrapper = styled(Grid)`
  /*
    Keep a consistent height whether the "Show Forecast" checkbox is shown or
    not
  */
  min-height: 50px;
`;

const StyledDownloadIcon = styled(DownloadIcon)`
  color: ${(props) =>
    props.theme.palette.type === 'light'
      ? props.theme.custom.domainSecondaryColor
      : props.theme.custom.domainColor};
`;

const StyledExpandIcon = styled(ExpandIcon)`
  color: ${(props) =>
    props.theme.palette.type === 'light'
      ? props.theme.custom.domainSecondaryColor
      : props.theme.custom.domainColor};
`;

const StyledCollapseIcon = styled(MinimizeIcon)`
  color: ${(props) =>
    props.theme.palette.type === 'light'
      ? props.theme.custom.domainSecondaryColor
      : props.theme.custom.domainColor};
`;

const ChartCheckbox = styled(Checkbox)``;

const ChartText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

const SpacedGroup = styled.div`
  > :not(:last-child) {
    margin-right: 2px;
  }
  > :not(:first-child) {
    margin-left: 2px;
  }
`;

interface Props {
  fromDate: Date;
  toDate: Date;
  zoomLevel: ReadingsChartZoomLevel;
  showForecast: boolean;
  shouldShowForecastCheckbox?: boolean;
  isFetching?: boolean;
  showAllGpsReadings: boolean; // Mobile Asset Map
  showAllGpsCheckbox?: boolean;
  setShowAllGpsReadings: (showAllGpsReadings: boolean) => void; // Mobile Asset Map
  setShowForecast: (shouldShowForecast: boolean) => void;
  // NOTE/TODO: Remove all zoom-related functions for graph once we get the
  // confirmation to not re-add the zoom buttons re: what customers want.
  // Includes the "goTo" functions.
  zoomIn: () => void;
  zoomOut: () => void;
  goToBeginning: () => void;
  goBackwards: () => void;
  goToNow: () => void;
  goForwards: () => void;
  goToEnd: () => void;
  exportGraphPDF: () => void;
  toggleIsGraphExpanded: () => void;
  isTableOrGraphExpanded: boolean;
  updateStartAndEndDates: (
    startDatetime: moment.Moment,
    endDatetime: moment.Moment
  ) => void;
}

const ChartOptions = ({
  fromDate,
  toDate,
  showForecast,
  shouldShowForecastCheckbox,
  isFetching,
  showAllGpsReadings,
  showAllGpsCheckbox,
  setShowAllGpsReadings,
  setShowForecast,
  exportGraphPDF,
  toggleIsGraphExpanded,
  isTableOrGraphExpanded,
  updateStartAndEndDates,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isBelowMdBreakpoint = useMediaQuery(theme.breakpoints.down('md'));

  const isAirProductsEnabledDomain = useSelector(
    selectIsActiveDomainApciEnabled
  );

  const momentFromDate = moment(fromDate);
  const momentToDate = moment(toDate);

  const handleShowForecast = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setShowForecast(checked);
  };

  const handleShowAllGpsReadings = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setShowAllGpsReadings(checked);
  };

  const downloadPdfAndGraphExpandButtons = (
    <Grid item>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <CustomTooltip title={t('ui.common.downloadGraph', 'Download Graph')}>
            <IconButton
              onClick={exportGraphPDF}
              disabled={isFetching}
              aria-label="Download graph"
            >
              <StyledDownloadIcon />
            </IconButton>
          </CustomTooltip>
        </Grid>
        <Grid item>
          <IconButton onClick={toggleIsGraphExpanded} disabled={isFetching}>
            {isTableOrGraphExpanded ? (
              <StyledCollapseIcon
                title="Minimize Graph"
                aria-label="minimize graph icon"
              />
            ) : (
              <StyledExpandIcon
                title="Expand Graph"
                aria-label="expand graph icon"
              />
            )}
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );

  return (
    <GridWrapper
      container
      spacing={1}
      alignItems="center"
      justify="space-between"
    >
      <Grid item>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <SpacedGroup>
              <DateRangePickerWithOptions
                isAssetDetailGraph
                isFetching={isFetching}
                startDate={momentFromDate}
                endDate={momentToDate}
                onSubmit={updateStartAndEndDates}
                customRangeComponent={
                  <StyledFilterBox p={4}>
                    <DateRangeForm
                      isAssetDetailGraph
                      isFetching={isFetching}
                      initialStartDate={momentFromDate}
                      initialEndDate={momentToDate}
                      onSubmit={updateStartAndEndDates}
                    />
                  </StyledFilterBox>
                }
              />
            </SpacedGroup>
          </Grid>
          {shouldShowForecastCheckbox && (
            <Grid item>
              <FormControlLabel
                value="start"
                control={
                  <ChartCheckbox
                    size="small"
                    checked={showForecast}
                    onChange={handleShowForecast}
                    disabled={isFetching}
                  />
                }
                label={
                  <ChartText>
                    {t('ui.assetdetail.forecast', 'Forecast')}
                  </ChartText>
                }
                labelPlacement="end"
              />
            </Grid>
          )}
          {showAllGpsCheckbox && (
            <CustomTooltip
              title={t(
                'ui.assetDetail.showAllGpsCheckboxDetails',
                'Check to show all GPS coordinates.  When not selected, any GPS coordinates within 1 km are shown as a single location.'
              )}
            >
              <Grid item>
                <FormControlLabel
                  value="start"
                  control={
                    <ChartCheckbox
                      size="small"
                      checked={showAllGpsReadings}
                      onChange={handleShowAllGpsReadings}
                      // Do not allow user to toggle from True to False.
                      disabled={isFetching || showAllGpsReadings}
                    />
                  }
                  label={
                    <ChartText>
                      {t('ui.assetdetail.allGps', 'All GPS')}
                    </ChartText>
                  }
                  labelPlacement="end"
                />
              </Grid>
            </CustomTooltip>
          )}
          {isBelowMdBreakpoint &&
            // We only show the downloadPdf and Graph expand buttons inside the
            // graph when the user is NOT on an airproducts domain. This is because
            // we move these two buttons outside of the graph for airproducts domains.
            !isAirProductsEnabledDomain &&
            downloadPdfAndGraphExpandButtons}
        </Grid>
      </Grid>
      {!isBelowMdBreakpoint &&
        // We only show the downloadPdf and Graph expand buttons inside the
        // graph when the user is NOT on an airproducts domain. This is because
        // we move these two buttons outside of the graph for airproducts domains.
        !isAirProductsEnabledDomain &&
        downloadPdfAndGraphExpandButtons}
    </GridWrapper>
  );
};

export default ChartOptions;
