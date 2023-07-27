import IconButton from '@material-ui/core/IconButton';
import MuiLink from '@material-ui/core/Link';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import { APP_VERSION_CHECKER_INTERVAL_IN_MINUTES } from 'env';
import React from 'react';
import { Trans } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectReleaseNotesRouteForCurrentApp } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import { brandYellow, defaultTextColor } from 'styles/colours';
import useCheckForAppVersionUpdates from './hooks/useCheckForAppVersionUpdates';
import useCheckForConfigUpdates from './hooks/useCheckForConfigUpdates';

const StyledLink = styled(MuiLink)`
  color: ${(props) =>
    // Since the snackbar's background colour uses the reversed background theme
    // colour (black background in light mode, white background in dark
    // mode), we use yellow text in light mode, black text in dark mode.
    props.theme.palette.type === 'light' ? brandYellow : defaultTextColor};
`;

const StyledIconButton = styled(IconButton)`
  padding: ${(props) => props.theme.spacing(0.5)}px;
`;

const AppVersionChecker = () => {
  const releaseNotesRoute = useSelector(selectReleaseNotesRouteForCurrentApp);

  // Snackbar
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);
  const openSnackbar = () => setIsSnackbarOpen(true);
  const closeSnackbar = () => setIsSnackbarOpen(false);

  // Environment variables
  const intervalInMinutes = APP_VERSION_CHECKER_INTERVAL_IN_MINUTES;
  const intervalInMilliseconds = 1000 * 60 * intervalInMinutes;

  useCheckForConfigUpdates({
    intervalInMilliseconds,
    onDifferentConfig: openSnackbar,
  });
  useCheckForAppVersionUpdates({
    intervalInMilliseconds,
    onDifferentVersion: openSnackbar,
  });

  const handleRefresh = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    window.location.reload();
  };
  const handleViewReleaseNotes = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    window.location.href = releaseNotesRoute;
  };

  return (
    <div>
      {isSnackbarOpen && (
        <Snackbar
          message={
            <Trans
              i18nKey="ui.appVersionChecker.snackbarText"
              defaults="A new version of Transcend is available. Please click <RefreshLink>refresh</RefreshLink> or <ReleaseNotesLink>view release notes</ReleaseNotesLink> to download the latest version."
              components={{
                RefreshLink: (
                  <StyledLink
                    underline="always"
                    href=""
                    onClick={handleRefresh}
                  />
                ),
                ReleaseNotesLink: (
                  <StyledLink
                    underline="always"
                    href=""
                    onClick={handleViewReleaseNotes}
                  />
                ),
              }}
            />
          }
          open={isSnackbarOpen}
          onClose={closeSnackbar}
          // Prevent closing the snackbar when clicking anywhere on the page
          ClickAwayListenerProps={{ mouseEvent: false, touchEvent: false }}
          action={
            <StyledIconButton
              aria-label="close"
              color="inherit"
              onClick={closeSnackbar}
            >
              <CloseIcon />
            </StyledIconButton>
          }
        />
      )}
    </div>
  );
};

export default AppVersionChecker;
