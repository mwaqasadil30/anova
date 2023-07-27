import React from 'react';
import { CheckboxProps } from '@material-ui/core/Checkbox';
import Checkbox from 'components/forms/styled-fields/Checkbox';

const TableCellCheckbox = (props: CheckboxProps) => (
  <Checkbox
    color="default"
    inputProps={{ 'aria-label': 'select row checkbox' }}
    size="small"
    {...props}
  />
);

export default TableCellCheckbox;
