/* eslint-disable indent */
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import systemRoutes, { tabsMap } from 'apps/system/routes';
import { ReactComponent as SearchIcon } from 'assets/icons/icn-search-magnifying-glass.svg';
// TODO: Uncomment once pages are ready
// import { ReactComponent as ReadingSerivceIcon } from 'assets/icons/icn-reading-service.svg';
// import { ReactComponent as CustomerMessagesIcon } from 'assets/icons/icn-customer-messages.svg';
import clsx from 'clsx';
import GitVersion from 'components/GitVersion';
import { useSideNavigationStyles } from 'components/navigation/common';
import {
  StyledList,
  StyledListItem,
  styledPrimaryListItemCss,
  StyledPrimaryListItemText,
} from 'components/navigation/SideNavigation/styles';
import ToolbarOffset from 'components/navigation/ToolbarOffset';
import ThemedTooltip from 'components/ThemedTooltip';
import React, { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { selectTopOffsetForNavbars } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import { mobileSidebarBreakpoint } from 'styles/theme';

const DrawerContextDefaultValue = {
  open: false,
};
const DrawerContext = createContext(DrawerContextDefaultValue);

const LocationIndicator = (props: any) => {
  const location = useLocation();
  const { open } = useContext(DrawerContext);
  const { isTopLevelItem: isPrimary, to: currentLink } = props;
  const selectedChild = Object.keys(tabsMap).find((key) =>
    location.pathname.includes(key)
  );
  const selectedPrimaryLink = tabsMap[selectedChild as keyof typeof tabsMap];
  const isPrimaryAndSelected = isPrimary && selectedPrimaryLink === currentLink;
  const isPrimaryAndSelectedAndDrawerIsClosed = isPrimaryAndSelected && !open;
  const correspondsToLocation = location.pathname.includes(currentLink);
  const isActive =
    correspondsToLocation || isPrimaryAndSelectedAndDrawerIsClosed;

  // Here we actually need to exclude `isTopLevelItem` so it doesn't get passed
  // down to `StyledListItem` and eventually into the DOM. It prevents this:
  // Warning: React does not recognize the `isTopLevelItem` prop on a DOM element.
  const {
    isTopLevelItem,
    IconComponent,
    TextComponent,
    primaryText,
    ...listItemProps
  } = props;

  return (
    <StyledListItem
      active={isActive}
      selected={isPrimaryAndSelected}
      isTopLevelItem={isTopLevelItem}
      {...listItemProps}
    >
      <ListItemIcon>
        <IconComponent />
      </ListItemIcon>
      <TextComponent
        isActive={isActive}
        selected={isPrimaryAndSelected}
        primary={primaryText}
        hideText={!open}
        aria-hidden={!open}
      />
    </StyledListItem>
  );
};

const StyledPrimaryListItem = styled((props: any) => (
  <LocationIndicator isTopLevelItem {...props} />
))`
  ${styledPrimaryListItemCss}
`;

const SideNavigation = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const theme = useTheme();
  const showMobileDrawer = useMediaQuery(
    theme.breakpoints.down(mobileSidebarBreakpoint)
  );
  const topOffsetForNavbars = useSelector(selectTopOffsetForNavbars);
  const classes = useSideNavigationStyles({ topOffset: topOffsetForNavbars });

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = () => {
    const nextValue = !open;
    setOpen(nextValue);
  };

  const toggleSystemSearch = () => {
    setOpen(false);
    history.push(systemRoutes.search);
  };

  // TODO: Uncomment once pages are ready
  // const toggleReadingService = () => {
  //   setOpen(false);
  //   history.push(systemRoutes.readingService);
  // };
  // const toggleCustomerMessages = () => {
  //   setOpen(false);
  //   history.push(systemRoutes.customerMessages);
  // };

  const drawerContent = (
    <DrawerContext.Provider value={{ open }}>
      <StyledList className={classes.list}>
        <Grid
          container
          direction="column"
          justify="space-between"
          wrap="nowrap"
        >
          <Grid item>
            <ThemedTooltip
              // @ts-ignore
              title={open ? '' : t('ui.systemApp.search', 'System Search')}
              placement="right"
              enterDelay={0}
            >
              <div>
                <StyledPrimaryListItem
                  button
                  onClick={toggleSystemSearch}
                  to={systemRoutes.search}
                  aria-label="system search nav"
                  IconComponent={SearchIcon}
                  TextComponent={StyledPrimaryListItemText}
                  primaryText={t('ui.systemApp.search', 'System Search')}
                />
              </div>
            </ThemedTooltip>

            {/*  TODO: Uncomment once pages are ready
            <ThemedTooltip
              // @ts-ignore
              title={
                open ? '' : t('ui.systemApp.readingService', 'Reading Service')
              }
              placement="right"
              enterDelay={0}
            >
              <div>
                <StyledPrimaryListItem
                  button
                  onClick={toggleReadingService}
                  to={systemRoutes.readingService}
                  aria-label="reading service nav"
                  IconComponent={ReadingSerivceIcon}
                  TextComponent={StyledPrimaryListItemText}
                  primaryText={t(
                    'ui.systemApp.readingService',
                    'Reading Service'
                  )}
                />
              </div>
            </ThemedTooltip>

            <ThemedTooltip
              // @ts-ignore
              title={
                open
                  ? ''
                  : t('ui.systemApp.customerMessages', 'Customer Messages')
              }
              placement="right"
              enterDelay={0}
            >
              <div>
                <StyledPrimaryListItem
                  button
                  onClick={toggleCustomerMessages}
                  to={systemRoutes.customerMessages}
                  aria-label="customer messages nav"
                  IconComponent={CustomerMessagesIcon}
                  TextComponent={StyledPrimaryListItemText}
                  primaryText={t(
                    'ui.systemApp.customerMessages',
                    'Customer Messages'
                  )}
                />
              </div>
            </ThemedTooltip> */}
          </Grid>
          <Grid item>
            <GitVersion open={open} toggleDrawer={toggleDrawer} />
          </Grid>
        </Grid>
      </StyledList>
    </DrawerContext.Provider>
  );

  return (
    <>
      {showMobileDrawer && (
        <Drawer
          variant="temporary"
          anchor="left"
          open={open}
          ModalProps={{
            // Prevent a weird flickering issue on Safari that'll constantly
            // toggle the open state of the drawer:
            // https://github.com/mui-org/material-ui/issues/22812
            disableScrollLock: true,
          }}
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !showMobileDrawer && !open,
          })}
          classes={{
            paper: clsx({
              [classes.mobileDrawerPaper]: true,
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !showMobileDrawer && !open,
            }),
          }}
          onClose={() => setOpen(false)}
        >
          {drawerContent}
        </Drawer>
      )}

      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerClose]: showMobileDrawer || !open,
          [classes.drawerOpen]: !showMobileDrawer && open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerPaper]: true,
            [classes.drawerClose]: showMobileDrawer || !open,
            [classes.drawerOpen]: !showMobileDrawer && open,
          }),
        }}
      >
        <ToolbarOffset />
        {drawerContent}
      </Drawer>
    </>
  );
};

export default SideNavigation;
