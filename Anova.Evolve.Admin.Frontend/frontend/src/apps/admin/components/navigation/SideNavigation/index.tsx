/* eslint-disable indent */
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { UserPermissionType } from 'api/admin/api';
import adminRoutes from 'apps/admin/routes';
import { ReactComponent as AssetConfigurationIcon } from 'assets/icons/asset-configuration.svg';
import { ReactComponent as DataChannelTemplateIcon } from 'assets/icons/data-channel-template.svg';
import { ReactComponent as DataChannelIcon } from 'assets/icons/data-channel.svg';
import { ReactComponent as DomainConfigurationIcon } from 'assets/icons/domain-configuration.svg';
import { ReactComponent as DomainIcon } from 'assets/icons/domain-flat.svg';
import { ReactComponent as GeofencingIcon } from 'assets/icons/geofencing.svg';
import { ReactComponent as GroupIcon } from 'assets/icons/group.svg';
import { ReactComponent as TankIcon } from 'assets/icons/icon-asset-flat.svg';
import { ReactComponent as EventsIcon } from 'assets/icons/icon-events-flat.svg';
import { ReactComponent as MessageTemplateIcon } from 'assets/icons/message-template.svg';
import { ReactComponent as PollScheduleIcon } from 'assets/icons/poll-schedule.svg';
import { ReactComponent as ProductIcon } from 'assets/icons/product.svg';
import { ReactComponent as RosterIcon } from 'assets/icons/roster.svg';
import { ReactComponent as RTUIcon } from 'assets/icons/rtu.svg';
import { ReactComponent as RuleGroupIcon } from 'assets/icons/rule-group.svg';
import { ReactComponent as SiteIcon } from 'assets/icons/site.svg';
import { ReactComponent as TankDimensionIcon } from 'assets/icons/tank-dimension.svg';
import { ReactComponent as TreeIcon } from 'assets/icons/tree.svg';
import { ReactComponent as UserRolesIcon } from 'assets/icons/user-roles.svg';
import { ReactComponent as UserSideNavIcon } from 'assets/icons/user-section-admin.svg';
import { ReactComponent as UserIcon } from 'assets/icons/user.svg';
import clsx from 'clsx';
import GitVersion from 'components/GitVersion';
import { useSideNavigationStyles } from 'components/navigation/common';
import {
  StyledCollapse,
  StyledList,
  styledPrimaryListItemCss,
  StyledPrimaryListItemText,
} from 'components/navigation/SideNavigation/styles';
import ToolbarOffset from 'components/navigation/ToolbarOffset';
import ThemedTooltip from 'components/ThemedTooltip';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { selectTopOffsetForNavbars } from 'redux-app/modules/app/selectors';
import {
  selectCanViewGeofenceTab,
  selectHasPermission,
  selectIsSystemAdminOrWhitelisted,
} from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { mobileSidebarBreakpoint } from 'styles/theme';
import DrawerContext from '../DrawerContext';
import { getActiveNavState } from '../helpers';
import LocationIndicator from '../LocationIndicator';
import SecondaryNavItem from '../SecondaryNavItem';

const StyledPrimaryListItem = styled((props: any) => (
  <LocationIndicator isTopLevelItem {...props} />
))`
  ${styledPrimaryListItemCss}
`;

