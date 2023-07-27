import Grid from '@material-ui/core/Grid';
import { RTUPollScheduleGroupFilterOptions } from 'api/admin/api';
import FilterBox from 'components/FilterBox';
import React from 'react';
import FilterForm from '../FilterForm';

interface FilterByData {
  filterByColumn: RTUPollScheduleGroupFilterOptions;
  filterTextValue: string;
}

const TableOptions = ({
  handleFilterFormSubmit,
}: {
  handleFilterFormSubmit: (filterData: FilterByData) => void;
}) => (
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

export default TableOptions;
