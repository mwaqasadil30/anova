import Box from '@material-ui/core/Box';
import MuiDialog, { DialogProps } from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from 'components/Button';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import DialogContent from '../DialogContent';

const StyledTitle = styled(Typography)`
  font-size: 16px;
  font-weight: 500;
`;

const StyledBannerBox = styled(Box)`
  border-radius: ${(props) =>
    `${props.theme.shape.borderRadius}px ${props.theme.shape.borderRadius}px 0 0`};

  background-color: ${(props) =>
    props.theme.palette.type === 'light' ? '#333333' : '#515151'};
`;

const DialogBanner = (props: React.ComponentProps<typeof Box>) => (
  <StyledBannerBox
    minHeight="28px"
    color="white"
    py={1}
    px={2}
    {...props}
    display="flex"
    alignItems="center"
  />
);

export interface UpdatedConfirmationDialogProps extends DialogProps {
  content?: React.ReactNode;
  open: boolean;
  icon?: React.ReactNode;
  mainTitle?: React.ReactNode;
  isDisabled?: boolean;
  isConfirmationButtonDisabled?: boolean;
  isCancelButtonDisabled?: boolean;
  confirmationButtonText?: React.ReactNode;
  cancelButtonText?: React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  customErrorMessage?: React.ReactNode;
  isMdOrLarger?: boolean;
  hideConfirmationButton?: boolean;
  hideCancelButton?: boolean;
  onConfirm?: () => void;
  closeDialog?: () => void;
}

const UpdatedConfirmationDialog = ({
  content,
  open,
  icon,
  mainTitle,
  isDisabled,
  isConfirmationButtonDisabled,
  isCancelButtonDisabled,
  confirmationButtonText,
  cancelButtonText,
  isLoading,
  isError,
  customErrorMessage,
  isMdOrLarger,
  hideConfirmationButton,
  hideCancelButton,
  onConfirm,
  closeDialog,
  ...dialogProps
}: UpdatedConfirmationDialogProps) => {
  const { t } = useTranslation();

  return (
    <MuiDialog
      maxWidth="sm"
      fullWidth
      open={open}
      // NOTE: important!
      // While this onClose exists on this dialog, we resort to using the
      // closeDialog() prop because of issues when using dialogProps.onClose
      // for the "Cancel" button below.
      onClose={closeDialog}
      {...dialogProps}
    >
      {mainTitle && (
        <Grid item xs={12}>
          <DialogBanner justifyContent={isMdOrLarger ? 'flex-start' : 'center'}>
            <StyledTitle>{mainTitle}</StyledTitle>
          </DialogBanner>
        </Grid>
      )}
      <Box mx={2} my={2}>
        <Grid container spacing={2} alignItems="center" justify="center">
          <Grid item xs={12}>
            <Grid container spacing={1} direction="column" justify="flex-start">
              {icon && mainTitle && (
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    <Grid item xs="auto">
                      {icon}
                    </Grid>
                    <Grid item xs>
                      <StyledTitle>{mainTitle}</StyledTitle>
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {content && (
                <Grid item xs={12}>
                  <DialogContent>{content}</DialogContent>
                </Grid>
              )}
            </Grid>
          </Grid>

          {isError && (
            <Grid item xs={12}>
              <Typography variant="body2" color="error" align="center">
                {customErrorMessage ||
                  t('ui.common.defaultError', 'An unexpected error occurred')}
              </Typography>
            </Grid>
          )}

          {/* 
            NOTE: 
            For more complicated dialogs, we allow hiding these buttons so these
            more complicated dialogs use their own buttons.
          */}
          {(!hideConfirmationButton || !hideCancelButton) && (
            <Grid item xs={12}>
              <Grid
                container
                spacing={1}
                alignItems="center"
                justify={isMdOrLarger ? 'flex-start' : 'center'}
              >
                {!hideConfirmationButton && (
                  <Grid item>
                    <Button
                      variant="contained"
                      onClick={onConfirm}
                      disabled={
                        isConfirmationButtonDisabled || isDisabled || isLoading
                      }
                      fullWidth
                    >
                      {confirmationButtonText || t('ui.common.ok', 'OK')}
                    </Button>
                  </Grid>
                )}
                {!hideCancelButton && (
                  <Grid item>
                    <Button
                      variant="outlined"
                      onClick={closeDialog}
                      disabled={
                        isCancelButtonDisabled || isDisabled || isLoading
                      }
                      fullWidth
                    >
                      {cancelButtonText || t('ui.common.cancel', 'Cancel')}
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Grid>
          )}
        </Grid>
      </Box>
    </MuiDialog>
  );
};

export default UpdatedConfirmationDialog;
