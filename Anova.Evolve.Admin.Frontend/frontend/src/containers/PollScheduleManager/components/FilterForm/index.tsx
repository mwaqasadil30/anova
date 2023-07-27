import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { RTUPollScheduleGroupFilterOptions as FilterOptions } from 'api/admin/api';
import Button from 'components/Button';
import FieldLabel from 'components/forms/labels/FieldLabel';
import FieldGroup from 'components/forms/styled-fields/FieldGroup';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import { TFunction } from 'i18next';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const getPlaceholderMapping = (
  t: TFunction
): Record<FilterOptions, string> => ({
  [FilterOptions.Name]: t('ui.common.name', 'Name'),
  [FilterOptions.RTU]: t('ui.common.rtu', 'RTU'),
});

const FilterForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const { t } = useTranslation();

  const [filterColumn, setFilterColumn] = useState(FilterOptions.Name);
  const [filterText, setFilterText] = useState('');

  const handleFilterByColumnChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setFilterColumn(event.target.value as FilterOptions);
    onSubmit({ filterByColumn: filterColumn, filterTextValue: filterText });
  };

  const handleFilterByInputChange = (
    event: React.ChangeEvent<{ value: string }>
  ) => {
    setFilterText(event.target.value);
  };

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    onSubmit({ filterByColumn: filterColumn, filterTextValue: filterText });
  };

  const placeholderMapping = getPlaceholderMapping(t);

  return (
    <form onSubmit={handleSubmit}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item>
          <FieldLabel>{t('ui.common.filterby', 'Filter By')}</FieldLabel>
        </Grid>
        <Grid item>
          <FieldGroup>
            <StyledTextField
              id="filterColumn-input"
              select
              fullWidth={false}
              onChange={handleFilterByColumnChange}
              value={filterColumn}
              style={{ minWidth: 160 }}
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
            <StyledTextField
              id="filterText-input"
              fullWidth={false}
              placeholder={t(
                'ui.common.filterplaceholder',
                `Enter {{filterOption}}`,
                // @ts-ignore
                { filterOption: placeholderMapping[filterColumn] }
              )}
              onChange={handleFilterByInputChange}
              value={filterText}
              style={{ minWidth: 280 }}
              InputProps={{
                style: { overflow: 'hidden' },
              }}
            />
          </FieldGroup>
        </Grid>

        <Grid item>
          <Button type="submit" variant="outlined">
            {t('ui.common.apply', 'Apply')}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default FilterForm;
