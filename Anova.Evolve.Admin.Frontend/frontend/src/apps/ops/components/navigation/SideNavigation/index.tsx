/* eslint-disable indent */
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { UserPermissionType } from 'api/admin/api';
import opsRoutes, { tabsMap } from 'apps/ops/routes';
import { ReactComponent as TankIcon } from 'assets/icons/icon-asset-flat.svg';
import { ReactComponent as BellIcon } from 'assets/icons/icon-events-flat.svg';
import { ReactComponent as MapIcon } from 'assets/icons/map-pin-flat.svg';
import { ReactComponent as ProblemReportsIcon } from 'assets/icons/problem-reports.svg';
import clsx from 'clsx';
import GitVersion from 'components/GitVersion';
import { useSideNavigationStyles } from 'components/navigation/common';
import {
  StyledList,
  StyledListItem,
  styledPrimaryListItemCss,
  StyledPrimaryListItemText,
  StyledPrimarySubIconListItemText,
} from 'components/navigation/SideNavigation/styles';
import ToolbarOffset from 'components/navigation/ToolbarOffset';
import ThemedTooltip from 'components/ThemedTooltip';
import { IS_ASSET_MAP_FEATURE_ENABLED } from 'env';
import React, { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { selectTopOffsetForNavbars } from 'redux-app/modules/app/selectors';
import {
  selectCanViewProblemReportsTab,
  selectHasPermission,
} from 'redux-app/modules/user/selectors';
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
    ExpandedTextComponent,
    IconTextComponent,
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
        <IconTextComponent
          hideText={open}
          aria-hidden={open}
          isActive={isActive}
          selected={isPrimaryAndSelected}
        >
          {primaryText}
        </IconTextComponent>
      </ListItemIcon>
      <ExpandedTextComponent
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
  const canViewAssetSummaryTab = hasPermission(
    UserPermissionType.ViewTabAssetSummary
  );
  const canViewEventsTab = hasPermission(UserPermissionType.ViewTabEvents);
  const canViewMap =
    IS_ASSET_MAP_FEATURE_ENABLED &&
    hasPermission(UserPermissionType.MiscellaneousFeatureViewMap);
  const canViewProblemReportsTab = useSelector(selectCanViewProblemReportsTab);

  const [open, setOpen] = React.useState(false);

  // const canAccessDashboard = useSelector(selectIsUserSystemAdminOrSystemUser);

  const toggleDrawer = () => {
    const nextValue = !open;
    setOpen(nextValue);
  };

  const toggleAssetList = () => {
    setOpen(false);
    history.push(opsRoutes.assetSummary.list);
  };

  const toggleEventsList = () => {
    setOpen(false);
    history.push(opsRoutes.events.list);
  };

  const toggleMapList = () => {
    setOpen(false);
    history.push(opsRoutes.assetMap.list);
  };

  const toggleProblemReportsList = () => {
    setOpen(false);
    history.push(opsRoutes.problemReports.list);
  };

  // const toggleDashboardList = () => {
  //   setOpen(false);
  //   history.push(opsRoutes.dashboard.home);
  // };

  // removed temporarily
  // const toggleScheduleList = () => {
  //   setOpen(false);
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
            {/* NOTE (Weird material ui issue): Without a div, the 
              tooltip only appears after clicking the list item */}
            {/* Temporarily commenting out dashboard */}
            {/* {canAccessDashboard && (
                <ThemedTooltip
                  // @ts-ignore
                  title={open ? '' : t('ui.common.dashboard', 'Dashboard')}
                  placement="right"
                  enterDelay={0}
                >
                  <div>
                    <StyledPrimaryListItem
                      button
                      onClick={toggleDashboardList}
                      aria-label="dashboard"
                      to={opsRoutes.dashboard.home}
                    >
                      <ListItemIcon>
                        <DashboardIcon color={domainColor} />
                      </ListItemIcon>
                      <StyledPrimaryListItemText
                        primary={t('ui.common.dashboard', 'Dashboard')}
                        aria-hidden={!open}
                      />
                    </StyledPrimaryListItem>
                  </div>
                </ThemedTooltip>
              )} */}
            {canViewAssetSummaryTab && (
              <ThemedTooltip
                // @ts-ignore
                title={open ? '' : t('ui.common.list', 'List')}
                placement="right"
                enterDelay={0}
              >
                <div>
                  <StyledPrimaryListItem
                    button
                    onClick={toggleAssetList}
                    aria-label="configure nav"
                    to={opsRoutes.assetSummary.list}
                    IconComponent={TankIcon}
                    IconTextComponent={StyledPrimarySubIconListItemText}
                    ExpandedTextComponent={StyledPrimaryListItemText}
                    primaryText={t('ui.common.list', 'List')}
                  />
                </div>
              </ThemedTooltip>
            )}

            {/* Temporarily commenting out scheduler until we start working on it 
              at a later date */}
            {/* TODO: Add tooltip when app is implemeted */}
            {/* <div>
                <StyledPrimaryListItem
                  button
                  onClick={toggleScheduleList}
                  aria-label="bell nav"
                >
                  <ListItemIcon>
                    <EventsIcon color={domainColor} />
                  </ListItemIcon>
                  <StyledPrimaryListItemText
                    primary={t('ui.main.schedule', 'Schedule')}
                    aria-hidden={!open}
                  />
                </StyledPrimaryListItem>
              </div> */}
            {canViewEventsTab && (
              <ThemedTooltip
                // @ts-ignore
                title={open ? '' : t('ui.common.events', 'Events')}
                placement="right"
                enterDelay={0}
              >
                <div>
                  <StyledPrimaryListItem
                    button
                    onClick={toggleEventsList}
                    to={opsRoutes.events.list}
                    aria-label="event nav"
                    IconComponent={BellIcon}
                    IconTextComponent={StyledPrimarySubIconListItemText}
                    ExpandedTextComponent={StyledPrimaryListItemText}
                    primaryText={t('ui.common.events', 'Events')}
                  />
                </div>
              </ThemedTooltip>
            )}

            {canViewMap && (
              <ThemedTooltip
                // @ts-ignore
                title={open ? '' : t('ui.common.map', 'Map')}
                placement="right"
                enterDelay={0}
              >
                <div>
                  <StyledPrimaryListItem
                    button
                    onClick={toggleMapList}
                    to={opsRoutes.assetMap.list}
                    aria-label="map nav"
                    IconComponent={MapIcon}
                    IconTextComponent={StyledPrimarySubIconListItemText}
                    ExpandedTextComponent={StyledPrimaryListItemText}
                    primaryText={t('ui.common.map', 'Map')}
                  />
                </div>
              </ThemedTooltip>
            )}

            {canViewProblemReportsTab && (
              <ThemedTooltip
                // @ts-ignore
                title={
                  open
                    ? ''
                    : t('ui.problemreport.problemreports', 'Problem Reports')
                }
                placement="right"
                enterDelay={0}
              >
                <div>
                  <StyledPrimaryListItem
                    button
                    onClick={toggleProblemReportsList}
                    to={opsRoutes.problemReports.list}
                    aria-label="problem reports nav"
                    IconComponent={ProblemReportsIcon}
                    IconTextComponent={StyledPrimarySubIconListItemText}
                    ExpandedTextComponent={StyledPrimaryListItemText}
                    primaryText={t(
                      'ui.problemreport.problemreports',
                      'Problem Reports'
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
