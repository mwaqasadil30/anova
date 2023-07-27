import MenuItem from '@material-ui/core/MenuItem';
import Select, { SelectProps } from '@material-ui/core/Select';
import styled from 'styled-components';
import React from 'react';

type SelectCustomProps = SelectProps & {
  itemArray: { label?: string | null; value?: string | null }[];
};

const SelectCustom = ({ itemArray, ...props }: SelectCustomProps) => {
  return (
    <Select {...props}>
      <MenuItem value={-1} key={-1} />

      {itemArray.map((item) => {
        return (
          <MenuItem value={item.value || ''} key={item.value!}>
            {item.label}
          </MenuItem>
        );
      })}
    </Select>
  );
};
const SelectCustomStyled = styled(SelectCustom)`
  width: 100%;
  border: 2px solid transparent;
  border-radius: 5px;
  background: ${(props) =>
    props.theme.palette.type === 'light' ? '#F0F0F0' : '#FFFFFF42'};
  color: ${(props) =>
    props.theme.palette.type === 'light' ? '#333333' : '#FFFFFFBF'};
  font-size: 0.8125rem;
  padding: 3px 7px;
  &:before {
    border-bottom: none;
  }
  &:after {
    border-bottom: none;
  }
  &.Mui-error {
    border: 2px ${(props) => props.theme.palette.error.main} solid;
  }
`;
export default SelectCustomStyled;
