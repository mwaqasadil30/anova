import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import systemRoutes from 'apps/system/routes';
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

    const isUserInSearchPath = matchPath(currentPathName, {
      path: systemRoutes.search,
    });

    if (isUserInSearchPath) {
      return history.push(systemRoutes.search);
    }

    return history.push(systemRoutes.base);
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
              appName={t('ui.main.system', 'System')}
              logoLinkTo={systemRoutes.base}
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
                  releaseNotesRoute={systemRoutes.releaseNotes}
                  contactSupportRoute={systemRoutes.contactSupport}
                  accessDolv3Route={systemRoutes.accessDolv3}
                />
              </Grid>
              <Grid item>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <UserAvatarMenu
                      languageRoute={systemRoutes.language}
                      userProfileRoute={systemRoutes.userProfile}
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
