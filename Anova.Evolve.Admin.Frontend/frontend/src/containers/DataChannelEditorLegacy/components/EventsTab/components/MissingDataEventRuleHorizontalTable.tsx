import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
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
import { getEventImportanceLevelOptions } from 'utils/i18n/enum-to-text';
import { renderImportance } from 'utils/ui/helpers';

interface Props {
  index: number;
}

const MissingDataEventRuleBox = ({ index }: Props) => {
  const { t } = useTranslation();

  const eventImportanceLevelOptions = getEventImportanceLevelOptions(t);

  return (
    <TableContainer>
      <Table style={{ minWidth: 800 }}>
        <TableHead>
          <TableHeadRow>
            <TableHeadCell style={{ width: '33%' }}>
              {t('ui.datachanneleventrule.importance', 'Importance')}
            </TableHeadCell>
            <TableHeadCell style={{ width: '33%' }}>
              {t('ui.datachanneleventrule.maxdataage', 'Max Data Age')} (hh:mm)
            </TableHeadCell>
            <TableHeadCell style={{ width: '33%' }}>
              {t('ui.datachanneleventrule.integrationid', 'Integration ID')}
            </TableHeadCell>
          </TableHeadRow>
        </TableHead>
        <TableBody>
          <TableBodyRow>
            <TableCell>
              <Field
                id={`missingDataEventRules.${index}.importanceLevel-input`}
                name={`missingDataEventRules.${index}.importanceLevel`}
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
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Field
                    id={`missingDataEventRules.${index}.hours-input`}
                    name={`missingDataEventRules.${index}.hours`}
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
                    id={`missingDataEventRules.${index}.minutes-input`}
                    name={`missingDataEventRules.${index}.minutes`}
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

            <TableCell>
              <Field
                id={`missingDataEventRules.${index}.integrationId-input`}
                name={`missingDataEventRules.${index}.integrationId`}
                component={CustomTextField}
              />
            </TableCell>
          </TableBodyRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MissingDataEventRuleBox;
