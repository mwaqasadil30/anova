import Box from '@material-ui/core/Box';
import MuiDialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';
import Button from 'components/Button';
import React from 'react';
import { useTranslation } from 'react-i18next';
import DialogContent from '../DialogContent';
import DialogTitle from '../DialogTitle';

export interface ConfirmationDialogProps extends DialogProps {
  content?: React.ReactNode;
  open: boolean;
  icon?: React.ReactNode;
  mainTitle?: React.ReactNode;
  isDisabled?: boolean;
  onConfirm: () => void;
}

const ConfirmationDialog = ({
  content,
  open,
  icon,
  mainTitle,
  isDisabled,
  onConfirm,
  ...dialogProps
}: ConfirmationDialogProps) => {
  const { t } = useTranslation();

  return (
    <MuiDialog
      maxWidth="sm"
      fullWidth
      open={open}
      onClose={dialogProps.onClose}
      {...dialogProps}
    >
      <Box m={3}>
        <Box mt={2}>
          <Grid
            container
            spacing={2}
            direction="column"
            alignItems="center"
            justify="center"
          >
            {icon && (
              <Grid item xs={12}>
                {icon}
              </Grid>
            )}
            {mainTitle && (
              <Grid item xs={12}>
                <DialogTitle>{mainTitle}</DialogTitle>
              </Grid>
            )}
            {content && (
              <Grid item xs={12}>
                <DialogContent>{content}</DialogContent>
              </Grid>
            )}
            <Grid item>
              <DialogActions>
                <Button
                  variant="contained"
                  onClick={onConfirm}
                  disabled={isDisabled}
                >
                  {t('ui.common.ok', 'OK')}
                </Button>
              </DialogActions>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </MuiDialog>
  );
};

export default ConfirmationDialog;
