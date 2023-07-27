/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import {
  AssetListFilterOptions,
  AssetSummaryGroupingOptions,
  DataChannelType,
} from 'api/admin/api';
import {
  defaultGroupByColumn,
  defaultUnitDisplayType,
} from 'apps/ops/containers/AssetSummaryLegacy/helpers';
import { ReactComponent as FilterToggleIcon } from 'assets/icons/filter-toggle.svg';
import Button from 'components/Button';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { white } from 'styles/colours';
import { UnitDisplayType } from 'types';
import {
  buildDataChannelTypeTextMapping,
  buildUnitDisplayTypeTextMapping,
} from 'utils/i18n/enum-to-text';
import {
  numberOfActiveFilters,
  truncateListWithMoreText,
} from '../TableOptions/helpers';
import FormattedTooltipText from '../FormattedTooltipText';

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
    background-color: ${white};
    box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.25);
  }
  & .MuiTooltip-arrow {
    color: ${white};
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
  box-shadow: 0px 3px 10px rgba(159, 178, 189, 0.2);

  && .MuiButton-startIcon {
    // NOTE: Not using transitions for now since the asset summary
    // table makes it very choppy
    // transition: transform 0.25s linear;
    transform: ${(props) => (props.hide ? `rotate(180deg)` : `rotate(0deg)`)};
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

interface Props {
  filterTextValue?: string;
  filterByColumn?: AssetListFilterOptions;
  groupByColumn: AssetSummaryGroupingOptions;
  unitSelected: UnitDisplayType;
  dataChannelSelected?: DataChannelType[];
  dataChannelOptions: DataChannelType[];
  inventoryStateSelected?: string[];
  inventoryStateOptions: string[];
  hideFilterBar: boolean;
  toggleFilterBarVisibility: () => void;
}

const FilterTooltip = ({
  filterTextValue,
  filterByColumn,
  groupByColumn,
  unitSelected,
  dataChannelSelected,
  dataChannelOptions,
  inventoryStateSelected,
  inventoryStateOptions,
  hideFilterBar,
  toggleFilterBarVisibility,
}: Props) => {
  const { t } = useTranslation();

  const [showTooltip, setShowTooltip] = useState(false);

  const dataChannelTypeTextMapping = buildDataChannelTypeTextMapping(t);

  const totalActiveFilters = numberOfActiveFilters({
    currentFilterByText: filterTextValue,
    currentGroupBy: groupByColumn,
    currentSelectedUnits: unitSelected,
    currentDataChannels: dataChannelSelected,
    dataChannelOptions,
    currentInventoryStates: inventoryStateSelected,
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

  const translatedDataChannelTypes = dataChannelSelected?.map(
    (dataChannelType) => dataChannelTypeTextMapping[dataChannelType]
  );
  const formattedDataChannelTypes = truncateListWithMoreText(
    translatedDataChannelTypes!,
    t
  );

  const formattedInventoryStates = truncateListWithMoreText(
    inventoryStateSelected,
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
                  filterText={filterByOptionMapping[filterByColumn!]}
                />
                <FormattedTooltipText
                  filterType={t('ui.common.search', 'Search')}
                  filterText={`"${filterTextValue}"`}
                />
              </>
            )}
            {groupByColumn !== defaultGroupByColumn && (
              <FormattedTooltipText
                filterType={t('ui.common.groupby', 'Group By')}
                filterText={groupByOptionsMapping[groupByColumn]}
              />
            )}
            {unitSelected !== defaultUnitDisplayType && (
              <FormattedTooltipText
                filterType={t('ui.common.units', 'Units')}
                filterText={unitDisplayTypeTextMapping[unitSelected]}
              />
            )}
            {dataChannelSelected &&
              dataChannelSelected.length !== dataChannelOptions.length && (
                <FormattedTooltipText
                  filterType={t('ui.common.datachannels', 'Data Channels')}
                  filterText={formattedDataChannelTypes}
                />
              )}
            {inventoryStateSelected &&
              inventoryStateSelected?.length !==
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
              <StyledCircle>{totalActiveFilters}</StyledCircle>
            </Grid>
          </Grid>
        </StyledFilterToggleButton>
      </div>
    </StyledTooltip>
  );
};

export default FilterTooltip;
