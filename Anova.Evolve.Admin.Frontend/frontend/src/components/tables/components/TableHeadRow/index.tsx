import React from 'react';
import styled from 'styled-components';
import MuiTableRow, { TableRowProps } from '@material-ui/core/TableRow';

const StyledTableRow = styled(MuiTableRow)`
  height: 40px;
`;

const TableHeadRow = (props: TableRowProps) => {
  return <StyledTableRow {...props} />;
};

export default TableHeadRow;
