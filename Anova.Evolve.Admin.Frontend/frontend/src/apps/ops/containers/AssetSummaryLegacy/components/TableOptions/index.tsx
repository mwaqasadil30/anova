/* eslint-disable indent */
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import {
  AssetListFilterOptions,
  AssetSummaryGroupingOptions,
  DataChannelType,
  ListSortDirection,
} from 'api/admin/api';
import { ReactComponent as SortDownIcon } from 'assets/icons/Icn-sort-down.svg';
import { ReactComponent as SortUpIcon } from 'assets/icons/Icn-sort-up.svg';
import FilterBox from 'components/FilterBox';
import FieldLabel from 'components/forms/labels/FieldLabel';
import MultiSelect from 'components/forms/styled-fields/MultiSelect';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { UnitDisplayType } from 'types';
import {
  buildDataChannelTypeTextMapping,
  getUnitDisplayTypeOptions,
} from 'utils/i18n/enum-to-text';
import FilterForm from '../FilterForm';
import FilterTooltip from '../FilterTooltip';

// to do
// localisation
// mobile formatting when we have designs
// update asc/desc icon when provided
interface FilterByData {
  filterByColumn: AssetListFilterOptions;
  filterTextValue: string;
}
const StyledSortDownIcon = styled(SortDownIcon)`
  color: ${(props) => props.theme.palette.text.secondary};
  height: 24px;
  width: 24px;
  padding-bottom: 2px;
`;
const StyledSortUpIcon = styled(SortUpIcon)`
  color: ${(props) => props.theme.palette.text.secondary};
  height: 24px;
  width: 24px;
  padding-bottom: 4px;
`;

const StyledWrapper = styled.div`
  position: relative;
`;

const StyledFilterBox = styled(FilterBox)`
  border-radius: 10px 10px 10px 0;
`;

interface Props {
  handleFilterFormSubmit: (filterData: FilterByData) => void;
  handleGroupByColumnChange: (
    event: React.ChangeEvent<{
      value: unknown;
    }>
  ) => void;
  groupByColumn: AssetSummaryGroupingOptions;
  groupBySortDirection: ListSortDirection;
  filterByColumn?: AssetListFilterOptions;
  filterTextValue?: string;
  handleGroupByColumnSortChange: () => void;
  unitSelected: UnitDisplayType;
  handleUnitChange: (
    event: React.ChangeEvent<{
      value: unknown;
    }>
  ) => void;
  inventoryStateOptions: string[];
  dataChannelOptions: DataChannelType[];
  handleDataChannelChange: (dataChannels: DataChannelType[]) => void;
  dataChannelSelected?: DataChannelType[];
  inventoryStateSelected?: string[];
  handleInventorySelectedChange: (selectedInventoryLevels: string[]) => void;
}

