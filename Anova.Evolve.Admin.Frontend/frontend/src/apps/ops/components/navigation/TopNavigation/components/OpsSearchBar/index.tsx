/* eslint-disable indent */
import Hidden from '@material-ui/core/Hidden';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import Popover from '@material-ui/core/Popover';
import { ReactComponent as TabletSearchIcon } from 'assets/icons/search-ops-tablet.svg';
import { ReactComponent as SearchIcon } from 'assets/icons/search-top-nav-ops.svg';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import React from 'react';
import styled from 'styled-components';
import { StyledNavbarCaretButton } from 'components/navigation/common';
import { useTranslation } from 'react-i18next';

const StyledAutocompleteSearchTextField = styled(StyledTextField)`
  .MuiAutocomplete-inputRoot[class*='MuiInput-root']
    .MuiAutocomplete-input:first-child {
    padding: 6px 0 7px 0;
  }
`;

const OpsSearchBar = () => {
  const { t } = useTranslation();

  const [
    searchAnchorEl,
    setSearchAnchorEl,
  ] = React.useState<null | HTMLElement>(null);

  const handleSearchClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSearchAnchorEl(event.currentTarget);
  };

  const handleSearchClose = () => {
    setSearchAnchorEl(null);
  };

  return (
    <>
      <Hidden lgUp>
        <Grid item>
          <StyledNavbarCaretButton
            variant="text"
            onClick={handleSearchClick}
            disableFocusRipple
          >
            <TabletSearchIcon />
          </StyledNavbarCaretButton>

          <Popover
            id="search-dropdown-menu"
            anchorEl={searchAnchorEl}
            getContentAnchorEl={null}
            open={Boolean(searchAnchorEl)}
            onClose={handleSearchClose}
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
              square: true,
            }}
          >
            <StyledAutocompleteSearchTextField
              placeholder={t('ui.common.search', 'Search')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Popover>
        </Grid>
      </Hidden>
      <Hidden mdDown>
        <Grid item xs={2}>
          <Box mr={2}>
            <StyledTextField
              placeholder={t('ui.common.search', 'Search')}
              InputProps={{
                style: {
                  height: 32,
                  overflow: 'hidden',
                  padding: 8,
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Grid>
      </Hidden>
    </>
  );
};

export default OpsSearchBar;
