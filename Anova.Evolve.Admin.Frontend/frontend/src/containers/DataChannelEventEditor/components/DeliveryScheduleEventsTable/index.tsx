/* eslint-disable indent */
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import TableRow from '@material-ui/core/TableRow';
import { EventRuleCategory, UnitType } from 'api/admin/api';
import { ReactComponent as PencilIcon } from 'assets/icons/pencil.svg';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import TableHead from 'components/tables/components/TableHead';
import {
  CustomTable,
  PaddedEventEditorCell,
  PaddedHeadCell,
  StyledGreenCircle,
  StyledNoneText,
  StyledTableBody,
  StyledTableContainer,
  StyledTableRow,
} from 'containers/DataChannelEditor/components/ProfileTab/styles';
import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getEventImportanceLevelOptions } from 'utils/i18n/enum-to-text';
import { renderImportance } from 'utils/ui/helpers';
import { StyledEventDescriptionText } from '../../styles';
import { CommonEventTableRowProps } from '../../types';

interface Props extends CommonEventTableRowProps {
  unitsOfMeasureTextMapping: Record<UnitType, string>;
  isAirProductsEnabledDomain: boolean;
}

const DeliveryScheduleEventsTable = ({
  dataChannel,
  canEdit,
  openRostersDrawer,
}: Props) => {
  const { t } = useTranslation();

  const eventImportanceLevelOptions = getEventImportanceLevelOptions(t);

  const hasRosters = dataChannel?.deliveryScheduleEvents?.some(
    (event) => event?.rosters?.length
  );

  return (
    <>
      <StyledTableContainer style={{ maxWidth: 1700 }}>
        <CustomTable>
          <TableHead>
            <TableRow>
              <PaddedHeadCell style={{ width: 75 }}>
                {t('ui.common.enabled', 'Enabled')}
              </PaddedHeadCell>

              <PaddedHeadCell
                style={{
                  minWidth: 130,
                  width: 130,
                }}
              >
                {t('ui.common.description', 'Description')}
              </PaddedHeadCell>

              <PaddedHeadCell
                style={{
                  minWidth: 175,
                  width: 175,
                }}
              >
                {t('ui.datachanneleventrule.importance', 'Importance')}
              </PaddedHeadCell>

              <PaddedHeadCell
                style={{
                  minWidth: hasRosters ? 360 : 150,
                  width: hasRosters ? 360 : 150,
                }}
              >
                {t('ui.events.rosters', 'Roster(s)')}
              </PaddedHeadCell>

              <PaddedHeadCell style={{ minWidth: 190, width: 190 }}>
                {t('ui.datachanneleventrule.integrationid', 'Integration ID')}
              </PaddedHeadCell>
            </TableRow>
          </TableHead>
          <StyledTableBody>
            {dataChannel?.deliveryScheduleEvents?.map(
              (deliveryEvent, eventIndex) => {
                const isEventDisabled = !deliveryEvent.isEnabled;

                const fieldNamePrefix = `deliveryScheduleEvents.${eventIndex}`;
                const isEnabledFieldName = `${fieldNamePrefix}.isEnabled`;
                const importanceLevelFieldName = `${fieldNamePrefix}.eventImportanceLevelId`;
                const integrationNameFieldName = `${fieldNamePrefix}.integrationName`;

                // const fieldErrors = getIn(errors, eventValueFieldName);
                // const fieldStatusErrors = getIn(status?.errors, eventValueFieldName);

                // let anyFieldErrors = null;
                // if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                //   anyFieldErrors = fieldErrors;
                // } else if (
                //   Array.isArray(fieldStatusErrors) &&
                //   fieldStatusErrors.length > 0
                // ) {
                //   anyFieldErrors = fieldStatusErrors;
                // }

                // const hasError =
                //   Array.isArray(anyFieldErrors) && anyFieldErrors.length > 0;

                // const isTotalizedOrRateOfChangeDataChannel =
                //   dataChannel.dataChannelTypeId ===
                //     DataChannelType.TotalizedLevel ||
                //   dataChannel.dataChannelTypeId === DataChannelType.RateOfChange;

                // const isVirtualChannelorRtuDataChannel =
                //   dataChannel.dataChannelTypeId ===
                //     DataChannelType.RtuCaseTemperature ||
                //   dataChannel.dataChannelTypeId === DataChannelType.Rtu ||
                //   dataChannel.dataChannelTypeId ===
                //     DataChannelType.VirtualChannel;

                // const isDisabled = getIsEventRuleDisabled(
                //   isTotalizedOrRateOfChangeDataChannel,
                //   isVirtualChannelorRtuDataChannel,
                //   inventoryEvent
                // );

                return (
                  <StyledTableRow key={eventIndex}>
                    <PaddedEventEditorCell align="center">
                      <Field
                        component={CheckboxWithLabel}
                        // For responsiveness to remove the margin when this
                        // field is on its own row and not beside another field
                        // withTopMargin={!isBelowSmBreakpoint}
                        id={`${isEnabledFieldName}-input`}
                        name={isEnabledFieldName}
                        type="checkbox"
                        Label={{
                          style: {
                            display: 'block',
                            margin: 0,
                          },
                        }}
                      />
                    </PaddedEventEditorCell>
                    <PaddedEventEditorCell>
                      <StyledEventDescriptionText>
                        {deliveryEvent.description}
                      </StyledEventDescriptionText>
                    </PaddedEventEditorCell>

                    <PaddedEventEditorCell>
                      <Field
                        id={`${importanceLevelFieldName}-input`}
                        name={importanceLevelFieldName}
                        component={CustomTextField}
                        select
                        SelectProps={{ displayEmpty: true }}
                        disabled={isEventDisabled}
                      >
                        <MenuItem value="" disabled>
                          <SelectItem />
                        </MenuItem>

                        {eventImportanceLevelOptions?.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {renderImportance(option.value)}&nbsp;{option.label}
                          </MenuItem>
                        ))}
                      </Field>
                    </PaddedEventEditorCell>

                    <PaddedEventEditorCell>
                      <Grid
                        container
                        alignItems="center"
                        justify="space-between"
                      >
                        <Grid item xs>
                          <Grid container>
                            {deliveryEvent?.rosters?.length ? (
                              deliveryEvent?.rosters
                                .split(',')
                                .map((roster) => {
                                  return (
                                    <Grid
                                      item
                                      xs="auto"
                                      style={{ paddingRight: 8 }}
                                    >
                                      <StyledGreenCircle className="roster-circle-icon" />{' '}
                                      {roster}
                                    </Grid>
                                  );
                                })
                            ) : (
                              <StyledNoneText>
                                {t('ui.common.none', 'None')}
                              </StyledNoneText>
                            )}
                          </Grid>
                        </Grid>
                        {canEdit && (
                          <Grid item xs={hasRosters ? 2 : 3}>
                            <IconButton
                              aria-label="Edit Rosters"
                              onClick={() =>
                                openRostersDrawer({
                                  eventRule: deliveryEvent,
                                  // NOTE: Using Level, since there is no type for
                                  // inventory events
                                  eventRuleType: EventRuleCategory.Level,
                                  fieldNamePrefix,
                                })
                              }
                              disabled={isEventDisabled}
                            >
                              <PencilIcon />
                            </IconButton>
                          </Grid>
                        )}
                      </Grid>
                    </PaddedEventEditorCell>

                    <PaddedEventEditorCell>
                      <Field
                        id={`${integrationNameFieldName}-input`}
                        name={integrationNameFieldName}
                        component={CustomTextField}
                        disabled={isEventDisabled}
                      />
                    </PaddedEventEditorCell>
                  </StyledTableRow>
                );
              }
            )}
          </StyledTableBody>
        </CustomTable>
      </StyledTableContainer>
    </>
  );
};

export default DeliveryScheduleEventsTable;
