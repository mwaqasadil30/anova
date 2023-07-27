/* eslint-disable indent */
import AppBar, { AppBarProps } from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import {
  createStyles,
  fade,
  makeStyles,
  Theme,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { ReactComponent as CaretIcon } from 'assets/icons/caret.svg';
import { ReactComponent as NotesIcon } from 'assets/icons/domain-notes.svg';
import Button from 'components/Button';
import TopNavigationToolbar from 'components/navigation/TopNavigationToolbar';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectIsDarkThemeEnabled } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import { gray900 } from 'styles/colours';
import {
  closedSidebarWidth,
  navbarHeight,
  openedSidebarWidth,
} from 'styles/theme';

export const StyledCaretIcon = styled(CaretIcon)``;

export const StyledNavbarCaretButton = styled(Button)`
  && {
    border-radius: 0;
    padding: 8px 15px;
    min-height: ${navbarHeight}px;
  }

  & [class*='MuiButton-endIcon'] svg {
    margin-left: 8px;
    padding-right: 8px;
  }
`;

export const StyledNotesIcon = styled(NotesIcon)``;

export const StyledMenuLinkWithIcon = styled(Link)`
  display: flex;
  text-decoration: none;
`;

export const StyledNavText = styled(Typography)`
  font-weight: 500;
  font-size: 14px;
`;

export const StyledDivider = styled(Divider)`
  && {
    height: 31px;
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

export const StyledLogoLink = styled(Link)`
  /* Background is always white in both light and dark theme */
  background: white;
  display: flex;
  height: 100%;
  align-items: center;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding: 0 10px;
`;

export const StyledMenuItem = styled(MenuItem)`
  min-width: 200px;
  color: ${(props) => props.theme.palette.text.secondary};

  & [class*='MuiListItemIcon-root'] {
    min-width: 36px;
    color: ${(props) => props.theme.palette.text.secondary};
  }
`;

export const StyledMenuItemText = styled(ListItemText)`
  & [class*='MuiListItemText-primary'] {
    font-size: 14px;
    font-weight: 500;
    color: ${(props) => props.theme.palette.text.secondary};
  }
`;

export const StyledMenuItemDivider = styled(Divider)`
  margin: 8px 24px;
`;

const CustomAppBar = styled(AppBar)<{
  $isDarkThemeEnabledGlobally?: boolean;
}>``;

export const StyledAppBar = (props: AppBarProps) => {
  const isDarkThemeEnabledGlobally = useSelector(selectIsDarkThemeEnabled);
  return (
    <CustomAppBar
      {...props}
      $isDarkThemeEnabledGlobally={isDarkThemeEnabledGlobally}
    />
  );
};

export const LeftNavContent = styled.div`
  flex-grow: 1;
  height: 100%;
  align-items: center;
  /*
    The logo has a bit of padding in dark mode, so we adjust the left margin
    so it's spaced after the AppSwitcher
  */
  margin-left: ${(props) => (props.theme.palette.type === 'light' ? 0 : 10)}px;
`;

export const StyledToolbar = styled(TopNavigationToolbar)`
  height: ${navbarHeight}px;
`;

export const useTopNavigationStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      // Used in the top navbar to prevent the Material UI Grid padding from
      // overlapping the side nav icons (which prevented them from being
      // clicked only on the very top)
      overflow: 'hidden',
    },
    appBarShift: {
      marginLeft: openedSidebarWidth,
      width: `calc(100% - ${openedSidebarWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 20,
    },
    hide: {
      display: 'none',
    },
    // #region Operations top nav styling
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
    // #endregion Operations top nav styling
  })
);

export const useSideNavigationStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: openedSidebarWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerOpen: {
      width: openedSidebarWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: closedSidebarWidth + 1, // +1 border
    },
    drawerPaper: {
      border: 0,
    },
    mobileDrawerPaper: (props: { topOffset: number }) => ({
      border: 0,
      top: props.topOffset,
      background: gray900,
      height: `calc(100% - ${props.topOffset}px)`,
    }),
    list: {
      overflowY: 'auto',
      overflowX: 'hidden',
      display: 'flex',
      flex: 1,
      '&::-webkit-scrollbar': {
        width: 5,
      },
      // Custom scrollbar styles
      // Firefox
      scrollbarColor: '#999 transparent',
      scrollbarWidth: 'thin',
      // Chrome
      '&::-webkit-scrollbar-thumb:vertical': {
        margin: 5,
        backgroundColor: '#999',
        '-webkit-border-radius': 5,
        borderRadius: 5,
      },
      '&::-webkit-scrollbar-button:start:decrement, &::-webkit-scrollbar-button:end:increment': {
        height: 5,
        display: 'block',
      },
    },
  })
);
