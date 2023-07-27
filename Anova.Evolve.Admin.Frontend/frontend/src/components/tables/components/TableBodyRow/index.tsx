import React from 'react';
import styled from 'styled-components';
import MuiTableRow from '@material-ui/core/TableRow';
import { gray100 } from 'styles/colours';

const TableBodyRow = styled(({ grayBackground: _grayBackground, ...rest }) => (
  <MuiTableRow {...rest} />
))`
  height: 50px;

  ${(props) => props.grayBackground && `background: ${gray100}`};
`;

export default TableBodyRow;
