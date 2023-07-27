/* eslint-disable indent */
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { UserPermissionType } from 'api/admin/api';
import freezerRoutes, { tabsMap } from 'apps/freezers/routes';
import { ReactComponent as DefaultChartManagerListIcon } from 'assets/icons/icon-freezer-chart-list.svg';
import { ReactComponent as FreezerSiteSummaryIcon } from 'assets/icons/icon-freezer-site-summary.svg';
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
import { selectHasPermission } from 'redux-app/modules/user/selectors';
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

  const hasPermission = useSelector(selectHasPermission);

  const isFreezerViewer = hasPermission(
    UserPermissionType.MiscellaneousFeatureFreezerView
  );
  const isFreezerAdmin = hasPermission(
    UserPermissionType.MiscellaneousFeatureFreezerAdmin
  );

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = () => {
    const nextValue = !open;
    setOpen(nextValue);
  };

  const toggleSiteSummaryList = () => {
    setOpen(false);
    history.push(freezerRoutes.sites.list);
  };

  const toggleDefaultChartManagerList = () => {
    setOpen(false);
    history.push(freezerRoutes.defaultChartManager.list);
  };

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
            {(isFreezerViewer || isFreezerAdmin) && (
              <ThemedTooltip
                // @ts-ignore
                title={
                  open ? '' : t('ui.freezerApp.siteSummary', 'Site Summary')
                }
                placement="right"
                enterDelay={0}
              >
                <div>
                  <StyledPrimaryListItem
                    button
                    onClick={toggleSiteSummaryList}
                    to={freezerRoutes.sites.list}
                    aria-label="site summary nav"
                    IconComponent={FreezerSiteSummaryIcon}
                    TextComponent={StyledPrimaryListItemText}
                    primaryText={t('ui.freezerApp.siteSummary', 'Site Summary')}
                  />
                </div>
              </ThemedTooltip>
            )}

            {isFreezerAdmin && (
              <ThemedTooltip
                // @ts-ignore
                title={
                  open
                    ? ''
                    : t(
                        'ui.freezerApp.defaultChartManager',
                        'Default Chart Manager'
                      )
                }
                placement="right"
                enterDelay={0}
              >
                <div>
                  <StyledPrimaryListItem
                    button
                    onClick={toggleDefaultChartManagerList}
                    to={freezerRoutes.defaultChartManager.list}
                    aria-label="default chart manager nav"
                    IconComponent={DefaultChartManagerListIcon}
                    TextComponent={StyledPrimaryListItemText}
                    primaryText={t(
                      'ui.freezerApp.defaultChartManager',
                      'Default Chart Manager'
                    )}
                  />
                </div>
              </ThemedTooltip>
            )}
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
