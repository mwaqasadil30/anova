import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { DataChannelFilter } from 'api/admin/api';
import Button from 'components/Button';
import FieldLabel from 'components/forms/labels/FieldLabel';
import FieldGroup from 'components/forms/styled-fields/FieldGroup';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatSearchText } from 'utils/api/helpers';
import { FilterByData } from '../../helpers';

interface Props {
  onSubmit: (data: FilterByData) => void;
}

const FilterForm = ({ onSubmit }: Props) => {
  const { t } = useTranslation();

  const [filterByColumn, setFilterByColumn] = useState(
    DataChannelFilter.ShipTo
  );

  const [filterByInputText, setFilterByInputText] = useState('');

  const handleFilterByColumnChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setFilterByColumn(event.target.value as DataChannelFilter);
  };

  const handleFilterByInputChange = (
    event: React.ChangeEvent<{ value: string }>
  ) => {
    setFilterByInputText(event.target.value);
  };
  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    onSubmit({
      filterByColumn,
      filterTextValue: formatSearchText(filterByInputText) || '',
    });
  };

  const shipToText = t('ui.problemreport.shipTo', 'Ship To');
  const rtuText = t('ui.common.rtu', 'RTU');
  const assetTitleText = t('ui.common.assettitle', 'Asset Title');

  const placeholderMapping = {
    [DataChannelFilter.ShipTo]: shipToText,
    [DataChannelFilter.RTU]: rtuText,
    [DataChannelFilter.AssetTitle]: assetTitleText,
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
              fullWidth={false}
              select
              onChange={handleFilterByColumnChange}
              value={filterByColumn}
              style={{ minWidth: 160 }}
              InputProps={{
                style: { height: 40, overflow: 'hidden' },
              }}
            >
              {[
                {
                  label: t('ui.problemreport.shipTo', 'Ship To'),
                  value: DataChannelFilter.ShipTo,
                },
                {
                  label: t('ui.common.rtu', 'RTU'),
                  value: DataChannelFilter.RTU,
                },
                {
                  label: t('ui.common.assettitle', 'Asset Title'),
                  value: DataChannelFilter.AssetTitle,
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
                'ui.common.filterplaceholder',
                `Enter {{filterOption}}`,
                // @ts-ignore
                { filterOption: placeholderMapping[filterByColumn] }
              )}
              onChange={handleFilterByInputChange}
              value={filterByInputText}
              style={{ minWidth: 280 }}
              InputProps={{
                style: { height: 40, overflow: 'hidden' },
              }}
            />
          </FieldGroup>
        </Grid>

        <Grid item>
          <Button type="submit" variant="contained">
            {t('ui.common.apply', 'Apply')}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default FilterForm;
