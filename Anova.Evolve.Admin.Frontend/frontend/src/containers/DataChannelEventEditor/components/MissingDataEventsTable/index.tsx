import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import TableRow from '@material-ui/core/TableRow';
import { EventRuleCategory } from 'api/admin/api';
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
import {
  StyledEventDescriptionText,
  StyledSecondaryTextWithHeight,
} from '../../styles';
import { CommonEventTableRowProps } from '../../types';

interface Props extends CommonEventTableRowProps {
  isAirProductsEnabledDomain: boolean;
}

const MissingDataEventsTable = ({
  isAirProductsEnabledDomain,
  dataChannel,
  errors,
  status,
  canEdit,
  domainTagsOptions,
  openRostersDrawer,
  setFieldValue,
}: Props) => {
  const { t } = useTranslation();

  const fieldNamePrefix = `missingDataEvent`;
  const isEnabledFieldName = `${fieldNamePrefix}.isEnabled`;
  const importanceLevelFieldName = `${fieldNamePrefix}.eventImportanceLevelId`;
  const eventValueFieldName = `${fieldNamePrefix}.eventValue`;
  const maxDataAgeByHourFieldName = `${fieldNamePrefix}.maxDataAgeByHour`;
  const maxDataAgeByMinuteFieldName = `${fieldNamePrefix}.maxDataAgeByMinute`;
  const integrationNameFieldName = `${fieldNamePrefix}.integrationName`;

  // Air Products fields
  const isLinkedFieldName = `${fieldNamePrefix}.isLinkedToEventRule`;
  const isAutoCreateProblemReportFieldName = `${fieldNamePrefix}.isAutoCreateProblemReport`;
  const isAutoCloseProblemReportFieldName = `${fieldNamePrefix}.isAutoCloseProblemReport`;
  const tagsFieldName = `${fieldNamePrefix}.tags`;
  const problemReportImportanceLevelIdFieldName = `${fieldNamePrefix}.problemReportImportanceLevelId`;

  const fieldErrors = getIn(errors, eventValueFieldName);
  const fieldStatusErrors = getIn(status?.errors, eventValueFieldName);

  let anyFieldErrors = null;
  if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
    anyFieldErrors = fieldErrors;
  } else if (Array.isArray(fieldStatusErrors) && fieldStatusErrors.length > 0) {
    anyFieldErrors = fieldStatusErrors;
  }
  const hasError = Array.isArray(anyFieldErrors) && anyFieldErrors.length > 0;

  const isDisabled = dataChannel?.missingDataEvent?.isLinkedToEventRule;

  const eventImportanceLevelOptions = getEventImportanceLevelOptions(t);

  const hasRosters = !!dataChannel?.missingDataEvent?.rosters?.length;

  const isEventLinked = dataChannel?.missingDataEvent?.isLinkedToEventRule;
  const isEventDisabled = !dataChannel?.missingDataEvent?.isEnabled;

  return (
    <>
      <IsEventLinkedFormEffect
        isLinked={dataChannel?.missingDataEvent?.isLinkedToEventRule}
        isEnabledFieldName={isEnabledFieldName}
        setFieldValue={setFieldValue}
      />
      <StyledTableContainer
        style={{ maxWidth: isAirProductsEnabledDomain ? 'inherit' : 1700 }}
      >
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
                  minWidth: 300,
                  width: 300,
                }}
              >
                {t('ui.datachanneleventrule.maxdataage', 'Max Data Age')}
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
                  {dataChannel?.missingDataEvent?.description}
                </StyledEventDescriptionText>
              </PaddedEventEditorCell>

              <PaddedEventEditorCell>
                <Field
                  id={`${importanceLevelFieldName}-input`}
                  name={importanceLevelFieldName}
                  component={CustomTextField}
                  select
                  SelectProps={{ displayEmpty: true }}
                  disabled={
                    isEventLinked ||
                    (!isAirProductsEnabledDomain && isEventDisabled)
                  }
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
                            (!isAirProductsEnabledDomain && isEventDisabled)
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
                            (!isAirProductsEnabledDomain && isEventDisabled)
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
              </PaddedEventEditorCell>
              <PaddedEventEditorCell>
                <Grid container alignItems="center" justify="space-between">
                  <Grid item xs>
                    <Grid container>
                      {dataChannel?.missingDataEvent?.rosters?.length ? (
                        dataChannel?.missingDataEvent?.rosters
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
                            eventRule: dataChannel?.missingDataEvent!,
                            eventRuleType: EventRuleCategory.MissingData,
                            fieldNamePrefix,
                          })
                        }
                        disabled={
                          isEventLinked ||
                          (!isAirProductsEnabledDomain && isEventDisabled)
                        }
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
                      disabled={
                        isEventLinked ||
                        (!isAirProductsEnabledDomain && isEventDisabled)
                      }
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
                      disabled={
                        isEventLinked ||
                        (!isAirProductsEnabledDomain && isEventDisabled)
                      }
                    />
                  </PaddedEventEditorCell>

                  <PaddedEventEditorCell>
                    <Field
                      id={`${problemReportImportanceLevelIdFieldName}-input`}
                      name={problemReportImportanceLevelIdFieldName}
                      component={CustomTextField}
                      select
                      SelectProps={{ displayEmpty: true }}
                      disabled={
                        isEventLinked ||
                        (!isAirProductsEnabledDomain && isEventDisabled)
                      }
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
                </>
              )}

              <PaddedEventEditorCell>
                <Field
                  id={`${integrationNameFieldName}-input`}
                  name={integrationNameFieldName}
                  component={CustomTextField}
                  disabled={
                    isEventLinked ||
                    (!isAirProductsEnabledDomain && isEventDisabled)
                  }
                />
              </PaddedEventEditorCell>
            </StyledTableRow>
          </StyledTableBody>
        </CustomTable>
      </StyledTableContainer>
    </>
  );
};

export default MissingDataEventsTable;
