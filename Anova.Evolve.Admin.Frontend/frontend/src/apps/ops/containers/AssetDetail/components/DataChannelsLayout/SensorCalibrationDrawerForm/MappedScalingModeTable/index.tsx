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
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { gray50 } from 'styles/colours';

const HalfWidthTableHeadCell = styled(TableHeadCell)`
  width: 50%;
`;

const TableCellWithField = styled(TableCell)`
  background: ${gray50};
  vertical-align: top;
`;

const StyledTextField = styled(TextField)`
  & .MuiInput-root {
    height: 32px;
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

const MappedScalingModeTable = () => {
  const { t } = useTranslation();

  const tableData = useMemo(() => Array(20).fill(0), []);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableHeadRow>
            <HalfWidthTableHeadCell>
              {t('ui.datachannel.raw', 'Raw')}
              {/* TODO: Add raw unit */}
            </HalfWidthTableHeadCell>
            <HalfWidthTableHeadCell>
              {t('ui.datachannel.scaled', 'Scaled')}
              {/* TODO: Add scaled unit */}
            </HalfWidthTableHeadCell>
          </TableHeadRow>
        </TableHead>
        <TableBody>
          {tableData.map((_, index) => (
            <TableBodyRow style={{ height: 32 }} key={index}>
              <TableCellWithField padding="none">
                <Field
                  component={CustomTextField}
                  type="number"
                  TextFieldComponent={StyledTextField}
                  name={`mappedValues[${index}].raw`}
                />
              </TableCellWithField>
              <TableCellWithField padding="none">
                <Field
                  component={CustomTextField}
                  type="number"
                  TextFieldComponent={StyledTextField}
                  name={`mappedValues[${index}].scaled`}
                />
              </TableCellWithField>
            </TableBodyRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MappedScalingModeTable;
