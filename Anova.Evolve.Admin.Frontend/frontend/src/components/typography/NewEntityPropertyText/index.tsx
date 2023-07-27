import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

const EntityPropertyText = styled(Typography)`
  && {
    font-weight: bold;
    font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
    color: ${(props) => props.theme.palette.text.primary};
    margin-right: 5px;
  }
`;

export default EntityPropertyText;
