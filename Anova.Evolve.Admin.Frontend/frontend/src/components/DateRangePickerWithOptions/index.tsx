/* eslint-disable indent */
import Popover from '@material-ui/core/Popover';
import { ChartZoomLevelButtonOption } from 'apps/ops/types';
import Tab from 'components/Tab';
import Tabs from 'components/Tabs';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const StyledTabs = styled(Tabs)`
  min-height: 28px;

  & .MuiTabs-indicator {
    display: flex;
    justify-content: center;
    background-color: transparent;
    & > span {
      min-width: 30px;
      width: calc(100% - 24px);
      background-color: ${(props) => props.theme.custom.domainColor};
    }
  }

  & .MuiTab-root {
    min-height: 28px;
    min-width: 30px;
    line-height: initial;
    font-size: 14px;
  }
`;

interface Props {
  isFetching?: boolean;
  startDate: moment.Moment;
  endDate: moment.Moment;
  customRangeComponent: React.ReactNode;
  isAssetDetailGraph?: boolean;
  onSubmit: (startDatetime: moment.Moment, endDatetime: moment.Moment) => void;
}

const DateRangePickerWithOptions = ({
  isFetching,
  startDate,
  endDate,
  customRangeComponent,
  isAssetDetailGraph,
  onSubmit,
}: Props) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(ChartZoomLevelButtonOption.Custom);

  // #region Custom date popover
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // @ts-ignore
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const defaultOptions = [
    // NOTE: Current places where this dateRangePIcker is used does not require now.
    // We could concatenate the "Now" Option based on ternary logic if other
    // pages require a "Now" Option.
    // {
    //   label: t('ui.common.now', 'Now'),
    //   value: ChartZoomLevelButtonOption.Now,
    // },
    {
      label: t('ui.assetdetail.chartOptions.oneDay', '1D'),
      value: ChartZoomLevelButtonOption.OneDay,
    },
    {
      label: t('ui.assetdetail.chartOptions.twoDay', '2D'),
      value: ChartZoomLevelButtonOption.TwoDay,
    },
    {
      label: t('ui.assetdetail.chartOptions.oneWeek', '1W'),
      value: ChartZoomLevelButtonOption.OneWeek,
    },
    {
      label: t('ui.assetdetail.chartOptions.fourWeeks', '4W'),
      value: ChartZoomLevelButtonOption.OneMonth,
    },
    {
      label: t('ui.assetdetail.chartOptions.twelveWeeks', '12W'),
      value: ChartZoomLevelButtonOption.ThreeMonths,
    },
    {
      label: t('ui.assetdetail.chartOptions.oneYear', '1Y'),
      value: ChartZoomLevelButtonOption.OneYear,
    },
    {
      label: t('ui.assetdetail.chartOptions.custom', 'Custom'),
      value: ChartZoomLevelButtonOption.Custom,
      onClick: handleClick,
    },
  ];

  const optionsForAssetDetailGraph = [
    {
      label: t('ui.assetdetail.chartOptions.oneDay', '1D'),
      value: ChartZoomLevelButtonOption.OneDay,
    },
    {
      label: t('ui.assetdetail.chartOptions.twoDay', '2D'),
      value: ChartZoomLevelButtonOption.TwoDay,
    },
    {
      label: t('ui.assetdetail.chartOptions.fourDay', '4D'),
      value: ChartZoomLevelButtonOption.FourDay,
    },
    {
      label: t('ui.assetdetail.chartOptions.oneWeek', '1W'),
      value: ChartZoomLevelButtonOption.OneWeek,
    },
    {
      label: t('ui.assetdetail.chartOptions.twoWeek', '2W'),
      value: ChartZoomLevelButtonOption.TwoWeeks,
    },
    {
      label: t('ui.assetdetail.chartOptions.fourWeek', '4W'),
      value: ChartZoomLevelButtonOption.FourWeeks,
    },
    {
      label: t('ui.assetdetail.chartOptions.twelveWeek', '12W'),
      value: ChartZoomLevelButtonOption.TwelveWeeks,
    },
    {
      label: t('ui.assetdetail.chartOptions.oneYear', '1Y'),
      value: ChartZoomLevelButtonOption.OneYear,
    },
    {
      label: t('ui.assetdetail.chartOptions.custom', 'Custom'),
      value: ChartZoomLevelButtonOption.Custom,
      onClick: handleClick,
    },
  ];

  const optionsToRender = isAssetDetailGraph
    ? optionsForAssetDetailGraph
    : defaultOptions;

  const handleTabChange = (
    event: React.ChangeEvent<{}>,
    newValue: ChartZoomLevelButtonOption
  ) => {
    if (newValue !== ChartZoomLevelButtonOption.Custom) {
      setActiveTab(newValue as number);

      const newStartDate = moment().subtract(newValue, 'hours');
      const newEndDate = moment();
      onSubmit(newStartDate, newEndDate);
    }
  };

  // Sync the current date range (start + end date) to one of the common ranges
  useEffect(() => {
    const durationInHours = Math.round(
      moment.duration(endDate?.diff(startDate)).asHours()
    );

    const formattedDurationInHoursForAssetDetailGraph = Math.round(
      // If the user selects "1Y" (One year) option (which = 10968 hours),
      // we need to re-calculate the durationInHours because we limit the forecast
      // to 90 days, so we need to subtract the 90 days that we added initially
      // to make sure the activeTab properly selects the "1Y" Option.
      // See: `addHoursOrEndDateForForecast` in `updateStartAndEndDates` located
      // in the AssetGraph file.
      moment.duration(endDate?.diff(startDate)).asHours() > 10000
        ? durationInHours - 2184
        : // We Divide by 2 because we double the date range because of the days
          // we need to add to the forecast (right side) part of the graph.
          // Example: 2 days (48 hours) is 96 hours before we divide by 2.
          durationInHours / 2
    );

    const closestOptionBasedOnRange = optionsToRender.find((option) => {
      // Check if the option.value is within the given range (+/- 23 hours).
      const matchOptionWithAssetDetailGraphDuration =
        option.value <= formattedDurationInHoursForAssetDetailGraph + 23 &&
        option.value >= formattedDurationInHoursForAssetDetailGraph - 23 &&
        formattedDurationInHoursForAssetDetailGraph >= 23;
      // Default check for non-asset detail graph pages. Takes into account
      // almost one whole day since the passed in fromDate might be formatted
      // to be the startOf('day'), which pushes up the hour difference by a few
      // hours.
      // See: fromDate.startOf('day') in useProblemReportsListDetails.
      const defaultMatchOptionWithSelectedDuration =
        option.value <= durationInHours + 23 &&
        option.value >= durationInHours - 23;

      return isAssetDetailGraph
        ? matchOptionWithAssetDetailGraphDuration
        : defaultMatchOptionWithSelectedDuration;
    });

    // NOTE: Check below should be used if there is a "Now" Option that relies
    // on the user's current time.
    // If the current date range is one of the available options within 59
    // seconds (since the user can only input values to the minute), then
    // change the active tab
    // const now = moment();
    if (
      closestOptionBasedOnRange &&
      endDate
      // NOTE: Check below should be used if there is a "Now" Option that relies
      // on the user's current time.
      // endDate.diff(moment(now), 'seconds') < 59
    ) {
      setActiveTab(closestOptionBasedOnRange.value);
    } else {
      setActiveTab(ChartZoomLevelButtonOption.Custom);
    }
  }, [startDate, endDate]);

  const open = Boolean(anchorEl);
  const id = open ? 'date-range-picker-with-options' : undefined;
  // #endregion Custom date popover

  return (
    <>
      <StyledTabs
        value={activeTab}
        // @ts-ignore
        onChange={handleTabChange}
        aria-label="date range picker with options"
        borderWidth={0}
        TabIndicatorProps={{
          children: <span />,
        }}
      >
        {optionsToRender.map((option, index) => (
          <Tab
            key={index}
            label={option.label}
            value={option.value}
            onClick={option.onClick}
            disabled={isFetching}
          />
        ))}
      </StyledTabs>
      {customRangeComponent && (
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          PaperProps={{
            style: {
              // TODO: Adjust this to support light theme
              backgroundColor: '#474747',
            },
          }}
        >
          {customRangeComponent}
        </Popover>
      )}
    </>
  );
};

export default DateRangePickerWithOptions;