const SideNavigation = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const theme = useTheme();
  const showMobileDrawer = useMediaQuery(
    theme.breakpoints.down(mobileSidebarBreakpoint)
  );
  const topOffsetForNavbars = useSelector(selectTopOffsetForNavbars);
  const classes = useSideNavigationStyles({ topOffset: topOffsetForNavbars });

  const isSystemAdminOrWhitelisted = useSelector(
    selectIsSystemAdminOrWhitelisted
  );
  const hasPermission = useSelector(selectHasPermission);
  const canViewSiteTab = hasPermission(
    UserPermissionType.AdministrationTabSite
  );
  const canViewTankDimensionTab = hasPermission(
    UserPermissionType.AdministrationTabTankDimensions
  );
  const canViewRtuManagerTab = hasPermission(
    UserPermissionType.AdministrationTabRTU
  );
  const canViewPollSchedule = hasPermission(
    UserPermissionType.AdministrationTabRTUPollSchedule
  );
  const canViewAssetConfigurationTab = hasPermission(
    UserPermissionType.AdministrationTabAsset
  );
  const canViewDataChannelTab = hasPermission(
    UserPermissionType.AdministrationTabDataChannel
  );
  const canViewProductTab = hasPermission(
    UserPermissionType.AdministrationTabProduct
  );
  const canViewAssetGroup = hasPermission(
    UserPermissionType.AdministrationTabAssetGroup
  );
  const canViewAssetTree = hasPermission(
    UserPermissionType.AdministrationTabAssetTree
  );
  const canViewUserAdminTab = hasPermission(
    UserPermissionType.AdministrationTabUser
  );
  const canViewMessageTemplateTab = hasPermission(
    UserPermissionType.AdministrationTabMessageTemplate
  );
  const canViewRosterAdminTab = hasPermission(
    UserPermissionType.AdministrationTabRoster
  );
  const canViewGeofenceTab = useSelector(selectCanViewGeofenceTab);

  const canAccessAnyAssetNavItem =
    isSystemAdminOrWhitelisted ||
    canViewSiteTab ||
    canViewTankDimensionTab ||
    canViewProductTab ||
    canViewPollSchedule ||
    canViewAssetGroup ||
    canViewAssetTree;
  const canAccessAnyDomainNavItem = isSystemAdminOrWhitelisted;
  const canAccessAnyEventsNavItem =
    isSystemAdminOrWhitelisted ||
    canViewMessageTemplateTab ||
    canViewRosterAdminTab ||
    canViewGeofenceTab;
  const canAccessAnyUserNavItem =
    isSystemAdminOrWhitelisted || canViewUserAdminTab;

  const { open: _, ...context } = useContext(DrawerContext);
  const [open, setOpen] = React.useState(false);
  const [assetListOpen, setAssetListOpen] = React.useState(false);
  const [domainListOpen, setDomainListOpen] = React.useState(false);
  const [eventsListOpen, setEventsListOpen] = React.useState(false);
  const [userListOpen, setUserListOpen] = React.useState(false);

  const toggleDrawer = () => {
    const nextValue = !open;
    setOpen(nextValue);
  };

  // Callback functions to only expand one of the primary nav's sub items (if
  // the drawer is closed). Otherwise, since the drawer is open, toggle the
  // expanded state of the primary nav's sub items
  const toggleAssetList = () => {
    if (!open) {
      setAssetListOpen(true);
      setDomainListOpen(false);
      setEventsListOpen(false);
      setUserListOpen(false);
    } else {
      setAssetListOpen(!assetListOpen);
      setDomainListOpen(false);
      setEventsListOpen(false);
      setUserListOpen(false);
    }
  };

  const toggleDomainList = () => {
    if (!open) {
      setDomainListOpen(true);
      setAssetListOpen(false);
      setEventsListOpen(false);
      setUserListOpen(false);
    } else {
      setDomainListOpen(!domainListOpen);
      setAssetListOpen(false);
      setEventsListOpen(false);
      setUserListOpen(false);
    }
  };

  const toggleEventsList = () => {
    if (!open) {
      setEventsListOpen(true);
      setAssetListOpen(false);
      setDomainListOpen(false);
      setUserListOpen(false);
    } else {
      setEventsListOpen(!eventsListOpen);
      setAssetListOpen(false);
      setDomainListOpen(false);
      setUserListOpen(false);
    }
  };

  const toggleUserList = () => {
    if (!open) {
      setUserListOpen(true);
      setEventsListOpen(false);
      setAssetListOpen(false);
      setDomainListOpen(false);
    } else {
      setUserListOpen(!userListOpen);
      setAssetListOpen(false);
      setDomainListOpen(false);
      setEventsListOpen(false);
    }
  };

  // Callback functions to close the drawer (if it isn't already) and expand
  // one of the primary nav's sub items
  const openAssetList = () => {
    setAssetListOpen(true);
    setDomainListOpen(false);
    setEventsListOpen(false);
    setOpen(false);
  };

  const openDomainList = () => {
    setDomainListOpen(true);
    setAssetListOpen(false);
    setEventsListOpen(false);
    setOpen(false);
  };

  const openEventsList = () => {
    setEventsListOpen(true);
    setAssetListOpen(false);
    setDomainListOpen(false);
    setOpen(false);
  };

  // Open the current active list of sub items if none of them are open
  useEffect(() => {
    if (!open && !assetListOpen && !domainListOpen && !eventsListOpen) {
      const domainActiveNavState = getActiveNavState({
        context,
        pathname: location.pathname,
        isDrawerOpen: open,
        isTopLevelItem: true,
        currentLinkPathname: adminRoutes.domainManager.list,
      });
      const eventsActiveNavState = getActiveNavState({
        context,
        pathname: location.pathname,
        isDrawerOpen: open,
        isTopLevelItem: true,
        currentLinkPathname: adminRoutes.eventManager.list,
      });

      if (domainActiveNavState.isActive) {
        openDomainList();
      } else if (eventsActiveNavState.isActive) {
        openEventsList();
      } else {
        // NOTE: When landing on the Admin app after switching from another
        // app, no active route is found, so we just default to opening the
        // asset list (since the Asset Configuration is the default page within
        // the list of asset nav items the user lands on).
        openAssetList();
      }
    }
  }, [open, showMobileDrawer]);

  const drawerContent = (
    <DrawerContext.Provider
      value={{ open, assetListOpen, domainListOpen, eventsListOpen }}
    >
      <StyledList className={classes.list}>
        <Grid
          container
          direction="column"
          justify="space-between"
          wrap="nowrap"
        >
          <Grid item>
            {canAccessAnyAssetNavItem && (
              <div>
                {/* NOTE (Weird material ui issue): Without a div, the 
                    tooltip only appears after clicking the list item */}
                <ThemedTooltip
                  // @ts-ignore
                  title={open ? '' : t('ui.common.configure', 'Configure')}
                  placement="right"
                  enterDelay={0}
                >
                  <div>
                    <StyledPrimaryListItem
                      button
                      onClick={toggleAssetList}
                      aria-label="configure nav"
                      to={adminRoutes.assetManager.list}
                      IconComponent={TankIcon}
                      TextComponent={StyledPrimaryListItemText}
                      primaryText={t('ui.common.configure', 'Configure')}
                    />
                  </div>
                </ThemedTooltip>
                <StyledCollapse in={assetListOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {isSystemAdminOrWhitelisted &&
                      canViewAssetConfigurationTab && (
                        <SecondaryNavItem
                          showTooltip={!open}
                          primaryText={t('ui.common.asset', 'Asset')}
                          linkTo={adminRoutes.assetManager.list}
                          IconComponent={AssetConfigurationIcon}
                        />
                      )}
                    {/*
                      Note: Since users will receive limited access to the
                      admin app, we hide some of these nav items.
                    */}
                    {canViewDataChannelTab && (
                      <SecondaryNavItem
                        showTooltip={!open}
                        primaryText={t('ui.common.datachannel', 'Data Channel')}
                        linkTo={adminRoutes.dataChannelManager.list}
                        IconComponent={DataChannelIcon}
                      />
                    )}
                    {canViewRtuManagerTab && (
                      <SecondaryNavItem
                        showTooltip={!open}
                        primaryText={t('ui.common.rtu', 'RTU')}
                        linkTo={adminRoutes.rtuManager.list}
                        IconComponent={RTUIcon}
                      />
                    )}
                    {canViewSiteTab && (
                      <SecondaryNavItem
                        showTooltip={!open}
                        primaryText={t('ui.common.site', 'Site')}
                        linkTo={adminRoutes.siteManager.list}
                        IconComponent={SiteIcon}
                      />
                    )}
                    {canViewTankDimensionTab && (
                      <SecondaryNavItem
                        showTooltip={!open}
                        primaryText={t(
                          'ui.common.tankdimension',
                          'Tank Dimension'
                        )}
                        linkTo={adminRoutes.tankDimensionManager.list}
                        IconComponent={TankDimensionIcon}
                      />
                    )}
                    {canViewProductTab && (
                      <SecondaryNavItem
                        showTooltip={!open}
                        primaryText={t('ui.common.product', 'Product')}
                        linkTo={adminRoutes.productManager.list}
                        IconComponent={ProductIcon}
                      />
                    )}
                    {canViewPollSchedule && (
                      <SecondaryNavItem
                        showTooltip={!open}
                        primaryText={t('ui.rtu.pollschedule', 'Poll Schedule')}
                        linkTo={adminRoutes.pollScheduleManager.list}
                        IconComponent={PollScheduleIcon}
                      />
                    )}
                    {canViewAssetGroup && (
                      <SecondaryNavItem
                        showTooltip={!open}
                        primaryText={t('ui.main.group', 'Group')}
                        linkTo={adminRoutes.assetGroupManager.list}
                        IconComponent={GroupIcon}
                      />
                    )}
                    {canViewAssetTree && (
                      <SecondaryNavItem
                        showTooltip={!open}
                        primaryText={t('ui.main.tree', 'Tree')}
                        linkTo={adminRoutes.assetTreeManager.list}
                        IconComponent={TreeIcon}
                      />
                    )}
                  </List>
                </StyledCollapse>
              </div>
            )}
            {canAccessAnyDomainNavItem && (
              <div>
                <ThemedTooltip
                  // @ts-ignore
                  title={open ? '' : t('ui.common.global', 'Global')}
                  placement="right"
                  enterDelay={0}
                >
                  <div>
                    <StyledPrimaryListItem
                      button
                      onClick={toggleDomainList}
                      aria-label="global nav"
                      to={adminRoutes.domainManager.list}
                      IconComponent={DomainIcon}
                      TextComponent={StyledPrimaryListItemText}
                      primaryText={t('ui.common.global', 'Global')}
                    />
                  </div>
                </ThemedTooltip>
                <StyledCollapse
                  in={domainListOpen}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {isSystemAdminOrWhitelisted && (
                      <SecondaryNavItem
                        showTooltip={!open}
                        primaryText={t('ui.common.domain', 'Domain')}
                        linkTo={adminRoutes.domainManager.list}
                        IconComponent={DomainConfigurationIcon}
                      />
                    )}
                    {isSystemAdminOrWhitelisted && (
                      <SecondaryNavItem
                        showTooltip={!open}
                        primaryText={t(
                          'ui.common.datachanneltemplate',
                          'Data Channel Template'
                        )}
                        IconComponent={DataChannelTemplateIcon}
                      />
                    )}
                  </List>
                </StyledCollapse>
              </div>
            )}
            {canAccessAnyEventsNavItem && (
              <div>
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
                      aria-label="events nav"
                      to={adminRoutes.eventManager.list}
                      IconComponent={EventsIcon}
                      TextComponent={StyledPrimaryListItemText}
                      primaryText={t('ui.common.events', 'Events')}
                    />
                  </div>
                </ThemedTooltip>
                <StyledCollapse
                  in={eventsListOpen}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {isSystemAdminOrWhitelisted && (
                      <SecondaryNavItem
                        showTooltip={!open}
                        primaryText={t('ui.main.rulegroup', 'Rule Group')}
                        IconComponent={RuleGroupIcon}
                      />
                    )}
                    {canViewMessageTemplateTab && (
                      <SecondaryNavItem
                        showTooltip={!open}
                        primaryText={t(
                          'ui.main.messagetemplate',
                          'Message Template'
                        )}
                        linkTo={adminRoutes.messageTemplateManager.list}
                        IconComponent={MessageTemplateIcon}
                      />
                    )}
                    {canViewRosterAdminTab && (
                      <SecondaryNavItem
                        showTooltip={!open}
                        primaryText={t('ui.main.roster', 'Roster')}
                        linkTo={adminRoutes.rosterManager.list}
                        IconComponent={RosterIcon}
                      />
                    )}
                    {canViewGeofenceTab && (
                      <SecondaryNavItem
                        showTooltip={!open}
                        linkTo={adminRoutes.geofenceManager.list}
                        IconComponent={GeofencingIcon}
                        primaryText={t('ui.main.geofencing', 'Geofencing')}
                      />
                    )}
                  </List>
                </StyledCollapse>
              </div>
            )}
            {canAccessAnyUserNavItem && (
              <div>
                <ThemedTooltip
                  // @ts-ignore
                  title={open ? '' : t('ui.common.user', 'User')}
                  placement="right"
                  enterDelay={0}
                >
                  <div>
                    <StyledPrimaryListItem
                      button
                      onClick={toggleUserList}
                      aria-label="user nav"
                      to={adminRoutes.userManager.list}
                      IconComponent={UserSideNavIcon}
                      TextComponent={StyledPrimaryListItemText}
                      primaryText={t('ui.common.user', 'User')}
                    />
                  </div>
                </ThemedTooltip>
                <StyledCollapse in={userListOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {canViewUserAdminTab && (
                      <SecondaryNavItem
                        showTooltip={!open}
                        primaryText={t('ui.common.user', 'User')}
                        linkTo={adminRoutes.userManager.list}
                        IconComponent={UserIcon}
                      />
                    )}

                    {isSystemAdminOrWhitelisted && (
                      <SecondaryNavItem
                        showTooltip={!open}
                        primaryText={t('ui.main.userrole', 'User Role')}
                        IconComponent={UserRolesIcon}
                      />
                    )}
                  </List>
                </StyledCollapse>
              </div>
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
