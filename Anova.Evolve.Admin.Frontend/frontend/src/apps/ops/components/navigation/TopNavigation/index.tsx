/* eslint-disable indent */
import Grid from '@material-ui/core/Grid';
import adminRoutes from 'apps/admin/routes';
import opsRoutes from 'apps/ops/routes';
import clsx from 'clsx';
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
import { useSelector } from 'react-redux';
import {
  generatePath,
  matchPath,
  useHistory,
  useLocation,
} from 'react-router-dom';
import {
  selectActiveDomain,
  selectShowOpsNavBar,
} from 'redux-app/modules/app/selectors';
import { selectIsUserSystemAdmin } from 'redux-app/modules/user/selectors';
import DomainNoteLink from 'components/navigation/DomainNoteLink';
import AboutMenu from '../../../../../components/AboutMenu';
import BreadcrumbBar from '../BreadcrumbBar';

const TopNavigation = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const classes = useTopNavigationStyles();
  const showOpsNav = useSelector(selectShowOpsNavBar);

  const activeDomain = useSelector(selectActiveDomain);
  const isSystemAdmin = useSelector(selectIsUserSystemAdmin);

  const handleSelectDomain = () => {
    const currentPathName = location.pathname;

    const isUserInAssetSummaryPath = matchPath(currentPathName, {
      path: opsRoutes.assetSummary.list,
    });
    const isUserInEventsPath = matchPath(currentPathName, {
      path: opsRoutes.events.list,
    });
    const isUserInAssetMapPath = matchPath(currentPathName, {
      path: opsRoutes.assetMap.list,
    });
    if (isUserInAssetSummaryPath) {
      return history.push(opsRoutes.assetSummary.list);
    }
    if (isUserInEventsPath) {
      return history.push(opsRoutes.events.list);
    }
    if (isUserInAssetMapPath) {
      return history.push(opsRoutes.assetMap.list);
    }

    return history.push(opsRoutes.base);
  };

  const linkToDomainNote = activeDomain?.domainId
    ? generatePath(adminRoutes.domainManager.notes, {
        domainId: activeDomain ? activeDomain?.domainId : '',
      })
    : '';

  const areThereDomainNotes = !!activeDomain?.domainAdditionalInfo
    ?.areThereDomainNotes;

  return (
    <div>
      <StyledAppBar
        position="fixed"
        color="default"
        elevation={0}
        className={clsx(classes.appBar)}
      >
        <StyledToolbar>
          <AppSwitcher />

          <LeftNavContent>
            <LogoAndAppName
              appName={t('ui.main.operations', 'Operations')}
              logoLinkTo={opsRoutes.base}
            />
          </LeftNavContent>

          {/* Search bar temporarily removed [sept 23, 2020] */}
          {/* <OpsSearchBar /> */}

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
                {/* Removed until notifications are implemented */}
                {/* <Grid item>
                  <StyledNavbarCaretButton
                    variant="text"
                    style={{ minWidth: 36, marginLeft: 8 }}
                    disabled
                  >
                    <BellIcon />
                  </StyledNavbarCaretButton>
                </Grid> */}
                <Grid item>
                  <AboutMenu
                    releaseNotesRoute={opsRoutes.releaseNotes}
                    contactSupportRoute={opsRoutes.contactSupport}
                    accessDolv3Route={opsRoutes.accessDolv3}
                  />
                </Grid>
              </>

              <Grid item>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <UserAvatarMenu
                      languageRoute={opsRoutes.language}
                      userProfileRoute={opsRoutes.userProfile}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </StyledToolbar>
        {showOpsNav && <BreadcrumbBar />}
      </StyledAppBar>
    </div>
  );
};

export default TopNavigation;
