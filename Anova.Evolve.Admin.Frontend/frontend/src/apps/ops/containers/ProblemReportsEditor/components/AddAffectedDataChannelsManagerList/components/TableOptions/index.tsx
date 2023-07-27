import Grid from '@material-ui/core/Grid';
import FilterBox from 'components/FilterBox';
import React from 'react';
import { FilterByData } from '../../helpers';
import FilterForm from '../FilterForm';

interface Props {
  handleFilterFormSubmit: (filterData: FilterByData) => void;
}

const TableOptions = ({ handleFilterFormSubmit }: Props) => {
  return (
    <FilterBox>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        spacing={2}
      >
        <Grid item>
          <FilterForm onSubmit={handleFilterFormSubmit} />
        </Grid>
      </Grid>
    </FilterBox>
  );
};

export default TableOptions;
