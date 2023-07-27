import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

const BoldPrimaryText = styled(Typography)`
  && {
    font-weight: 500;
    font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
    line-height: 16px;
    color: ${(props) => props.theme.palette.text.primary};
  }
`;

export default BoldPrimaryText;
