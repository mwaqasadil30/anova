import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import { entityDetailBorderColor } from 'styles/colours';

const EntityDetailsBox = styled(Box)`
  border: 1px solid ${entityDetailBorderColor};
  padding: 16px 16px;
`;

export default EntityDetailsBox;
