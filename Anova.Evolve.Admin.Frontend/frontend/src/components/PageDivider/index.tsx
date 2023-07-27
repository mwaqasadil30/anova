import React from 'react';
import styled from 'styled-components';
import Divider from '@material-ui/core/Divider';

const PageDivider = styled(({ dense: _dense, ...rest }) => (
  <Divider {...rest} />
))`
  margin-left: -32px;
  margin-right: -32px;
  ${(props) => !props.dense && `margin-top: 8px;`}
`;

export default PageDivider;
