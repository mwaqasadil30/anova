/* eslint-disable indent */
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import {
  DataChannelCategory,
  EventRuleCategory,
  UnitType,
} from 'api/admin/api';
import { ReactComponent as PencilIcon } from 'assets/icons/pencil.svg';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import TableBodyRow from 'components/tables/components/TableBodyRow';
import TableCell from 'components/tables/components/TableCell';
import { Field, getIn } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getUnitText } from '../../formHelpers';
import { getIsEventRuleDisabled } from '../../helpers';
import {
  StyledEventText,
  StyledSecondaryText,
  StyledSecondaryTextWithHeight,
  TableBodyCellForRTUSyncIcon,
} from '../../styles';
import { CommonEventTableRowProps } from '../../types';
import RTUSyncIcon from '../RTUSyncIcon';

interface Props extends CommonEventTableRowProps {
  unitsOfMeasureTextMapping: Record<UnitType, string>;
}

const UsageRateEventsTableBodyRow = ({
  hasIntegrationId,
  dataChannel,
  errors,
  status,
  canEdit,
  unitsOfMeasureTextMapping,
  openRostersDrawer,
}: Props) => {
  const { t } = useTranslation();

  const fieldNamePrefix = `usageRateEvent`;
  const eventValueFieldName = `${fieldNamePrefix}.eventValue`;
  const integrationNameFieldName = `${fieldNamePrefix}.integrationName`;
  const minimumReadingPeriodFieldName = `${fieldNamePrefix}.minimumReadingPeriod`;

  const eventValueErrors = getIn(errors, eventValueFieldName);
  const eventValueStatusErrors = getIn(status?.errors, eventValueFieldName);
  const readingPeriodErrors = getIn(errors, minimumReadingPeriodFieldName);
  const readingPeriodStatusErrors = getIn(
    status?.errors,
    minimumReadingPeriodFieldName
  );

  const unit = getUnitText(
    dataChannel?.usageRateEvent?.currentUOMTypeId,
    undefined, // Usage rate events have no scaled unit
    unitsOfMeasureTextMapping
  );

  let anyEventValueErrors = null;
  if (Array.isArray(eventValueErrors) && eventValueErrors.length > 0) {
    anyEventValueErrors = eventValueErrors;
  } else if (
    Array.isArray(eventValueStatusErrors) &&
    eventValueStatusErrors.length > 0
  ) {
    anyEventValueErrors = eventValueStatusErrors;
  }

  let anyReadingPeriodErrors = null;
  if (Array.isArray(readingPeriodErrors) && readingPeriodErrors.length > 0) {
    anyReadingPeriodErrors = readingPeriodErrors;
  } else if (
    Array.isArray(readingPeriodStatusErrors) &&
    readingPeriodStatusErrors.length > 0
  ) {
    anyReadingPeriodErrors = readingPeriodStatusErrors;
  }

  const isTotalizedOrRateOfChangeDataChannel =
    dataChannel?.dataChannelTypeId === DataChannelCategory.TotalizedLevel ||
    dataChannel?.dataChannelTypeId === DataChannelCategory.RateOfChange;

  const isVirtualChannelorRtuDataChannel =
    dataChannel?.dataChannelTypeId === DataChannelCategory.RtuCaseTemperature ||
    dataChannel?.dataChannelTypeId === DataChannelCategory.Rtu ||
    dataChannel?.dataChannelTypeId === DataChannelCategory.VirtualChannel;

  const isFieldDisabled = getIsEventRuleDisabled(
    isTotalizedOrRateOfChangeDataChannel,
    isVirtualChannelorRtuDataChannel,
    dataChannel?.usageRateEvent!
  );

  return (
    <TableBodyRow>
      <TableBodyCellForRTUSyncIcon>
        {/* Only show the RTUSyncIcon if it's linked to an event rule */}
        {!isTotalizedOrRateOfChangeDataChannel &&
          !isVirtualChannelorRtuDataChannel && (
            <RTUSyncIcon
              isSetpointUpdateSupported={
                dataChannel?.usageRateEvent?.isSetpointUpdateSupported
              }
              rtuChannelSetpointIndex={
                dataChannel?.usageRateEvent?.rtuChannelSetpointIndex
              }
              isLinkedToEventRule={
                dataChannel?.usageRateEvent?.isLinkedToEventRule
              }
            />
          )}
      </TableBodyCellForRTUSyncIcon>
      <TableCell>
        <StyledEventText>
          {dataChannel?.usageRateEvent?.description}
        </StyledEventText>
      </TableCell>
      <TableCell>
        <Grid container alignItems="flex-start" spacing={2}>
          <Grid item xs={6}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Field
                  component={CustomTextField}
                  fullWidth={false}
                  id={`${eventValueFieldName}-input`}
                  name={eventValueFieldName}
                  type="number"
                  disabled={isFieldDisabled}
                  // Error messages are shown below instead
                  helperText=""
                  InputProps={{
                    readOnly: !canEdit,
                    style: {
                      height: 40,
                      overflow: 'hidden',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <StyledSecondaryTextWithHeight>
                  {unit}
                </StyledSecondaryTextWithHeight>
              </Grid>
              {Array.isArray(anyEventValueErrors) && (
                <Grid item xs={12}>
                  {anyEventValueErrors.map((error) => {
                    return (
                      <FormHelperText error key={error}>
                        {error}
                      </FormHelperText>
                    );
                  })}
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid item xs={6}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Field
                  component={CustomTextField}
                  fullWidth={false}
                  id={`${minimumReadingPeriodFieldName}-input`}
                  name={minimumReadingPeriodFieldName}
                  type="number"
                  disabled={isFieldDisabled}
                  // Error messages are shown below instead
                  helperText=""
                  InputProps={{
                    readOnly: !canEdit,
                    style: {
                      height: 40,
                      overflow: 'hidden',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <StyledSecondaryTextWithHeight>
                  {t('ui.common.mins', 'Min(s)')}
                </StyledSecondaryTextWithHeight>
              </Grid>
              {Array.isArray(anyReadingPeriodErrors) && (
                <Grid item xs={12}>
                  {anyReadingPeriodErrors.map((error) => {
                    return (
                      <FormHelperText error key={error}>
                        {error}
                      </FormHelperText>
                    );
                  })}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </TableCell>

      <TableCell>
        <Grid container spacing={1} alignItems="center" justify="space-between">
          <Grid item xs>
            <StyledSecondaryText>
              {dataChannel?.usageRateEvent?.rosters || (
                <em>{t('ui.common.none', 'None')}</em>
              )}
            </StyledSecondaryText>
          </Grid>
          {canEdit && (
            <Grid item xs={2}>
              <IconButton
                aria-label="Edit Rosters"
                onClick={() =>
                  openRostersDrawer({
                    eventRule: dataChannel?.usageRateEvent!,
                    eventRuleType: EventRuleCategory.UsageRate,
                    fieldNamePrefix,
                  })
                }
              >
                <PencilIcon />
              </IconButton>
            </Grid>
          )}
        </Grid>
      </TableCell>
      {hasIntegrationId && (
        <TableCell>
          <Field
            id={`${integrationNameFieldName}-input`}
            name={integrationNameFieldName}
            component={CustomTextField}
            InputProps={{
              readOnly: !canEdit,
            }}
          />
        </TableCell>
      )}
    </TableBodyRow>
  );
};

export default UsageRateEventsTableBodyRow;
