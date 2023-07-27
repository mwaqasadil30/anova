/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import {
  AssetListFilterOptions,
  AssetSummaryGroupingOptions,
  DataChannelType,
} from 'api/admin/api';
import {
  defaultGroupByColumn,
  defaultUnitDisplayType,
} from 'apps/ops/containers/AssetSummaryLegacy/helpers';
import { ReactComponent as ClearIcon } from 'assets/icons/clear-x.svg';
import { ReactComponent as FilterToggleIcon } from 'assets/icons/filter-toggle.svg';
import Button from 'components/Button';
import { StyledDivider } from 'components/navigation/common';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationState } from 'redux-app/modules/app/types';
import styled from 'styled-components';
import { white } from 'styles/colours';
import { UnitDisplayType } from 'types';
import {
  buildDataChannelTypeTextMapping,
  buildUnitDisplayTypeTextMapping,
} from 'utils/i18n/enum-to-text';
import {
  defaultFilterByColumn,
  getInitialStateValues,
  TooltipValues,
} from '../../helpers';
import { TableOptionsOutput } from '../../types';
import FormattedTooltipText from '../FormattedTooltipText';
import {
  numberOfActiveFilters,
  truncateListWithMoreText,
} from '../TableOptions/helpers';

// Styling the MUI tooltip with styled-components is a little custom:
// https://github.com/mui-org/material-ui/issues/11467#issuecomment-423845900
const StyledTooltip = styled((props) => (
  <Tooltip
    classes={{ popper: props.className, tooltip: 'tooltip' }}
    {...props}
  />
))`
  & .tooltip {
    max-width: none;
    font-size: 14px;
    background-color: ${(props) => props.theme.palette.background.paper};
    box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.25);
  }
  & .MuiTooltip-arrow {
    color: ${(props) => props.theme.palette.background.paper};
    font-size: 25px;
  }
`;

const StyledFilterToggleButton = styled(({ hide, ...props }) => (
  <Button {...props} />
))`
  color: ${(props) => props.theme.palette.text.secondary};
  background-color: ${(props) => props.theme.palette.background.paper};
  && {
    border-radius: ${(props) => (props.hide ? 'default' : '0 0 10px 10px')};
  }
  box-shadow: ${(props) =>
    props.theme.palette.type === 'light' &&
    '0px 3px 10px rgba(159, 178, 189, 0.2)'};

  && .MuiButton-startIcon {
    // NOTE: Not using transitions for now since the asset summary
    // table makes it very choppy
    // transition: transform 0.25s linear;
    transform: ${(props) => (props.hide ? `rotate(180deg)` : `rotate(0deg)`)};
  }
`;

const StyledClearAllButton = styled(({ hide, ...props }) => (
  <Button {...props} />
))`
  && {
    border: none;
    border-radius: 0 10px 10px 0;
    padding: 0px;
  }
  &&:hover {
    background: none;
  }

  &&.Mui-disabled {
    border: none;
    border-radius: 0 10px 10px 0;
    padding: 0px;
  }
`;

const StyledFilterToggleCaret = styled(FilterToggleIcon)``;

const StyledCircle = styled.div`
  width: 21px;
  height: 21px;
  background-color: #515151;
  border-radius: 50%;
  color: ${white};
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledVerticalDivider = styled(StyledDivider)`
  && {
    height: 23px;
    background-color: ${(props) =>
      props.theme.palette.type === 'light' ? '#e5e5e5' : '#686868'};
  }
`;

const StyledClearIcon = styled(ClearIcon)`
  height: 9px;
  color: ${(props) => props.theme.palette.text.secondary};
`;

const StyledClearAllText = styled(Typography)`
  font-size: 14px;
  font-weight: 400;
  color: ${(props) => props.theme.palette.text.secondary};
