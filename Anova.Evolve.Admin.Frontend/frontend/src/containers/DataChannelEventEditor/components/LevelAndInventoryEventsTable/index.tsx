/* eslint-disable indent */
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import TableRow from '@material-ui/core/TableRow';
import {
  DataChannelCategory,
  EventRuleCategory,
  UnitType,
} from 'api/admin/api';
import { ReactComponent as PencilIcon } from 'assets/icons/pencil.svg';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import MultiSelect from 'components/forms/form-fields/MultiSelect';
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
import IsEventLinkedFormEffect from 'containers/DataChannelEventEditor/IsEventLinkedFormEffect';
import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { isNumber } from 'utils/format/numbers';
import {
  eventComparatorTypeTextMapping,
  getEventImportanceLevelOptions,
} from 'utils/i18n/enum-to-text';
import { renderImportance } from 'utils/ui/helpers';
import { getAnyFieldErrors, getIsEventRuleDisabled } from '../../helpers';
import {
  StyledComparatorText,
  StyledEventDescriptionText,
  StyledFieldGroup,
  StyledSecondaryTextWithHeight,
} from '../../styles';
import {
  CommonEventTableRowProps,
  QEERInventoryDTOWithPreciseValue,
  QEERLevelDTOWithPreciseValue,
} from '../../types';

interface Props extends CommonEventTableRowProps {
  unitsOfMeasureTextMapping: Record<UnitType, string>;
  isAirProductsEnabledDomain: boolean;
  formattedScaledUnitsText?: string | null;
  setPoints: string[];
}

