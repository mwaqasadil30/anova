import styled from 'styled-components';
import Popper from '@material-ui/core/Popper';

const PasswordRequirementsPopper = styled(Popper)`
  /* Width is set based on the anchor element */
  max-width: 90%;
  min-width: 350px;
  /* Make the popper appear on top of the side-nav */
  z-index: ${(props) => props.theme.zIndex.drawer + 1};
`;

export default PasswordRequirementsPopper;
