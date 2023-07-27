import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { SiteListFilterOptions, SiteListGroupingOptions } from 'api/admin/api';
import FilterBox from 'components/FilterBox';
import FieldLabel from 'components/forms/labels/FieldLabel';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import React from 'react';
import { useTranslation } from 'react-i18next';
import FilterForm from '../FilterForm';

interface FilterByData {
  filterByColumn: SiteListFilterOptions;
  filterTextValue: string;
}

interface Props {
  handleFilterFormSubmit: (filterData: FilterByData) => void;
  handleGroupByColumnChange: (
    event: React.ChangeEvent<{
      value: unknown;
    }>
  ) => void;
  groupByColumn: SiteListGroupingOptions;
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
                    value: SiteListGroupingOptions.None,
                  },
                  {
                    label: t('ui.common.customername', 'Customer Name'),
                    value: SiteListGroupingOptions.CustomerName,
                  },
                  {
                    label: t('ui.common.state', 'State'),
                    value: SiteListGroupingOptions.State,
                  },
                  {
                    label: t('ui.common.country', 'Country'),
                    value: SiteListGroupingOptions.Country,
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
