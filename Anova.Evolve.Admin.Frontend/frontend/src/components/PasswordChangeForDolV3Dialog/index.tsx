/* eslint-disable jsx-a11y/media-has-caption */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from 'components/Button';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import PageSubHeader from 'components/PageSubHeader';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  performLogout,
  setUserAccessToDolV3AndTranscend,
} from 'redux-app/modules/user/actions';
import CreatePasswordForm from './components/CreatePasswordForm';

interface Props {
  isOpen?: boolean;
  handleClose: () => void;
}

const PasswordChangeForDolV3Dialog = ({ isOpen, handleClose }: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [isNewPasswordConfirmed, setIsNewPasswordConfirmed] = React.useState(
    false
  );

  const handleClosePasswordCreationDialog = () => {
    handleClose();
  };

  const closeDialog = () => {
    handleClosePasswordCreationDialog();
    // So this Dialog will not appear after every refresh -- only once user
    // logs-in again
    dispatch(setUserAccessToDolV3AndTranscend(undefined));
  };

  const handleLogout = () => {
    closeDialog();
    dispatch(performLogout());
  };

  const mainTitle = t(
    'ui.common.dolv3PasswordCreation',
    'DOLV3 Password Creation'
  );

  return (
    <div>
      <UpdatedConfirmationDialog
        open={!!isOpen}
        maxWidth={isNewPasswordConfirmed ? 'xs' : 'sm'}
        disableBackdropClick
        disableEscapeKeyDown
        mainTitle={mainTitle}
        content={
          <>
            {isNewPasswordConfirmed ? (
              <Box p={2}>
                <Grid
                  container
                  spacing={2}
                  alignContent="center"
                  justify="center"
                >
                  <Grid item xs={12}>
                    <Box textAlign="center">
                      <PageSubHeader dense>
                        {t(
                          'ui.common.successfullyCreatedDolV3Account',
                          'You have successfully created your new DOLV3 username and password. Close this window and login to DOLV3 using your new credentials.'
                        )}
                      </PageSubHeader>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box textAlign="center">
                      <Button variant="outlined" onClick={handleLogout}>
                        {t('ui.common.close', 'Close')}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <>
                <Box p={4}>
                  <CreatePasswordForm
                    setIsNewPasswordConfirmed={setIsNewPasswordConfirmed}
                    closeDialog={closeDialog}
                  />
                </Box>
              </>
            )}
          </>
        }
        hideConfirmationButton
        hideCancelButton
      />
    </div>
  );
};

export default PasswordChangeForDolV3Dialog;
