import MuiIconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import React from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';

const StyledBackIconButton = styled(MuiIconButton)`
  padding: 0;
  color: ${(props) => props.theme.palette.text.primary};
  & svg {
    width: ${(props) => (props.size === 'small' ? 30 : 40)}px;
    height: ${(props) => (props.size === 'small' ? 30 : 40)}px;
  }
`;

const BackIconButton = (props: IconButtonProps) => {
  const history = useHistory();

  return (
    <StyledBackIconButton
      aria-label="back"
      // Note that this onClick can be overridden via props.onClick
      onClick={() => history.goBack()}
      {...props}
    >
      <ChevronLeftIcon />
    </StyledBackIconButton>
  );
};

export default BackIconButton;
