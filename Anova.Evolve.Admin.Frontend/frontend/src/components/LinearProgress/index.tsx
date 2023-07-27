import MuiLinearProgress from '@material-ui/core/LinearProgress';
import { darken } from '@material-ui/core/styles';
import styled from 'styled-components';

const LinearProgress = styled(MuiLinearProgress)`
  &.MuiLinearProgress-colorPrimary {
    background-color: ${(props) => darken(props.theme.custom.domainColor, 0.1)};
  }

  & .MuiLinearProgress-barColorPrimary {
    background-color: ${(props) => props.theme.custom.domainColor};
  }
`;

export default LinearProgress;
