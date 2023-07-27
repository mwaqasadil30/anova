/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import { FormikProps } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Values } from '../../types';

const StyledText = styled(Typography)`
  color: ${(props) => props.theme.palette.text.primary};
`;

interface Props {
  setFieldValue: FormikProps<Values>['setFieldValue'];
  isSetAsPrimaryWarningOpen: boolean;
  closeSetAsPrimaryWarningDialog: () => void;
}
const SetAsPrimaryDialog = ({
  setFieldValue,
  isSetAsPrimaryWarningOpen,
  closeSetAsPrimaryWarningDialog,
}: Props) => {
  const { t } = useTranslation();

  const mainTitle = t('ui.dataChannel.confirmChanges', 'Confirm changes?');
  const confirmationButtonText = t('ui.common.yes', 'Yes');
  return (
    <UpdatedConfirmationDialog
      open={isSetAsPrimaryWarningOpen}
      maxWidth="xs"
      disableBackdropClick
      disableEscapeKeyDown
      mainTitle={mainTitle}
      content={
        <Box m={2} mb={2}>
          <Grid container spacing={2} alignItems="center" justify="center">
            <Grid item xs={12} md={12} style={{ maxWidth: '350px' }}>
              <StyledText
                align="center"
                style={{
                  fontSize: 14,
                  textAlign: 'center',
                }}
              >
                {t(
                  'ui.dataChannel.setAsPrimaryWarning',
                  'Are you sure you want to change the Data Channel status from Secondary to Primary?'
                )}
              </StyledText>
            </Grid>
          </Grid>
        </Box>
      }
      confirmationButtonText={confirmationButtonText}
      closeDialog={() => {
        closeSetAsPrimaryWarningDialog();
        // Reset the setAsPrimary boolean to false or "No"
        setFieldValue('setAsPrimary', false);
      }}
      onConfirm={closeSetAsPrimaryWarningDialog}
    />
  );
};

export default SetAsPrimaryDialog;
