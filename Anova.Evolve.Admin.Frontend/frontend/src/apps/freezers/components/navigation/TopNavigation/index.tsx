import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import freezersRoutes from 'apps/freezers/routes';
import AboutMenu from 'components/AboutMenu';
import AppSwitcher from 'components/AppSwitcher';
import {
  LeftNavContent,
  StyledAppBar,
  StyledDivider,
  StyledToolbar,
  useTopNavigationStyles,
} from 'components/navigation/common';
import DomainSwitcher from 'components/navigation/DomainSwitcher';
import LogoAndAppName from 'components/navigation/LogoAndAppName';
import TimezoneSwitcher from 'components/navigation/TimezoneSwitcher';
import UserAvatarMenu from 'components/navigation/UserAvatarMenu';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { matchPath, useHistory, useLocation } from 'react-router-dom';

const TopNavigation = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const classes = useTopNavigationStyles();
  const location = useLocation();

  const handleSelectDomain = () => {
    const currentPathName = location.pathname;

    const isUserInSitesPath = matchPath(currentPathName, {
      path: freezersRoutes.sites.list,
    });
    const isUserInDefaultChartManagerPath = matchPath(currentPathName, {
      path: freezersRoutes.defaultChartManager.list,
    });

    if (isUserInSitesPath) {
      return history.push(freezersRoutes.sites.list);
    }
    if (isUserInDefaultChartManagerPath) {
      return history.push(freezersRoutes.defaultChartManager.list);
    }
    return history.push(freezersRoutes.base);
  };

  return (
    <div>
      <StyledAppBar
        position="fixed"
        color="default"
        elevation={0}
        className={classes.appBar}
      >
        <StyledToolbar>
          <AppSwitcher />

          <LeftNavContent>
            <LogoAndAppName
              appName={t('ui.main.freezers', 'Freezers')}
              logoLinkTo={freezersRoutes.base}
            />
          </LeftNavContent>

          <div>
            <Grid container spacing={0} alignItems="center">
              <Hidden smDown>
                <Grid item>
                  <StyledDivider orientation="vertical" flexItem />
                </Grid>
              </Hidden>
              <Grid item>
                <DomainSwitcher onSelectDomain={handleSelectDomain} />
              </Grid>
              <Grid item>
                <StyledDivider orientation="vertical" flexItem />
              </Grid>
              <Grid item>
                <TimezoneSwitcher condensed="md" />
              </Grid>
              <Grid item>
                <StyledDivider orientation="vertical" flexItem />
              </Grid>
              <Grid item>
                <AboutMenu
                  releaseNotesRoute={freezersRoutes.releaseNotes}
                  contactSupportRoute={freezersRoutes.contactSupport}
                  accessDolv3Route={freezersRoutes.accessDolv3}
                />
              </Grid>
              <Grid item>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <UserAvatarMenu
                      languageRoute={freezersRoutes.language}
                      userProfileRoute={freezersRoutes.userProfile}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </StyledToolbar>
      </StyledAppBar>
    </div>
  );
};

export default TopNavigation;
