import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { white } from 'styles/colours';

const ComponentTitle = styled(Typography)`
  color: ${white};
  && {
    font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
    font-weight: 500;
  }
`;

export default ComponentTitle;
