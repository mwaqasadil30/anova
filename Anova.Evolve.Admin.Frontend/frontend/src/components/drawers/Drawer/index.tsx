import styled from 'styled-components';
import MuiDrawer from '@material-ui/core/Drawer';

const Drawer = styled(MuiDrawer)`
  & .MuiDrawer-paper {
    background: ${(props) => props.theme.palette.background.default};
  }
`;

export default Drawer;
