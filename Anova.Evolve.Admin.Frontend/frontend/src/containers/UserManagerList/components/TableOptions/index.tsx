import Grid from '@material-ui/core/Grid';
import FilterBox from 'components/FilterBox';
import React from 'react';
import FilterForm from '../FilterForm';

interface FormData {
  column: string;
  text: string;
}

interface Props {
  filterData: (formData: FormData) => void;
  uniqueRoleNames: string[];
}

const TableOptions = ({ filterData, uniqueRoleNames }: Props) => {
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
          <FilterForm
            onSubmit={(formData) => {
              filterData(formData);
            }}
            uniqueRoleNames={uniqueRoleNames}
          />
        </Grid>
      </Grid>
    </FilterBox>
  );
};

export default TableOptions;
