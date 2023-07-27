import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import {
  DomainDetailDto,
  RTUSearchInfoListFilterOptionsEnum,
} from 'api/admin/api';
import { ReactComponent as WorldIcon } from 'assets/icons/icn-globe.svg';
import Button from 'components/Button';
import FieldLabel from 'components/forms/labels/FieldLabel';
import Checkbox from 'components/forms/styled-fields/Checkbox';
import DropdownAutocomplete from 'components/forms/styled-fields/DropdownAutocomplete';
import FieldGroup from 'components/forms/styled-fields/FieldGroup';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import {
  StyledCaretIcon,
  StyledNavbarCaretButton,
} from 'components/navigation/common';
import { useRetrieveCurrentUserAccessibleDomains } from 'hooks/useRetrieveCurrentUserAccessibleDomains';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { DomainDetailDtoSearchListOption, RouteState } from '../../types';
import DateRangePicker from '../DateRangePicker';

const StyledFieldGroup = styled(FieldGroup)`
  display: flex;
  align-items: flex-end;
`;

interface Props {
  onSubmit: (data: any) => void;
  onSelectDomain: (domainOrNull?: DomainDetailDto | null) => void;
  routeState?: RouteState;
  isLoadingOrFetching: boolean;
  includeSubDomain: boolean;
  setIncludeSubDomain: (includeSubDomain: boolean) => void;
  showDeleted: boolean;
  setShowDeletedRTU: (showDeletedRtu: boolean) => void;
  selectedDomain?: DomainDetailDto | null;

  startDate?: Date;
  setStartDate?: React.Dispatch<React.SetStateAction<Date>>;
  endDate?: Date;
  setEndDate?: React.Dispatch<React.SetStateAction<Date>>;
}

interface Option {
  label: string;
  value: string;
}

