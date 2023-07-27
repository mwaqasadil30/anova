/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import CancelButton from 'components/buttons/CancelButton';
import SaveAndExitButton from 'components/buttons/SaveAndExitButton';
import SaveButton from 'components/buttons/SaveButton';
import PageHeader from 'components/PageHeader';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { SaveResponse } from '../../types';

enum SaveType {
  Save = 'save',
  SaveAndExit = 'save-and-exit',
}

interface Props {
  submitForm?: any;
  isCreating?: boolean;
  isSubmitting: boolean;
  submissionResult: any;
  headerNavButton?: React.ReactNode;
  isInlineForm?: boolean;
  cancelCallback?: () => void;
  saveCallback?: (response: SaveResponse) => void;
  saveAndExitCallback?: (response: SaveResponse) => void;
}

const PageIntro = ({
  isSubmitting,
  submitForm,
  submissionResult,
  headerNavButton,
  isInlineForm,
  cancelCallback,
  saveCallback,
  saveAndExitCallback,
}: Props) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [saveType, setSaveType] = useState<SaveType>();

  const cancel = () => {
    cancelCallback?.();
  };

  const submit = () => {
    submitForm?.().then(() => {
      setSaveType(SaveType.Save);
    });
  };

  const submitAndGoToListPage = () => {
    submitForm?.().then(() => {
      setSaveType(SaveType.SaveAndExit);
    });
  };

  useEffect(() => {
    if (!submissionResult?.response || isSubmitting) {
      return;
    }

    if (saveType === SaveType.Save) {
      saveCallback?.(submissionResult.response);
    } else if (saveType === SaveType.SaveAndExit) {
      saveAndExitCallback?.(submissionResult.response);
    }
  }, [submissionResult, saveType, history, isSubmitting]);

  return (
    <Box>
      <Grid container spacing={2} alignItems="center" justify="space-between">
        <Grid item>
          <Grid container spacing={1} alignItems="center">
            {headerNavButton && <Grid item>{headerNavButton}</Grid>}
            <Grid item>
              <PageHeader dense>
                {t(
                  'ui.calibrationParameters.editCalibrationParameters',
                  'Edit Calibration Parameters'
                )}
              </PageHeader>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <CancelButton onClick={cancel} fullWidth />
            </Grid>
            {!isInlineForm && (
              <Grid item>
                <SaveButton fullWidth onClick={submit} />
              </Grid>
            )}
            <Grid item>
              <SaveAndExitButton
                variant="contained"
                fullWidth
                onClick={submitAndGoToListPage}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PageIntro;
