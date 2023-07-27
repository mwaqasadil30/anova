import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { RTUListFilterOptions } from 'api/admin/api';
import Button from 'components/Button';
import FieldLabel from 'components/forms/labels/FieldLabel';
import FieldGroup from 'components/forms/styled-fields/FieldGroup';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';

interface Props {
  onSubmit: (data: any) => void;
}

interface Option {
  label: string;
  value: string;
}

const FilterForm = ({ onSubmit }: Props) => {
  const { t } = useTranslation();
  const activeDomain = useSelector(selectActiveDomain);
  const domainIntegrationProfile = activeDomain?.integrationProfile;

  const [filterByColumn, setFilterByColumn] = useState(
    RTUListFilterOptions.RTU
  );

  const [filterByInputText, setFilterByInputText] = useState('');

  const handleFilterByColumnChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setFilterByColumn(event.target.value as RTUListFilterOptions);
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

  const carrierText = t('enum.rtulistfilteroptions.carrier', 'Carrier');
  const siteText = t('enum.rtulistfilteroptions.state', 'Site');
  const customerNameText = t(
    'enum.rtulistfilteroptions.customerName',
    'Customer Name'
  );
  const rtuPhoneText = t('enum.rtulistfilteroptions.rtuphone', 'RTU Phone');
  const rtuText = t('enum.rtulistfilteroptions.rtu', 'RTU');

  const placeholderMapping = {
    [RTUListFilterOptions.Customer]: customerNameText,
    [RTUListFilterOptions.RTU]: rtuText,
    [RTUListFilterOptions.Site]: siteText,
    [RTUListFilterOptions.Carrier]: carrierText,
    [RTUListFilterOptions.RTUPhone]: rtuPhoneText,
  };

  // list of filter options
  let filterOptions = {
    RTU: {
      label: t('enum.rtulistfilteroptions.rtu', 'RTU'),
      value: RTUListFilterOptions.RTU.toString(),
    },
    Carrier: {
      label: t('enum.rtulistfilteroptions.carrier', 'Carrier'),
      value: RTUListFilterOptions.Carrier.toString(),
    },
    customerName: {
      label: t('enum.rtulistfilteroptions.customerName', 'Customer Name'),
      value: RTUListFilterOptions.Customer.toString(),
    },
    RTUPhone: {
      label: t('enum.rtulistfilteroptions.rtuphone', 'RTU Phone'),
      value: RTUListFilterOptions.RTUPhone.toString(),
    },
  };

  // add site for domains that are not APCI(1)
  if (domainIntegrationProfile !== 1) {
    const amend = {
      Site: {
        label: t('enum.rtulistfilteroptions.state', 'Site'),
        value: RTUListFilterOptions.Site.toString(),
      },
    };
    filterOptions = { ...filterOptions, ...amend };
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* spacing 4 keeps items in line */}
      <Grid container alignItems="center" spacing={4}>
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
              {Object.values(filterOptions).map((option: Option) => (
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

        <Button type="submit" variant="outlined">
          {t('ui.common.apply', 'Apply')}
        </Button>
      </Grid>
    </form>
  );
};

export default FilterForm;
