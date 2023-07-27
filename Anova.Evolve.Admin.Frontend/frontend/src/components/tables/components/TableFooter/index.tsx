import MuiTableFooter, {
  TableFooterProps,
} from '@material-ui/core/TableFooter';
import { commonTableHeadAndFooterStyles } from 'components/tables/components/styles';
import React from 'react';
import styled from 'styled-components';

const StyledTableFooter = styled(MuiTableFooter)`
  ${commonTableHeadAndFooterStyles}
`;

const TableFooter = (props: TableFooterProps) => {
  return <StyledTableFooter {...props} />;
};

export default TableFooter;
