import FormatDateTime from 'components/FormatDateTime';
import React from 'react';
import { Cell } from 'react-table';

function TableDateTimeCell<T extends object>({ value }: Cell<T>) {
  if (value) {
    return <FormatDateTime date={value} />;
  }
  return '-';
}

export default TableDateTimeCell;
