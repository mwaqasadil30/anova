import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import CancelButton from 'components/buttons/CancelButton';
import SaveAndExitButton from 'components/buttons/SaveAndExitButton';
import SaveButton from 'components/buttons/SaveButton';
import DefaultTransition from 'components/common/animations/DefaultTransition';
import FormErrorAlert from 'components/FormErrorAlert';
import PageHeader from 'components/PageHeader';
import { FormikProps } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

enum SaveType {
  Save = 'save',
  SaveAndExit = 'save-and-exit',
}

export interface EditorPageIntroProps<T = any> {
  title?: React.ReactNode;
  showSaveOptions?: boolean;
  disableCancel?: boolean;
  disableSave?: boolean;
  disableSaveAndExit?: boolean;
  isSubmitting?: boolean;
  submissionResult?: T;
  submissionError?: any;
  headerNavButton?: React.ReactNode;
  isWithinDrawer?: boolean;
  saveAndExitButtonText?: React.ReactNode;
  extraButtonComponent?: React.ReactNode;
  submitForm?: FormikProps<any>['submitForm'];
  cancelCallback?: () => void;
  saveCallback?: (response: T) => void;
  saveAndExitCallback?: (response: T) => void;
}

function EditorPageIntro<T = any>({
  title,
  showSaveOptions,
  disableCancel,
  disableSave,
  disableSaveAndExit,
  isSubmitting,
  submissionResult,
  submissionError,
  headerNavButton,
  isWithinDrawer,
  saveAndExitButtonText,
  extraButtonComponent,
  submitForm,
  cancelCallback,
  saveCallback,
  saveAndExitCallback,
}: EditorPageIntroProps<T>) {
  const { t } = useTranslation();

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
    if (!submissionResult || isSubmitting) {
      return;
    }

    if (saveType === SaveType.Save) {
      saveCallback?.(submissionResult);
    } else if (saveType === SaveType.SaveAndExit) {
      saveAndExitCallback?.(submissionResult);
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [submissionResult, saveType, isSubmitting]);

  const renderSubmissionErrorMessage = () => {
    /* eslint-disable indent */
    return submissionError && submissionError.errors
      ? (Object.values(submissionError?.errors).reduce(
          (previousValue, currentValue) => `${previousValue} * ${currentValue}`,
          ''
        ) as string)
      : t('ui.common.unableToSave', 'Unable to save');
    /* eslint-enable indent */
  };

  return (
    <Box>
      <Grid container spacing={2} alignItems="center" justify="space-between">
        <Grid item xs zeroMinWidth>
          <Grid container spacing={1} alignItems="center">
            {headerNavButton && <Grid item>{headerNavButton}</Grid>}
            <Grid item zeroMinWidth>
              <PageHeader
                dense
                title={(title as string) || ''}
                style={{
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {title}
              </PageHeader>
            </Grid>
          </Grid>
        </Grid>
        {showSaveOptions && (
          <Grid item>
            <Box
              clone
              justifyContent={['space-between', 'space-between', 'flex-end']}
            >
              <Grid container spacing={2} alignItems="center">
                {cancelCallback && (
                  <Grid item>
                    <CancelButton
                      onClick={cancel}
                      fullWidth
                      useDomainColorForIcon
                      disabled={isSubmitting || disableCancel}
                    />
                  </Grid>
                )}
                {extraButtonComponent && (
                  <Grid item>{extraButtonComponent}</Grid>
                )}
                {!isWithinDrawer && saveCallback && (
                  <Grid item>
                    <SaveButton
                      fullWidth
                      onClick={submit}
                      useDomainColorForIcon
                      disabled={isSubmitting || disableSave}
                    />
                  </Grid>
                )}
                {saveAndExitCallback && (
                  <Grid item>
                    <SaveAndExitButton
                      variant="contained"
                      fullWidth
                      onClick={submitAndGoToListPage}
                      disabled={isSubmitting || disableSaveAndExit}
                      children={saveAndExitButtonText || undefined}
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>
        )}
        <DefaultTransition in={!!submissionError} unmountOnExit>
          <Grid item xs={12}>
            <FormErrorAlert>{renderSubmissionErrorMessage()}</FormErrorAlert>
          </Grid>
        </DefaultTransition>
      </Grid>
    </Box>
  );
}

export default EditorPageIntro;
