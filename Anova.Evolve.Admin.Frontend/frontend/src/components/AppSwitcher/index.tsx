import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AppsIcon from '@material-ui/icons/Apps';
import adminRoutes from 'apps/admin/routes';
import freezersRoutes from 'apps/freezers/routes';
import opsRoutes from 'apps/ops/routes';
import reportsRoutes from 'apps/reports/routes';
import trainingRoutes from 'apps/training/routes';
import systemRoutes from 'apps/system/routes';
import { ReactComponent as AdministrationIcon } from 'assets/icons/admin-app-icon.svg';
import { ReactComponent as FreezerIcon } from 'assets/icons/freezer-app-icon.svg';
import { ReactComponent as OperationsIcon } from 'assets/icons/ops-app-icon.svg';
import { ReactComponent as ReportsIcon } from 'assets/icons/reports-app-icon.svg';
import { ReactComponent as TrainingIcon } from 'assets/icons/training-app-icon.svg';
import { ReactComponent as SystemSearchIcon } from 'assets/icons/icn-sys-admin.svg';
// import { ReactComponent as SchedulerIcon } from 'assets/icons/scheduler-app-icon.svg';
// import { ReactComponent as SystemAdministrationIcon } from 'assets/icons/sysadmin-app-icon.svg';
import CloseIconButton from 'components/buttons/CloseIconButton';
import CustomThemeProvider from 'components/CustomThemeProvider';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import {
  selectCanAccessAdminApp,
  selectCanAccessFreezersApp,
  selectCanAccessOperationsApp,
  selectCanAccessReportsApp,
  selectCanAccessSystemApp,
} from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import AppIcon from './AppIcon';

const StyledDomainNameText = styled(Typography)`
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.67);
`;

const StyledCloseIcon = styled(CloseIconButton)`
  color: #838383;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const StyledBorderedGridContainer = styled(Grid)`
  /* Style each <Grid item> (directly under this <Grid container>) */
  & > div {
    border-bottom: 1px solid #717171;

    &:nth-child(odd) {
      border-right: 1px solid #717171;
    }

    /* Select the first two children */
    &:nth-child(-n + 2) {
      border-top: 1px solid #717171;
    }
  }
`;

const drawerWidth = 360;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexGrow: 1,
    },

    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },

    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  })
);

const AppSwitcher = () => {
  const location = useLocation();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();

  const activeDomain = useSelector(selectActiveDomain);

  const canAccessAdminApp = useSelector(selectCanAccessAdminApp);
  const canAccessOperationsApp = useSelector(selectCanAccessOperationsApp);

  const canAccessReportsApp = useSelector(selectCanAccessReportsApp);
  const canAccessFreezersApp = useSelector(selectCanAccessFreezersApp);
  const canAccessSystemApp = useSelector(selectCanAccessSystemApp);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    // We only want the AppSwitcher's drawer always in dark theme no-matter
    // what. This might change once the rest of the app supports switching between
    // dark/light mode.
    <CustomThemeProvider forceThemeType="dark">
      <IconButton
        id="app-picker-button"
        onClick={handleDrawerOpen}
        edge="start"
        color="inherit"
        aria-label="app picker"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <AppsIcon color="inherit" />
      </IconButton>

      <Drawer
        className={classes.drawer}
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
        aria-labelledby="app-picker-button"
        onBackdropClick={handleDrawerClose}
      >
        <Box px={5} py={2}>
          <Grid container>
            <Grid item xs={12}>
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <Box textAlign="center">
                    <StyledDomainNameText>
                      {activeDomain?.name}
                    </StyledDomainNameText>
                  </Box>
                </Grid>
                <Grid item>
                  <StyledCloseIcon onClick={handleDrawerClose} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <StyledBorderedGridContainer container>
            {canAccessOperationsApp && (
              <Grid item xs={6}>
                <StyledLink to={opsRoutes.base} onClick={handleDrawerClose}>
                  <AppIcon
                    text={t('ui.appSwitcher.operations', 'Operations')}
                    IconComponent={OperationsIcon}
                    active={location.pathname.startsWith(opsRoutes.base)}
                  />
                </StyledLink>
              </Grid>
            )}

            {canAccessAdminApp && (
              <Grid item xs={6}>
                <StyledLink to={adminRoutes.base} onClick={handleDrawerClose}>
                  <AppIcon
                    text={t('ui.appSwitcher.administration', 'Administration')}
                    active={location.pathname.startsWith(adminRoutes.base)}
                    IconComponent={AdministrationIcon}
                  />
                </StyledLink>
              </Grid>
            )}
            {/* Hide apps that have not been implemented yet */}
            {/* {isSystemAdminOrSystemUser && (
              <Grid item xs={6}>
                <StyledLink to={adminRoutes.base} onClick={handleDrawerClose}>
                  <AppIcon
                    text={t(
                      'ui.appSwitcher.systemAdministration',
                      'System Administration'
                    )}
                    IconComponent={SystemAdministrationIcon}
                  />
                </StyledLink>
              </Grid>
            )} */}
            {/* {isSystemAdminOrSystemUser && (
              <Grid item xs={6}>
                <StyledLink to={adminRoutes.base} onClick={handleDrawerClose}>
                  <AppIcon
                    text={t('ui.appSwitcher.scheduler', 'Scheduler')}
                    IconComponent={SchedulerIcon}
                  />
                </StyledLink>
              </Grid>
            )} */}
            {canAccessReportsApp && (
              <Grid item xs={6}>
                <StyledLink to={reportsRoutes.base} onClick={handleDrawerClose}>
                  <AppIcon
                    text={t('ui.main.reports', 'Reports')}
                    IconComponent={ReportsIcon}
                    active={location.pathname.startsWith(reportsRoutes.base)}
                  />
                </StyledLink>
              </Grid>
            )}
            <Grid item xs={6}>
              <StyledLink to={trainingRoutes.base} onClick={handleDrawerClose}>
                <AppIcon
                  text={t('ui.main.trainingHub', 'Training Hub')}
                  IconComponent={TrainingIcon}
                  active={location.pathname.startsWith('/training')}
                />
              </StyledLink>
            </Grid>
            {canAccessSystemApp && (
              <Grid item xs={6}>
                <StyledLink to={systemRoutes.base} onClick={handleDrawerClose}>
                  <AppIcon
                    text={t('ui.main.systemSearch', 'System Search')}
                    IconComponent={SystemSearchIcon}
                    active={location.pathname.startsWith('/system')}
                  />
                </StyledLink>
              </Grid>
            )}
            {canAccessFreezersApp && (
              <Grid item xs={6}>
                <StyledLink
                  to={freezersRoutes.base}
                  onClick={handleDrawerClose}
                >
                  <AppIcon
                    text={t('ui.main.freezers', 'Freezers')}
                    IconComponent={FreezerIcon}
                    active={location.pathname.startsWith(freezersRoutes.base)}
                  />
                </StyledLink>
              </Grid>
            )}
          </StyledBorderedGridContainer>
        </Box>
      </Drawer>
    </CustomThemeProvider>
  );
};

export default AppSwitcher;
