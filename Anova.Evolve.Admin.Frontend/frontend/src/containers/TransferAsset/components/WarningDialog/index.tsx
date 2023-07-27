import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import routes from 'apps/admin/routes';
import Button from 'components/Button';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { defaultTextColor } from 'styles/colours';

const DialogText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize.commonFontSize};
  color: ${defaultTextColor};
`;

export interface WarningDialogProps {
  open: boolean;
  message: React.ReactNode;
}

const WarningDialog = ({ open, message }: WarningDialogProps) => {
  const { t } = useTranslation();

  const mainTitle = t('ui.assetTransfer.warning', 'Asset Transfer Warning');
  return (
    <UpdatedConfirmationDialog
      open={open}
      maxWidth="xs"
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
              <DialogText align="center">{message}</DialogText>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                component={Link}
                to={routes.assetManager.list}
              >
                {t('ui.common.ok', 'OK')}
              </Button>
            </Grid>
          </Grid>
        </Box>
      }
      hideConfirmationButton
      hideCancelButton
    />
  );
};

export default WarningDialog;
