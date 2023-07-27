import styled from 'styled-components';
import TableRow from '@material-ui/core/TableRow';

const TableGroupedRow = styled(TableRow).attrs(() => ({
  row: 'rowgroup',
}))`
  background: ${(props) =>
    props.theme.palette.type === 'light'
      ? '#DBDBDB'
      : 'linear-gradient(0deg, #474747, #474747), #666666'};
`;

export default TableGroupedRow;
