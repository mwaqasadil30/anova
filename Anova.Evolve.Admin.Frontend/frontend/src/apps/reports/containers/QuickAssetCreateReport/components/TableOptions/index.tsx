import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { AssetType } from 'api/admin/api';
import Button from 'components/Button';
import FilterBox from 'components/FilterBox';
import FieldLabel from 'components/forms/labels/FieldLabel';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatSearchText } from 'utils/api/helpers';
import { getSupportedAssetTypeOptions } from 'utils/i18n/enum-to-text';
import { QuickAssetReportFilterOption } from '../../types';
import DateRangeForm from '../DateRangeForm';
import FilterForm from '../FilterForm';

interface FilterByData {
  filterColumn: QuickAssetReportFilterOption;
  filterTextValue: string;
}

interface Props {
  isFetching?: boolean;
  assetTypeFilter: AssetType;
  startDate: moment.Moment | null;
  endDate: moment.Moment | null;
  handleChangeStartDate: (newDate: moment.Moment | null) => void;
  handleChangeEndDate: (newDate: moment.Moment | null) => void;
  handleFilterFormSubmit: (filterData: FilterByData) => void;
  handleChangeAssetType: (
    event: React.ChangeEvent<{
      value: unknown;
    }>
  ) => void;
}

const TableOptions = ({
  isFetching,
  assetTypeFilter,
  startDate,
  endDate,
  handleChangeStartDate,
  handleChangeEndDate,
  handleFilterFormSubmit,
  handleChangeAssetType,
}: Props) => {
  const { t } = useTranslation();
  const assetTypeOptions = getSupportedAssetTypeOptions(t);

  const [filterColumn, setFilterColumn] = useState(
    QuickAssetReportFilterOption.AssetTitle
  );
  const [filterText, setFilterText] = useState('');

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    handleFilterFormSubmit({
      filterTextValue: formatSearchText(filterText),
      filterColumn,
    });
  };

  return (
    <FilterBox component="form" onSubmit={handleSubmit}>
      <Grid container direction="row" alignItems="center" spacing={2}>
        <Grid item>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <FieldLabel>{t('ui.asset.assettype', 'Asset Type')}</FieldLabel>
            </Grid>
            <Grid item>
              <StyledTextField
                id="assetType-input"
                select
                onChange={handleChangeAssetType}
                value={assetTypeFilter}
                style={{ minWidth: 265 }}
                InputProps={{
                  style: { overflow: 'hidden' },
                }}
              >
                {assetTypeOptions.map((option) => (
                  <MenuItem key={option.label} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </StyledTextField>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <FilterForm
            filterText={filterText}
            filterColumn={filterColumn}
            handleChangeFilterColumn={setFilterColumn}
            handleChangeFilterText={setFilterText}
          />
        </Grid>
        <Grid item>
          <DateRangeForm
            startDate={startDate}
            endDate={endDate}
            handleChangeStartDate={handleChangeStartDate}
            handleChangeEndDate={handleChangeEndDate}
          />
        </Grid>
        <Grid item>
          <Button type="submit" variant="contained" disabled={isFetching}>
            {t('ui.common.apply', 'Apply')}
          </Button>
        </Grid>
      </Grid>
    </FilterBox>
  );
};

export default TableOptions;
