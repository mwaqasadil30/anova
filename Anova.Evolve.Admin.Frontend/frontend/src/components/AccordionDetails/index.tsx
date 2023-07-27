import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import styled from 'styled-components';

const AccordionDetails = styled(MuiAccordionDetails)`
  padding: ${(props) => props.theme.spacing(2)}px;
`;

export default AccordionDetails;
