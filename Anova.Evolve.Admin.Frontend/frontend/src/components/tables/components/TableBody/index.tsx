/* eslint-disable indent */
import { lighten } from '@material-ui/core/styles';
import MuiTableBody, { TableBodyProps } from '@material-ui/core/TableBody';
import React from 'react';
import styled from 'styled-components';

const StyledTableBody = styled(MuiTableBody)`
  background: ${(props) => props.theme.palette.background.paper};

  & > tr:last-child > td,
  & > .MuiTableRow-root:last-child > .MuiTableCell-body {
    border-bottom: 0;
  }

  & > tr > td:not(:last-child),
  & .MuiTableRow-root > .MuiTableCell-body:not(:last-child) {
    border-right: 1px solid
      ${(props) => props.theme.custom.palette.table.borderColor};
  }

  & > tr:not(:last-child) > td,
  & .MuiTableRow-root:not(:last-child) > .MuiTableCell-body {
    border-bottom: 1px solid
      ${(props) => props.theme.custom.palette.table.borderColor};
  }

  & > tr:hover,
  & .MuiTableRow-root:hover {
    background-color: ${(props) =>
      props.theme.palette.type === 'light'
        ? lighten(props.theme.custom.domainColor, 0.83)
        : props.theme.custom.palette.table.rowHoverColor};
  }
`;

const TableBody = (props: TableBodyProps) => {
  return <StyledTableBody {...props} />;
};

export default TableBody;
