import TableCell from 'components/tables/components/TableCell';
import styled from 'styled-components';
import { commonTableHeadAndFooterCellStyles } from '../styles';

const TableFooterCell = styled(TableCell)`
  ${commonTableHeadAndFooterCellStyles}
  background-color: ${(props) =>
    props.theme.custom.palette.table.footerCellBackgroundColor};
  border-top: 1px solid
    ${(props) => props.theme.custom.palette.table.borderColor};
`;

export default TableFooterCell;
