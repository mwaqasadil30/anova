import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

const DialogSubtitle = styled(Typography)`
  font-size: 18px;
  font-weight: 500;
  color: ${(props) => props.theme.palette.text.primary};
`;

export default DialogSubtitle;
