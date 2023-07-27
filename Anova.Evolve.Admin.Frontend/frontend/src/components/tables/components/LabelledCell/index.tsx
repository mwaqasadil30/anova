import React from 'react';
import { Cell } from 'react-table';

interface Props<T extends object> extends Cell<T> {
  'aria-label': string;
}

function LabelledCell<T extends object>({
  'aria-label': ariaLabel,
  value,
}: Props<T>) {
  return <span aria-label={ariaLabel}>{value}</span>;
}

export default LabelledCell;
