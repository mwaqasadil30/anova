/* eslint-disable indent */
import Hidden from '@material-ui/core/Hidden';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { DomainDetailDto } from 'api/admin/api';
import { queryClient } from 'api/react-query/helpers';
import { ReactComponent as WorldIcon } from 'assets/icons/icn-globe.svg';
import DropdownAutocomplete from 'components/forms/styled-fields/DropdownAutocomplete';
import {
  StyledCaretIcon,
  StyledNavbarCaretButton,
} from 'components/navigation/common';
import { useRetrieveCurrentUserAccessibleDomains } from 'hooks/useRetrieveCurrentUserAccessibleDomains';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveDomainById } from 'redux-app/modules/app/actions';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';

const StyledCaretButton = styled(StyledNavbarCaretButton)`
  & .MuiButton-startIcon {
    ${(props) => props.theme.breakpoints.down('sm')} {
      margin-right: 0px;
    }
  }
`;

const StyledDropdownOptionsText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

interface Props {
  onSelectDomain?: (domain?: DomainDetailDto) => void;
}

const DomainSwitcher = ({ onSelectDomain }: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const retrieveCurrentUserAccessibleDomainsApi = useRetrieveCurrentUserAccessibleDomains(
    !!anchorEl
  );

  const accessibleDomains = retrieveCurrentUserAccessibleDomainsApi.data || [];
  const activeDomain = useSelector(selectActiveDomain);

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleSelectDomain = (domain: DomainDetailDto) => {
    dispatch(setActiveDomainById(domain.domainId));
    handlePopoverClose();
    onSelectDomain?.(domain);
    // Clear all queries so no cache persists when a user changes domains.
    queryClient.clear();
  };

  return (
    <>
      <StyledCaretButton
        id="domain-dropdown-button"
        variant="text"
        color="inherit"
        startIcon={<WorldIcon />}
        endIcon={<StyledCaretIcon />}
        onClick={handleButtonClick}
        disableFocusRipple
        aria-haspopup="true"
        aria-expanded={Boolean(anchorEl)}
        disabled={activeDomain?.isFetching}
      >
        <Hidden smDown>
          {activeDomain?.name || <em>{t('ui.common.select', 'Select')}</em>}
        </Hidden>
      </StyledCaretButton>

      <Popover
        id="domain-dropdown-menu"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        open={Boolean(anchorEl)}
        onClose={handlePopoverClose}
        // Remove transition to prevent autocomplete menu from
        // overlapping the autocomplete input
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
        <DropdownAutocomplete<DomainDetailDto>
          isOpen={Boolean(anchorEl)}
          options={accessibleDomains}
          getOptionLabel={(option) => option?.name || ''}
          onChange={(_: any, domain) => {
            if (domain) {
              handleSelectDomain(domain);
            }
          }}
          renderOption={(option) => (
            <StyledDropdownOptionsText>{option.name}</StyledDropdownOptionsText>
          )}
          style={{ width: 300 }}
          loading={retrieveCurrentUserAccessibleDomainsApi.isLoading}
        />
      </Popover>
    </>
  );
};

export default DomainSwitcher;
