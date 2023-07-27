import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { AssetListFilterOptions } from 'api/admin/api';
import FieldLabel from 'components/forms/labels/FieldLabel';
import FieldGroup from 'components/forms/styled-fields/FieldGroup';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { isNumber } from 'utils/format/numbers';

const StyledFieldGroup = styled(FieldGroup)`
  display: flex;
  align-items: flex-end;
`;

const HiddenButton = styled.button`
  display: none;
`;

interface Props {
  externalFilterByColumn?: AssetListFilterOptions;
  externalFilterByInputText?: string;
  onSubmit: (data: any) => void;
}

const FilterForm = ({
  externalFilterByColumn,
  externalFilterByInputText,
  onSubmit,
}: Props) => {
  const cleanExternalFilterByColumn = isNumber(externalFilterByColumn)
    ? externalFilterByColumn
    : AssetListFilterOptions.Asset;

  const cleanExternalFilterByInputText = externalFilterByInputText || '';
  const [filterByColumn, setFilterByColumn] = useState(
    cleanExternalFilterByColumn
  );
  const [filterByInputText, setFilterByInputText] = useState(
    cleanExternalFilterByInputText
  );

  useEffect(() => {
    setFilterByColumn(cleanExternalFilterByColumn);
    setFilterByInputText(cleanExternalFilterByInputText);
  }, [cleanExternalFilterByColumn, cleanExternalFilterByInputText]);

  const handleFilterByColumnChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const newColumn = event.target.value as AssetListFilterOptions;
    setFilterByColumn(newColumn);
    onSubmit({
      filterByColumn: newColumn,
      filterTextValue: filterByInputText,
    });
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
    <form onSubmit={handleSubmit}>
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
              value={filterByColumn}
              style={{ minWidth: 160 }}
              InputProps={{
                style: { height: 40, overflow: 'hidden' },
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
              value={filterByInputText}
              style={{ minWidth: 280 }}
              InputProps={{
                style: { height: 40, overflow: 'hidden' },
              }}
            />
          </StyledFieldGroup>
        </Grid>
      </Grid>
      {/*
        A submit button is required to submit the form using the "Enter" key
        when a Material UI text field is present. Note that this doesn't seem
        to be necessary if the form only has plain HTML input elements for some
        reason.
      */}
      <HiddenButton type="submit" />
    </form>
  );
};

export default FilterForm;
