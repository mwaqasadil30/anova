import React from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { ReactComponent as EllipsisIcon } from 'assets/icons/ellipsis.svg';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  width: 50px;
  height: 50px;
  min-width: 0;
  border-radius: 0;
`;

const ActionsButton = (props: ButtonProps) => {
  return (
    <StyledButton {...props} aria-haspopup="true" aria-label="Actions button">
      <EllipsisIcon />
    </StyledButton>
  );
};

export default ActionsButton;