`;

interface Props {
  handleClearFilters: () => void;
  tooltipTextValues: TooltipValues;
  setTooltipTextValues: (data: TooltipValues) => void;
  filterTextValue?: string;
  groupByColumn: AssetSummaryGroupingOptions;
  unitSelected: UnitDisplayType;
  dataChannelOptions: DataChannelType[];
  inventoryStateOptions: string[];
  hideFilterBar: boolean;
  toggleFilterBarVisibility: () => void;
  setTableOptions: (data: TableOptionsOutput) => void;
  setUnitDisplayType: (data: UnitDisplayType) => void;
  opsNavData: ApplicationState['opsNavigationData'];
  dataChannels: DataChannelType[];
  inventoryStates: string[];
  inventoryStatusLevel: string[] | undefined;
  domainId: string;
}

const FilterTooltip = ({
  handleClearFilters,
  tooltipTextValues,
  setTooltipTextValues,
  filterTextValue,
  groupByColumn,
  unitSelected,
  dataChannelOptions,
  hideFilterBar,
  inventoryStateOptions,
  toggleFilterBarVisibility,
  setTableOptions,
  setUnitDisplayType,
  opsNavData,
  dataChannels,
  inventoryStates,
  inventoryStatusLevel,
  domainId,
}: Props) => {
  const { t } = useTranslation();

  const [showTooltip, setShowTooltip] = useState(false);

  const dataChannelTypeTextMapping = buildDataChannelTypeTextMapping(t);

  const totalActiveFilters = numberOfActiveFilters({
    currentFilterByText: tooltipTextValues.filterTextValue,
    currentGroupBy: tooltipTextValues.groupByColumn,
    currentSelectedUnits: tooltipTextValues.unitSelected,
    currentDataChannels: tooltipTextValues.dataChannelSelected,
    dataChannelOptions,
    currentInventoryStates: tooltipTextValues.inventoryStateSelected,
    inventoryStateOptions,
  });

  const filterButtonText = hideFilterBar
    ? t('ui.common.showfilters', 'Show Filters')
    : t('ui.common.hidefilters', 'Hide Filters');

  const assetTitleText = t('enum.assetlistfilteroptions.asset', 'Asset Title');
  const rtuText = t('enum.assetlistfilteroptions.rtu', 'RTU');
  const ftpIdText = t('enum.assetlistfilteroptions.ftpid', 'FTP ID');
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
  const noneText = t('enum.assetsummarygroupingoptions.none', 'None');
  const assetText = t('enum.assetsummarygroupingoptions.asset', 'Asset');
  const locationText = t(
    'enum.assetsummarygroupingoptions.assetlocation',
    'Asset Location'
  );

  const filterByOptionMapping = {
    [AssetListFilterOptions.Asset]: assetTitleText,
    [AssetListFilterOptions.RTU]: rtuText,
    [AssetListFilterOptions.FTPId]: ftpIdText,
    [AssetListFilterOptions.Product]: productText,
    [AssetListFilterOptions.CustomerName]: customerNameText,
    [AssetListFilterOptions.AllFields]: allFieldsText,
    [AssetListFilterOptions.Site]: assetLocationText,
  };

  const groupByOptionsMapping = {
    [AssetSummaryGroupingOptions.None]: noneText,
    [AssetSummaryGroupingOptions.CustomerName]: customerNameText,
    [AssetSummaryGroupingOptions.Asset]: assetText,
    [AssetSummaryGroupingOptions.Location]: locationText,
  };
  const unitDisplayTypeTextMapping = buildUnitDisplayTypeTextMapping(t);

  const translatedDataChannelTypes = tooltipTextValues.dataChannelSelected?.map(
    (dataChannelType) => dataChannelTypeTextMapping[dataChannelType]
  );
  const formattedDataChannelTypes = truncateListWithMoreText(
    translatedDataChannelTypes!,
    t
  );

  const formattedInventoryStates = truncateListWithMoreText(
    tooltipTextValues.inventoryStateSelected,
    t
  );

  const hasActiveFilters = totalActiveFilters > 0;
  return (
    <StyledTooltip
      title={
        !hasActiveFilters ? (
          ''
        ) : (
          <Box p={1}>
            {filterTextValue && (
              <>
                <FormattedTooltipText
                  filterType={t('ui.common.filterby', 'Filter By')}
                  filterText={
                    filterByOptionMapping[tooltipTextValues.filterByColumn!]
                  }
                />
                <FormattedTooltipText
                  filterType={t('ui.common.search', 'Search')}
                  filterText={`"${tooltipTextValues.filterTextValue}"`}
                />
              </>
            )}
            {groupByColumn !== defaultGroupByColumn && (
              <FormattedTooltipText
                filterType={t('ui.common.groupby', 'Group By')}
                filterText={
                  groupByOptionsMapping[tooltipTextValues.groupByColumn]
                }
              />
            )}
            {unitSelected !== defaultUnitDisplayType && (
              <FormattedTooltipText
                filterType={t('ui.common.units', 'Units')}
                filterText={
                  unitDisplayTypeTextMapping[tooltipTextValues.unitSelected]
                }
              />
            )}
            {tooltipTextValues.dataChannelSelected &&
              tooltipTextValues.dataChannelSelected.length !==
                dataChannelOptions.length && (
                <FormattedTooltipText
                  filterType={t('ui.common.datachannels', 'Data Channels')}
                  filterText={formattedDataChannelTypes}
                />
              )}
            {tooltipTextValues.inventoryStateSelected &&
              tooltipTextValues.inventoryStateSelected?.length !==
                inventoryStateOptions.length && (
                <FormattedTooltipText
                  filterType={t(
                    'ui.assetsummary.inventorystatesfilter',
                    'Inventory States'
                  )}
                  filterText={formattedInventoryStates}
                />
              )}
          </Box>
        )
      }
      placement="bottom"
      open={hideFilterBar && showTooltip}
      arrow
    >
      <div
        style={{
          position: 'absolute',
          // NOTE: Not using transitions for now since the asset summary
          // table makes it very choppy
          // transition: 'bottom 0.25s linear',
          bottom: hideFilterBar ? -50 : -41,
          left: 0,
        }}
      >
        <StyledFilterToggleButton
          hide={hideFilterBar}
          startIcon={<StyledFilterToggleCaret />}
          onClick={toggleFilterBarVisibility}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Grid container spacing={1} alignItems="center">
            <Grid item xs="auto">
              {filterButtonText}
            </Grid>
            <Grid item xs>
              <StyledCircle aria-label="Active filter count">
                {totalActiveFilters}
              </StyledCircle>
            </Grid>
            <Grid item style={{ paddingLeft: '10px' }}>
              <StyledVerticalDivider orientation="vertical" flexItem />
            </Grid>
            <Grid item xs="auto" style={{ padding: '2px' }}>
              <StyledClearAllButton
                variant="outlined"
                disableRipple
                onClick={(event: any) => {
                  event.stopPropagation();

                  setTableOptions(
                    getInitialStateValues({
                      opsNavData,
                      defaultDataChannels: dataChannels,
                      defaultInventoryStates: inventoryStates,
                      inventoryStatusQuery: inventoryStatusLevel,
                      defaultDomainId: domainId,
                      disableInitialFetch: false, // Set to false to be able to fetch all records
                    })
                  );
                  // Clear the totalActiveFilter count above + tooltip hover text.
                  setTooltipTextValues({
                    filterTextValue: '',
                    filterByColumn: defaultFilterByColumn,
                    groupByColumn: defaultGroupByColumn,
                    unitSelected: defaultUnitDisplayType,
                    dataChannelSelected: dataChannels,
                    inventoryStateSelected: inventoryStates,
                  });
                  setUnitDisplayType(UnitDisplayType.Display);
                  handleClearFilters();
                }}
                disabled={!hasActiveFilters}
              >
                <Grid container alignItems="center">
                  <Grid item style={{ padding: '0 10px 0 8px' }}>
                    <StyledClearIcon />
                  </Grid>
                  <Grid item>
                    <StyledClearAllText>
                      {t('ui.common.clearAll', 'Clear All')}
                    </StyledClearAllText>
                  </Grid>
                </Grid>
              </StyledClearAllButton>
            </Grid>
          </Grid>
        </StyledFilterToggleButton>
      </div>
    </StyledTooltip>
  );
};

export default FilterTooltip;
