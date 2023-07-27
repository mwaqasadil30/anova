/* eslint-disable indent */
import Popover from '@material-ui/core/Popover';
import Tab from 'components/Tab';
import Tabs from 'components/Tabs';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { OptionsTimeValue } from '../../types';

const StyledTabs = styled(Tabs)`
  min-height: 28px;

  & .MuiTabs-indicator {
    display: flex;
    justify-content: center;
    background-color: transparent;
    & > span {
      min-width: 30px;
      width: calc(100% - 24px);
      background-color: ${(props) =>
        props.theme.palette.type === 'dark'
          ? props.theme.custom.domainColor
          : props.theme.custom.domainSecondaryColor};
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
  onSubmit: (startDatetime: moment.Moment, endDatetime: moment.Moment) => void;
  customRangeComponent: React.ReactNode;
}

const DateRangePickerWithOptions = ({
  isFetching,
  startDate,
  endDate,
  onSubmit,
  customRangeComponent,
}: Props) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(OptionsTimeValue.Custom);

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

  const options = [
    {
      label: t('ui.common.now', 'Now'),
      value: OptionsTimeValue.Now,
    },
    {
      label: t('ui.assetdetail.chartOptions.oneHour', '1H'),
      value: OptionsTimeValue.OneHour,
    },
    {
      label: t('ui.assetdetail.chartOptions.twoHours', '2H'),
      value: OptionsTimeValue.TwoHours,
    },
    {
      label: t('ui.assetdetail.chartOptions.oneDay', '1D'),
      value: OptionsTimeValue.OneDay,
    },
    {
      label: t('ui.assetdetail.chartOptions.oneWeek', '1W'),
      value: OptionsTimeValue.OneWeek,
    },
    {
      label: t('ui.assetdetail.chartOptions.custom', 'Custom'),
      value: OptionsTimeValue.Custom,
      onClick: handleClick,
    },
  ];

  const handleTabChange = (
    event: React.ChangeEvent<{}>,
    newValue: OptionsTimeValue
  ) => {
    if (newValue !== OptionsTimeValue.Custom) {
      setActiveTab(newValue as number);

      const newStartDate = moment().subtract(newValue, 'hours');
      const newEndDate = moment();
      onSubmit(newStartDate, newEndDate);
    }
  };

  // Sync the current date range (start + end date) to one of the common ranges
  useEffect(() => {
    const durationInHours = moment.duration(endDate.diff(startDate)).asHours();

    // if less then an hour, return 0.5
    const roundedDuration =
      durationInHours < 1 ? 0.5 : Math.round(durationInHours);

    const closestOptionBasedOnRange = options.find(
      (option) => option.value === roundedDuration
    );

    // If the current date range is one of the available options within 59
    // seconds (since the user can only input values to the minute), then
    // change the active tab
    const now = moment();
    if (closestOptionBasedOnRange && endDate.diff(now, 'seconds') < 59) {
      setActiveTab(closestOptionBasedOnRange.value);
    } else {
      setActiveTab(OptionsTimeValue.Custom);
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
        {options.map((option, index) => (
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
