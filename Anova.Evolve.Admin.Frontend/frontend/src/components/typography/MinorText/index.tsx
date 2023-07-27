import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

const MinorText = styled(Typography)`
  color: ${(props) => props.theme.palette.text.primary};
  && {
    font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
    font-weight: normal;
  }
`;

export default MinorText;
