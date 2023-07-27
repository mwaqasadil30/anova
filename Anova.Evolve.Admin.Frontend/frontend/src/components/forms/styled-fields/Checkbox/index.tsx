import React from 'react';
import styled from 'styled-components';
import MuiCheckbox, { CheckboxProps } from '@material-ui/core/Checkbox';

const Checkbox = styled((props: CheckboxProps) => (
  <MuiCheckbox color="default" {...props} />
))`
  color: ${(props) => props.theme.palette.text.primary};
  &.Mui-checked {
    color: ${(props) => props.theme.palette.text.primary};
  }
`;

export default Checkbox;
