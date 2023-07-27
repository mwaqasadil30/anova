/* eslint-disable indent */
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { fade, lighten } from '@material-ui/core/styles';
import React from 'react';
import styled, { css } from 'styled-components';
import {
  DomainThemeColor,
  getCustomDomainContrastText,
  gray25,
  gray300,
  gray900,
  gray950,
  white,
} from 'styles/colours';

const subNavActiveColor = white;
const subNavInactiveColor = gray25;

export const StyledCollapse = styled(Collapse)`
  background: ${gray950};
`;

// #region Primary items
export const StyledList = styled(({ bgColor, ...props }) => (
  <List {...props} />
))`
  padding-top: 0;
  background: ${gray900};
`;

export const StyledListItem = styled(
  ({
    active: _active,
    primaryText,
    IconComponent,
    TextComponent,
    isTopLevelItem,
    ...props
  }) => <ListItem {...props} />
)`
  ${(props) =>
    props.isTopLevelItem &&
    `
    &&&&.MuiListItem-root {
      padding: 8px 0;
      min-height: 65px;
    }
    && .MuiListItemIcon-root,
    .MuiButtonBase-root,
    .MuiListItem-root {
      display: block;
    }
`}
  &.Mui-selected {
    position: relative;
  }
  ${({
    active,
    isTopLevelItem,
    ...props
  }: {
    active?: boolean;
    isTopLevelItem: boolean;
    props: any;
  }) =>
    !isTopLevelItem &&
    `
    // Adds border-left to sub nav items only
    padding-left: 14px;
    background-color: ${
      // @ts-ignore
      active ? props.theme.custom.domainColor : 'transparent'
    };
    `}
  // Applies contrast color to SELECTED top level side nav icon
  ${(props) =>
    props.selected &&
    props.isTopLevelItem &&
    /* prettier-ignore */
    `&& .MuiListItemIcon-root {
      color: #333333 ;};`}
  // Enforces color (subNavActiveColor) on ACTIVE sub-nav icon
  ${(props) =>
    props.active &&
    !props.isTopLevelItem &&
    `&& .MuiListItemIcon-root {
      color: ${
        props.theme.custom.domainColor === DomainThemeColor.Yellow
          ? getCustomDomainContrastText(props.theme.custom.domainColor)
          : subNavActiveColor
      };};`}
  &:hover {
    background: ${(props) =>
      !props.isTopLevelItem && props.active
        ? fade(props.theme.custom.domainColor, 0.8)
        : fade(gray300, 0.2)};
  }
  ${(props) =>
    props.selected &&
    `
    &.Mui-selected {
      background-color: ${lighten(props.theme.custom.domainColor, 0.83)};
      border-right: 1px solid rgba(0, 0, 0, 0.10);
      &:hover {
        background-color: ${fade(props.theme.custom.domainColor, 0.8)};
      }
    }
    `}
`;

export const StyledPrimaryListItemText = styled(
  ({ isActive, selected, primaryText, hideText, ...props }) => (
    <ListItemText {...props} />
  )
)`
  /* prettier-ignore */
  & .MuiListItemText-primary {
    min-width: 150px;
    white-space: initial;
    font-weight: 500;
    transition: opacity 0.2s ease-in-out;
    color: ${(props) => (!props.selected ? gray300 : '#333333')};
    opacity: ${(props) => (props.hideText ? 0 : 1)};
  }
`;

export const StyledPrimarySubIconListItemText = styled(
  ({ isActive, selected, primaryText, hideText, ...props }) => (
    <Typography {...props} />
  )
)`
  width: 65px;
  font-size: 11px;
  text-align: center;
  line-height: 1em;
  left: 0;
  white-space: initial;
  font-weight: 500;
  color: ${(props) => (!props.selected ? gray300 : '#333333')};
  opacity: ${(props) => (props.hideText ? 0 : 1)};
  transition: max-height 0.2s ease-in-out, opacity 0.2s ease-in-out;
  max-height: ${(props) => (props.hideText ? 0 : '40px')};
`;

export const styledPrimaryListItemCss = css`
  & .MuiListItemIcon-root {
    min-width: 65px;
    text-align: center;
    color: ${gray300};
  }
  & svg {
    width: 33px;
  }
`;
// #endregion Primary items

// #region Secondary items
export const SecondaryListItemText = styled(
  ({ isActive, primaryText, hideText, ...props }) => <ListItemText {...props} />
)`
  /* prettier-ignore */
  & .MuiListItemText-primary {
    min-width: 160px;
    white-space: initial;
    font-size: 14px;
    color: ${(props) =>
    props.isActive
      ? getCustomDomainContrastText(props.theme.custom.domainColor)
      : subNavInactiveColor};
    font-weight: ${(props) => (props.isActive ? 600 : 400)};

    transition: opacity 0.2s ease-in-out;
    opacity: ${(props) => (props.hideText ? 0 : 1)};
  }
`;

export const styledSecondaryListItemCss = css`
  height: 40px;
  & svg {
    width: 32px;
  }

  & .MuiListItemIcon-root {
    min-width: 46px;
    color: ${subNavInactiveColor};
  }
`;
// #endregion Secondary items