const LevelAndInventoryEventsTable = ({
  dataChannel,
  errors,
  status,
  canEdit,
  isAirProductsEnabledDomain,
  formattedScaledUnitsText,
  setPoints,
  domainTagsOptions,
  openRostersDrawer,
  setFieldValue,
}: Props) => {
  const { t } = useTranslation();

  const inventoryEvents = dataChannel?.inventoryEvents;
  const levelEvents = dataChannel?.levelEvents;

  const getInventoryAndLevelEvents = (): Array<
    QEERInventoryDTOWithPreciseValue | QEERLevelDTOWithPreciseValue
  > => {
    if (inventoryEvents?.length && levelEvents?.length) {
      return inventoryEvents.concat(levelEvents);
    }

    if (inventoryEvents?.length) {
      return inventoryEvents;
    }
    if (levelEvents?.length) {
      return levelEvents;
    }
    return [];
  };

  const levelAndOrInventoryEvents = getInventoryAndLevelEvents();

  const hasRosters = levelAndOrInventoryEvents?.some(
    (event) => event?.rosters?.length
  );

  const areAllEventDelaysNull = levelAndOrInventoryEvents?.every(
    (event) => event?.delay === null
  );

  const eventImportanceLevelOptions = getEventImportanceLevelOptions(t);

  const showSetpointColumn = levelAndOrInventoryEvents?.some(
    (levelEvent) => levelEvent.isSetpointUpdateSupported
  );

  return (
    <>
      <StyledTableContainer>
        <CustomTable>
          <TableHead>
            <TableRow>
              <PaddedHeadCell style={{ width: 75 }}>
                {t('ui.common.enabled', 'Enabled')}
              </PaddedHeadCell>
              {isAirProductsEnabledDomain && (
                <PaddedHeadCell style={{ width: 100 }}>
                  {t('ui.datachanneleventrule.linked', 'Linked')}
                </PaddedHeadCell>
              )}

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
                  minWidth: 175,
                  width: 175,
                }}
              >
                {t('ui.common.value', 'Value')} {formattedScaledUnitsText}
              </PaddedHeadCell>

              {showSetpointColumn && (
                <PaddedHeadCell
                  style={{
                    minWidth: 125,
                    width: 125,
                  }}
                >
                  {t('ui.datachannel.setpoint', 'Set Point')}
                </PaddedHeadCell>
              )}

              <PaddedHeadCell style={{ minWidth: 150, width: 150 }}>
                {t('ui.datachanneleventrule.hysteresis.nounits', 'Hysteresis')}{' '}
                {formattedScaledUnitsText}
              </PaddedHeadCell>
              {!isAirProductsEnabledDomain && !areAllEventDelaysNull && (
                <PaddedHeadCell
                  style={{
                    minWidth: 350,
                    width: 350,
                  }}
                >
                  {t('ui.datachannel.eventDelay', 'Event Delay')}
                </PaddedHeadCell>
              )}

              <PaddedHeadCell
                style={{
                  minWidth: hasRosters ? 360 : 150,
                  width: hasRosters ? 360 : 150,
                }}
              >
                {t('ui.events.rosters', 'Roster(s)')}
              </PaddedHeadCell>

              <PaddedHeadCell style={{ width: 150 }}>
                {t('ui.datachanneleventrule.graphed', 'Graphed')}
              </PaddedHeadCell>

              <PaddedHeadCell style={{ width: 150 }}>
                {t('ui.datachanneleventrule.summarized', 'Summarized')}
              </PaddedHeadCell>
              {isAirProductsEnabledDomain && (
                <PaddedHeadCell style={{ width: 150 }}>
                  {t('ui.datachanneleventrule.abbreviation', 'Abbreviation')}
                </PaddedHeadCell>
              )}

              <PaddedHeadCell style={{ width: 150 }}>
                {t(
                  'ui.datachanneleventrule.alwaystriggered',
                  'Always Triggered'
                )}
              </PaddedHeadCell>

              {isAirProductsEnabledDomain && (
                <>
                  <PaddedHeadCell
                    style={{
                      minWidth: 275,
                      width: 275,
                    }}
                  >
                    {t('ui.common.tags', 'Tags')}
                  </PaddedHeadCell>
                  <PaddedHeadCell
                    style={{
                      minWidth: 120,
                      width: 120,
                    }}
                  >
                    {t(
                      'ui.datachanneleventrule.prautocreate',
                      'PR Auto-Create'
                    )}
                  </PaddedHeadCell>
                  <PaddedHeadCell
                    style={{
                      minWidth: 120,
                      width: 120,
                    }}
                  >
                    {t('ui.datachanneleventrule.prautoclose', 'PR Auto-Close')}
                  </PaddedHeadCell>
                  <PaddedHeadCell
                    style={{
                      minWidth: 175,
                      width: 175,
                    }}
                  >
                    {t('ui.datachanneleventrule.primportance', 'PR Importance')}
                  </PaddedHeadCell>
                </>
              )}

              <PaddedHeadCell style={{ minWidth: 190, width: 190 }}>
                {t('ui.datachanneleventrule.integrationid', 'Integration ID')}
              </PaddedHeadCell>
            </TableRow>
          </TableHead>
          <StyledTableBody>
            {dataChannel?.levelEvents?.map((levelEvent, eventIndex) => {
              const isEventLinked = levelEvent.isLinkedToEventRule;
              const isEventDisabled =
                !levelEvent.isEnabled && !isAirProductsEnabledDomain;

              const comparatorText =
                // @ts-ignore
                eventComparatorTypeTextMapping[
                  levelEvent.eventComparatorTypeId!
                ];

              const fieldNamePrefix = `levelEvents.${eventIndex}`;
              const isEnabledFieldName = `${fieldNamePrefix}.isEnabled`;
              const importanceLevelFieldName = `${fieldNamePrefix}.eventImportanceLevelId`;
              const rtuSetpointIndexFieldName = `${fieldNamePrefix}.rtuChannelSetpointIndex`;
              const hysteresisFieldName = `${fieldNamePrefix}.hysteresis`;
              const maxDataAgeByHourFieldName = `${fieldNamePrefix}.maxDataAgeByHour`;
              const maxDataAgeByMinuteFieldName = `${fieldNamePrefix}.maxDataAgeByMinute`;
              const isGraphedFieldName = `${fieldNamePrefix}.isDisplayedOnGraph`;
              const isSummarizedFieldName = `${fieldNamePrefix}.isDisplayedInSummary`;
              const descriptionAbbreviationFieldName = `${fieldNamePrefix}.descriptionAbbreviation`;
              const isAlwaysTriggeredFieldName = `${fieldNamePrefix}.isAlwaysTriggered`;
              const eventValueFieldName = `${fieldNamePrefix}.eventValue`;
              const integrationNameFieldName = `${fieldNamePrefix}.integrationName`;

              // Air Products fields
              const isLinkedFieldName = `${fieldNamePrefix}.isLinkedToEventRule`;
              const isAutoCreateProblemReportFieldName = `${fieldNamePrefix}.isAutoCreateProblemReport`;
              const isAutoCloseProblemReportFieldName = `${fieldNamePrefix}.isAutoCloseProblemReport`;
              const tagsFieldName = `${fieldNamePrefix}.tags`;
              const problemReportImportanceLevelIdFieldName = `${fieldNamePrefix}.problemReportImportanceLevelId`;

              // const unit = getUnitText(
              //   event.currentUOMTypeId,
              //   event.scaledUOM,
              //   unitsOfMeasureTextMapping
              // );

              const eventDelayFieldName = `${fieldNamePrefix}.delay`;
              const anyEventValueFieldErrors = getAnyFieldErrors(
                eventValueFieldName,
                errors,
                status
              );
              const anyEventDelayFieldErrors = getAnyFieldErrors(
                eventDelayFieldName,
                errors,
                status
              );

              const hasError =
                Array.isArray(anyEventDelayFieldErrors) &&
                anyEventDelayFieldErrors.length > 0;

              const isTotalizedOrRateOfChangeDataChannel =
                dataChannel.dataChannelTypeId ===
                  DataChannelCategory.TotalizedLevel ||
                dataChannel.dataChannelTypeId ===
                  DataChannelCategory.RateOfChange;

              const isVirtualChannelorRtuDataChannel =
                dataChannel.dataChannelTypeId ===
                  DataChannelCategory.RtuCaseTemperature ||
                dataChannel.dataChannelTypeId === DataChannelCategory.Rtu ||
                dataChannel.dataChannelTypeId ===
                  DataChannelCategory.VirtualChannel;

              const isDisabled = getIsEventRuleDisabled(
                isTotalizedOrRateOfChangeDataChannel,
                isVirtualChannelorRtuDataChannel,
                levelEvent
              );

              const { isSetpointUpdateSupported, delay } = levelEvent;

              const isEventDelayANumber = isNumber(delay);

              return (
                <>
                  <IsEventLinkedFormEffect
                    isLinked={isEventLinked}
                    isEnabledFieldName={isEnabledFieldName}
                    setFieldValue={setFieldValue}
                  />
                  <StyledTableRow key={eventIndex}>
                    <PaddedEventEditorCell align="center">
                      <Field
                        component={CheckboxWithLabel}
                        id={`${isEnabledFieldName}-input`}
                        name={isEnabledFieldName}
                        type="checkbox"
                        Label={{
                          style: {
                            display: 'block',
                            margin: 0,
                          },
                        }}
                        disabled={isEventLinked}
                      />
                    </PaddedEventEditorCell>
                    {isAirProductsEnabledDomain && (
                      <PaddedEventEditorCell align="center">
                        <Field
                          component={CheckboxWithLabel}
                          id={`${isLinkedFieldName}-input`}
                          name={isLinkedFieldName}
                          type="checkbox"
                          Label={{
                            style: {
                              display: 'block',
                              margin: 0,
                            },
                          }}
                        />
                      </PaddedEventEditorCell>
                    )}
                    <PaddedEventEditorCell>
                      <StyledEventDescriptionText>
                        {levelEvent.description}
                      </StyledEventDescriptionText>
                    </PaddedEventEditorCell>

                    <PaddedEventEditorCell>
                      <Field
                        id={`${importanceLevelFieldName}-input`}
                        name={importanceLevelFieldName}
                        component={CustomTextField}
                        select
                        SelectProps={{ displayEmpty: true }}
                        disabled={isEventLinked || isEventDisabled}
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
                      <Grid container alignItems="flex-start" spacing={1}>
                        <Grid item xs={12}>
                          <StyledFieldGroup
                            style={{ alignItems: 'flex-start' }}
                          >
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
                              disabled={isEventLinked || isEventDisabled}
                            />

                            <Field
                              component={CustomTextField}
                              id={`${eventValueFieldName}-input`}
                              type="number"
                              name={eventValueFieldName}
                              disabled={
                                isDisabled || isEventLinked || isEventDisabled
                              }
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
                        {/* This might be needed since the helper function for this is super helpful */}
                        {/* <Grid item xs={3}>
                        <StyledSecondaryTextWithHeight>
                          {unit}
                        </StyledSecondaryTextWithHeight>
                      </Grid> */}
                        {Array.isArray(anyEventValueFieldErrors) && (
                          <Grid item xs={12}>
                            {anyEventValueFieldErrors.map((error) => {
                              return (
                                <FormHelperText error key={error}>
                                  {error}
                                </FormHelperText>
                              );
                            })}
                          </Grid>
                        )}
                      </Grid>
                    </PaddedEventEditorCell>
                    {isSetpointUpdateSupported && (
                      <PaddedEventEditorCell>
                        <Field
                          id={`${rtuSetpointIndexFieldName}-input`}
                          name={rtuSetpointIndexFieldName}
                          component={CustomTextField}
                          select
                          SelectProps={{ displayEmpty: true }}
                          disabled={isEventLinked || isEventDisabled}
                        >
                          <MenuItem value="" disabled>
                            <SelectItem />
                          </MenuItem>
                          {setPoints?.map((option, index) => (
                            <MenuItem key={index} value={index}>
                              {option}
                            </MenuItem>
                          ))}
                        </Field>
                      </PaddedEventEditorCell>
                    )}
                    <PaddedEventEditorCell>
                      <Field
                        component={CustomTextField}
                        id={`${hysteresisFieldName}-input`}
                        name={hysteresisFieldName}
                        type="number"
                        // Error messages are shown below instead
                        // helperText=""
                        InputProps={{
                          // readOnly: !canEdit,
                          style: {
                            overflow: 'hidden',
                          },
                        }}
                        disabled={isEventLinked || isEventDisabled}
                      />
                    </PaddedEventEditorCell>
                    {!isAirProductsEnabledDomain && !areAllEventDelaysNull && (
                      <PaddedEventEditorCell>
                        {isEventDelayANumber && (
                          <Grid container alignItems="flex-start" spacing={1}>
                            <Grid item xs={6}>
                              <Grid container spacing={1} alignItems="center">
                                <Grid item xs={6}>
                                  <Field
                                    component={CustomTextField}
                                    fullWidth={false}
                                    id={`${maxDataAgeByHourFieldName}-input`}
                                    name={maxDataAgeByHourFieldName}
                                    disabled={
                                      isDisabled ||
                                      isEventLinked ||
                                      isEventDisabled
                                    }
                                    // NOTE: Without type="number" it causes issues with the
                                    // dirty state. The initial value provided is a number, but
                                    // the onChange would convert it to a string b/c it doesn't
                                    // have type="number".
                                    type="number"
                                    InputProps={{
                                      readOnly: !canEdit,
                                      style: {
                                        overflow: 'hidden',
                                      },
                                    }}
                                    error={hasError}
                                  />
                                </Grid>
                                <Grid item xs={6}>
                                  <StyledSecondaryTextWithHeight>
                                    {t('ui.common.hours', 'Hour(s)')}
                                  </StyledSecondaryTextWithHeight>
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid item xs={6}>
                              <Grid container spacing={1} alignItems="center">
                                <Grid item xs={6}>
                                  <Field
                                    component={CustomTextField}
                                    fullWidth={false}
                                    id={`${maxDataAgeByMinuteFieldName}-input`}
                                    name={maxDataAgeByMinuteFieldName}
                                    disabled={
                                      isDisabled ||
                                      isEventLinked ||
                                      isEventDisabled
                                    }
                                    type="number"
                                    InputProps={{
                                      readOnly: !canEdit,
                                      style: {
                                        overflow: 'hidden',
                                      },
                                    }}
                                    error={hasError}
                                  />
                                </Grid>
                                <Grid item xs={6}>
                                  <StyledSecondaryTextWithHeight>
                                    {t('ui.common.mins', 'Min(s)')}
                                  </StyledSecondaryTextWithHeight>
                                </Grid>
                              </Grid>
                            </Grid>

                            {Array.isArray(anyEventDelayFieldErrors) && (
                              <Grid item xs={12}>
                                {anyEventDelayFieldErrors.map((error) => {
                                  return (
                                    <FormHelperText error key={error}>
                                      {error}
                                    </FormHelperText>
                                  );
                                })}
                              </Grid>
                            )}
                          </Grid>
                        )}
                      </PaddedEventEditorCell>
                    )}

                    <PaddedEventEditorCell>
                      <Grid
                        container
                        alignItems="center"
                        justify="space-between"
                      >
                        <Grid item xs>
                          <Grid container>
                            {levelEvent?.rosters?.length ? (
                              levelEvent?.rosters.split(',').map((roster) => {
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
                                  eventRule: levelEvent,
                                  // NOTE: Using Level, since there is no type for
                                  // inventory events
                                  eventRuleType: EventRuleCategory.Level,
                                  fieldNamePrefix,
                                })
                              }
                              disabled={isEventLinked || isEventDisabled}
                            >
                              <PencilIcon />
                            </IconButton>
                          </Grid>
                        )}
                      </Grid>
                    </PaddedEventEditorCell>

                    <PaddedEventEditorCell align="center">
                      <Field
                        component={CheckboxWithLabel}
                        // For responsiveness to remove the margin when this
                        // field is on its own row and not beside another field
                        // withTopMargin={!isBelowSmBreakpoint}
                        id={`${isGraphedFieldName}-input`}
                        name={isGraphedFieldName}
                        type="checkbox"
                        Label={{
                          style: {
                            display: 'block',
                            margin: 0,
                          },
                        }}
                        disabled={isEventLinked || isEventDisabled}
                      />
                    </PaddedEventEditorCell>
                    <PaddedEventEditorCell align="center">
                      <Field
                        component={CheckboxWithLabel}
                        // For responsiveness to remove the margin when this
                        // field is on its own row and not beside another field
                        // withTopMargin={!isBelowSmBreakpoint}
                        id={`${isSummarizedFieldName}-input`}
                        name={isSummarizedFieldName}
                        type="checkbox"
                        Label={{
                          style: {
                            display: 'block',
                            margin: 0,
                          },
                        }}
                        disabled={isEventLinked || isEventDisabled}
                      />
                    </PaddedEventEditorCell>
                    {isAirProductsEnabledDomain && (
                      <PaddedEventEditorCell align="center">
                        <Field
                          id={`${descriptionAbbreviationFieldName}-input`}
                          name={descriptionAbbreviationFieldName}
                          component={CustomTextField}
                          disabled={isEventLinked || isEventDisabled}
                        />
                      </PaddedEventEditorCell>
                    )}
                    <PaddedEventEditorCell align="center">
                      <Field
                        component={CheckboxWithLabel}
                        // For responsiveness to remove the margin when this
                        // field is on its own row and not beside another field
                        // withTopMargin={!isBelowSmBreakpoint}
                        id={`${isAlwaysTriggeredFieldName}-input`}
                        name={isAlwaysTriggeredFieldName}
                        type="checkbox"
                        Label={{
                          style: {
                            display: 'block',
                            margin: 0,
                          },
                        }}
                        disabled={isEventLinked || isEventDisabled}
                      />
                    </PaddedEventEditorCell>

                    {isAirProductsEnabledDomain && (
                      <>
                        <PaddedEventEditorCell
                          style={{ width: 275, maxWidth: 275 }}
                        >
                          <Field
                            id={`${tagsFieldName}-input`}
                            name={tagsFieldName}
                            component={MultiSelect}
                            select
                            fullWidth
                            options={domainTagsOptions?.map((tag) => tag)}
                            renderValue={(option: string) => {
                              return option || '';
                            }}
                            disabled={isEventLinked || isEventDisabled}
                          />
                        </PaddedEventEditorCell>
                        <PaddedEventEditorCell align="center">
                          <Field
                            component={CheckboxWithLabel}
                            id={`${isAutoCreateProblemReportFieldName}-input`}
                            name={isAutoCreateProblemReportFieldName}
                            type="checkbox"
                            Label={{
                              style: {
                                display: 'block',
                                margin: 0,
                              },
                            }}
                            disabled={isEventLinked || isEventDisabled}
                          />
                        </PaddedEventEditorCell>
                        <PaddedEventEditorCell align="center">
                          <Field
                            component={CheckboxWithLabel}
                            id={`${isAutoCloseProblemReportFieldName}-input`}
                            name={isAutoCloseProblemReportFieldName}
                            type="checkbox"
                            Label={{
                              style: {
                                display: 'block',
                                margin: 0,
                              },
                            }}
                            disabled={isEventLinked || isEventDisabled}
                          />
                        </PaddedEventEditorCell>

                        <PaddedEventEditorCell>
                          <Field
                            id={`${problemReportImportanceLevelIdFieldName}-input`}
                            name={problemReportImportanceLevelIdFieldName}
                            component={CustomTextField}
                            select
                            SelectProps={{ displayEmpty: true }}
                            disabled={isEventLinked || isEventDisabled}
                          >
                            <MenuItem value="" disabled>
                              <SelectItem />
                            </MenuItem>

                            {eventImportanceLevelOptions?.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {renderImportance(option.value)}&nbsp;
                                {option.label}
                              </MenuItem>
                            ))}
                          </Field>
                        </PaddedEventEditorCell>
                      </>
                    )}

                    <PaddedEventEditorCell align="center">
                      <Field
                        id={`${integrationNameFieldName}-input`}
                        name={integrationNameFieldName}
                        component={CustomTextField}
                        disabled={isEventLinked || isEventDisabled}
                      />
                    </PaddedEventEditorCell>
                  </StyledTableRow>
                </>
              );
            })}

            {dataChannel?.inventoryEvents?.map((inventoryEvent, eventIndex) => {
              const isEventLinked = inventoryEvent.isLinkedToEventRule;
              const isEventDisabled =
                !inventoryEvent.isEnabled && !isAirProductsEnabledDomain;

              const comparatorText =
                // @ts-ignore
                eventComparatorTypeTextMapping[
                  inventoryEvent.eventComparatorTypeId!
                ];

              const fieldNamePrefix = `inventoryEvents.${eventIndex}`;
              const isEnabledFieldName = `${fieldNamePrefix}.isEnabled`;
              const importanceLevelFieldName = `${fieldNamePrefix}.eventImportanceLevelId`;
              const rtuSetpointIndexFieldName = `${fieldNamePrefix}.rtuChannelSetpointIndex`;
              const hysteresisFieldName = `${fieldNamePrefix}.hysteresis`;
              const maxDataAgeByHourFieldName = `${fieldNamePrefix}.maxDataAgeByHour`;
              const maxDataAgeByMinuteFieldName = `${fieldNamePrefix}.maxDataAgeByMinute`;
              const isGraphedFieldName = `${fieldNamePrefix}.isDisplayedOnGraph`;
              const isSummarizedFieldName = `${fieldNamePrefix}.isDisplayedInSummary`;
              const descriptionAbbreviationFieldName = `${fieldNamePrefix}.descriptionAbbreviation`;
              const isAlwaysTriggeredFieldName = `${fieldNamePrefix}.isAlwaysTriggered`;
              const eventValueFieldName = `${fieldNamePrefix}.eventValue`;
              const integrationNameFieldName = `${fieldNamePrefix}.integrationName`;

              // Air Products fields
              const isLinkedFieldName = `${fieldNamePrefix}.isLinkedToEventRule`;
              const isAutoCreateProblemReportFieldName = `${fieldNamePrefix}.isAutoCreateProblemReport`;
              const isAutoCloseProblemReportFieldName = `${fieldNamePrefix}.isAutoCloseProblemReport`;
              const tagsFieldName = `${fieldNamePrefix}.tags`;
              const problemReportImportanceLevelIdFieldName = `${fieldNamePrefix}.problemReportImportanceLevelId`;

              // const unit = getUnitText(
              //   event.currentUOMTypeId,
              //   event.scaledUOM,
              //   unitsOfMeasureTextMapping
              // );

              const eventDelayFieldName = `${fieldNamePrefix}.delay`;
              const anyEventValueFieldErrors = getAnyFieldErrors(
                eventValueFieldName,
                errors,
                status
              );
              const anyEventDelayFieldErrors = getAnyFieldErrors(
                eventDelayFieldName,
                errors,
                status
              );

              const hasError =
                Array.isArray(anyEventDelayFieldErrors) &&
                anyEventDelayFieldErrors.length > 0;

              const isTotalizedOrRateOfChangeDataChannel =
                dataChannel.dataChannelTypeId ===
                  DataChannelCategory.TotalizedLevel ||
                dataChannel.dataChannelTypeId ===
                  DataChannelCategory.RateOfChange;

              const isVirtualChannelorRtuDataChannel =
                dataChannel.dataChannelTypeId ===
                  DataChannelCategory.RtuCaseTemperature ||
                dataChannel.dataChannelTypeId === DataChannelCategory.Rtu ||
                dataChannel.dataChannelTypeId ===
                  DataChannelCategory.VirtualChannel;

              const isDisabled = getIsEventRuleDisabled(
                isTotalizedOrRateOfChangeDataChannel,
                isVirtualChannelorRtuDataChannel,
                inventoryEvent
              );

              const { isSetpointUpdateSupported, delay } = inventoryEvent;

              const isEventDelayANumber = isNumber(delay);

              return (
                <>
                  <IsEventLinkedFormEffect
                    isLinked={isEventLinked}
                    isEnabledFieldName={isEnabledFieldName}
                    setFieldValue={setFieldValue}
                  />
                  <StyledTableRow key={eventIndex}>
                    <PaddedEventEditorCell align="center">
                      <Field
                        component={CheckboxWithLabel}
                        id={`${isEnabledFieldName}-input`}
                        name={isEnabledFieldName}
                        type="checkbox"
                        Label={{
                          style: {
                            display: 'block',
                            margin: 0,
                          },
                        }}
                        disabled={isEventLinked}
                      />
                    </PaddedEventEditorCell>
                    {isAirProductsEnabledDomain && (
                      <PaddedEventEditorCell align="center">
                        <Field
                          component={CheckboxWithLabel}
                          id={`${isLinkedFieldName}-input`}
                          name={isLinkedFieldName}
                          type="checkbox"
                          Label={{
                            style: {
                              display: 'block',
                              margin: 0,
                            },
                          }}
                        />
                      </PaddedEventEditorCell>
                    )}
                    <PaddedEventEditorCell>
                      <StyledEventDescriptionText>
                        {inventoryEvent.description}
                      </StyledEventDescriptionText>
                    </PaddedEventEditorCell>

                    <PaddedEventEditorCell>
                      <Field
                        id={`${importanceLevelFieldName}-input`}
                        name={importanceLevelFieldName}
                        component={CustomTextField}
                        select
                        SelectProps={{ displayEmpty: true }}
                        disabled={isEventLinked || isEventDisabled}
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
                      <Grid container alignItems="flex-start" spacing={1}>
                        <Grid item xs={12}>
                          <StyledFieldGroup
                            style={{ alignItems: 'flex-start' }}
                          >
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
                              disabled={isEventLinked || isEventDisabled}
                            />

                            <Field
                              component={CustomTextField}
                              id={`${eventValueFieldName}-input`}
                              type="number"
                              name={eventValueFieldName}
                              disabled={
                                isDisabled || isEventLinked || isEventDisabled
                              }
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
                        {/* This might be needed since the helper function for this is super helpful */}
                        {/* <Grid item xs={3}>
                        <StyledSecondaryTextWithHeight>
                          {unit}
                        </StyledSecondaryTextWithHeight>
                      </Grid> */}
                        {Array.isArray(anyEventValueFieldErrors) && (
                          <Grid item xs={12}>
                            {anyEventValueFieldErrors.map((error) => {
                              return (
                                <FormHelperText error key={error}>
                                  {error}
                                </FormHelperText>
                              );
                            })}
                          </Grid>
                        )}
                      </Grid>
                    </PaddedEventEditorCell>
                    {isSetpointUpdateSupported && (
                      <PaddedEventEditorCell>
                        <Field
                          id={`${rtuSetpointIndexFieldName}-input`}
                          name={rtuSetpointIndexFieldName}
                          component={CustomTextField}
                          select
                          SelectProps={{ displayEmpty: true }}
                          disabled={isEventLinked || isEventDisabled}
                        >
                          <MenuItem value="" disabled>
                            <SelectItem />
                          </MenuItem>
                          {setPoints?.map((option, index) => (
                            <MenuItem key={index} value={index}>
                              {option}
                            </MenuItem>
                          ))}
                        </Field>
                      </PaddedEventEditorCell>
                    )}
                    <PaddedEventEditorCell>
                      <Field
                        component={CustomTextField}
                        id={`${hysteresisFieldName}-input`}
                        name={hysteresisFieldName}
                        type="number"
                        // Error messages are shown below instead
                        // helperText=""
                        InputProps={{
                          // readOnly: !canEdit,
                          style: {
                            overflow: 'hidden',
                          },
                        }}
                        disabled={isEventLinked || isEventDisabled}
                      />
                    </PaddedEventEditorCell>
                    {!isAirProductsEnabledDomain && !areAllEventDelaysNull && (
                      <PaddedEventEditorCell>
                        {isEventDelayANumber && (
                          <Grid container alignItems="flex-start" spacing={1}>
                            <Grid item xs={6}>
                              <Grid container spacing={1} alignItems="center">
                                <Grid item xs={6}>
                                  <Field
                                    component={CustomTextField}
                                    fullWidth={false}
                                    id={`${maxDataAgeByHourFieldName}-input`}
                                    name={maxDataAgeByHourFieldName}
                                    disabled={
                                      isDisabled ||
                                      isEventLinked ||
                                      isEventDisabled
                                    }
                                    // NOTE: Without type="number" it causes issues with the
                                    // dirty state. The initial value provided is a number, but
                                    // the onChange would convert it to a string b/c it doesn't
                                    // have type="number".
                                    type="number"
                                    InputProps={{
                                      readOnly: !canEdit,
                                      style: {
                                        overflow: 'hidden',
                                      },
                                    }}
                                    error={hasError}
                                  />
                                </Grid>
                                <Grid item xs={6}>
                                  <StyledSecondaryTextWithHeight>
                                    {t('ui.common.hours', 'Hour(s)')}
                                  </StyledSecondaryTextWithHeight>
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid item xs={6}>
                              <Grid container spacing={1} alignItems="center">
                                <Grid item xs={6}>
                                  <Field
                                    component={CustomTextField}
                                    fullWidth={false}
                                    id={`${maxDataAgeByMinuteFieldName}-input`}
                                    name={maxDataAgeByMinuteFieldName}
                                    disabled={
                                      isDisabled ||
                                      isEventLinked ||
                                      isEventDisabled
                                    }
                                    type="number"
                                    InputProps={{
                                      readOnly: !canEdit,
                                      style: {
                                        overflow: 'hidden',
                                      },
                                    }}
                                    error={hasError}
                                  />
                                </Grid>
                                <Grid item xs={6}>
                                  <StyledSecondaryTextWithHeight>
                                    {t('ui.common.mins', 'Min(s)')}
                                  </StyledSecondaryTextWithHeight>
                                </Grid>
                              </Grid>
                            </Grid>

                            {Array.isArray(anyEventDelayFieldErrors) && (
                              <Grid item xs={12}>
                                {anyEventDelayFieldErrors.map((error) => {
                                  return (
                                    <FormHelperText error key={error}>
                                      {error}
                                    </FormHelperText>
                                  );
                                })}
                              </Grid>
                            )}
                          </Grid>
                        )}
                      </PaddedEventEditorCell>
                    )}

                    <PaddedEventEditorCell>
                      <Grid
                        container
                        alignItems="center"
                        justify="space-between"
                      >
                        <Grid item xs>
                          <Grid container>
                            {inventoryEvent?.rosters?.length ? (
                              inventoryEvent?.rosters
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
                                  eventRule: inventoryEvent,
                                  // NOTE: Using Level, since there is no type for
                                  // inventory events
                                  eventRuleType: EventRuleCategory.Level,
                                  fieldNamePrefix,
                                })
                              }
                              disabled={isEventLinked || isEventDisabled}
                            >
                              <PencilIcon />
                            </IconButton>
                          </Grid>
                        )}
                      </Grid>
                    </PaddedEventEditorCell>

                    <PaddedEventEditorCell align="center">
                      <Field
                        component={CheckboxWithLabel}
                        // For responsiveness to remove the margin when this
                        // field is on its own row and not beside another field
                        // withTopMargin={!isBelowSmBreakpoint}
                        id={`${isGraphedFieldName}-input`}
                        name={isGraphedFieldName}
                        type="checkbox"
                        Label={{
                          style: {
                            display: 'block',
                            margin: 0,
                          },
                        }}
                        disabled={isEventLinked || isEventDisabled}
                      />
                    </PaddedEventEditorCell>
                    <PaddedEventEditorCell align="center">
                      <Field
                        component={CheckboxWithLabel}
                        // For responsiveness to remove the margin when this
                        // field is on its own row and not beside another field
                        // withTopMargin={!isBelowSmBreakpoint}
                        id={`${isSummarizedFieldName}-input`}
                        name={isSummarizedFieldName}
                        type="checkbox"
                        Label={{
                          style: {
                            display: 'block',
                            margin: 0,
                          },
                        }}
                        disabled={isEventLinked || isEventDisabled}
                      />
                    </PaddedEventEditorCell>
                    {isAirProductsEnabledDomain && (
                      <PaddedEventEditorCell align="center">
                        <Field
                          id={`${descriptionAbbreviationFieldName}-input`}
                          name={descriptionAbbreviationFieldName}
                          component={CustomTextField}
                          disabled={isEventLinked || isEventDisabled}
                        />
                      </PaddedEventEditorCell>
                    )}
                    <PaddedEventEditorCell align="center">
                      <Field
                        component={CheckboxWithLabel}
                        // For responsiveness to remove the margin when this
                        // field is on its own row and not beside another field
                        // withTopMargin={!isBelowSmBreakpoint}
                        id={`${isAlwaysTriggeredFieldName}-input`}
                        name={isAlwaysTriggeredFieldName}
                        type="checkbox"
                        Label={{
                          style: {
                            display: 'block',
                            margin: 0,
                          },
                        }}
                        disabled={isEventLinked || isEventDisabled}
                      />
                    </PaddedEventEditorCell>

                    {isAirProductsEnabledDomain && (
                      <>
                        <PaddedEventEditorCell
                          style={{ width: 275, maxWidth: 275 }}
                        >
                          <Field
                            id={`${tagsFieldName}-input`}
                            name={tagsFieldName}
                            component={MultiSelect}
                            select
                            fullWidth
                            options={domainTagsOptions?.map((tag) => tag)}
                            renderValue={(option: string) => {
                              return option || '';
                            }}
                            disabled={isEventLinked || isEventDisabled}
                          />
                        </PaddedEventEditorCell>
                        <PaddedEventEditorCell align="center">
                          <Field
                            component={CheckboxWithLabel}
                            id={`${isAutoCreateProblemReportFieldName}-input`}
                            name={isAutoCreateProblemReportFieldName}
                            type="checkbox"
                            Label={{
                              style: {
                                display: 'block',
                                margin: 0,
                              },
                            }}
                            disabled={isEventLinked || isEventDisabled}
                          />
                        </PaddedEventEditorCell>
                        <PaddedEventEditorCell align="center">
                          <Field
                            component={CheckboxWithLabel}
                            id={`${isAutoCloseProblemReportFieldName}-input`}
                            name={isAutoCloseProblemReportFieldName}
                            type="checkbox"
                            Label={{
                              style: {
                                display: 'block',
                                margin: 0,
                              },
                            }}
                            disabled={isEventLinked || isEventDisabled}
                          />
                        </PaddedEventEditorCell>

                        <PaddedEventEditorCell>
                          <Field
                            id={`${problemReportImportanceLevelIdFieldName}-input`}
                            name={problemReportImportanceLevelIdFieldName}
                            component={CustomTextField}
                            select
                            SelectProps={{ displayEmpty: true }}
                            disabled={isEventLinked || isEventDisabled}
                          >
                            <MenuItem value="" disabled>
                              <SelectItem />
                            </MenuItem>

                            {eventImportanceLevelOptions?.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {renderImportance(option.value)}&nbsp;
                                {option.label}
                              </MenuItem>
                            ))}
                          </Field>
                        </PaddedEventEditorCell>
                      </>
                    )}

                    <PaddedEventEditorCell align="center">
                      <Field
                        id={`${integrationNameFieldName}-input`}
                        name={integrationNameFieldName}
                        component={CustomTextField}
                        disabled={isEventLinked || isEventDisabled}
                      />
                    </PaddedEventEditorCell>
                  </StyledTableRow>
                </>
              );
            })}
          </StyledTableBody>
        </CustomTable>
      </StyledTableContainer>
    </>
  );
};

export default LevelAndInventoryEventsTable;
