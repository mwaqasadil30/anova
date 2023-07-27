/* eslint-disable indent */
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { SiteListFilterOptions } from 'api/admin/api';
import Button from 'components/Button';
import FieldLabel from 'components/forms/labels/FieldLabel';
import FieldGroup from 'components/forms/styled-fields/FieldGroup';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectIsActiveDomainApciEnabled } from 'redux-app/modules/app/selectors';

interface Props {
  onSubmit: (data: any) => void;
}

const FilterForm = ({ onSubmit }: Props) => {
  const { t } = useTranslation();

  const isAirProductsEnabledDomain = useSelector(
    selectIsActiveDomainApciEnabled
  );

  const [filterByColumn, setFilterByColumn] = useState(
    SiteListFilterOptions.CustomerName
  );

  const [filterByInputText, setFilterByInputText] = useState('');

  const handleFilterByColumnChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setFilterByColumn(event.target.value as SiteListFilterOptions);
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

  const cityTitleText = t('enum.sitelistfilteroptions.city', 'City');
  const stateText = t('enum.sitelistfilteroptions.state', 'State');
  const customerNameText = t(
    'enum.sitelistfilteroptions.customerName',
    'Customer Name'
  );
  const countryText = t('enum.sitelistfilteroptions.country', 'Country');
  const siteNumberText = t(
    'enum.sitelistfilteroptions.siteNumber',
    'Site Number'
  );

  const placeholderMapping = {
    // For air products domains, site number is the same enum value as customer name
    [SiteListFilterOptions.CustomerName]: isAirProductsEnabledDomain
      ? siteNumberText
      : customerNameText,
    [SiteListFilterOptions.City]: cityTitleText,
    [SiteListFilterOptions.State]: stateText,
    [SiteListFilterOptions.Country]: countryText,
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
                style: { overflow: 'hidden' },
              }}
            >
              {[
                isAirProductsEnabledDomain
                  ? {
                      label: t(
                        'enum.sitelistfilteroptions.siteNumber',
                        'Site Number'
                      ),
                      // Filtering by site number uses the same enum value (0) as customer name
                      value: SiteListFilterOptions.CustomerName,
                    }
                  : {
                      label: t(
                        'enum.sitelistfilteroptions.customerName',
                        'Customer Name'
                      ),
                      value: SiteListFilterOptions.CustomerName,
                    },
                {
                  label: t('enum.sitelistfilteroptions.state', 'State'),
                  value: SiteListFilterOptions.State,
                },
                {
                  label: t('enum.sitelistfilteroptions.city', 'City'),
                  value: SiteListFilterOptions.City,
                },
                {
                  label: t('enum.sitelistfilteroptions.country', 'Country'),
                  value: SiteListFilterOptions.Country,
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