const TableOptions = ({
  handleFilterFormSubmit,
  handleGroupByColumnChange,
  handleGroupByColumnSortChange,
  handleDataChannelChange,
  handleInventorySelectedChange,
  handleUnitChange,
  groupByColumn,
  groupBySortDirection,
  filterByColumn,
  filterTextValue,
  unitSelected,
  dataChannelSelected,
  inventoryStateSelected,
  dataChannelOptions,
  inventoryStateOptions,
}: Props) => {
  const { t } = useTranslation();
  const [selectedDataChannels, setSelectedDataChannels] = useState<
    DataChannelType[] | undefined
  >(dataChannelSelected);

  const [selectedInventoryLevels, setSelectedInventoryLevels] = useState<
    string[]
  >(inventoryStateSelected || []);

  // Filter bar & tooltip
  const [hideFilterBar, setHideFilterBar] = useState(true);

  const toggleFilterBarVisibility = () => {
    setHideFilterBar((prevState) => !prevState);
  };

  const dataChannelTypeTextMapping = buildDataChannelTypeTextMapping(t);
  const unitTypeOptions = getUnitDisplayTypeOptions(t);
  const groupByOptions = [
    {
      label: t('enum.assetsummarygroupingoptions.none', 'None'),
      value: AssetSummaryGroupingOptions.None,
    },
    {
      label: t(
        'enum.assetsummarygroupingoptions.customername',
        'Customer Name'
      ),
      value: AssetSummaryGroupingOptions.CustomerName,
    },
    {
      label: t('enum.assetsummarygroupingoptions.asset', 'Asset'),
      value: AssetSummaryGroupingOptions.Asset,
    },
    // {
    //   label: t(
    //     'enum.assetsummarygroupingoptions.assetlocation',
    //     'Asset Location'
    //   ),
    //   value: AssetSummaryGroupingOptions.Location,
    // },
  ];

  useEffect(() => setSelectedInventoryLevels(inventoryStateSelected || []), [
    inventoryStateSelected,
  ]);

  useEffect(() => setSelectedDataChannels(dataChannelSelected), [
    dataChannelSelected,
  ]);

  const renderSortIcon = (SortDirection: any) => {
    if (SortDirection) {
      return (
        <StyledSortDownIcon
          aria-label="Group by sort direction"
          aria-sort="descending"
          onClick={() => {
            handleGroupByColumnSortChange();
          }}
        />
      );
    }
    return (
      <StyledSortUpIcon
        aria-label="Group by sort direction"
        aria-sort="ascending"
        onClick={() => {
          handleGroupByColumnSortChange();
        }}
      />
    );
  };

  return (
    <StyledWrapper>
      <Collapse in={!hideFilterBar} timeout={0}>
        <StyledFilterBox>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
            spacing={2}
          >
            <Grid item>
              <FilterForm
                externalFilterByColumn={filterByColumn}
                externalFilterByInputText={filterTextValue}
                onSubmit={handleFilterFormSubmit}
              />
            </Grid>
            <Grid item>
              <Grid container alignItems="flex-end" spacing={1}>
                <Grid item>
                  <StyledTextField
                    id="groupBy-input"
                    select
                    label={
                      <FieldLabel>
                        {t('ui.common.groupby', 'Group By')}
                      </FieldLabel>
                    }
                    onChange={handleGroupByColumnChange}
                    value={groupByColumn}
                    style={{ minWidth: 168 }}
                    InputProps={{
                      style: { height: 40, overflow: 'hidden' },
                    }}
                  >
                    {groupByOptions.map((option) => (
                      <MenuItem key={option.label} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </StyledTextField>
                </Grid>

                {groupByColumn !== AssetSummaryGroupingOptions.None && (
                  <Grid item>{renderSortIcon(groupBySortDirection)}</Grid>
                )}
              </Grid>
            </Grid>
            <Grid item>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <StyledTextField
                    id="units-input"
                    select
                    label={
                      <FieldLabel>{t('ui.common.units', 'Units')}</FieldLabel>
                    }
                    onChange={handleUnitChange}
                    value={unitSelected}
                    style={{ minWidth: 168 }}
                    InputProps={{
                      style: { height: 40, overflow: 'hidden' },
                    }}
                  >
                    {unitTypeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </StyledTextField>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <MultiSelect<DataChannelType>
                    id="dataChannel-input"
                    options={dataChannelOptions}
                    value={selectedDataChannels!}
                    setValue={setSelectedDataChannels}
                    label={
                      <FieldLabel>
                        {t('ui.common.datachannels', 'Data Channels')}
                      </FieldLabel>
                    }
                    onClose={(selectedOptions) =>
                      handleDataChannelChange(selectedOptions)
                    }
                    renderValue={(option) => {
                      // @ts-ignore
                      return dataChannelTypeTextMapping[option];
                    }}
                    style={{ width: 250 }}
                    InputProps={{
                      style: { height: 40, overflow: 'hidden' },
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <MultiSelect<string>
                    id="inventoryStates-input"
                    options={inventoryStateOptions}
                    value={selectedInventoryLevels}
                    setValue={setSelectedInventoryLevels}
                    label={
                      <FieldLabel>
                        {t(
                          'ui.assetsummary.inventorystatesfilter',
                          'Inventory States'
                        )}
                      </FieldLabel>
                    }
                    renderValue={(option) => option}
                    onClose={() =>
                      handleInventorySelectedChange(selectedInventoryLevels)
                    }
                    style={{ width: 250 }}
                    InputProps={{
                      style: { height: 40, overflow: 'hidden' },
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </StyledFilterBox>
      </Collapse>
      <FilterTooltip
        toggleFilterBarVisibility={toggleFilterBarVisibility}
        filterTextValue={filterTextValue}
        filterByColumn={filterByColumn}
        groupByColumn={groupByColumn}
        unitSelected={unitSelected}
        dataChannelSelected={dataChannelSelected}
        dataChannelOptions={dataChannelOptions}
        inventoryStateSelected={inventoryStateSelected}
        inventoryStateOptions={inventoryStateOptions}
        hideFilterBar={hideFilterBar}
      />
    </StyledWrapper>
  );
};

export default TableOptions;
