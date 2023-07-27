import Typography from '@material-ui/core/Typography';
import CustomBox from 'components/CustomBox';
import styled from 'styled-components';
import { defaultTextColor } from 'styles/colours';

export const StyledCalibrationDetailsBox = styled(CustomBox)`
  height: calc(100% - 48px);
`;

export const CalibrationDetailsHeader = styled(Typography)`
  font-size: 16px;
  font-weight: 600;
  color: ${defaultTextColor};
  margin-bottom: ${(props) => props.theme.spacing(3)}px;
`;
