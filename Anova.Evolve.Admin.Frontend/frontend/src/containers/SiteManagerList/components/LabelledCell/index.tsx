import React from 'react';
import { SiteInfoRecord } from 'api/admin/api';
import { Cell } from 'react-table';

const getAriaLabelByColumnId = (id: string) => {
  switch (id) {
    case 'state':
      return 'State';
    case 'country':
      return 'Country';
    default:
      return '';
  }
};

const LabelledCell = ({ value, column }: Cell<SiteInfoRecord>) => {
  const ariaLabel = getAriaLabelByColumnId(column.id);

  return <span {...(ariaLabel && { 'aria-label': ariaLabel })}>{value}</span>;
};

export default LabelledCell;
