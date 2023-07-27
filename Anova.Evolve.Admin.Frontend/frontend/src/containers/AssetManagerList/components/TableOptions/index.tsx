import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import {
  AssetListFilterOptions,
  AssetListGroupingOptions,
} from 'api/admin/api';
import FilterBox from 'components/FilterBox';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import FieldLabel from 'components/forms/labels/FieldLabel';
import React from 'react';
import { useTranslation } from 'react-i18next';
import FilterForm from '../FilterForm';

interface FilterByData {
  filterByColumn: AssetListFilterOptions;
  filterTextValue: string;
}

interface Props {
  handleFilterFormSubmit: (filterData: FilterByData) => void;
  handleGroupByColumnChange: (
    event: React.ChangeEvent<{
      value: unknown;
    }>
  ) => void;
  groupByColumn: AssetListGroupingOptions;
}

const TableOptions = ({
  handleFilterFormSubmit,
  handleGroupByColumnChange,
  groupByColumn,
}: Props) => {
  const { t } = useTranslation();
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
        <Grid item>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <FieldLabel>{t('ui.common.groupby', 'Group By')}</FieldLabel>
            </Grid>
            <Grid item>
              <StyledTextField
                id="groupBy-input"
                select
                onChange={handleGroupByColumnChange}
                value={groupByColumn}
                style={{ minWidth: 265 }}
                InputProps={{
                  style: { overflow: 'hidden' },
                }}
              >
                {[
                  {
                    label: t('ui.common.none', 'None'),
                    value: AssetListGroupingOptions.None,
                  },
                  {
                    label: t('ui.common.customername', 'Customer Name'),
                    value: AssetListGroupingOptions.CustomerName,
                  },
                ].map((option) => (
                  <MenuItem key={option.label} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </StyledTextField>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </FilterBox>
  );
};

export default TableOptions;
