/* eslint-disable indent */
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { ProblemReportFilter, TagDto } from 'api/admin/api';
import { ProblemReportStatusFilterEnum } from 'apps/ops/types';
import Button from 'components/Button';
import Chip from 'components/Chip';
import FilterBox from 'components/FilterBox';
import FieldLabel from 'components/forms/labels/FieldLabel';
import EmptyDropdownAutocomplete, {
  Props as EmptyDropdownAutocompleteProps,
} from 'components/forms/styled-fields/EmptyDropdownAutocomplete';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectActiveDomainId } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import { getProblemReportStatusEnumOptions } from 'utils/i18n/enum-to-text';
import { useGetProblemReportTagIds } from '../../hooks/useGetProblemReportTagIds';
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

const StyledDropdownAutocomplete = styled(EmptyDropdownAutocomplete)`
  width: 300px;
`;

interface Props {
  isFetching: boolean;
  handleFilterTextAndColumnChange: (filterData: FilterByData) => void;
  filterByColumn?: ProblemReportFilter;
  filterTextValue?: string;
  statusSelected: ProblemReportStatusFilterEnum;
  selectedTagIds?: number[] | null;
  handleStatusTypeChange: (
    event: React.ChangeEvent<{
      value: unknown;
    }>
  ) => void;
  handleSelectTag: (tagId: number) => void;
  handleDeleteTag: (tagId: number) => () => void;
  handleSubmitAllFilters: () => void;
}

const TableOptions = ({
  isFetching,
  filterByColumn,
  filterTextValue,
  statusSelected,
  selectedTagIds,
  handleFilterTextAndColumnChange,
  handleStatusTypeChange,
  handleSelectTag,
  handleDeleteTag,
  handleSubmitAllFilters,
}: Props) => {
  const { t } = useTranslation();
  const domainId = useSelector(selectActiveDomainId);

  const statusTypeOptions = getProblemReportStatusEnumOptions(t);

  const getTagsApi = useGetProblemReportTagIds(domainId);

  const getTagsApiData = getTagsApi.data;

  const selectedTags = getTagsApiData?.filter((tagObject) =>
    selectedTagIds?.find((selectedTagId) => selectedTagId === tagObject.tagId)
  );

  const selectableTags = getTagsApiData?.filter(
    (tagObject) =>
      !selectedTagIds?.find(
        (selectedTagId) => selectedTagId === tagObject.tagId
      )
  );

  return (
    <FilterBox>
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
                  style={{ minWidth: 168 }}
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
              handleFilterTextAndColumnChange={handleFilterTextAndColumnChange}
            />
          </Grid>

          <Grid item>
            <StyledDropdownAutocomplete<
              React.FC<EmptyDropdownAutocompleteProps<TagDto>>
            >
              label={<FieldLabel>{t('ui.common.tags', 'Tags')}</FieldLabel>}
              options={selectableTags || []}
              getOptionLabel={(option) => option?.name || ''}
              onChange={(_: any, tag) => {
                if (tag?.tagId) {
                  handleSelectTag(tag.tagId);
                }
              }}
              renderOption={(option) => <Typography>{option.name}</Typography>}
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

          <Grid item xs={12}>
            <Grid
              container
              alignItems="center"
              spacing={1}
              justify="flex-start"
            >
              {selectedTags?.map((tag) => {
                return (
                  <>
                    <Grid item key={tag.tagId}>
                      <Chip
                        label={tag.name}
                        onDelete={handleDeleteTag(tag.tagId!)}
                      />
                    </Grid>
                  </>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
        <HiddenButton type="submit" />
      </form>
    </FilterBox>
  );
};

export default TableOptions;
