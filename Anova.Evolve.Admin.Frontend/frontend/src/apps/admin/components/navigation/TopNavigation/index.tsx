/* eslint-disable indent */
import Grid from '@material-ui/core/Grid';
import adminRoutes from 'apps/admin/routes';
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
import DomainNoteLink from 'components/navigation/DomainNoteLink';
import LogoAndAppName from 'components/navigation/LogoAndAppName';
import TimezoneSwitcher from 'components/navigation/TimezoneSwitcher';
import UserAvatarMenu from 'components/navigation/UserAvatarMenu';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  generatePath,
  matchPath,
  useHistory,
  useLocation,
} from 'react-router-dom';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import { selectIsUserSystemAdmin } from 'redux-app/modules/user/selectors';

const TopNavigation = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const classes = useTopNavigationStyles();
  const location = useLocation();

  const activeDomain = useSelector(selectActiveDomain);

  const isSystemAdmin = useSelector(selectIsUserSystemAdmin);

  const handleSelectDomain = () => {
    const currentPathName = location.pathname;
    // #region Asset pages
    const isUserInAssetConfigPath = matchPath(currentPathName, {
      path: adminRoutes.assetManager.list,
    });
    const isUserInDataChannelPath = matchPath(currentPathName, {
      path: adminRoutes.dataChannelManager.list,
    });
    const isUserInRtuPath = matchPath(currentPathName, {
      path: adminRoutes.rtuManager.list,
    });
    const isUserInSitePath = matchPath(currentPathName, {
      path: adminRoutes.siteManager.list,
    });
    const isUserInTankDimensionPath = matchPath(currentPathName, {
      path: adminRoutes.tankDimensionManager.list,
    });
    const isUserInProductPath = matchPath(currentPathName, {
      path: adminRoutes.productManager.list,
    });
    const isUserInPollSchedulePath = matchPath(currentPathName, {
      path: adminRoutes.pollScheduleManager.list,
    });
    const isUserInAssetGroupPath = matchPath(currentPathName, {
      path: adminRoutes.assetGroupManager.list,
    });
    const isUserInAssetTreePath = matchPath(currentPathName, {
      path: adminRoutes.assetTreeManager.list,
    });
    // #endregion Asset pages

    // #region Domain pages
    const isUserInDomainPath = matchPath(currentPathName, {
      path: adminRoutes.domainManager.list,
    });
    // #endregion Domain pages

    // #region Events pages
    const isUserInMessageTemplatePath = matchPath(currentPathName, {
      path: adminRoutes.messageTemplateManager.list,
    });
    const isUserInRosterPath = matchPath(currentPathName, {
      path: adminRoutes.rosterManager.list,
    });
    const isUserInGeofencePath = matchPath(currentPathName, {
      path: adminRoutes.geofenceManager.list,
    });
    // #endregion Events pages

    // #region User pages
    const isUserInUserAdminPath = matchPath(currentPathName, {
      path: adminRoutes.userManager.list,
    });
    // #endregion User pages

    // Asset pages
    if (isUserInAssetConfigPath) {
      return history.push(adminRoutes.assetManager.list);
    }
    if (isUserInDataChannelPath) {
      return history.push(adminRoutes.dataChannelManager.list);
    }
    if (isUserInRtuPath) {
      return history.push(adminRoutes.rtuManager.list);
    }
    if (isUserInSitePath) {
      return history.push(adminRoutes.siteManager.list);
    }
    if (isUserInTankDimensionPath) {
      return history.push(adminRoutes.tankDimensionManager.list);
    }
    if (isUserInProductPath) {
      return history.push(adminRoutes.productManager.list);
    }
    if (isUserInPollSchedulePath) {
      return history.push(adminRoutes.pollScheduleManager.list);
    }
    if (isUserInAssetGroupPath) {
      return history.push(adminRoutes.assetGroupManager.list);
    }
    if (isUserInAssetTreePath) {
      return history.push(adminRoutes.assetTreeManager.list);
    }

    // Domain pages
    if (isUserInDomainPath) {
      return history.push(adminRoutes.domainManager.list);
    }

    // Events pages
    if (isUserInMessageTemplatePath) {
      return history.push(adminRoutes.messageTemplateManager.list);
    }
    if (isUserInRosterPath) {
      return history.push(adminRoutes.rosterManager.list);
    }
    if (isUserInGeofencePath) {
      return history.push(adminRoutes.geofenceManager.list);
    }

    // User pages
    if (isUserInUserAdminPath) {
      return history.push(adminRoutes.userManager.list);
    }

    return history.push(adminRoutes.assetManager.list);
  };

  const linkToDomainNote = activeDomain?.domainId
    ? generatePath(adminRoutes.domainManager.notes, {
        domainId: activeDomain?.domainId || '',
      })
    : '';

  const areThereDomainNotes = !!activeDomain?.domainAdditionalInfo
    ?.areThereDomainNotes;

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
            appName={t('ui.main.administration', 'Administration')}
            logoLinkTo={adminRoutes.base}
          />
        </LeftNavContent>

        <div>
          <Grid container spacing={0} alignItems="center">
            <>
              {activeDomain && isSystemAdmin && areThereDomainNotes && (
                <Grid item>
                  <DomainNoteLink url={linkToDomainNote} />
                </Grid>
              )}

              <Grid item>
                <StyledDivider orientation="vertical" flexItem />
              </Grid>

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
                  releaseNotesRoute={adminRoutes.releaseNotes}
                  contactSupportRoute={adminRoutes.contactSupport}
                  accessDolv3Route={adminRoutes.accessDolv3}
                />
              </Grid>
            </>

            <Grid item>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <UserAvatarMenu
                    languageRoute={adminRoutes.language}
                    userProfileRoute={adminRoutes.userProfile}
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
