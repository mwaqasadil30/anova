import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from 'components/Button';
import CircularProgress from 'components/CircularProgress';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { GeoCsvFormat } from 'types';

export interface DownloadDialogProps {
  open: boolean;
  isDownloading: boolean;
  handleClose: () => void;
  setDownloadFormat: Dispatch<SetStateAction<GeoCsvFormat | null | undefined>>;
  downloadData: () => void;
  setIsDownloading: Dispatch<SetStateAction<boolean>>;
}

const DownloadDialog = ({
  open,
  isDownloading,
  handleClose,
  setDownloadFormat,
  downloadData,
  setIsDownloading,
}: DownloadDialogProps) => {
  const { t } = useTranslation();

  const mainTitle = t('ui.assetdetail.timeformat', 'Select CSV Format');

  const confirmationButtonText = t('ui.common.download', 'Download');

  const handleNorthAmericaClick = () => {
    setDownloadFormat(GeoCsvFormat.NorthAmerica);
    setIsDownloading(true);
  };

  const handleEuropeClick = () => {
    setDownloadFormat(GeoCsvFormat.Europe);
    setIsDownloading(true);
  };

  return (
    <UpdatedConfirmationDialog
      open={open}
      maxWidth="xs"
      mainTitle={mainTitle}
      content={
        <Box p={2} pb={0}>
          <Grid
            container
            spacing={2}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item container justify="space-around" xs={12}>
              {isDownloading ? (
                <CircularProgress />
              ) : (
                <>
                  <Grid item>
                    <Button
                      variant="outlined"
                      onClick={handleNorthAmericaClick}
                    >
                      {t('ui.common.northAmerica', 'North America')}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="outlined" onClick={handleEuropeClick}>
                      {t('ui.common.europe', 'Europe')}
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </Box>
      }
      confirmationButtonText={confirmationButtonText}
      closeDialog={handleClose}
      onConfirm={downloadData}
      hideConfirmationButton
      hideCancelButton
    />
  );
};

export default DownloadDialog;
