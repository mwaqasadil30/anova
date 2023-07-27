import Box from '@material-ui/core/Box';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { EditAsset } from 'api/admin/api';
import Button from 'components/Button';
import DialogContent from 'components/dialog/DialogContent';
import DialogTitle from 'components/dialog/DialogTitle';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledDialogContent = styled(DialogContent)`
  p {
    font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
    color: ${(props) => props.theme.palette.text.primary};
  }
`;

const FieldTitle = styled(Typography)`
  font-weight: bold;
  color: ${(props) => props.theme.palette.text.primary};
`;
const FieldValue = styled(Typography)`
  color: ${(props) => props.theme.palette.text.primary};
`;

export interface SuccessfulCreationDialogProps {
  createdAsset?: EditAsset | null;
  exitPath: string;
  viewDetailsPath?: string;
  handleCreateNew: () => void;
}

const SuccessfulCreationDialog = ({
  createdAsset,
  exitPath,
  viewDetailsPath,
  handleCreateNew,
}: SuccessfulCreationDialogProps) => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(!!createdAsset);

  useEffect(() => {
    if (createdAsset) {
      setIsDialogOpen(true);
    }
  }, [createdAsset]);

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const mainTitle = t(
    'ui.quicktankcreate.successDialog.saveSuccessful',
    'Save Successful!'
  );
  const confirmationButtonText = t(
    'ui.quicktankcreate.successDialog.createNewBulkTank',
    'Create New Bulk Tank'
  );
  return (
    <UpdatedConfirmationDialog
      open={isDialogOpen}
      maxWidth="sm"
      disableBackdropClick
      disableEscapeKeyDown
      mainTitle={mainTitle}
      content={
        <>
          <Box p={1} pb={0}>
            <Grid
              container
              spacing={4}
              direction="row"
              alignItems="center"
              justify="center"
            >
              <Grid item xs={8}>
                <DialogTitle align="center">
                  {t(
                    'ui.quicktankcreate.successDialog.bulkTankAssetCreated',
                    'Bulk Tank Asset Created'
                  )}
                </DialogTitle>
              </Grid>
              <Grid item xs={8} component={StyledDialogContent}>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={5}>
                    <FieldTitle>
                      {t(
                        'ui.datachannel.assetdescription',
                        'Asset Description'
                      )}
                      :
                    </FieldTitle>
                  </Grid>
                  <Grid item xs={12} md={7}>
                    <FieldValue> {createdAsset?.description}</FieldValue>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <FieldTitle>
                      {t('ui.common.siteinformation', 'Site Information')}:
                    </FieldTitle>
                  </Grid>
                  <Grid item xs={12} md={7}>
                    <FieldValue>{createdAsset?.siteInfo}</FieldValue>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <DialogActions>
                  {viewDetailsPath && (
                    <Button
                      variant="outlined"
                      component={Link}
                      to={viewDetailsPath}
                      replace
                    >
                      {t('ui.common.viewDetails', 'View Details')}
                    </Button>
                  )}
                  <Button variant="outlined" onClick={handleClose}>
                    {t(
                      'ui.quicktankcreate.successDialog.createNewBulkTank',
                      'Create New Bulk Tank'
                    )}
                  </Button>
                  <Button variant="contained" component={Link} to={exitPath}>
                    {t('ui.common.exit', 'Exit')}
                  </Button>
                </DialogActions>
              </Grid>
            </Grid>
          </Box>
        </>
      }
      hideCancelButton
      hideConfirmationButton
      confirmationButtonText={confirmationButtonText}
      closeDialog={handleCreateNew}
      onConfirm={handleClose}
    />
  );
};

export default SuccessfulCreationDialog;
