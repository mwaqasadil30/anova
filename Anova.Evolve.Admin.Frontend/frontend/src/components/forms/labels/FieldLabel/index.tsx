import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

const FieldLabel = styled(Typography)`
  color: ${(props) => props.theme.palette.text.primary};
  && {
    font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
    font-weight: 500;
    line-height: 1.2;
  }
`;

export default FieldLabel;
