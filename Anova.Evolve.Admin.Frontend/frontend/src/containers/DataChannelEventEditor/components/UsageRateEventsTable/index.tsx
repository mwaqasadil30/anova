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
import { Field, getIn } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getEventImportanceLevelOptions } from 'utils/i18n/enum-to-text';
import { renderImportance } from 'utils/ui/helpers';
import { getIsEventRuleDisabled } from '../../helpers';
import {
  StyledEventDescriptionText,
  StyledSecondaryTextWithHeight,
} from '../../styles';
import { CommonEventTableRowProps } from '../../types';

interface Props extends CommonEventTableRowProps {
  unitsOfMeasureTextMapping: Record<UnitType, string>;
  isAirProductsEnabledDomain: boolean;
  formattedScaledUnitsText?: string | null;
  setPoints: string[];
}

const UsageRateEventsTable = ({
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

  const fieldNamePrefix = `usageRateEvent`;
  const isEnabledFieldName = `${fieldNamePrefix}.isEnabled`;
  const importanceLevelFieldName = `${fieldNamePrefix}.eventImportanceLevelId`;
  const eventValueFieldName = `${fieldNamePrefix}.eventValue`;
  const rtuSetpointIndexFieldName = `${fieldNamePrefix}.rtuChannelSetpointIndex`;
  const minimumReadingPeriodFieldName = `${fieldNamePrefix}.minimumReadingPeriod`;

  const integrationNameFieldName = `${fieldNamePrefix}.integrationName`;

  // Air Products fields
  const isLinkedFieldName = `${fieldNamePrefix}.isLinkedToEventRule`;
  const isAutoCreateProblemReportFieldName = `${fieldNamePrefix}.isAutoCreateProblemReport`;
  const isAutoCloseProblemReportFieldName = `${fieldNamePrefix}.isAutoCloseProblemReport`;
  const tagsFieldName = `${fieldNamePrefix}.tags`;
  const problemReportImportanceLevelIdFieldName = `${fieldNamePrefix}.problemReportImportanceLevelId`;

  const eventValueErrors = getIn(errors, eventValueFieldName);
  const eventValueStatusErrors = getIn(status?.errors, eventValueFieldName);
  const readingPeriodErrors = getIn(errors, minimumReadingPeriodFieldName);
  const readingPeriodStatusErrors = getIn(
    status?.errors,
    minimumReadingPeriodFieldName
  );

  // const unit = getUnitText(
  //   dataChannel?.usageRateEvent?.currentUOMTypeId,
  //   undefined, // Usage rate events have no scaled unit
  //   unitsOfMeasureTextMapping
  // );

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

  const eventImportanceLevelOptions = getEventImportanceLevelOptions(t);

  // const comparatorText =
  //   eventComparatorTypeTextMapping[
  //     dataChannel?.usageRateEvent?.eventComparatorTypeId!
  //   ] || '';

  const hasRosters = !!dataChannel?.usageRateEvent?.rosters?.length;

  const isEventDisabled = !dataChannel?.usageRateEvent?.isEnabled;

  const isSetpointUpdateSupported =
    dataChannel?.usageRateEvent?.isSetpointUpdateSupported;

  return (
    <>
      <IsEventLinkedFormEffect
        isLinked={dataChannel?.usageRateEvent?.isLinkedToEventRule}
        setFieldValue={setFieldValue}
        isEnabledFieldName={isEnabledFieldName}
      />
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
                  minWidth: 135,
                  width: 135,
                }}
              >
                {t('ui.datachanneleventrule.usagerate', 'Usage Rate')}{' '}
                {formattedScaledUnitsText}
              </PaddedHeadCell>

              {isSetpointUpdateSupported && (
                <PaddedHeadCell
                  style={{
                    minWidth: 300,
                    width: 300,
                  }}
                >
                  {t('ui.datachannel.setpoint', 'Set Point')}
                </PaddedHeadCell>
              )}

              <PaddedHeadCell style={{ minWidth: 200, width: 200 }}>
                {t(
                  'ui.datachanneleventrule.minimumreadingperiod',
                  'Minimum Reading Period'
                )}
              </PaddedHeadCell>

              <PaddedHeadCell
                style={{
                  minWidth: hasRosters ? 360 : 150,
                  width: hasRosters ? 360 : 150,
                }}
              >
                {t('ui.events.rosters', 'Roster(s)')}
              </PaddedHeadCell>

              {isAirProductsEnabledDomain && (
                <>
                  <PaddedHeadCell style={{ width: 100 }}>
                    {t('ui.datachanneleventrule.linked', 'Linked')}
                  </PaddedHeadCell>
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
            <StyledTableRow>
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
                  {dataChannel?.usageRateEvent?.description}
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
                <Grid container alignItems="flex-start" spacing={1}>
                  <Grid item xs={12}>
                    {/* <StyledFieldGroup style={{ alignItems: 'flex-start' }}>
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
                            padding: '7px 9px',
                            textAlign: 'center',
                          },
                        }}
                        disabled={isEventDisabled}
                      /> */}

                    <Field
                      component={CustomTextField}
                      id={`${eventValueFieldName}-input`}
                      type="number"
                      name={eventValueFieldName}
                      // disabled={isDisabled}
                      // Error messages are shown below instead
                      helperText=""
                      InputProps={{
                        readOnly: !canEdit,
                        style: {
                          overflow: 'hidden',
                        },
                      }}
                      disabled={isEventDisabled}
                    />
                    {/* </StyledFieldGroup> */}
                  </Grid>
                  {/* This might be needed since the helper function for this is super helpful */}
                  {/* <Grid item xs={3}>
                    <StyledSecondaryTextWithHeight>
                      {unit}
                    </StyledSecondaryTextWithHeight>
                  </Grid> */}
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
              </PaddedEventEditorCell>

              {isSetpointUpdateSupported && (
                <PaddedEventEditorCell>
                  <Field
                    id={`${rtuSetpointIndexFieldName}-input`}
                    name={rtuSetpointIndexFieldName}
                    component={CustomTextField}
                    select
                    disabled={isEventDisabled}
                    style={{ width: '100%' }}
                  >
                    {setPoints?.map((option, index) => (
                      <MenuItem key={index} value={index}>
                        {option}
                      </MenuItem>
                    ))}
                  </Field>
                </PaddedEventEditorCell>
              )}

              <PaddedEventEditorCell>
                <Grid container alignItems="flex-start" spacing={2}>
                  <Grid item xs={12}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={6}>
                        <Field
                          component={CustomTextField}
                          fullWidth={false}
                          id={`${minimumReadingPeriodFieldName}-input`}
                          name={minimumReadingPeriodFieldName}
                          type="number"
                          disabled={isFieldDisabled || isEventDisabled}
                          // Error messages are shown below instead
                          helperText=""
                          InputProps={{
                            readOnly: !canEdit,
                            style: {
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
              </PaddedEventEditorCell>

              <PaddedEventEditorCell>
                <Grid container alignItems="center" justify="space-between">
                  <Grid item xs>
                    <Grid container>
                      {dataChannel?.usageRateEvent?.rosters?.length ? (
                        dataChannel?.usageRateEvent?.rosters
                          .split(',')
                          .map((roster) => {
                            return (
                              <Grid item xs="auto" style={{ paddingRight: 8 }}>
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
                            eventRule: dataChannel?.usageRateEvent!,
                            eventRuleType: EventRuleCategory.UsageRate,
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

              {isAirProductsEnabledDomain && (
                <>
                  <PaddedEventEditorCell style={{ width: 275, maxWidth: 275 }}>
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
                      disabled={isEventDisabled}
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
                      disabled={isEventDisabled}
                    />
                  </PaddedEventEditorCell>

                  <PaddedEventEditorCell>
                    <Field
                      id={`${problemReportImportanceLevelIdFieldName}-input`}
                      name={problemReportImportanceLevelIdFieldName}
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
                          {renderImportance(option.value)}&nbsp;
                          {option.label}
                        </MenuItem>
                      ))}
                    </Field>
                  </PaddedEventEditorCell>
                </>
              )}

              <PaddedEventEditorCell>
                <Field
                  id={`${integrationNameFieldName}-input`}
                  name={integrationNameFieldName}
                  component={CustomTextField}
                  disabled={isEventDisabled}
                />
              </PaddedEventEditorCell>
            </StyledTableRow>
          </StyledTableBody>
        </CustomTable>
      </StyledTableContainer>
    </>
  );
};

export default UsageRateEventsTable;
