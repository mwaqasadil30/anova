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
import { getIsEventRuleDisabled } from '../../helpers';

interface Props extends CommonEventTableRowProps {
  unitsOfMeasureTextMapping: Record<UnitType, string>;
}

const InventoryEventsTableBodyRow = ({
  hasIntegrationId,
  dataChannel,
  errors,
  status,
  canEdit,
  unitsOfMeasureTextMapping,
  openRostersDrawer,
}: Props) => {
  const { t } = useTranslation();

  return (
    <>
      {dataChannel?.inventoryEvents?.map((inventoryEvent, eventIndex) => {
        const comparatorText =
          // @ts-ignore
          eventComparatorTypeTextMapping[inventoryEvent.eventComparatorTypeId!];

        const fieldNamePrefix = `inventoryEvents.${eventIndex}`;
        const eventValueFieldName = `${fieldNamePrefix}.eventValue`;
        const integrationNameFieldName = `${fieldNamePrefix}.integrationName`;

        const fieldErrors = getIn(errors, eventValueFieldName);
        const fieldStatusErrors = getIn(status?.errors, eventValueFieldName);

        const unit = getUnitText(
          inventoryEvent.currentUOMTypeId,
          inventoryEvent.scaledUOM,
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
          inventoryEvent
        );

        return (
          <TableBodyRow key={eventIndex}>
            <TableBodyCellForRTUSyncIcon>
              {!isTotalizedOrRateOfChangeDataChannel &&
                !isVirtualChannelorRtuDataChannel && (
                  <RTUSyncIcon
                    isSetpointUpdateSupported={
                      inventoryEvent.isSetpointUpdateSupported
                    }
                    isLinkedToEventRule={inventoryEvent.isLinkedToEventRule}
                    rtuChannelSetpointIndex={
                      inventoryEvent.rtuChannelSetpointIndex
                    }
                  />
                )}
            </TableBodyCellForRTUSyncIcon>
            <TableCell>
              <StyledEventText>{inventoryEvent.description}</StyledEventText>
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
                          height: 40,
                          overflow: 'hidden',
                          padding: '7px 9px',
                          textAlign: 'center',
                        },
                      }}
                    />

                    <Field
                      component={CustomTextField}
                      id={`${eventValueFieldName}-input`}
                      type="number"
                      name={eventValueFieldName}
                      disabled={isDisabled}
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
                    {inventoryEvent.rosters || (
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
                          eventRule: inventoryEvent,
                          // NOTE: Using Level, since there is no type for
                          // inventory events
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

export default InventoryEventsTableBodyRow;
