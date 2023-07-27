import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import CancelButton from 'components/buttons/CancelButton';
import SaveAndExitButton from 'components/buttons/SaveAndExitButton';
import DefaultTransition from 'components/common/animations/DefaultTransition';
import FormErrorAlertWithMessage from 'components/FormErrorAlertWithMessage';
import PageHeader from 'components/PageHeader';
import { FormikProps } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Values } from './types';

enum SaveType {
  Save = 'save',
  SaveAndExit = 'save-and-exit',
}

interface Props {
  disableSaveButton?: boolean;
  showSaveButton?: boolean;
  isSubmitting: boolean;
  submissionResult?: boolean;
  submissionError?: any;
  submitForm?: FormikProps<Values>['submitForm'];
  cancelCallback: () => void;
  saveCallback?: (response: any) => void;
  saveAndExitCallback?: (response: any) => void;
}

const PageIntro = ({
  disableSaveButton,
  showSaveButton,
  isSubmitting,
  submissionResult,
  submissionError,
  saveCallback,
  saveAndExitCallback,
  cancelCallback,
  submitForm,
}: Props) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [saveType, setSaveType] = useState<SaveType>();

  const cancel = () => {
    cancelCallback();
  };

  const submitAndGoToListPage = () => {
    submitForm?.().then(() => {
      setSaveType(SaveType.SaveAndExit);
    });
  };

  useEffect(() => {
    if (!submissionResult || isSubmitting) {
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
              <PageHeader dense>{t('ui.common.events', 'Events')}</PageHeader>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <CancelButton onClick={cancel} fullWidth />
            </Grid>
            {showSaveButton && (
              <Grid item>
                <SaveAndExitButton
                  variant="contained"
                  fullWidth
                  onClick={submitAndGoToListPage}
                  disabled={disableSaveButton}
                />
              </Grid>
            )}
          </Grid>
        </Grid>

        <DefaultTransition in={!!submissionError} unmountOnExit>
          <Grid item xs={12}>
            <FormErrorAlertWithMessage error={submissionError} />
          </Grid>
        </DefaultTransition>
      </Grid>
    </Box>
  );
};

export default PageIntro;
