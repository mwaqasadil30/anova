import MuiTableContainer, {
  TableContainerProps,
} from '@material-ui/core/TableContainer';
import styled from 'styled-components';

export type { TableContainerProps };

const TableContainer = styled(MuiTableContainer)`
  background: ${(props) => props.theme.palette.background.paper};
  border-radius: ${(props) => props.theme.shape.borderRadius}px;
  box-shadow: ${(props) =>
    props.theme.palette.type === 'light' &&
    '0px 3px 10px rgba(159, 178, 189, 0.2)'};
`;

export default TableContainer;
