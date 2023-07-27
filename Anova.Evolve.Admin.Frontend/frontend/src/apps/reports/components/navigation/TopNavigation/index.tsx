import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import reportsRoutes from 'apps/reports/routes';
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
import { useHistory } from 'react-router-dom';

const TopNavigation = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const classes = useTopNavigationStyles();

  const handleSelectDomain = () => {
    history.push(reportsRoutes.base);
  };

  return (
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
            appName={t('ui.main.reports', 'Reports')}
            logoLinkTo={reportsRoutes.base}
          />
        </LeftNavContent>

        <div>
          <Grid container spacing={0} alignItems="center">
            <>
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
                <TimezoneSwitcher condensed="sm" />
              </Grid>
              <Grid item>
                <StyledDivider orientation="vertical" flexItem />
              </Grid>
              <Grid item>
                <AboutMenu
                  releaseNotesRoute={reportsRoutes.releaseNotes}
                  contactSupportRoute={reportsRoutes.contactSupport}
                  accessDolv3Route={reportsRoutes.accessDolv3}
                />
              </Grid>
            </>

            <Grid item>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <UserAvatarMenu
                    languageRoute={reportsRoutes.language}
                    userProfileRoute={reportsRoutes.userProfile}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default TopNavigation;
