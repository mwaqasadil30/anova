import ListSubheader from '@material-ui/core/ListSubheader';
import styled from 'styled-components';

const StyledListSubheader = styled(ListSubheader)`
  color: ${(props) => props.theme.palette.text.primary};
  background: ${(props) =>
    props.theme.palette.type === 'light' ? '#f9f9f9' : '#1d1d1d'};
  border-top: 1px solid ${(props) => props.theme.palette.divider};
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
  /*
    Prevent clicking on the list subheader so it doesn't select the empty
    option
  */
  pointer-events: none;
`;

export default StyledListSubheader;
