import MuiTable, { TableProps } from '@material-ui/core/Table';
import React from 'react';
import styled from 'styled-components';

export type { TableProps };

const StyledTable = styled(MuiTable)`
  && {
    border-radius: ${(props) => props.theme.shape.borderRadius}px;
    border-collapse: separate;
  }

  & thead,
  & .MuiTableHead-root {
    border-top-left-radius: ${(props) => props.theme.shape.borderRadius}px;
    border-top-left-radius: ${(props) => props.theme.shape.borderRadius}px;
  }

  & thead > tr > th:first-of-type,
  & .MuiTableHead-root > .MuiTableRow-head > .MuiTableCell-head:first-of-type {
    border-top-left-radius: ${(props) => props.theme.shape.borderRadius}px;
  }

  & thead > tr > th:last-of-type,
  & .MuiTableHead-root > .MuiTableRow-head > .MuiTableCell-head:last-of-type {
    border-top-right-radius: ${(props) => props.theme.shape.borderRadius}px;
  }
`;

const Table = (props: TableProps) => {
  return <StyledTable {...props} />;
};

export default Table;
