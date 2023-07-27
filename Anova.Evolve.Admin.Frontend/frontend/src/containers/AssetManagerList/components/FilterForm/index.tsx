import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { AssetListFilterOptions } from 'api/admin/api';
import Button from 'components/Button';
import FieldLabel from 'components/forms/labels/FieldLabel';
import FieldGroup from 'components/forms/styled-fields/FieldGroup';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  onSubmit: (data: any) => void;
}

const FilterForm = ({ onSubmit }: Props) => {
  const [filterByColumn, setFilterByColumn] = useState(
    AssetListFilterOptions.Asset
  );
  const [filterByInputText, setFilterByInputText] = useState('');

  const handleFilterByColumnChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setFilterByColumn(event.target.value as AssetListFilterOptions);
    onSubmit({ filterByColumn, filterTextValue: filterByInputText });
  };
  const handleFilterByInputChange = (
    event: React.ChangeEvent<{ value: string }>
  ) => {
    setFilterByInputText(event.target.value);
  };
  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    onSubmit({ filterByColumn, filterTextValue: filterByInputText });
  };
  const { t } = useTranslation();

  const assetTitleText = t('enum.assetlistfilteroptions.asset', 'Asset Title');
  const rtuText = t('enum.assetlistfilteroptions.rtu', 'RTU');
  const placeholderMapping = {
    [AssetListFilterOptions.Asset]: assetTitleText,
    [AssetListFilterOptions.RTU]: rtuText,
  };

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
              value={filterByColumn}
              style={{ minWidth: 160 }}
              InputProps={{
                style: { overflow: 'hidden' },
              }}
            >
              {[
                {
                  label: t('enum.assetlistfilteroptions.asset', 'Asset Title'),
                  value: AssetListFilterOptions.Asset,
                },
                {
                  label: t('enum.assetlistfilteroptions.rtu', 'RTU'),
                  value: AssetListFilterOptions.RTU,
                },
              ].map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </StyledTextField>

            <StyledTextField
              id="filterText-input"
              fullWidth={false}
              placeholder={t(
                'ui.assetlistfilteroptions.placeholder',
                `Enter {{filterOption}}`,
                // @ts-ignore
                { filterOption: placeholderMapping[filterByColumn] }
              )}
              onChange={handleFilterByInputChange}
              value={filterByInputText}
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
