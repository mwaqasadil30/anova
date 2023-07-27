import MuiTableHead, { TableHeadProps } from '@material-ui/core/TableHead';
import React from 'react';
import styled from 'styled-components';
import { commonTableHeadAndFooterStyles } from '../styles';

const StyledTableHead = styled(MuiTableHead)`
  ${commonTableHeadAndFooterStyles}
`;

const TableHead = (props: TableHeadProps) => {
  return <StyledTableHead {...props} />;
};

export default TableHead;
