import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { defaultTextColor, lightTextColor } from 'styles/colours';
import { defaultFonts } from 'styles/fonts';

export const ActiveText = styled(Typography)`
  font-weight: 500;
  font-size: 15px;
  color: ${defaultTextColor};
`;

export const InactiveText = styled(Typography)`
  font-size: 15px;
  color: ${lightTextColor};
`;

export const StyledOrderedList = styled.ol`
  font-size: 15px;
  padding-left: 19px;
  margin: 0;
  font-family: ${defaultFonts};
  li {
    margin-bottom: ${(props) => props.theme.spacing(1)}px;
    font-family: ${defaultFonts};
  }
`;

export const StyledListItemText = styled(Typography)`
  font-size: 15px;
  color: ${defaultTextColor};
`;

export const StyledIntegrationIdText = styled(Typography)`
  font-size: 12px;
`;

export const TitleText = styled(Typography)`
  font-size: 20px;
  font-weight: 500;
  color: ${defaultTextColor};
`;

export const DisabledText = styled(Typography)`
  font-weight: 500;
  font-size: 16px;
  color: ${defaultTextColor};
  text-align: right;
`;
