import CircularProgress from 'components/CircularProgress';
import styled from 'styled-components';

export const CenteredCircularProgress = styled(CircularProgress)`
  position: absolute;
  top: calc(50% - 30px);
  left: calc(50% - 30px);
`;
