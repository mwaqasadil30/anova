/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { ProblemReportFilter } from 'api/admin/api';
import { ProblemReportStatusFilterEnum } from 'apps/ops/types';
import Button from 'components/Button';
import FieldLabel from 'components/forms/labels/FieldLabel';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { getProblemReportStatusEnumOptions } from 'utils/i18n/enum-to-text';
import FilterForm from '../FilterForm';

const StyledApplyButton = styled(Button)`
  margin-top: 22px;
`;

const HiddenButton = styled.button`
  display: none;
`;

interface FilterByData {
  filterByColumn: ProblemReportFilter;
  filterTextValue: string;
}

interface Props {
  isFetching: boolean;
  filterByColumn?: ProblemReportFilter;
  filterTextValue?: string;
  statusSelected: ProblemReportStatusFilterEnum;
  handleFilterTextAndColumnChange: (filterData: FilterByData) => void;
  handleStatusTypeChange: (
    event: React.ChangeEvent<{
      value: unknown;
    }>
  ) => void;
  handleSubmitAllFilters: () => void;
}

const TableOptions = ({
  isFetching,
  filterByColumn,
  filterTextValue,
  statusSelected,
  handleFilterTextAndColumnChange,
  handleStatusTypeChange,
  handleSubmitAllFilters,
}: Props) => {
  const { t } = useTranslation();

  const statusTypeOptions = getProblemReportStatusEnumOptions(t);

  return (
    <>
      <Box>
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleSubmitAllFilters();
          }}
        >
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
            spacing={2}
          >
            <Grid item>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <StyledTextField
                    id="status-input"
                    select
                    label={
                      <FieldLabel>
                        {t('ui.problemreport.status', 'Status')}
                      </FieldLabel>
                    }
                    onChange={handleStatusTypeChange}
                    value={statusSelected}
                    style={{ minWidth: 125 }}
                    InputProps={{
                      style: { overflow: 'hidden' },
                    }}
                  >
                    {statusTypeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </StyledTextField>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <FilterForm
                filterByColumn={filterByColumn}
                filterTextValue={filterTextValue}
                handleFilterTextAndColumnChange={
                  handleFilterTextAndColumnChange
                }
              />
            </Grid>

            <Grid item>
              <StyledApplyButton
                type="submit"
                variant="outlined"
                disabled={isFetching}
              >
                {t('ui.common.apply', 'Apply')}
              </StyledApplyButton>
            </Grid>
          </Grid>
          <HiddenButton type="submit" />
        </form>
      </Box>
    </>
  );
};

export default TableOptions;
