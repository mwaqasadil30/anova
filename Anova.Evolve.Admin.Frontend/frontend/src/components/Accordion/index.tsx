import MuiAccordion from '@material-ui/core/Accordion';
import styled from 'styled-components';

const Accordion = styled(MuiAccordion)`
  width: inherit;
  border-radius: ${(props) =>
    `${props.theme.shape.borderRadius}px ${props.theme.shape.borderRadius}px 
    ${props.theme.shape.borderRadius}px ${props.theme.shape.borderRadius}px`};
`;

export default Accordion;
