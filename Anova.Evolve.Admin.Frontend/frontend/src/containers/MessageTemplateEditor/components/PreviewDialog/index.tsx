/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormattedTemplates } from '../ObjectForm/types';

interface Props {
  open: boolean;
  close: () => void;
  formattedTemplates: FormattedTemplates | null;
}

const PreviewDialog = ({ open, close, formattedTemplates }: Props) => {
  const { t } = useTranslation();
  const mainTitle = t(
    'ui.messageTemplateEditor.messageTemplatePreview',
    'Message Template Preview'
  );
  const confirmationButtonText = t('ui.common.close', 'Close');
  return (
    <UpdatedConfirmationDialog
      open={open}
      maxWidth="md"
      isMdOrLarger
      mainTitle={mainTitle}
      content={
        <Box p={1}>
          <Grid container spacing={2} alignItems="center" justify="flex-start">
            <Grid item xs={12}>
              <Grid container spacing={3} alignItems="stretch">
                <Grid item xs={12}>
                  <StyledTextField
                    label={t('ui.messageTemplateEditor.subject', 'Subject')}
                    value={formattedTemplates?.subject || ''}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <StyledTextField
                    label={t('ui.messageTemplateEditor.body', 'Body')}
                    multiline
                    value={formattedTemplates?.body || ''}
                    rows={10}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      }
      confirmationButtonText={confirmationButtonText}
      onConfirm={close}
      hideCancelButton
    />
  );
};

export default PreviewDialog;
