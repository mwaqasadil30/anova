import Box from '@material-ui/core/Box';
import styled from 'styled-components';

const DialogContent = styled(Box)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

export default DialogContent;
