import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ChartDto } from 'api/admin/api';
import CancelButton from 'components/buttons/CancelButton';
import SaveAndExitButton from 'components/buttons/SaveAndExitButton';
import FormErrorAlert from 'components/FormErrorAlert';
import PageHeader from 'components/PageHeader';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

enum SaveType {
  Save = 'save',
  SaveAndExit = 'save-and-exit',
}

interface Props {
  submitForm?: any;
  refetchEditData?: any;
  isCreating: boolean;
  isSubmitting?: boolean;
  submissionResult?: ChartDto;
  submissionError?: any;
  headerNavButton?: React.ReactNode;
  showSaveOptions?: boolean;
  saveCallback?: (chart: ChartDto) => void;
  saveAndExitCallback?: (chart: ChartDto) => void;
}

const PageIntro = ({
  isCreating,
  isSubmitting,
  // refetchEditData,
  submitForm,
  submissionResult,
  submissionError,
  headerNavButton,
  showSaveOptions,
  saveCallback,
  saveAndExitCallback,
}: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const theme = useTheme();
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  const [saveType, setSaveType] = useState<SaveType>();

  const cancel = () => {
    // refetchEditData();
    history.goBack();
    setSaveType(undefined);
  };

  // const submit = () => {
  //   submitForm?.().then(() => {
  //     setSaveType(SaveType.Save);
  //   });
  // };

  const submitAndGoToListPage = () => {
    submitForm?.().then(() => {
      setSaveType(SaveType.SaveAndExit);
    });
  };

  useEffect(() => {
    // If the API call wasn't successful or is in progress, don't proceed with
    // save/save & exit logic
    if (!submissionResult || isSubmitting) {
      setSaveType(undefined);
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
        <Grid item xs={12} md="auto">
          <Grid container spacing={1} alignItems="center">
            {headerNavButton && <Grid item>{headerNavButton}</Grid>}
            <Grid item>
              <PageHeader dense>
                {isCreating
                  ? t('ui.freezer.chartEditor.newChart', 'New Chart')
                  : t('ui.freezer.chartEditor.editChart', 'Edit Chart')}
              </PageHeader>
            </Grid>
          </Grid>
        </Grid>
        {showSaveOptions && (
          <Grid item xs={12} md="auto">
            <Box
              clone
              justifyContent={['space-between', 'space-between', 'flex-end']}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
                  <CancelButton
                    onClick={cancel}
                    fullWidth
                    disabled={isSubmitting}
                  />
                </Grid>
                {/* <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
                <SaveButton
                  onClick={submit}
                  fullWidth
                  // Remove save icon since it doesn't work on dark mode atm
                  startIcon={null}
                  variant="contained"
                  disabled={isSubmitting}
                />
              </Grid> */}
                {/*
                TODO: If we decide to use the "Save & Close" button then we may
                need the siteId in the ChartDetails response so we can redirect
                to it (example: if they open this page in a new tab).
              */}
                <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
                  <SaveAndExitButton
                    onClick={submitAndGoToListPage}
                    fullWidth
                    disabled={isSubmitting}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        )}
        <Fade in={!isSubmitting && !!submissionError} unmountOnExit>
          <Grid item xs={12}>
            <FormErrorAlert>
              {t('ui.common.unableToSave', 'Unable to save')}
            </FormErrorAlert>
          </Grid>
        </Fade>
      </Grid>
    </Box>
  );
};

export default PageIntro;
