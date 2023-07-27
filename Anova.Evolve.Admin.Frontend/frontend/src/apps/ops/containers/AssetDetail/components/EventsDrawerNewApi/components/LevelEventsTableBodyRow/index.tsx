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
import { eventComparatorTypeTextMapping } from 'utils/i18n/enum-to-text';
import { getUnitText } from '../../formHelpers';
import { getIsEventRuleDisabled } from '../../helpers';
import {
  StyledComparatorText,
  StyledEventText,
  StyledFieldGroup,
  StyledSecondaryText,
  StyledSecondaryTextWithHeight,
  TableBodyCellForRTUSyncIcon,
} from '../../styles';
import { CommonEventTableRowProps } from '../../types';
import RTUSyncIcon from '../RTUSyncIcon';

interface Props extends CommonEventTableRowProps {
  unitsOfMeasureTextMapping: Record<UnitType, string>;
}

const LevelEventsTableBodyRow = ({
  hasIntegrationId,
  dataChannel,
  dataChannelIndex,
  errors,
  status,
  canEdit,
  unitsOfMeasureTextMapping,
  openRostersDrawer,
}: Props) => {
  const { t } = useTranslation();

  return (
    <>
      {dataChannel?.levelEvents?.map((event, eventIndex) => {
        const comparatorText =
          // @ts-ignore
          eventComparatorTypeTextMapping[event.eventComparatorTypeId!];

        const fieldNamePrefix = `dataChannels.${dataChannelIndex}.levelEvents.${eventIndex}`;
        const eventValueFieldName = `${fieldNamePrefix}.eventValue`;
        const integrationNameFieldName = `${fieldNamePrefix}.integrationName`;

        const fieldErrors = getIn(errors, eventValueFieldName);
        const fieldStatusErrors = getIn(status?.errors, eventValueFieldName);

        const unit = getUnitText(
          event.currentUOMTypeId,
          event.scaledUOM,
          unitsOfMeasureTextMapping
        );

        let anyFieldErrors = null;
        if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
          anyFieldErrors = fieldErrors;
        } else if (
          Array.isArray(fieldStatusErrors) &&
          fieldStatusErrors.length > 0
        ) {
          anyFieldErrors = fieldStatusErrors;
        }

        const isTotalizedOrRateOfChangeDataChannel =
          dataChannel.dataChannelTypeId ===
            DataChannelCategory.TotalizedLevel ||
          dataChannel.dataChannelTypeId === DataChannelCategory.RateOfChange;

        const isVirtualChannelorRtuDataChannel =
          dataChannel.dataChannelTypeId ===
            DataChannelCategory.RtuCaseTemperature ||
          dataChannel.dataChannelTypeId === DataChannelCategory.Rtu ||
          dataChannel.dataChannelTypeId === DataChannelCategory.VirtualChannel;

        const isDisabled = getIsEventRuleDisabled(
          isTotalizedOrRateOfChangeDataChannel,
          isVirtualChannelorRtuDataChannel,
          event
        );

        return (
          <TableBodyRow key={eventIndex}>
            <TableBodyCellForRTUSyncIcon>
              {!isTotalizedOrRateOfChangeDataChannel &&
                !isVirtualChannelorRtuDataChannel && (
                  <RTUSyncIcon
                    isSetpointUpdateSupported={event.isSetpointUpdateSupported}
                    isLinkedToEventRule={event.isLinkedToEventRule}
                    rtuChannelSetpointIndex={event.rtuChannelSetpointIndex}
                    rtuChannelSetPointIndexAsText={
                      event.rtuChannelSetpointIndexAsText
                    }
                  />
                )}
            </TableBodyCellForRTUSyncIcon>

            <TableCell>
              <StyledEventText>{event.description}</StyledEventText>
            </TableCell>
            <TableCell>
              <Grid container alignItems="flex-start" spacing={1}>
                <Grid item xs={6}>
                  <StyledFieldGroup style={{ alignItems: 'flex-start' }}>
                    <StyledComparatorText
                      fullWidth={false}
                      value={comparatorText}
                      inputProps={{
                        // Prevent tabbing onto the comparator field since the
                        // field is readOnly
                        tabIndex: -1,
                      }}
                      InputProps={{
                        readOnly: true,
                        style: {
                          overflow: 'hidden',
                          textAlign: 'center',
                        },
                      }}
                    />

                    <Field
                      component={CustomTextField}
                      id={`${eventValueFieldName}-input`}
                      name={eventValueFieldName}
                      disabled={isDisabled}
                      type="number"
                      // Error messages are shown below instead
                      helperText=""
                      InputProps={{
                        readOnly: !canEdit,
                        style: {
                          overflow: 'hidden',
                        },
                      }}
                    />
                  </StyledFieldGroup>
                </Grid>

                <Grid item xs={3}>
                  <StyledSecondaryTextWithHeight>
                    {unit}
                  </StyledSecondaryTextWithHeight>
                </Grid>
                {Array.isArray(anyFieldErrors) && (
                  <Grid item xs={12}>
                    {anyFieldErrors.map((error) => {
                      return (
                        <FormHelperText error key={error}>
                          {error}
                        </FormHelperText>
                      );
                    })}
                  </Grid>
                )}
              </Grid>
            </TableCell>
            <TableCell>
              <Grid
                container
                spacing={1}
                alignItems="center"
                justify="space-between"
              >
                <Grid item xs>
                  <StyledSecondaryText>
                    {event.rosters || <em>{t('ui.common.none', 'None')}</em>}
                  </StyledSecondaryText>
                </Grid>
                {canEdit && (
                  <Grid item xs={2}>
                    <IconButton
                      aria-label="Edit Rosters"
                      onClick={() =>
                        openRostersDrawer({
                          eventRule: event,
                          eventRuleType: EventRuleCategory.Level,
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
      })}
    </>
  );
};

export default LevelEventsTableBodyRow;
