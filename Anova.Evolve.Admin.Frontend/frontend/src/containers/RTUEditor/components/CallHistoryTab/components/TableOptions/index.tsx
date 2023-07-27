/* eslint-disable indent */
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { RcmJournalItemStatusEnum } from 'api/admin/api';
import Button from 'components/Button';
import FilterBox from 'components/FilterBox';
import FieldLabel from 'components/forms/labels/FieldLabel';
import MultiSelect from 'components/forms/styled-fields/MultiSelect';
import StyledKeyboardDatePickerLegacy from 'components/forms/styled-fields/StyledKeyboardDatePickerLegacy';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  buildRtuStatusTypeTextMapping,
  getRTUCommunicationDirectionEnumOptions,
  RtuPacketsChannelTypeForFilter,
} from 'utils/i18n/enum-to-text';

const StyledApplyButton = styled(Button)`
  margin-top: 20px;
`;

interface Props {
  isFetching: boolean;
  // 'Status'
  selectedRtuStatusTypes: RcmJournalItemStatusEnum[];
  setSelectedRtuStatusTypes: (
    rtuStatusTypes: RcmJournalItemStatusEnum[]
  ) => void;
  handleRtuStatusTypeChange: (
    rtuStatusTypes: RcmJournalItemStatusEnum[]
  ) => void;
  // 'Row Count'
  rowCount: number | null;
  handleRowCountChange: (rowCountValue: number) => void;
  // 'Direction'
  selectedDirection: RtuPacketsChannelTypeForFilter;
  handleDirectionChange: (
    directionValue: RtuPacketsChannelTypeForFilter
  ) => void;
  // Time Pickers
  beginTime: moment.Moment | null;
  setBeginTime: (timeValue: moment.Moment | null) => void;
  // Api call
  handleApplyFilters: () => void;
}

const TableOptions = ({
  isFetching,
  selectedRtuStatusTypes,
  setSelectedRtuStatusTypes,
  handleRtuStatusTypeChange,
  rowCount,
  handleRowCountChange,
  selectedDirection,
  handleDirectionChange,
  beginTime,
  setBeginTime,
  handleApplyFilters,
}: Props) => {
  const { t } = useTranslation();

  const [isLocalBeginTimeValid, setIsLocalBeginTimeValid] = useState(
    moment(beginTime).isValid()
  );

  const rtuCommunicationDirectionEnumOptions = getRTUCommunicationDirectionEnumOptions(
    t
  );

  const rtuStatusTypeTextMapping = buildRtuStatusTypeTextMapping(t);
  const rtuStatusTypeOptions = [
    RcmJournalItemStatusEnum.Complete,
    RcmJournalItemStatusEnum.Failed,
    RcmJournalItemStatusEnum.Initialized,
    RcmJournalItemStatusEnum.Partial,
    RcmJournalItemStatusEnum.Processing,
  ];

  return (
    <FilterBox>
      <Grid container justify="flex-start" alignItems="center" spacing={2}>
        <Grid item>
          <MultiSelect<RcmJournalItemStatusEnum>
            id="status-input"
            options={rtuStatusTypeOptions}
            value={selectedRtuStatusTypes!.sort()}
            setValue={setSelectedRtuStatusTypes}
            label={
              <FieldLabel>
                {t('enum.rcmcalljournallistfilteroptions.status', 'Status')}
              </FieldLabel>
            }
            onClose={(selectedOptions) =>
              handleRtuStatusTypeChange(selectedOptions)
            }
            renderValue={(option) => {
              // @ts-ignore
              return rtuStatusTypeTextMapping[option];
            }}
            style={{ width: 190 }}
            InputProps={{
              style: {
                overflow: 'hidden',
              },
            }}
            disabled={isFetching}
          />
        </Grid>

        <Grid item>
          <StyledTextField
            id="direction-input"
            label={t('ui.common.direction', 'Direction')}
            select
            onChange={(event) => {
              handleDirectionChange(
                (event.target
                  .value as unknown) as RtuPacketsChannelTypeForFilter
              );
            }}
            value={selectedDirection}
            style={{ width: 115 }}
            disabled={isFetching}
          >
            {rtuCommunicationDirectionEnumOptions.map((option) => (
              <MenuItem key={option.label} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </StyledTextField>
        </Grid>

        <Grid item>
          <StyledKeyboardDatePickerLegacy
            id="startDate-input"
            label={t('ui.common.before', 'Before')}
            KeyboardButtonProps={{
              'aria-label': 'change from date',
            }}
            PopoverProps={{ id: 'from date popover' }}
            value={beginTime}
            onChange={setBeginTime}
            disabled={isFetching}
            onError={(error) => {
              setIsLocalBeginTimeValid(!error);
            }}
            disableFuture
            style={{ width: 140 }}
            {...(!beginTime
              ? {
                  error: true,
                  helperText: t('validate.common.required', 'Required'),
                }
              : undefined)}
          />
        </Grid>

        <Grid item>
          <StyledTextField
            id="rowCount-input"
            label={t('ui.packetretrieval.rowcount', 'Row Count')}
            type="number"
            onChange={(event) => {
              handleRowCountChange(Number(event.target.value));
            }}
            value={rowCount}
            style={{ width: 90 }}
            disabled={isFetching}
          />
        </Grid>
        <Grid item>
          <StyledApplyButton
            variant="outlined"
            disabled={isFetching || !isLocalBeginTimeValid || !beginTime}
            onClick={handleApplyFilters}
          >
            {t('ui.common.apply', 'Apply')}
          </StyledApplyButton>
        </Grid>
      </Grid>
    </FilterBox>
  );
};

export default TableOptions;
