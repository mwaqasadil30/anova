/* eslint-disable indent */
import React from 'react';
import styled from 'styled-components';
import MuiTableCell from '@material-ui/core/TableCell';

const TableCell = styled(({ minWidth, dense: _dense, ...rest }) => (
  <MuiTableCell {...rest} />
))`
  padding: 11px 16px;

  ${(props) =>
    props.dense &&
    `
      height: 25px;
      padding: 7px 16px;
  `}

  ${(props) =>
    props.minWidth &&
    `
      min-width: ${props.minWidth};
  `}
`;

export default TableCell;
