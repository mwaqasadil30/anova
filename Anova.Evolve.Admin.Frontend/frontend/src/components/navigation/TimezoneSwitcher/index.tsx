import Hidden from '@material-ui/core/Hidden';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { EvolveTimezoneInfo } from 'api/admin/api';
import { ReactComponent as ClockSimpleIcon } from 'assets/icons/icn-clock.svg';
import {
  StyledCaretIcon,
  StyledNavbarCaretButton,
} from 'components/navigation/common';
import momentTimezone from 'moment-timezone';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentTimezone } from 'redux-app/modules/app/actions';
import {
  selectCurrentTimezone,
  selectTimezones,
} from 'redux-app/modules/app/selectors';
import styled from 'styled-components';

const NavbarButton = styled(StyledNavbarCaretButton)`
  max-width: 350px;
  && {
    padding-left: 12px;
    padding-right: 12px;
  }
`;

const TimezoneDisplayName = styled(Typography)`
  font-size: 14px;
  font-weight: 500;
`;

interface Props {
  condensed: 'sm' | 'md';
}

const TimezoneSwitcher = ({ condensed }: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const timezonesData = useSelector(selectTimezones);
  const currentTimezoneData = useSelector(selectCurrentTimezone);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleSelectTimezone = (timezone: EvolveTimezoneInfo) => {
    if (timezone.ianaTimezoneId) {
      momentTimezone.tz.setDefault(timezone.ianaTimezoneId);
    }
    dispatch(setCurrentTimezone(timezone));
  };

  return (
    <>
      <NavbarButton
        id="timezone-dropdown-button"
        variant="text"
        color="inherit"
        endIcon={<StyledCaretIcon />}
        onClick={handleButtonClick}
        disabled={timezonesData.loading || currentTimezoneData.loading}
        disableFocusRipple
        aria-haspopup="true"
        aria-expanded={Boolean(anchorEl)}
      >
        <Hidden
          {...(condensed && condensed === 'sm' && { smDown: true })}
          {...(condensed && condensed === 'md' && { mdDown: true })}
        >
          <TimezoneDisplayName noWrap>
            {currentTimezoneData.timezone?.displayName || (
              <em>{t('ui.common.select', 'Select')}</em>
            )}
          </TimezoneDisplayName>
        </Hidden>
        <Hidden
          {...(condensed && condensed === 'sm' && { mdUp: true })}
          {...(condensed && condensed === 'md' && { lgUp: true })}
        >
          <ClockSimpleIcon />
        </Hidden>
      </NavbarButton>
      <Popover
        id="timezone-dropdown-menu"
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
          'aria-labelledby': 'timezone-dropdown-button',
        }}
      >
        <MenuList>
          {timezonesData.timezones.map((timezone) => (
            <MenuItem
              key={timezone.timezoneId!}
              selected={
                timezone.timezoneId === currentTimezoneData.timezone?.timezoneId
              }
              onClick={() => {
                handleSelectTimezone(timezone);
                handlePopoverClose();
              }}
            >
              {timezone.displayName}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </>
  );
};

export default TimezoneSwitcher;
