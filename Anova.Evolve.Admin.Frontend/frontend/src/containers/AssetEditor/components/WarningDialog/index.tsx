import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import routes from 'apps/admin/routes';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

const DialogText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize.commonFontSize};
  font-weight: 400;
`;

export interface WarningDialogProps {
  message: React.ReactNode;
  open: boolean;
  title?: React.ReactNode;
}

const WarningDialog = ({ message, open }: WarningDialogProps) => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleClose = () => {
    history.push(routes.assetManager.list);
  };

  const mainTitle = t('ui.assetEditor.assetWarning', 'Asset Warning');

  return (
    <UpdatedConfirmationDialog
      open={open}
      maxWidth="sm"
      disableBackdropClick
      disableEscapeKeyDown
      mainTitle={mainTitle}
      content={
        <Box p={2}>
          <Grid
            container
            spacing={2}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item xs={12}>
              <SearchCloudIcon />
            </Grid>
            <Grid item xs={12}>
              <DialogText>{message}</DialogText>
            </Grid>
          </Grid>
        </Box>
      }
      onConfirm={handleClose}
      hideCancelButton
    />
  );
};

export default WarningDialog;
