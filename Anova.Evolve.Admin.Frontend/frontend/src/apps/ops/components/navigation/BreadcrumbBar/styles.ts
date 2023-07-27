/* eslint-disable indent */
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CancelSharpIcon from '@material-ui/icons/CancelSharp';
import { ReactComponent as FavoritesStar } from 'assets/icons/favorites-star.svg';
import { ReactComponent as GroupIcon } from 'assets/icons/updated-group-icon.svg';
import { ReactComponent as TreeFolder } from 'assets/icons/updated-tree-folder.svg';
import { ReactComponent as BreadcrumbCaret } from 'assets/icons/vector.svg';
import BreadcrumbLink from 'components/Breadcrumbs/components/BreadcrumbLink';
import Button from 'components/Button';
import styled from 'styled-components';
import { DomainThemeColor, getCustomDomainContrastText } from 'styles/colours';
import { opsNavbarHeight } from 'styles/theme';

export interface StyledIconProps {
  as: any;
  size?: string;
}

export const StyledFavoritesStar = styled(FavoritesStar)`
  color: ${(props) =>
    props.theme.palette.type === 'light'
      ? getCustomDomainContrastText(props.theme.custom.domainColor)
      : props.theme.custom.domainColor};
`;

export const StyledNavBarFavoritesStar = styled(FavoritesStar)`
  color: ${(props) =>
    props.theme.custom.domainColor === DomainThemeColor.Yellow &&
    props.theme.palette.type === 'light'
      ? '#464646'
      : props.theme.custom.domainColor};
`;

export const StyledGroupIcon = styled(GroupIcon)`
  color: ${(props) =>
    props.theme.palette.type === 'light'
      ? getCustomDomainContrastText(props.theme.custom.domainColor)
      : props.theme.custom.domainColor};
`;

export const StyledTreeFolderIcon = styled(TreeFolder)`
  padding-top: 8px;
  margin-right: 2px;
  color: ${(props) =>
    props.theme.palette.type === 'light'
      ? getCustomDomainContrastText(props.theme.custom.domainColor)
      : props.theme.custom.domainColor};
`;

export const StyledBreadcrumbCaret = styled(BreadcrumbCaret)`
  color: ${(props) =>
    props.theme.palette.type === 'light'
      ? getCustomDomainContrastText(props.theme.custom.domainColor)
      : '#9e9e9e'};
`;

export const StyledBreadcrumbLink = styled(BreadcrumbLink)`
  cursor: pointer;

  && {
    color: ${(props) =>
      props.theme.palette.type === 'light'
        ? getCustomDomainContrastText(props.theme.custom.domainColor)
        : props.theme.palette.text.primary};
  }
`;

export const StyledNavItem = styled(Typography)`
  font-size: 14px;
  font-weight: 500;
  padding-right: 0px;
  color: ${(props) =>
    props.theme.palette.type === 'light'
      ? getCustomDomainContrastText(props.theme.custom.domainColor)
      : props.theme.palette.text.primary};
`;

export const StyledPaper = styled(Paper)`
  position: relative;
  height: ${opsNavbarHeight}px;
  box-shadow: 0 4px 8px 0px rgba(0, 0, 0, 0.06);

  /*
    Prevent the Material UI Grid spacing/padding from overlapping on
    the first side-nav button a bit (which prevented clicking slightly)
  */
  overflow: hidden;

  ${(props) =>
    props.theme.palette.type === 'light' &&
    `
    background-color: ${props.theme.custom.domainColor};
  `}
  ${(props) =>
    props.theme.palette.type === 'dark' &&
    `
    background-color: #515151;
  `}
`;

export const StyledGradient = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 10px;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.06) 0%,
    rgba(0, 0, 0, 0) 100%
  );
`;

export const GridWrapper = styled.div`
  padding: 4px;
  height: 100%;
`;

export const StyledButton = styled(Button)`
  height: 32px;
  && {
    padding: 8px 12px;
  }
`;

export const StyledCloseButton = styled(IconButton)`
  height: 32px;
  min-width: 32px;
  color: ${(props) =>
    props.theme.palette.type === 'light'
      ? getCustomDomainContrastText(props.theme.custom.domainColor)
      : '#bcbcbc'};
  && {
    padding: 0;
    margin-left: -8px;
  }
`;

export const StyledDefaultText = styled(Typography)`
  font-size: 14px;
  color: ${(props) => props.theme.palette.text.secondary};
`;

export const StyledCloseIcon = styled(CancelSharpIcon)`
  font-size: 17px;
  opacity: ${(props) =>
    props.theme.custom.domainColor === DomainThemeColor.Yellow && 0.6};
`;

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popoverText: {
      padding: theme.spacing(2),
    },
    nestedList: {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    },
  })
);

export const StyledNavMenuItemIcon = styled.svg.attrs(
  (props: StyledIconProps) => ({
    size: props.size === 'large' ? 64 : 24,
  })
)`
  vertical-align: middle;
  margin-right: 5px;
  fill: ${(props) => props.theme.custom.domainColor};
  ${(props: StyledIconProps) =>
    props.size &&
    `
    height: ${props.size}px;
    width: ${props.size}px;
    `};
`;

export const StyledListItemIcon = styled(ListItemIcon)`
  min-width: 33px;
`;

export const StyledListItemText = styled(ListItemText)`
  & [class*='MuiListItemText-primary'] {
    font-weight: 500;
    font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
    /* use margin-right so ellipsis button isnt overlapping with text */
    margin-right: 10px;
  }
`;

export const StyledNavIcon = styled.svg.attrs((props: StyledIconProps) => ({
  size: props.size === 'large' ? 64 : 24,
}))`
  vertical-align: middle;
  margin-right: 5px;
  fill: ${(props) =>
    props.theme.palette.type === 'light'
      ? getCustomDomainContrastText(props.theme.custom.domainColor)
      : props.theme.custom.domainColor};
  ${(props: StyledIconProps) =>
    props.size &&
    `
    height: ${props.size}px;
    width: ${props.size}px;
    `};
`;
