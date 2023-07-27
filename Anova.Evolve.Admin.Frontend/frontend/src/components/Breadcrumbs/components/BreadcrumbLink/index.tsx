/* eslint-disable indent */
import MuiLink from '@material-ui/core/Link';
import React from 'react';
import styled from 'styled-components';

const BreadcrumbLink = styled(({ active: _active, ...props }) => (
  <MuiLink {...props} />
))`
  && {
    font-size: 14px;
    font-weight: 500;
    color: ${(props) =>
      props.active
        ? props.theme.palette.text.primary
        : props.theme.palette.text.secondary};
  }
`;

export default BreadcrumbLink;
