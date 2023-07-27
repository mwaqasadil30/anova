import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { EventRuleType, EventRecordStatus, TagDto } from 'api/admin/api';
import { useGetDomainTags } from 'apps/ops/hooks/useGetDomainTags';
import Button from 'components/Button';
import Chip from 'components/Chip';
import FilterBox from 'components/FilterBox';
import FieldLabel from 'components/forms/labels/FieldLabel';
import EmptyDropdownAutocomplete, {
  Props as EmptyDropdownAutocompleteProps,
} from 'components/forms/styled-fields/EmptyDropdownAutocomplete';
import MultiSelect from 'components/forms/styled-fields/MultiSelect';
import StyledKeyboardDatePickerLegacy from 'components/forms/styled-fields/StyledKeyboardDatePickerLegacy';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  selectActiveDomainId,
  selectIsActiveDomainApciEnabled,
} from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import { buildEventRuleTypeTextMapping } from 'utils/i18n/enum-to-text';

const StyledDropdownAutocomplete = styled(EmptyDropdownAutocomplete)`
  & .MuiInput-root {
    height: 40px;
    padding: 4px 16px;
  }
  & [class*='MuiInput-root']:hover {
    /* Removing hover state since the designs dont include one */
    padding: 4px 16px;
  }
  & [class*='MuiInput-root'][class*='Mui-focused'] {
    /* Once hovering while focused on the dropdown, remove the 1px text shake */
    padding: 3px 15px;
  }
`;

interface Props {
  handleEventTypeSelectedChange: (eventTypes: EventRuleType[]) => void;
  selectedEventTypes: any;
  handleEventStatusSelectedChange: (
    event: React.ChangeEvent<{
      value: unknown;
    }>
  ) => void;
  selectedEventStatus: EventRecordStatus;
  startDate: moment.Moment | null;
  endDate: moment.Moment | null;
  disableFilterOptions: boolean;
  handleChangeStartDate: (newDate: moment.Moment | null) => void;
  handleChangeEndDate: (newDate: moment.Moment | null) => void;
  selectedTagIds: number[];
  handleSelectTag: (tagId: number) => void;
  handleDeselectTag: (tagId: number) => () => void;
}

