/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import { ProblemReportFilter, TagDto } from 'api/admin/api';
import { ProblemReportStatusFilterEnum } from 'apps/ops/types';
import { ReactComponent as FilterToggleIcon } from 'assets/icons/filter-toggle.svg';
import Button from 'components/Button';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { white } from 'styles/colours';
import { buildProblemReportStatusEnumTextMapping } from 'utils/i18n/enum-to-text';
import { defaultStatusType } from '../../helpers';
import FormattedTooltipText from '../FormattedTooltipText';
import { numberOfActiveFilters } from '../TableOptions/helpers';

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
  filterTextValue?: string | null;
  filterByColumn?: ProblemReportFilter;
  statusSelected: ProblemReportStatusFilterEnum;
  tagData?: TagDto[] | null;
  // dataChannelSelected?: DataChannelType[];
  // dataChannelOptions: DataChannelType[];
  hideFilterBar: boolean;
  toggleFilterBarVisibility: () => void;
}

const FilterTooltip = ({
  filterTextValue,
  filterByColumn,
  statusSelected,
  tagData,
  hideFilterBar,
  toggleFilterBarVisibility,
}: Props) => {
  const { t } = useTranslation();

  const [showTooltip, setShowTooltip] = useState(false);

  const totalActiveFilters = numberOfActiveFilters({
    currentFilterByText: filterTextValue,
    currentSelectedStatus: statusSelected,
    currentSelectedTags: tagData,
  });

  const filterButtonText = hideFilterBar
    ? t('ui.common.showfilters', 'Show Filters')
    : t('ui.common.hidefilters', 'Hide Filters');

  const shipToText = t(
    'enum.problemreportdatachannelfilterby.shipto',
    'Ship To'
  );
  const rtuText = t('enum.problemreportdatachannelfilterby.rtu', 'RTU');
  const assetTitleText = t(
    'enum.problemreportdatachannelfilterby.assettitle',
    'Asset Title'
  );
  const distributionText = t('ui.problemreport.distribution', 'Distribution');
  const ownerText = t('ui.problemreport.owner', 'Owner');
  const plantStatusText = t('ui.problemreport.plantstatus', 'Plant Status');
  const problemIdText = t('ui.problemreport.problemid', 'Problem ID');

  const filterByOptionMapping = {
    [ProblemReportFilter.ShipTo]: shipToText,
    [ProblemReportFilter.Rtu]: rtuText,
    [ProblemReportFilter.AssetTitle]: assetTitleText,
    [ProblemReportFilter.Owner]: ownerText,
    [ProblemReportFilter.PlantStatus]: plantStatusText,
    [ProblemReportFilter.ProblemId]: problemIdText,
    [ProblemReportFilter.Distribution]: distributionText,
  };

  const problemReportStatusEnumTextMapping = buildProblemReportStatusEnumTextMapping(
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
            {statusSelected !== defaultStatusType && (
              <FormattedTooltipText
                filterType={t('ui.problemreport.status', 'Status')}
                filterText={problemReportStatusEnumTextMapping[statusSelected]}
              />
            )}
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
            {!!tagData?.length && (
              <FormattedTooltipText
                filterType={t('ui.common.tags', 'Tags')}
                filterText={tagData
                  .map((tag) => {
                    return tag.name;
                  })
                  .join(', ')}
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
          </Grid>
        </StyledFilterToggleButton>
      </div>
    </StyledTooltip>
  );
};

export default FilterTooltip;
