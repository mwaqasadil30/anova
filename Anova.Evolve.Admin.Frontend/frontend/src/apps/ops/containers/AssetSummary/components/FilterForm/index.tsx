import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { AssetListFilterOptions } from 'api/admin/api';
import FieldLabel from 'components/forms/labels/FieldLabel';
import FieldGroup from 'components/forms/styled-fields/FieldGroup';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { isNumber } from 'utils/format/numbers';
import { defaultFilterByColumn } from '../../helpers';

const StyledFieldGroup = styled(FieldGroup)`
  display: flex;
  align-items: flex-end;
`;

interface Props {
  filterByColumn?: AssetListFilterOptions;
  filterTextValue?: string;
  handleFilterTextAndColumnChange: (data: any) => void;
}

const FilterForm = ({
  filterByColumn,
  filterTextValue,
  handleFilterTextAndColumnChange,
}: Props) => {
  const { t } = useTranslation();

  const cleanExternalFilterByColumn = isNumber(filterByColumn)
    ? filterByColumn
    : defaultFilterByColumn;

  const cleanExternalFilterByInputText = filterTextValue || '';

  const handleFilterByColumnChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const newColumn = event.target.value as AssetListFilterOptions;

    handleFilterTextAndColumnChange({
      filterByColumn: newColumn,
      filterTextValue: cleanExternalFilterByInputText,
    });
  };
  const handleFilterByInputChange = (
    event: React.ChangeEvent<{ value: string }>
  ) => {
    handleFilterTextAndColumnChange({
      filterByColumn: cleanExternalFilterByColumn,
      filterTextValue: event.target.value,
    });
  };

  const assetTitleText = t('enum.assetlistfilteroptions.asset', 'Asset Title');
  const rtuText = t('enum.assetlistfilteroptions.rtu', 'RTU');
  const FTPIdText = t('enum.assetlistfilteroptions.ftpid', 'FTP ID');
  const assetLocationText = t(
    'enum.assetlistfilteroptions.assetlocation',
    'Asset Location'
  );
  const productText = t('enum.assetlistfilteroptions.product', 'Product');
  const customerNameText = t(
    'enum.assetlistfilteroptions.customername',
    'Customer Name'
  );
  const allFieldsText = t(
    'enum.assetlistfilteroptions.allfields',
    'All Fields'
  );

  const placeholderMapping = {
    [AssetListFilterOptions.Asset]: assetTitleText,
    [AssetListFilterOptions.RTU]: rtuText,
    [AssetListFilterOptions.FTPId]: FTPIdText,
    [AssetListFilterOptions.Product]: productText,
    [AssetListFilterOptions.CustomerName]: customerNameText,
    [AssetListFilterOptions.AllFields]: allFieldsText,
    [AssetListFilterOptions.Site]: assetLocationText,
  };

  const filterOptions = [
    {
      label: allFieldsText,
      value: AssetListFilterOptions.AllFields,
    },
    {
      label: assetTitleText,
      value: AssetListFilterOptions.Asset,
    },
    {
      label: assetLocationText,
      value: AssetListFilterOptions.Site,
    },
    {
      label: customerNameText,
      value: AssetListFilterOptions.CustomerName,
    },
    {
      label: FTPIdText,
      value: AssetListFilterOptions.FTPId,
    },

    {
      label: productText,
      value: AssetListFilterOptions.Product,
    },
    {
      label: rtuText,
      value: AssetListFilterOptions.RTU,
    },
  ];
  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid item>
        <StyledFieldGroup>
          <StyledTextField
            select
            fullWidth={false}
            label={
              <FieldLabel>{t('ui.common.filterby', 'Filter By')}</FieldLabel>
            }
            onChange={handleFilterByColumnChange}
            value={cleanExternalFilterByColumn}
            style={{ minWidth: 160 }}
            InputProps={{
              style: {
                overflow: 'hidden',
              },
            }}
          >
            {filterOptions.map((option) => (
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
            value={cleanExternalFilterByInputText}
            style={{ minWidth: 280 }}
            InputProps={{
              style: {
                overflow: 'hidden',
              },
            }}
          />
        </StyledFieldGroup>
      </Grid>
    </Grid>
  );
};

export default FilterForm;
