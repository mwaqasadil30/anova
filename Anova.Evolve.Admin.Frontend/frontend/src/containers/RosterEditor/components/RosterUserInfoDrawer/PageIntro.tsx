import Box from '@material-ui/core/Box';
import Alert from 'components/Alert';
import Grid from '@material-ui/core/Grid';
import CancelButton from 'components/buttons/CancelButton';
import SaveAndExitButton from 'components/buttons/SaveAndExitButton';
import PageHeader from 'components/PageHeader';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultTransition from 'components/common/animations/DefaultTransition';
import { useHistory } from 'react-router';
import { RosterUserSummaryDto } from 'api/admin/api';
import { SaveCallbackFunction } from 'containers/RosterEditor/types';

enum SaveType {
  Save = 'save',
  SaveAndExit = 'save-and-exit',
}

interface Props {
  closeDeliveryDrawer: () => void;
  submitForm?: any;
  isSubmitting: boolean;
  submissionResult?: RosterUserSummaryDto;
  submissionError?: any;
  saveCallback?: SaveCallbackFunction;
  saveAndExitCallback?: (rosterUser: RosterUserSummaryDto) => void;
}

const PageIntro = ({
  closeDeliveryDrawer,
  submitForm,
  isSubmitting,
  submissionResult,
  submissionError,
  saveCallback,
  saveAndExitCallback,
}: Props) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [saveType, setSaveType] = useState<SaveType>();

  const cancel = () => {
    closeDeliveryDrawer();
  };

  const submitAndClose = () => {
    submitForm?.().then(() => {
      setSaveType(SaveType.SaveAndExit);
    });
  };

  useEffect(() => {
    if (!submissionResult?.rosterUserId || isSubmitting) {
      return;
    }

    if (saveType === SaveType.Save) {
      saveCallback?.(submissionResult);
    } else if (saveType === SaveType.SaveAndExit) {
      saveAndExitCallback?.(submissionResult);
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [submissionResult, saveType, history, isSubmitting]);

  return (
    <Box>
      <Grid container spacing={2} alignItems="center" justify="space-between">
        <Grid item>
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <PageHeader dense>
                {t('ui.rosterEditor.rosterUserEditor', 'Roster User Editor')}
              </PageHeader>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <CancelButton
                onClick={cancel}
                fullWidth
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item>
              <SaveAndExitButton
                variant="contained"
                fullWidth
                onClick={submitAndClose}
                disabled={isSubmitting}
              />
            </Grid>
          </Grid>
        </Grid>

        <DefaultTransition in={!!submissionError} unmountOnExit>
          <Grid item xs={12}>
            <Alert variant="filled" severity="error">
              {t('ui.common.unableToSave', 'Unable to save')}
            </Alert>
          </Grid>
        </DefaultTransition>
      </Grid>
    </Box>
  );
};

export default PageIntro;
