import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { EventRuleCategory } from 'api/admin/api';
import { ReactComponent as PencilIcon } from 'assets/icons/pencil.svg';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import TableBodyRow from 'components/tables/components/TableBodyRow';
import TableCell from 'components/tables/components/TableCell';
import { Field, getIn } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyledEventText,
  StyledSecondaryText,
  StyledSecondaryTextWithHeight,
  TableBodyCellForRTUSyncIcon,
} from '../../styles';
import { CommonEventTableRowProps } from '../../types';
import RTUSyncIcon from '../RTUSyncIcon';

interface Props extends CommonEventTableRowProps {}

const MissingDataEventsTableBodyRow = ({
  hasIntegrationId,
  dataChannel,
  errors,
  status,
  canEdit,
  openRostersDrawer,
}: Props) => {
  const { t } = useTranslation();

  const fieldNamePrefix = `missingDataEvent`;
  const eventValueFieldName = `${fieldNamePrefix}.eventValue`;
  const maxDataAgeByHourFieldName = `${fieldNamePrefix}.maxDataAgeByHour`;
  const maxDataAgeByMinuteFieldName = `${fieldNamePrefix}.maxDataAgeByMinute`;
  const integrationNameFieldName = `${fieldNamePrefix}.integrationName`;

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

  return (
    <TableBodyRow>
      <TableBodyCellForRTUSyncIcon>
        {/* Only show the RTUSyncIcon if it's linked to an event rule */}
        {dataChannel?.missingDataEvent?.isLinkedToEventRule && (
          <RTUSyncIcon
            isLinkedToEventRule={
              dataChannel?.missingDataEvent?.isLinkedToEventRule
            }
          />
        )}
      </TableBodyCellForRTUSyncIcon>
      <TableCell>
        <StyledEventText>
          {dataChannel?.missingDataEvent?.description}
        </StyledEventText>
      </TableCell>
      <TableCell>
        <Grid container alignItems="flex-start" spacing={1}>
          <Grid item xs={6}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Field
                  component={CustomTextField}
                  fullWidth={false}
                  id={`${maxDataAgeByHourFieldName}-input`}
                  name={maxDataAgeByHourFieldName}
                  disabled={isDisabled}
                  // NOTE: Without type="number" it causes issues with the
                  // dirty state. The initial value provided is a number, but
                  // the onChange would convert it to a string b/c it doesn't
                  // have type="number".
                  type="number"
                  InputProps={{
                    readOnly: !canEdit,
                    style: {
                      height: 40,
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
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Field
                  component={CustomTextField}
                  fullWidth={false}
                  id={`${maxDataAgeByMinuteFieldName}-input`}
                  name={maxDataAgeByMinuteFieldName}
                  disabled={isDisabled}
                  type="number"
                  InputProps={{
                    readOnly: !canEdit,
                    style: {
                      height: 40,
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
      </TableCell>
      <TableCell>
        <Grid container spacing={1} alignItems="center" justify="space-between">
          <Grid item xs>
            <StyledSecondaryText>
              {dataChannel?.missingDataEvent?.rosters || (
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
                    eventRule: dataChannel?.missingDataEvent!,
                    eventRuleType: EventRuleCategory.MissingData,
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

export default MissingDataEventsTableBodyRow;
