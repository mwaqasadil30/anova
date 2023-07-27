import Grid from '@material-ui/core/Grid';
import FilterBox from 'components/FilterBox';
import React from 'react';
import FilterForm from '../FilterForm';

interface Props {
  setGlobalFilter: (filterText: string) => void;
}

const TableOptions = ({ setGlobalFilter }: Props) => {
  return (
    <FilterBox>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        spacing={2}
      >
        <Grid item xs={12}>
          <FilterForm setGlobalFilter={setGlobalFilter} />
        </Grid>
      </Grid>
    </FilterBox>
  );
};

export default TableOptions;
