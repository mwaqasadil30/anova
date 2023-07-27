/* eslint-disable indent */
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import TextField from 'components/forms/styled-fields/StyledTextField';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableBodyRow from 'components/tables/components/TableBodyRow';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import TableHeadRow from 'components/tables/components/TableHeadRow';
import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  getTankDimensionUnitsOfMeasureOptions,
  getUnitsOfVolumeOptions,
} from 'utils/i18n/enum-to-text';

const HalfWidthTableHeadCell = styled(TableHeadCell)`
  width: 50%;
`;

const TableCellWithField = styled(TableCell)`
  vertical-align: top;
`;

const StyledTableBody = styled(TableBody)`
  & > tr > td:not(:last-child),
  & .MuiTableRow-root > .MuiTableCell-body:not(:last-child) {
    ${(props) =>
      props.theme.palette.type === 'dark' && `border-right: 1px solid #525252;`}
  }

  & > tr:not(:last-child) > td,
  & .MuiTableRow-root:not(:last-child) > .MuiTableCell-body {
    ${(props) =>
      props.theme.palette.type === 'dark' &&
      `border-bottom: 1px solid #525252;`};
  }
`;

const StyledTextField = styled(TextField)`
  & .MuiInput-root {
    height: 44px;
    border: 0;
    border-radius: 0;
  }
  & .MuiInput-root.Mui-focused,
  & .MuiInput-root:hover {
    border: 0;
  }

  & .MuiFormHelperText-root {
    margin-left: 8px;
  }
`;

const makeData = (rowCount: number) => {
  return [...Array(rowCount)].map((_, i) => ({
    level: i,
    volume: i,
  }));
};
const tableData = makeData(20);

const StrappingPointsTable = () => {
  const { t } = useTranslation();

  const unitsOfMeasureOptions = getTankDimensionUnitsOfMeasureOptions(t);
  const unitsOfVolumeOptions = getUnitsOfVolumeOptions(t);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableHeadRow>
            <HalfWidthTableHeadCell>
              <Grid container alignItems="center" justify="space-between">
                <Grid item>{t('ui.tankdimension.level', 'Level')}</Grid>
                <Grid item style={{ textTransform: 'none' }}>
                  <Field
                    component={CustomTextField}
                    select
                    name="strappingLevelUnits"
                    style={{ minWidth: 140 }}
                  >
                    {unitsOfMeasureOptions?.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>
              </Grid>
            </HalfWidthTableHeadCell>
            <HalfWidthTableHeadCell>
              <Grid container alignItems="center" justify="space-between">
                <Grid item>{t('ui.tankdimension.volume', 'Volume')}</Grid>
                <Grid item style={{ textTransform: 'none' }}>
                  <Field
                    component={CustomTextField}
                    select
                    name="strappingVolumeUnits"
                    style={{ minWidth: 140 }}
                  >
                    {unitsOfVolumeOptions?.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>
              </Grid>
            </HalfWidthTableHeadCell>
          </TableHeadRow>
        </TableHead>
        <StyledTableBody>
          {tableData.map((_, index) => (
            <TableBodyRow style={{ height: 44 }} key={index}>
              <TableCellWithField padding="none">
                <Field
                  component={CustomTextField}
                  type="number"
                  TextFieldComponent={StyledTextField}
                  name={`tankStrappings[${index}].height`}
                />
              </TableCellWithField>
              <TableCellWithField padding="none">
                <Field
                  component={CustomTextField}
                  type="number"
                  TextFieldComponent={StyledTextField}
                  name={`tankStrappings[${index}].volume`}
                />
              </TableCellWithField>
            </TableBodyRow>
          ))}
        </StyledTableBody>
      </Table>
    </TableContainer>
  );
};

export default StrappingPointsTable;
