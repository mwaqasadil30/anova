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
  // NOTE/TODO:
  // Filter options below are related to problem report status type
  // 'Both' and/or 'Closed'
  // const distributionText = t('ui.problemreport.distribution', 'Distribution');
  // const ownerText = t('ui.problemreport.owner', 'Owner');
  // const plantStatusText = t('ui.problemreport.plantstatus', 'Plant Status');
  const problemIdText = t('ui.problemreport.problemid', 'Problem ID');

  // NOTE:
  // Could be used if we want to make the default search text custom
  // const placeholderMapping = {
  //   [ProblemReportFilter.ShipTo]: shipToText,
  //   [ProblemReportFilter.Rtu]: rtuText,
  //   [ProblemReportFilter.AssetTitle]: assetTitleText,
  //   [ProblemReportFilter.Owner]: ownerText,
  //   [ProblemReportFilter.PlantStatus]: plantStatusText,
  //   [ProblemReportFilter.ProblemId]: problemIdText,
  //   [ProblemReportFilter.Distribution]: distributionText,
  // };

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
    // NOTE/TODO:
    // Filter options below are related to problem report status type
    // 'Both' and/or 'Closed'
    // Uncomment once we implement the views required for these columns/filter options
    // {
    //   label: distributionText,
    //   value: ProblemReportFilter.Distribution,
    // },
    // {
    //   label: ownerText,
    //   value: ProblemReportFilter.Owner,
    // },
    // {
    //   label: plantStatusText,
    //   value: ProblemReportFilter.PlantStatus,
    // },
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
            style={{ minWidth: 160 }}
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
            style={{ minWidth: 280 }}
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
