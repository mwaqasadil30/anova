import Grid from '@material-ui/core/Grid';
import { EvolveAssetSummaryDto } from 'api/admin/api';
import React from 'react';
import { Cell } from 'react-table';
import { isNumber } from 'utils/format/numbers';
import { renderImportance } from 'utils/ui/helpers';

const ImportanceCell = (cell: Cell<EvolveAssetSummaryDto>) => {
  const importanceLevel = cell.row.original?.eventImportanceLevel;
  if (!cell.value && !isNumber(importanceLevel)) {
    return null;
  }

  const importanceIcon = renderImportance(importanceLevel);

  return (
    <Grid container justify="space-between" alignItems="center" spacing={2}>
      <Grid item>{cell.value}</Grid>
      {importanceIcon && <Grid item>{importanceIcon}</Grid>}
    </Grid>
  );
};

export default ImportanceCell;
