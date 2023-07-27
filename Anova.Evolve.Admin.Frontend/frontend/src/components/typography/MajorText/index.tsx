import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

const MajorText = styled(Typography)`
  && {
    font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
    font-weight: 500;
  }
`;

export default MajorText;
