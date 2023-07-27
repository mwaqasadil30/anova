import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  EvolveSaveDomainAdditionalResponse,
  EvolveSaveDomainResponse,
} from 'api/admin/api';
import routes from 'apps/admin/routes';
import Alert from 'components/Alert';
import CancelButton from 'components/buttons/CancelButton';
import SaveAndExitButton from 'components/buttons/SaveAndExitButton';
import SaveButton from 'components/buttons/SaveButton';
import PageHeader from 'components/PageHeader';
import { SubmissionResult } from 'form-utils/types';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useHistory } from 'react-router-dom';

enum SaveType {
  Save = 'save',
  SaveAndExit = 'save-and-exit',
}

interface Props {
  domainName?: string;
  submitForm?: any;
  refetchEditData?: any;
  isCreating: boolean;
  isSubmitting: boolean;
  isValid?: boolean;
  submissionResult?: SubmissionResult<EvolveSaveDomainResponse>;
  domainAdditionalSubmissionResult?: SubmissionResult<EvolveSaveDomainAdditionalResponse>;
  submissionError: any;
  headerNavButton?: React.ReactNode;
}

const PageIntro = ({
  domainName,
  isCreating,
  isSubmitting,
  isValid,
  refetchEditData,
  submitForm,
  submissionResult,
  domainAdditionalSubmissionResult,
  submissionError,
  headerNavButton,
}: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const theme = useTheme();
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  const [saveType, setSaveType] = useState<SaveType>();

  const cancel = () => {
    refetchEditData();
    setSaveType(undefined);
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
    // If both API calls weren't successful or are still in progress, don't
    // proceed with save/save & exit logic
    if (
      !submissionResult?.response ||
      !domainAdditionalSubmissionResult?.response ||
      isSubmitting
    ) {
      setSaveType(undefined);
      return;
    }

    if (saveType === SaveType.Save) {
      const editRoutePath = generatePath(routes.domainManager.edit, {
        domainId: submissionResult.response.saveDomainResult?.editObject?.id,
      });
      history.replace(editRoutePath);
    } else if (saveType === SaveType.SaveAndExit) {
      history.push(routes.domainManager.list);
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [submissionResult, saveType, history, isSubmitting]);

  // Do the check below because the form values are undefined on the initial
  // load of the page. 'Edit Domain - undefined' would show up if we don't do this.
  const formattedEditDomainText = domainName
    ? `${t('ui.domainEditor.editDomain', 'Edit Domain')} - ${domainName}`
    : t('ui.domainEditor.editDomain', 'Edit Domain');

  return (
    <Box>
      <Grid container spacing={2} alignItems="center" justify="space-between">
        <Grid item xs={12} md="auto">
          <Grid container spacing={1} alignItems="center">
            {headerNavButton && <Grid item>{headerNavButton}</Grid>}
            <Grid item>
              <PageHeader dense>
                {isCreating
                  ? t('ui.domainEditor.addDomain', 'Add Domain')
                  : formattedEditDomainText}
              </PageHeader>
            </Grid>
          </Grid>
        </Grid>
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
                  useDomainColorForIcon
                />
              </Grid>
              <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
                <SaveButton
                  onClick={submit}
                  disabled={!isValid}
                  fullWidth
                  useDomainColorForIcon
                />
              </Grid>
              <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
                <SaveAndExitButton
                  onClick={submitAndGoToListPage}
                  disabled={!isValid}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Fade in={!isSubmitting && !!submissionError} unmountOnExit>
          <Grid item xs={12}>
            <Alert severity="error">
              {t('ui.domainEditor.error', 'Unable to save domain')}
            </Alert>
          </Grid>
        </Fade>
      </Grid>
    </Box>
  );
};

export default PageIntro;
