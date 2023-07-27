import Grid from '@material-ui/core/Grid';
import ItemCount from 'components/typography/ItemCount';
import React from 'react';

interface Props {
  totalRows: number;
}

const TableActionsAndPagination = ({ totalRows }: Props) => {
  return (
    <Grid container spacing={1} alignItems="center" justify="center">
      <Grid item>
        <ItemCount count={totalRows} />
      </Grid>
    </Grid>
  );
};

export default TableActionsAndPagination;
