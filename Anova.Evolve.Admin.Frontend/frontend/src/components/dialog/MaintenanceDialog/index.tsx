import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setShowGlobalMaintenanceDialog } from 'redux-app/modules/app/actions';
import { selectShowGlobalMaintenanceDialog } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import UpdatedConfirmationDialog from '../UpdatedConfirmationDialog';

const StyledText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

const MaintenanceDialog = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const showGlobalMaintenanceDialog = useSelector(
    selectShowGlobalMaintenanceDialog
  );

  const handleClose = () => {
    dispatch(setShowGlobalMaintenanceDialog(false));
    window.location.href = 'https://offline.transcend.anova.com';
  };

  const mainTitle = t(
    'ui.maintenanceDialog.maintenance',
    'Transcend is down for scheduled maintenance right now.'
  );
  const mainMessage = t(
    'ui.maintenanceDialog.mainText',
    'We are updating the system to improve your experience and will be back online as soon as possible.'
  );
  const thankYouMessage = t(
    'ui.maintenanceDialog.subText',
    'Thank you for your patience,'
  );
  const transcendTeamText = t('ui.common.transcendTeam', 'Transcend Team');

  return (
    <UpdatedConfirmationDialog
      open={showGlobalMaintenanceDialog}
      maxWidth="sm"
      disableBackdropClick
      disableEscapeKeyDown
      mainTitle={mainTitle}
      content={
        <>
          <Grid container spacing={3} alignItems="center" justify="center">
            <Grid item>
              <StyledText align="center">{mainMessage}</StyledText>
            </Grid>
            <Grid item>
              <StyledText align="center">
                {thankYouMessage}
                <br />
                {transcendTeamText}
              </StyledText>
            </Grid>
          </Grid>
        </>
      }
      onConfirm={handleClose}
      hideCancelButton
    />
  );
};

export default MaintenanceDialog;
