import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import { EvolveRtuChannelSetPoint } from 'api/admin/api';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableBodyRow from 'components/tables/components/TableBodyRow';
import TableCell from 'components/tables/components/TableCell';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import TableHeadRow from 'components/tables/components/TableHeadRow';
import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  eventComparatorTypeTextMapping,
  getEventImportanceLevelOptions,
} from 'utils/i18n/enum-to-text';
import { getLabelWithUnits, renderImportance } from 'utils/ui/helpers';
import { DCEditorEventRule } from '../../ObjectForm/types';

interface Props {
  index: number;
  eventRule: DCEditorEventRule;
  displayUnitsText: string;
  setPoints?: EvolveRtuChannelSetPoint[] | null;
}

const UsageRateRuleBox = ({
  index,
  eventRule,
  displayUnitsText,
  setPoints,
}: Props) => {
  const { t } = useTranslation();

  const eventImportanceLevelOptions = getEventImportanceLevelOptions(t);

  const eventComparatorType =
    eventComparatorTypeTextMapping[eventRule.eventComparator!];

  return (
    <TableContainer>
      <Table style={{ minWidth: 800 }}>
        <TableHead>
          <TableHeadRow>
            <TableHeadCell style={{ minWidth: 191 }}>
              {t('ui.datachanneleventrule.importance', 'Importance')}
            </TableHeadCell>
            <TableHeadCell style={{ minWidth: 155 }}>
              {getLabelWithUnits(
                t('ui.datachanneleventrule.usagerate', 'Usage Rate'),
                displayUnitsText
              )}
            </TableHeadCell>
            <TableHeadCell style={{ minWidth: 138 }}>
              {t('ui.datachanneleventrule.setpoint', 'Set Point')}
            </TableHeadCell>

            <TableHeadCell style={{ minWidth: 173 }}>
              {t(
                'ui.datachanneleventrule.minimumreadingperiod',
                'Minimum Reading Period'
              )}{' '}
              (hh:mm)
            </TableHeadCell>
            <TableHeadCell style={{ minWidth: 217 }}>
              {t('ui.datachanneleventrule.integrationid', 'Integration ID')}
            </TableHeadCell>
          </TableHeadRow>
        </TableHead>
        <TableBody>
          <TableBodyRow>
            <TableCell>
              <Field
                id={`usageRateEventRules.${index}.importanceLevel-input`}
                name={`usageRateEventRules.${index}.importanceLevel`}
                component={CustomTextField}
                select
                SelectProps={{ displayEmpty: true }}
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
            </TableCell>
            <TableCell>
              <Field
                id={`usageRateEventRules.${index}.usageRate-input`}
                name={`usageRateEventRules.${index}.usageRate`}
                type="number"
                component={CustomTextField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      aria-label="Event comparator"
                    >
                      {eventComparatorType}
                    </InputAdornment>
                  ),
                }}
              />
            </TableCell>
            <TableCell>
              <Field
                id={`usageRateEventRules.${index}.setPoint-input`}
                name={`usageRateEventRules.${index}.setPoint`}
                component={CustomTextField}
                select
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem value="" disabled>
                  <SelectItem />
                </MenuItem>

                {setPoints?.map((setPoint) => (
                  <MenuItem
                    key={setPoint.setPointIndex}
                    value={setPoint.setPointIndex}
                  >
                    {setPoint.setPointIndex}
                  </MenuItem>
                ))}
              </Field>
            </TableCell>

            <TableCell>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Field
                    id={`usageRateEventRules.${index}.hours-input`}
                    name={`usageRateEventRules.${index}.hours`}
                    type="number"
                    component={CustomTextField}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">h</InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Field
                    id={`usageRateEventRules.${index}.minutes-input`}
                    name={`usageRateEventRules.${index}.minutes`}
                    type="number"
                    component={CustomTextField}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">m</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </TableCell>
            <TableCell aria-label="Integration ID">
              <Field
                id={`usageRateEventRules.${index}.integrationId-input`}
                name={`usageRateEventRules.${index}.integrationId`}
                component={CustomTextField}
              />
            </TableCell>
          </TableBodyRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UsageRateRuleBox;