const TableOptions = ({
  selectedEventTypes,
  handleEventTypeSelectedChange,
  handleEventStatusSelectedChange,
  selectedEventStatus,
  startDate,
  endDate,
  disableFilterOptions,
  handleChangeStartDate,
  handleChangeEndDate,
  selectedTagIds,
  handleSelectTag,
  handleDeselectTag,
}: Props) => {
  const { t } = useTranslation();

  const isAirProductsEnabledDomain = useSelector(
    selectIsActiveDomainApciEnabled
  );

  const domainId = useSelector(selectActiveDomainId);

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

  const getTagsApi = useGetDomainTags(domainId);

  const getTagsApiData = getTagsApi.data;

  const selectedTags = getTagsApiData?.filter((tagObject) =>
    selectedTagIds?.find((selectedTagId) => selectedTagId === tagObject.tagId)
  );

  const selectableTags = getTagsApiData?.filter(
    (tagObject) =>
      !selectedTagIds?.find(
        (selectedTagId) => selectedTagId === tagObject.tagId
      )
  );

  const isActiveEventsSelected =
    selectedEventStatus === EventRecordStatus.Active;
  const isInactiveEventsSelected =
    selectedEventStatus === EventRecordStatus.Inactive;

  const showTags = selectedTags && selectedTags?.length > 0;

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
            style={{ minWidth: 120 }}
            InputProps={{
              style: {
                overflow: 'hidden',
              },
            }}
            disabled={disableFilterOptions}
          >
            {[
              {
                label: t('enum.eventrulestatetype.active"', 'Active'),
                value: EventRecordStatus.Active,
              },
              {
                label: t('enum.eventrulestatetype.inactive', 'Inactive'),
                value: EventRecordStatus.Inactive,
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
                style={{ width: isActiveEventsSelected ? 265 : 200 }}
                InputProps={{
                  style: {
                    overflow: 'hidden',
                  },
                }}
                disabled={disableFilterOptions}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* 
          We duplicate the tags component as well as separate the UI for active
          tags because the date picker would be in the way of this component.
        */}
        {isAirProductsEnabledDomain && isInactiveEventsSelected && (
          <>
            <Grid item>
              <FieldLabel>{t('ui.common.tags', 'Tags')}</FieldLabel>
            </Grid>
            <Grid item>
              <StyledDropdownAutocomplete<
                React.FC<EmptyDropdownAutocompleteProps<TagDto>>
              >
                label=""
                options={selectableTags || []}
                getOptionLabel={(option) => option?.name || ''}
                onChange={(_: any, tag) => {
                  if (tag?.tagId) {
                    handleSelectTag(tag.tagId);
                  }
                }}
                renderOption={(option) => (
                  <Typography>{option.name}</Typography>
                )}
                style={{ width: 150 }}
                disabled={disableFilterOptions}
              />
            </Grid>
          </>
        )}

        {selectedEventStatus === EventRecordStatus.Inactive && (
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
                  disabled={disableFilterOptions}
                  onError={(error) => {
                    setIsLocalStartDateValid(!error);
                  }}
                  disableFuture
                  maxDate={localEndDate}
                  style={{ width: 135 }}
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
                  disabled={disableFilterOptions}
                  onError={(error) => {
                    setIsLocalEndDateValid(!error);
                  }}
                  disableFuture
                  minDate={localStartDate}
                  style={{ width: 135 }}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  disabled={
                    disableFilterOptions ||
                    !isLocalStartDateValid ||
                    !isLocalEndDateValid
                  }
                  onClick={handleStartAndEndDateChange}
                >
                  {t('ui.common.apply', 'Apply')}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}

        {/* 
          We duplicate the tags component as well as separate the physical tags (below)
          because the date picker would be in the way of how tags are rendered OR the
          date picker apply button would appear before the tags field making it even
          more confusing for the user.
        */}
        {/* 
          If no tags are selected, don't show the grid item as there will be
          an empty space in the UI.
        */}
        {showTags && isAirProductsEnabledDomain && isInactiveEventsSelected && (
          <Grid item xs={12}>
            <Grid
              container
              alignItems="center"
              spacing={1}
              justify="flex-start"
            >
              {selectedTags?.map((tag) => {
                return (
                  <Grid item key={tag.tagId}>
                    <Chip
                      label={tag.name}
                      onDelete={handleDeselectTag(tag.tagId!)}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        )}

        {isAirProductsEnabledDomain && isActiveEventsSelected && (
          <>
            <Grid item>
              <FieldLabel>{t('ui.common.tags', 'Tags')}</FieldLabel>
            </Grid>
            <Grid item>
              <StyledDropdownAutocomplete<
                React.FC<EmptyDropdownAutocompleteProps<TagDto>>
              >
                label=""
                options={selectableTags || []}
                getOptionLabel={(option) => option?.name || ''}
                onChange={(_: any, tag) => {
                  if (tag?.tagId) {
                    handleSelectTag(tag.tagId);
                  }
                }}
                renderOption={(option) => (
                  <Typography>{option.name}</Typography>
                )}
                style={{ width: 200 }}
                disabled={disableFilterOptions}
              />
            </Grid>
          </>
        )}
        {/* 
          If no tags are selected, don't show the grid item as there will be
          an empty space in the UI.
        */}
        {showTags && isAirProductsEnabledDomain && isActiveEventsSelected && (
          <Grid item xs={12}>
            <Grid
              container
              alignItems="center"
              spacing={1}
              justify="flex-start"
            >
              {selectedTags?.map((tag) => {
                return (
                  <Grid item key={tag.tagId}>
                    <Chip
                      label={tag.name}
                      onDelete={handleDeselectTag(tag.tagId!)}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        )}
      </Grid>
    </FilterBox>
  );
};

export default TableOptions;
