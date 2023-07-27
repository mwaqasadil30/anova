import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import FieldLabel from 'components/forms/labels/FieldLabel';
import FieldGroup from 'components/forms/styled-fields/FieldGroup';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { QuickAssetReportFilterOption } from '../../types';

const getPlaceholderMapping = (
  t: TFunction
): Record<QuickAssetReportFilterOption, string> => ({
  [QuickAssetReportFilterOption.AssetTitle]: t(
    'ui.common.assettitle',
    'Asset Title'
  ),
  [QuickAssetReportFilterOption.DeviceId]: t('ui.common.deviceid', 'Device Id'),
  [QuickAssetReportFilterOption.Username]: t('ui.common.user', 'User'),
});

interface Props {
  filterText: string;
  filterColumn: QuickAssetReportFilterOption;
  handleChangeFilterColumn: (newColumn: QuickAssetReportFilterOption) => void;
  handleChangeFilterText: (newText: string) => void;
}

const FilterForm = ({
  filterText,
  filterColumn,
  handleChangeFilterText,
  handleChangeFilterColumn,
}: Props) => {
  const { t } = useTranslation();
  const placeholderMapping = getPlaceholderMapping(t);

  const handleFilterColumnSelectChange = (
    event: React.ChangeEvent<{ value: string }>
  ) => {
    handleChangeFilterColumn(
      event.target.value as QuickAssetReportFilterOption
    );
  };

  const handleFilterByInputChange = (
    event: React.ChangeEvent<{ value: string }>
  ) => {
    handleChangeFilterText(event.target.value);
  };

  return (
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
            onChange={handleFilterColumnSelectChange}
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
    </Grid>
  );
};

export default FilterForm;
