/* eslint-disable indent */
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { RtuPacketCategory } from 'api/admin/api';
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
  buildPacketTypeGroupTextMapping,
  buildRtuChannelTypeTextMapping,
  getRTUCommunicationDirectionEnumOptions,
  RtuPacketsChannelType,
  RtuPacketsChannelTypeForFilter,
} from 'utils/i18n/enum-to-text';

const StyledApplyButton = styled(Button)`
  margin-top: 20px;
`;

interface Props {
  isFetching: boolean;
  // 'Channel'
  selectedRtuChannelTypes: RtuPacketsChannelType[];
  setSelectedRtuChannelTypes: (
    rtuChannelTypes: RtuPacketsChannelType[]
  ) => void;
  handleRtuChannelTypeChange: (
    rtuChannelTypes: RtuPacketsChannelType[]
  ) => void;
  // 'Packet Category'
  selectedPacketCategories: RtuPacketCategory[];
  setSelectedPacketCategories: (packetCategories: RtuPacketCategory[]) => void;
  handlePacketCategoryChange: (packetCategories: RtuPacketCategory[]) => void;
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
  selectedRtuChannelTypes,
  setSelectedRtuChannelTypes,
  handleRtuChannelTypeChange,
  selectedPacketCategories,
  setSelectedPacketCategories,
  handlePacketCategoryChange,
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
  const packetTypeGroupTextMapping = buildPacketTypeGroupTextMapping(t);

  const packetTypeGroupOptions = [
    RtuPacketCategory.Configuration,
    RtuPacketCategory.Data,
    RtuPacketCategory.Initial,
    RtuPacketCategory.Unknown,
  ];

  const rtuChannelTypeTextMapping = buildRtuChannelTypeTextMapping(t);
  const rtuChannelTypeOptions = [
    RtuPacketsChannelType.ChannelOne,
    RtuPacketsChannelType.ChannelTwo,
    RtuPacketsChannelType.ChannelThree,
    RtuPacketsChannelType.ChannelFour,
    RtuPacketsChannelType.ChannelFive,
    RtuPacketsChannelType.ChannelSix,
    RtuPacketsChannelType.ChannelSeven,
    RtuPacketsChannelType.ChannelEight,
    RtuPacketsChannelType.GpsChannel,
  ];

  return (
    <FilterBox>
      <Grid container justify="flex-start" alignItems="center" spacing={2}>
        <Grid item>
          <MultiSelect<RtuPacketsChannelType>
            id="channel-input"
            options={rtuChannelTypeOptions}
            value={selectedRtuChannelTypes!.sort()}
            setValue={setSelectedRtuChannelTypes}
            label={<FieldLabel>{t('ui.common.channel', 'Channel')}</FieldLabel>}
            onClose={(selectedOptions) =>
              handleRtuChannelTypeChange(selectedOptions)
            }
            renderValue={(option) => {
              // @ts-ignore
              return rtuChannelTypeTextMapping[option];
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
          <MultiSelect<RtuPacketCategory>
            id="packetCategory-input"
            options={packetTypeGroupOptions}
            value={selectedPacketCategories!}
            setValue={setSelectedPacketCategories}
            label={
              <FieldLabel>
                {t('ui.packetretrieval.packetcategory', 'Packet Category')}
              </FieldLabel>
            }
            onClose={(selectedOptions) =>
              handlePacketCategoryChange(selectedOptions)
            }
            renderValue={(option) => {
              // @ts-ignore
              return packetTypeGroupTextMapping[option];
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
