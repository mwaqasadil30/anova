import MuiIconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import styled from 'styled-components';

const StyledCloseButtonIcon = styled(MuiIconButton)`
  padding: 0;
  & svg {
    width: 30px;
    height: 30px;
  }
`;

const CloseButtonIcon = (props: IconButtonProps) => {
  return (
    <StyledCloseButtonIcon aria-label="close" {...props}>
      <CloseIcon />
    </StyledCloseButtonIcon>
  );
};

export default CloseButtonIcon;
