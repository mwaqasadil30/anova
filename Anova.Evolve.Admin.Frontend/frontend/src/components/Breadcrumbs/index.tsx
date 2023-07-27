/* eslint-disable indent */
import MuiBreadcrumbs from '@material-ui/core/Breadcrumbs';
import styled from 'styled-components';
import { getCustomDomainContrastText } from 'styles/colours';

const Breadcrumbs = styled(MuiBreadcrumbs)`
  && [class*='MuiBreadcrumbs-separator'] {
    color: ${(props) =>
      props.theme.palette.type === 'light'
        ? getCustomDomainContrastText(props.theme.custom.domainColor)
        : props.theme.palette.text.primary};
  }
`;

export default Breadcrumbs;
