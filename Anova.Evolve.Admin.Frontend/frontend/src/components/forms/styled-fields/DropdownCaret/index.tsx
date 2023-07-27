import { ReactComponent as DropdownCaretIcon } from 'assets/icons/dropdown-caret.svg';
import styled from 'styled-components';

const DropdownCaret = styled(DropdownCaretIcon)`
  color: ${(props) => props.theme.palette.text.secondary};
`;

export default DropdownCaret;
