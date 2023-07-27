import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { EventRuleType, EventStatusType } from 'api/admin/api';
import Button from 'components/Button';
import FilterBox from 'components/FilterBox';
import FieldLabel from 'components/forms/labels/FieldLabel';
import MultiSelect from 'components/forms/styled-fields/MultiSelect';
import StyledKeyboardDatePickerLegacy from 'components/forms/styled-fields/StyledKeyboardDatePickerLegacy';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { buildEventRuleTypeTextMapping } from 'utils/i18n/enum-to-text';

interface Props {
  handleEventTypeSelectedChange: (eventTypes: EventRuleType[]) => void;
  selectedEventTypes: any;
  handleEventStatusSelectedChange: (
    event: React.ChangeEvent<{
      value: unknown;
    }>
  ) => void;
  selectedEventStatus: EventStatusType;
  startDate: moment.Moment | null;
  endDate: moment.Moment | null;
  isFetching: boolean;
  handleChangeStartDate: (newDate: moment.Moment | null) => void;
  handleChangeEndDate: (newDate: moment.Moment | null) => void;
}

const TableOptions = ({
  selectedEventTypes,
  handleEventTypeSelectedChange,
  handleEventStatusSelectedChange,
  selectedEventStatus,
  startDate,
  endDate,
  isFetching,
  handleChangeStartDate,
  handleChangeEndDate,
}: Props) => {
  const { t } = useTranslation();
  const [eventTypesInput, setEventTypesInput] = useState<EventRuleType[]>(
    selectedEventTypes
  );

  const [localStartDate, setLocalStartDate] = useState<moment.Moment | null>(
    startDate
  );
  const [localEndDate, setLocalEndDate] = useState<moment.Moment | null>(
    endDate
  );

  const [isLocalStartDateValid, setIsLocalStartDateValid] = useState(
    moment(localStartDate).isValid()
  );
  const [isLocalEndDateValid, setIsLocalEndDateValid] = useState(
    moment(localEndDate).isValid()
  );

  const handleStartAndEndDateChange = () => {
    handleChangeStartDate(localStartDate);
    handleChangeEndDate(localEndDate);
  };

  const eventRuleTextMapping = buildEventRuleTypeTextMapping(t);
  const eventTypeOptions = [
    EventRuleType.Level,
    EventRuleType.MissingData,
    EventRuleType.ScheduledDeliveryTooEarly,
    EventRuleType.ScheduledDeliveryTooLate,
    EventRuleType.ScheduledDeliveryMissed,
    EventRuleType.RTUChannelEvent,
    EventRuleType.UsageRate,
    EventRuleType.GeoFencing,
  ];

  return (
    <FilterBox>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
        spacing={2}
      >
        <Grid item>
          <FieldLabel>{t('ui.common.view', 'View')}</FieldLabel>
        </Grid>
        <Grid item>
          <StyledTextField
            id="view-input"
            select
            onChange={handleEventStatusSelectedChange}
            value={selectedEventStatus}
            style={{ minWidth: 200 }}
            InputProps={{
              style: { height: 40, overflow: 'hidden' },
            }}
            disabled={isFetching}
          >
            {[
              {
                label: t('enum.eventrulestatetype.active"', 'Active'),
                value: EventStatusType.Active,
              },
              {
                label: t('enum.eventrulestatetype.inactive', 'Inactive'),
                value: EventStatusType.Inactive,
              },
            ].map((option) => (
              <MenuItem key={option.label} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </StyledTextField>
        </Grid>
        <Grid item>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <FieldLabel>
                {t('ui.eventsummary.eventTypes', 'Event Types')}
              </FieldLabel>{' '}
            </Grid>

            <Grid item>
              <MultiSelect<EventRuleType>
                id="eventTypes-input"
                options={eventTypeOptions}
                value={eventTypesInput}
                setValue={setEventTypesInput}
                label=""
                renderValue={(option) => {
                  return eventRuleTextMapping[option];
                }}
                onClose={(selectedOptions) =>
                  handleEventTypeSelectedChange(selectedOptions)
                }
                style={{ width: 265 }}
                InputProps={{
                  style: { height: 40, overflow: 'hidden' },
                }}
                disabled={isFetching}
              />
            </Grid>
          </Grid>
        </Grid>
        {selectedEventStatus === EventStatusType.Inactive && (
          <Grid item>
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <FieldLabel>
                  {t('ui.common.daterange', 'Date Range')}
                </FieldLabel>
              </Grid>
              <Grid item>
                <StyledKeyboardDatePickerLegacy
                  id="startDate-input"
                  KeyboardButtonProps={{
                    'aria-label': 'change start date',
                  }}
                  PopoverProps={{ id: 'start date popover' }}
                  value={localStartDate}
                  onChange={setLocalStartDate}
                  disabled={isFetching}
                  onError={(error) => {
                    setIsLocalStartDateValid(!error);
                  }}
                  disableFuture
                  maxDate={localEndDate}
                />
              </Grid>
              <Grid item>
                <FieldLabel>{t('ui.common.to', 'To')}</FieldLabel>
              </Grid>
              <Grid item>
                <StyledKeyboardDatePickerLegacy
                  id="endDate-input"
                  KeyboardButtonProps={{ 'aria-label': 'change end date' }}
                  PopoverProps={{ id: 'end date popover' }}
                  value={localEndDate}
                  onChange={setLocalEndDate}
                  disabled={isFetching}
                  onError={(error) => {
                    setIsLocalEndDateValid(!error);
                  }}
                  disableFuture
                  minDate={localStartDate}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  disabled={
                    isFetching || !isLocalStartDateValid || !isLocalEndDateValid
                  }
                  onClick={handleStartAndEndDateChange}
                >
                  {t('ui.common.apply', 'Apply')}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </FilterBox>
  );
};

export default TableOptions;
