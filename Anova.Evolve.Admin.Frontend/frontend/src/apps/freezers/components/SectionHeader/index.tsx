import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

const SectionHeader = styled(Typography)`
  font-size: 14px;
  text-transform: uppercase;
  color: ${(props) => props.theme.palette.text.secondary};
  padding-bottom: 8px;
`;

export default SectionHeader;
