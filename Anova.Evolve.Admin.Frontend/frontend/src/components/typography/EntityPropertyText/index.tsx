import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

const EntityPropertyText = styled(Typography)`
  && {
    font-size: 14px;
    color: ${(props) => props.theme.palette.text.secondary};
  }
`;

export default EntityPropertyText;
