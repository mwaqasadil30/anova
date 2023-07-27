import React from 'react';
import styled from 'styled-components';
import MuiMenu, { MenuProps } from '@material-ui/core/Menu';

const StyledMenu = styled((props) => (
  <MuiMenu
    {...props}
    PaperProps={{
      square: true,
      ...props.PaperProps,
    }}
  />
))``;

const Menu = (props: MenuProps) => {
  return <StyledMenu {...props} />;
};

export default Menu;
