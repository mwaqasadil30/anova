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
import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { boxBackgroundGrey } from 'styles/colours';
import { getEventImportanceLevelOptions } from 'utils/i18n/enum-to-text';
import { renderImportance } from 'utils/ui/helpers';

const StyledTableCell = styled(TableCell)`
  width: 165px;
  background-color: ${boxBackgroundGrey};
`;

interface Props {
  index: number;
}

const MissingDataEventRuleBox = ({ index }: Props) => {
  const { t } = useTranslation();

  const eventImportanceLevelOptions = getEventImportanceLevelOptions(t);

  return (
    <TableContainer>
      <Table>
        <TableBody>
          <TableBodyRow>
            <StyledTableCell>
              {t('ui.datachanneleventrule.importance', 'Importance')}
            </StyledTableCell>
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
          </TableBodyRow>
          <TableBodyRow>
            <StyledTableCell>
              {t('ui.datachanneleventrule.maxdataage', 'Max Data Age')} (hh:mm)
            </StyledTableCell>
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
          </TableBodyRow>
          <TableBodyRow>
            <StyledTableCell>
              {t('ui.datachanneleventrule.integrationid', 'Integration ID')}
            </StyledTableCell>
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
