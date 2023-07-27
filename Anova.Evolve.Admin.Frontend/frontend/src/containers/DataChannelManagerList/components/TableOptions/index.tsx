import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import {
  DataChannelListFilterOptions,
  DataChannelListGroupingOptions as GroupOptions,
} from 'api/admin/api';
import FilterBox from 'components/FilterBox';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import FieldLabel from 'components/forms/labels/FieldLabel';
import { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import FilterForm from '../FilterForm';

// todo: fix asset and rtu grouping
const getPlaceholderMapping = (t: TFunction) => ({
  [GroupOptions.None]: t('ui.common.none', 'None'),
  /*  [GroupOptions.Asset]: t('ui.common.asset', 'Asset'),*/
  [GroupOptions.CustomerName]: t('ui.common.customername', 'Customer Name'),
  /*  [GroupOptions.RTU]: t('ui.common.rtu', 'RTU'),*/
});

interface FilterByData {
  filterByColumn: DataChannelListFilterOptions;
  filterTextValue: string;
}

const TableOptions = ({
  handleFilterFormSubmit,
  handleGroupByColumnChange,
  groupByColumn,
}: {
  handleFilterFormSubmit: (filterData: FilterByData) => void;
  handleGroupByColumnChange: (
    event: React.ChangeEvent<{
      value: unknown;
    }>
  ) => void;
  groupByColumn: GroupOptions;
}) => {
  const { t } = useTranslation();
  const placeholderMapping = getPlaceholderMapping(t);

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
                select
                onChange={handleGroupByColumnChange}
                value={groupByColumn}
                style={{ minWidth: 265 }}
                InputProps={{
                  style: { overflow: 'hidden' },
                }}
              >
                {Object.entries(placeholderMapping).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
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
