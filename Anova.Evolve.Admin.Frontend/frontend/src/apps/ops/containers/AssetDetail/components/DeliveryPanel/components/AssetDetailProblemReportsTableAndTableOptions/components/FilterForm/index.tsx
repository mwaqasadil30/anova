import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { ProblemReportFilter } from 'api/admin/api';
import FieldLabel from 'components/forms/labels/FieldLabel';
import FieldGroup from 'components/forms/styled-fields/FieldGroup';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { isNumber } from 'utils/format/numbers';

const StyledFieldGroup = styled(FieldGroup)`
  display: flex;
  align-items: flex-end;
`;

interface Props {
  filterByColumn?: ProblemReportFilter;
  filterTextValue?: string | null;
  handleFilterTextAndColumnChange: (data: any) => void;
}

const FilterForm = ({
  filterByColumn,
  filterTextValue,
  handleFilterTextAndColumnChange,
}: Props) => {
  const cleanExternalFilterByColumn = isNumber(filterByColumn)
    ? filterByColumn
    : ProblemReportFilter.ShipTo;

  const cleanExternalFilterByInputText = filterTextValue || '';

  const handleFilterByColumnChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const newColumn = event.target.value as ProblemReportFilter;

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

  const { t } = useTranslation();

  const shipToText = t(
    'enum.problemreportdatachannelfilterby.shipto',
    'Ship To'
  );
  const rtuText = t('enum.problemreportdatachannelfilterby.rtu', 'RTU');
  const assetTitleText = t(
    'enum.problemreportdatachannelfilterby.assettitle',
    'Asset Title'
  );
  const problemIdText = t('ui.problemreport.problemid', 'Problem ID');

  const filterOptions = [
    {
      label: shipToText,
      value: ProblemReportFilter.ShipTo,
    },
    {
      label: rtuText,
      value: ProblemReportFilter.Rtu,
    },
    {
      label: assetTitleText,
      value: ProblemReportFilter.AssetTitle,
    },
    {
      label: problemIdText,
      value: ProblemReportFilter.ProblemId,
    },
  ];
  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid item>
        <StyledFieldGroup>
          <StyledTextField
            select
            id="filterBy-input"
            fullWidth={false}
            label={
              <FieldLabel>{t('ui.common.filterby', 'Filter By')}</FieldLabel>
            }
            onChange={handleFilterByColumnChange}
            value={cleanExternalFilterByColumn}
            style={{ minWidth: 130 }}
            InputProps={{
              style: { overflow: 'hidden' },
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
              'ui.common.enterSearchCriteria',
              'Enter Search Criteria...'
            )}
            onChange={handleFilterByInputChange}
            value={cleanExternalFilterByInputText}
            style={{ minWidth: 240 }}
            InputProps={{
              style: { overflow: 'hidden' },
            }}
          />
        </StyledFieldGroup>
      </Grid>
    </Grid>
  );
};

export default FilterForm;
