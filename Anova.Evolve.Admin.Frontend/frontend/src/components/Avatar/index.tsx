import styled from 'styled-components';
import Avatar from '@material-ui/core/Avatar';
import { getCustomDomainContrastText } from 'styles/colours';

/* eslint-disable indent */
const StyledAvatar = styled(Avatar)`
  && {
    background-color: ${(props) => props.theme.custom.domainColor};
    color: ${(props) =>
      getCustomDomainContrastText(props.theme.custom.domainColor)};
    width: 32px;
    height: 32px;
    font-size: 18px;
    font-weight: 500;
  }
`;

export default StyledAvatar;
