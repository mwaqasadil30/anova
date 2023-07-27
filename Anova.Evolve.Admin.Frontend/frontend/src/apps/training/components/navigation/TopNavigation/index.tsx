import Grid from '@material-ui/core/Grid';
import trainingRoutes from 'apps/training/routes';
import AppSwitcher from 'components/AppSwitcher';
import {
  LeftNavContent,
  StyledAppBar,
  StyledToolbar,
  useTopNavigationStyles,
} from 'components/navigation/common';
import LogoAndAppName from 'components/navigation/LogoAndAppName';
import UserAvatarMenu from 'components/navigation/UserAvatarMenu';
import React from 'react';
import { useTranslation } from 'react-i18next';

const TopNavigation = () => {
  const { t } = useTranslation();
  const classes = useTopNavigationStyles();

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
            appName={t('ui.main.trainingHub', 'Training Hub')}
            logoLinkTo={trainingRoutes.base}
          />
        </LeftNavContent>

        <div>
          <Grid container spacing={0} alignItems="center">
            <Grid item>
              <UserAvatarMenu
                languageRoute={trainingRoutes.language}
                userProfileRoute={trainingRoutes.userProfile}
              />
            </Grid>
          </Grid>
        </div>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default TopNavigation;