const SearchForm = ({
  onSubmit,
  onSelectDomain,
  selectedDomain,
  routeState,
  isLoadingOrFetching,
  includeSubDomain,
  setIncludeSubDomain,
  setShowDeletedRTU,
  showDeleted,
}: Props) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [
    filterByColumn,
    setFilterByColumn,
  ] = useState<RTUSearchInfoListFilterOptionsEnum>(
    routeState?.filterByColumn || RTUSearchInfoListFilterOptionsEnum.RTU
  );
  const [startDate, setStartDate] = useState(
    routeState?.startDate || new Date()
  );
  const [endDate, setEndDate] = useState(routeState?.endDate || new Date());

  const [filterByInputText, setFilterByInputText] = useState(
    routeState?.filterTextValue || ''
  );
  const retrieveCurrentUserAccessibleDomainsApi = useRetrieveCurrentUserAccessibleDomains(
    !!anchorEl
  );
  const accessibleDomains = retrieveCurrentUserAccessibleDomainsApi.data || [];
  const accessibleDomainsWithNullOption = ([
    { name: t('ui.common.alldomains', 'All Domains'), isAllDomains: true },
  ] as DomainDetailDtoSearchListOption[]).concat(accessibleDomains);

  const handleFilterByColumnChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setFilterByInputText('');
    setFilterByColumn(event.target.value as RTUSearchInfoListFilterOptionsEnum);
  };

  const handleFilterByInputChange = (
    event: React.ChangeEvent<{ value: string }>
  ) => {
    setFilterByInputText(event.target.value);
  };
  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    onSubmit({
      ...(selectedDomain && { domainId: selectedDomain.domainId }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      includeSubDomain,
      showDeleted,
      filterByColumn,
      filterTextValue: filterByInputText,
    });
  };
  const handleDomainButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const handleDomainSelect = (domain: DomainDetailDtoSearchListOption) => {
    handlePopoverClose();
    if (domain.isAllDomains) {
      onSelectDomain(null);
    } else {
      onSelectDomain(domain);
    }
  };

  const rtuText = t('enum.RTUSearchInfoListFilterOptionsEnum.rtu', 'RTU');
  const siteText = t('enum.RTUSearchInfoListFilterOptionsEnum.site', 'Site');
  const assetText = t('enum.RTUSearchInfoListFilterOptionsEnum.asset', 'Asset');
  const rtuPhoneText = t(
    'enum.RTUSearchInfoListFilterOptionsEnum.rtuphone',
    'RTU Phone'
  );
  const rtuCreatedDateText = t(
    'enum.RTUSearchInfoListFilterOptionsEnum.rtucreateddate',
    'RTU Created Date'
  );
  const rtuPollScheduleGroupText = t(
    'enum.RTUSearchInfoListFilterOptionsEnum.rtupollschedulegroup',
    'RTU Poll Schedule Group'
  );

  const carrierText = t(
    'enum.RTUSearchInfoListFilterOptionsEnum.carrier',
    'Carrier'
  );
  const altDeviceIdText = t(
    'enum.RTUSearchInfoListFilterOptionsEnum.altDeviceIdText',
    'Alt Device ID'
  );

  const placeholderMapping = {
    [RTUSearchInfoListFilterOptionsEnum.RTU]: rtuText,
    [RTUSearchInfoListFilterOptionsEnum.Site]: siteText,
    [RTUSearchInfoListFilterOptionsEnum.Asset]: assetText,
    [RTUSearchInfoListFilterOptionsEnum.RTUPhone]: rtuPhoneText,

    [RTUSearchInfoListFilterOptionsEnum.RTUCreatedDate]: rtuCreatedDateText,
    [RTUSearchInfoListFilterOptionsEnum.RTUPollScheduleGroup]: rtuPollScheduleGroupText,

    [RTUSearchInfoListFilterOptionsEnum.Carrier]: carrierText,
    [RTUSearchInfoListFilterOptionsEnum.AltDeviceId]: altDeviceIdText,
  };

  // list of filter options
  const filterOptions = {
    RTU: {
      label: t('enum.RTUSearchInfoListFilterOptionsEnum.rtu', 'RTU'),
      value: RTUSearchInfoListFilterOptionsEnum.RTU.toString(),
    },
    Site: {
      label: t('enum.RTUSearchInfoListFilterOptionsEnum.site', 'Site'),
      value: RTUSearchInfoListFilterOptionsEnum.Site.toString(),
    },
    Asset: {
      label: t('enum.RTUSearchInfoListFilterOptionsEnum.asset', 'Asset'),
      value: RTUSearchInfoListFilterOptionsEnum.Asset.toString(),
    },
    RTUCreatedDate: {
      label: t(
        'enum.RTUSearchInfoListFilterOptionsEnum.rtucreateddate',
        'RTU Created Date'
      ),
      value: RTUSearchInfoListFilterOptionsEnum.RTUCreatedDate.toString(),
    },
    RTUPollScheduleGroup: {
      label: t(
        'enum.RTUSearchInfoListFilterOptionsEnum.rtupollschedulegroup',
        'RTU Poll Schedule Group'
      ),
      value: RTUSearchInfoListFilterOptionsEnum.RTUPollScheduleGroup.toString(),
    },
    RTUPhone: {
      label: t('enum.RTUSearchInfoListFilterOptionsEnum.rtuphone', 'RTU Phone'),
      value: RTUSearchInfoListFilterOptionsEnum.RTUPhone.toString(),
    },
    Carrier: {
      label: t('enum.RTUSearchInfoListFilterOptionsEnum.carrier', 'Carrier'),
      value: RTUSearchInfoListFilterOptionsEnum.Carrier.toString(),
    },
    AltDeviceId: {
      label: t(
        'enum.RTUSearchInfoListFilterOptionsEnum.altdeviceid',
        'Alt Device ID'
      ),
      value: RTUSearchInfoListFilterOptionsEnum.AltDeviceId.toString(),
    },
  };

  const isSearchButtonDisabled =
    (filterByColumn !== RTUSearchInfoListFilterOptionsEnum.RTUCreatedDate &&
      !filterByInputText) ||
    isLoadingOrFetching;

  return (
    <form onSubmit={handleSubmit}>
      {/* spacing 4 keeps items in line */}
      <Grid container alignItems="center" spacing={4}>
        <Grid item sm={11}>
          <Grid container alignItems="center" spacing={4}>
            <Grid item>
              <FieldLabel>{t('ui.common.searchby', 'Search By')}</FieldLabel>
            </Grid>
            <Grid item>
              <StyledFieldGroup>
                <StyledTextField
                  id="filterColumn-input"
                  select
                  fullWidth={false}
                  onChange={handleFilterByColumnChange}
                  value={filterByColumn}
                  style={{ minWidth: 160 }}
                  InputProps={{
                    style: { overflow: 'hidden' },
                  }}
                >
                  {Object.values(filterOptions).map((option: Option) => (
                    <MenuItem
                      key={option.value}
                      value={parseInt(option.value, 10)}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </StyledTextField>
                {/* eslint-disable indent */}
                {filterByColumn !==
                RTUSearchInfoListFilterOptionsEnum.RTUCreatedDate ? (
                  <StyledTextField
                    id="filterText-input"
                    fullWidth={false}
                    placeholder={t(
                      'ui.common.filterplaceholder',
                      `Enter {{filterOption}}`,
                      // @ts-ignore
                      { filterOption: placeholderMapping[filterByColumn] }
                    )}
                    onChange={handleFilterByInputChange}
                    value={filterByInputText}
                    style={{ minWidth: 280 }}
                    InputProps={{
                      style: { overflow: 'hidden' },
                    }}
                  />
                ) : (
                  <DateRangePicker
                    isFetching={isLoadingOrFetching}
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                  />
                )}
                {/* eslint-enable indent */}
              </StyledFieldGroup>
            </Grid>
            <Grid item>
              <StyledNavbarCaretButton
                id="domain-dropdown-button"
                variant="text"
                color="inherit"
                startIcon={<WorldIcon />}
                endIcon={<StyledCaretIcon />}
                onClick={handleDomainButtonClick}
                disableFocusRipple
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl)}
              >
                <Hidden smDown>
                  {selectedDomain?.name ||
                    t('ui.common.alldomains', 'All Domains')}
                </Hidden>
              </StyledNavbarCaretButton>

              <Popover
                id="domain-dropdown-menu"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                open={Boolean(anchorEl)}
                onClose={handlePopoverClose}
                transitionDuration={0}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                elevation={15}
                PaperProps={{
                  'aria-labelledby': 'domain-dropdown-button',
                  style: {
                    // Match the border radius of text fields
                    borderRadius: 5,
                  },
                }}
              >
                <DropdownAutocomplete<DomainDetailDtoSearchListOption>
                  isOpen={Boolean(anchorEl)}
                  options={accessibleDomainsWithNullOption}
                  getOptionLabel={(option) => option?.name || ''}
                  onChange={(_: any, domain) => {
                    if (domain) {
                      handleDomainSelect(domain);
                    }
                  }}
                  renderOption={(option) =>
                    option ? (
                      <Typography>{option.name}</Typography>
                    ) : (
                      <Typography>
                        {t('ui.common.alldomains', 'All Domains')}
                      </Typography>
                    )
                  }
                  style={{ width: 300 }}
                  loading={retrieveCurrentUserAccessibleDomainsApi.isLoading}
                />
              </Popover>
            </Grid>
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    name="includeSubDomain"
                    checked={routeState?.includeSubDomain}
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>,
                      isTrue: boolean
                    ) => {
                      setIncludeSubDomain(isTrue);
                    }}
                  />
                }
                label={t('ui.common.includesubdomain', 'Include Sub Domains')}
              />
            </Grid>
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    name="showDeleted"
                    checked={routeState?.showDeleted}
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>,
                      isTrue: boolean
                    ) => {
                      setShowDeletedRTU(isTrue);
                    }}
                  />
                }
                label={t('ui.common.showdeletedrtu', 'Show Deleted')}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={1}>
          <Grid container justify="flex-end">
            <Grid item xs={12}>
              <Box textAlign="right">
                <Button
                  type="submit"
                  variant="outlined"
                  disabled={isSearchButtonDisabled}
                >
                  {t('ui.common.search', 'Search')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default SearchForm;
