import ListItemIcon from '@material-ui/core/ListItemIcon';
import {
  StyledListItem,
  StyledPrimarySubIconListItemText,
} from 'components/navigation/SideNavigation/styles';
import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import DrawerContext from '../DrawerContext';
import { getActiveNavState } from '../helpers';

const LocationIndicator = (props: any) => {
  const location = useLocation();
  const { open, ...context } = useContext(DrawerContext);

  const {
    isTopLevelItem: isPrimary,
    to: currentLink,
    primaryText,
    IconComponent,
    TextComponent,
  } = props;

  // Here we actually need to exclude `isTopLevelItem` so it doesn't get passed
  // down to `StyledListItem` and eventually into the DOM. It prevents this:
  // Warning: React does not recognize the `isTopLevelItem` prop on a DOM element.
  const { isTopLevelItem, ...listItemProps } = props;

  const navState = getActiveNavState({
    context,
    pathname: location.pathname,
    isDrawerOpen: open,
    isTopLevelItem: isPrimary,
    currentLinkPathname: currentLink,
  });

  return (
    <StyledListItem
      active={navState.isActive}
      selected={navState.isPrimaryAndSelected}
      isTopLevelItem={isTopLevelItem}
      {...listItemProps}
    >
      {isTopLevelItem ? (
        <ListItemIcon>
          <IconComponent />
          <StyledPrimarySubIconListItemText
            hideText={open}
            aria-hidden={open}
            isActive={navState.isActive}
            selected={navState.isPrimaryAndSelected}
          >
            {primaryText}
          </StyledPrimarySubIconListItemText>
        </ListItemIcon>
      ) : (
        <ListItemIcon>
          <IconComponent />
        </ListItemIcon>
      )}
      <TextComponent
        isActive={navState.isActive}
        selected={navState.isPrimaryAndSelected}
        primary={primaryText}
        hideText={!open}
        aria-hidden={!open}
      />
    </StyledListItem>
  );
};

export default LocationIndicator;
