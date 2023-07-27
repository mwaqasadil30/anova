import React from 'react';
import styled from 'styled-components';
import MuiTableCell, { TableCellProps } from '@material-ui/core/TableCell';

const StyledTableCell = styled(MuiTableCell)`
  && {
    text-align: center;
    height: 200px;
    border-bottom: 0;
  }
`;

const TableCellMessage = (props: TableCellProps) => {
  return <StyledTableCell {...props} />;
};

export default TableCellMessage;
