import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import Logo from 'components/icons/Logo';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { selectShowGlobalApplicationTimeoutDialog } from 'redux-app/modules/app/selectors';
import { performLogout } from 'redux-app/modules/user/actions';
import styled from 'styled-components';

const StyledLogo = styled(Logo)`
  width: 100px;
`;

const ApplicationTimeoutDialog = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();

  const showGlobalApplicationTimeoutDialog = useSelector(
    selectShowGlobalApplicationTimeoutDialog
  );

  const handleConfirm = () => {
    dispatch(performLogout({ redirectPath: location.pathname }));
  };

  const title = t('ui.common.sessionHasTimedOut', 'Session has timed out!');
  const actionText = t(
    'ui.common.logBackIn',
    'Please log back into the application.'
  );

  return (
    <UpdatedConfirmationDialog
      open={showGlobalApplicationTimeoutDialog}
      maxWidth="xs"
      disableBackdropClick
      disableEscapeKeyDown
      mainTitle={title}
      content={
        <Grid container spacing={3} alignItems="center" justify="center">
          <Grid item xs={12}>
            <Box textAlign="center">
              <StyledLogo />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography align="center">{actionText}</Typography>
          </Grid>
        </Grid>
      }
      onConfirm={handleConfirm}
      hideCancelButton
    />
  );
};

export default ApplicationTimeoutDialog;
