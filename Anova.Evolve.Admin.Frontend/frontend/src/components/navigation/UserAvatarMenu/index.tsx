import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import { SettingsBrightnessOutlined } from '@material-ui/icons';
import { ReactComponent as LanguageIcon } from 'assets/icons/language.svg';
import { ReactComponent as LogoutIcon } from 'assets/icons/logout.svg';
import { ReactComponent as UserProfileIcon } from 'assets/icons/user-profile.svg';
import StyledAvatar from 'components/Avatar';
import BasicSwitch from 'components/forms/styled-fields/BasicSwitch';
import Menu from 'components/Menu';
import {
  StyledMenuItem,
  StyledMenuItemDivider,
  StyledMenuItemText,
  StyledNavbarCaretButton,
} from 'components/navigation/common';
import {
  IS_DEV_TOGGLE_DARK_THEME_EVERYWHERE_FEATURE_ENABLED,
  IS_TOGGLE_DARK_THEME_FEATURE_ENABLED,
} from 'env';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { setIsDarkThemeEnabled } from 'redux-app/modules/app/actions';
import { selectIsDarkThemeEnabled } from 'redux-app/modules/app/selectors';
import { performLogout } from 'redux-app/modules/user/actions';
import {
  selectCanUserEditTheirProfile,
  selectUser,
} from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { Language as LanguageChoice } from 'types';
import { getIsLightOrDarkThemeForPathname } from 'utils/theme-availability';

const StyledSwitch = styled(BasicSwitch)`
  & .MuiSwitch-switchBase:not(.Mui-checked) {
    color: #fafafa;
  }
`;

const StyledSmallMenuItemText = styled(Typography)`
  font-size: 11px;
  color: ${(props) => props.theme.palette.text.secondary};
  margin-left: 16px;
`;

interface Props {
  languageRoute: string;
  userProfileRoute: string;
}

const UserAvatarMenu = ({ languageRoute, userProfileRoute }: Props) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const canUserEditTheirProfile = useSelector(selectCanUserEditTheirProfile);
  const isDarkThemeEnabled = useSelector(selectIsDarkThemeEnabled);
  const canChangeThemeForPathname = getIsLightOrDarkThemeForPathname(
    location.pathname
  );
  const canViewDarkThemeSwitch =
    IS_DEV_TOGGLE_DARK_THEME_EVERYWHERE_FEATURE_ENABLED ||
    (IS_TOGGLE_DARK_THEME_FEATURE_ENABLED && canChangeThemeForPathname);

  const user = useSelector(selectUser);
  const userInfo =
    user.data?.authenticateAndRetrieveApplicationInfoResult?.userInfo;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleChecked = () => {
    dispatch(setIsDarkThemeEnabled(!isDarkThemeEnabled));
  };

  const selectedLanguageMapping = {
    [LanguageChoice.English]: t('enum.displaylanguage.en.us', 'English'),
    [LanguageChoice.German]: t('enum.displaylanguage.de', 'German'),
    [LanguageChoice.Spanish]: t('enum.displaylanguage.es', 'Spanish'),
    [LanguageChoice.French]: t('enum.displaylanguage.fr.ca', 'French'),
    [LanguageChoice.Thai]: t('enum.displaylanguage.th', 'Thai'),
    [LanguageChoice.ChineseSimplified]: t(
      'enum.displaylanguage.zh.hans',
      'Chinese (Simplified)'
    ),
    [LanguageChoice.ChineseTraditional]: t(
      'enum.displaylanguage.zh.hant',
      'Chinese (Traditional)'
    ),
  };

  return (
    <>
      <StyledNavbarCaretButton
        id="user-avatar-button"
        variant="text"
        onClick={handleButtonClick}
        aria-label="user avatar"
        aria-controls="user-settings-menu"
        aria-haspopup="true"
        aria-expanded={Boolean(anchorEl)}
        style={{ padding: '8px 12px' }}
      >
        <StyledAvatar>
          {userInfo?.firstName?.charAt(0).toLocaleUpperCase()}
        </StyledAvatar>
      </StyledNavbarCaretButton>
      <Menu
        id="user-settings-menu"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <li>
          <StyledMenuItem
            // @ts-ignore
            component={Link}
            to={languageRoute}
            onClick={handleMenuClose}
          >
            <ListItemIcon>
              <LanguageIcon />
            </ListItemIcon>
            <StyledMenuItemText>
              {t('ui.main.language', 'Language')}
            </StyledMenuItemText>
            <StyledSmallMenuItemText>
              {/*
                // @ts-ignore */}
              {selectedLanguageMapping[i18n.language]}
            </StyledSmallMenuItemText>
          </StyledMenuItem>
        </li>
        {canUserEditTheirProfile && (
          <StyledMenuItem
            // @ts-ignore
            component={Link}
            to={userProfileRoute}
            onClick={handleMenuClose}
          >
            <ListItemIcon>
              <UserProfileIcon />
            </ListItemIcon>
            <StyledMenuItemText>
              {t('ui.main.profile', 'Profile')}
            </StyledMenuItemText>
          </StyledMenuItem>
        )}
        {canViewDarkThemeSwitch && (
          <StyledMenuItem>
            <ListItemIcon>
              <SettingsBrightnessOutlined />
            </ListItemIcon>
            <StyledMenuItemText>
              {t('ui.domainEditor.theme', 'Theme')}
            </StyledMenuItemText>
            <StyledSwitch
              size="small"
              checked={isDarkThemeEnabled}
              onChange={toggleChecked}
            />
            <StyledSmallMenuItemText>
              {isDarkThemeEnabled
                ? t('ui.theme.dark', 'Dark')
                : t('ui.theme.light', 'Light')}
            </StyledSmallMenuItemText>
          </StyledMenuItem>
        )}
        <StyledMenuItemDivider
          // @ts-ignore
          component="li"
        />

        <StyledMenuItem
          onClick={() => {
            dispatch(performLogout());
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <StyledMenuItemText>
            {t('ui.main.logout', 'Logout')}
          </StyledMenuItemText>
        </StyledMenuItem>
      </Menu>
    </>
  );
};

export default UserAvatarMenu;
