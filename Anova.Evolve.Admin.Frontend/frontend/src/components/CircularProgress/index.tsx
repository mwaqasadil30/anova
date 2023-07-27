import MuiCircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';

const CircularProgress = styled(MuiCircularProgress)`
  color: ${(props) => props.theme.custom.domainColor};

  && {
    @keyframes MuiCircularProgress-keyframes-circular-rotate {
      /*
        NOTE: The 0% keyframe was removed b/c it was causing the loading
        spinner to completely freeze on Chrome. There doesn't seem to be an
        open issue for it.
        This was added in @material-ui/core v4.10.1 (a patch version) to fix an
        issue in IE 11. It seems like it'll be removed in material UI v5, in
        which case this custom keyframe styling can be removed.
        https://github.com/mui-org/material-ui/blob/v4.10.1/packages/material-ui/src/CircularProgress/CircularProgress.js#L68-L71
      */
      100% {
        transform: rotate(360deg);
      }
    }
  }
`;

export default CircularProgress;
