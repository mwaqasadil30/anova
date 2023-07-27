import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import routes, { DataChannelId } from 'apps/admin/routes';
import Alert from 'components/Alert';
import CancelButton from 'components/buttons/CancelButton';
import SaveAndExitButton from 'components/buttons/SaveAndExitButton';
import SaveButton from 'components/buttons/SaveButton';
import ErrorAlertLinks from 'components/ErrorAlertLinks';
import PageSubHeader from 'components/PageSubHeader';
import { DataChannelEditorTabs } from 'containers/DataChannelEditorLegacy/types';
import { SubmissionResult } from 'form-utils/types';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useHistory } from 'react-router-dom';
import { SaveResponse } from '../../types';

enum SaveType {
  Save = 'save',
  SaveAndExit = 'save-and-exit',
}

interface Props {
  submitForm?: any;
  refetchEditData?: any;
  isCreating: boolean;
  isSubmitting: boolean;
  isValid?: boolean;
  submissionResult?: SubmissionResult<SaveResponse>;
  submissionError: any;
  formikErrorStatus?: any;
  headerNavButton?: React.ReactNode;
  assetDescription?: string | null;
  siteCustomerName?: string | null;
  dataChannelTypeText?: string;
  handleChangeActiveTab: (
    event: React.ChangeEvent<{}> | undefined,
    newValue: DataChannelEditorTabs
  ) => void;
}

const PageIntro = ({
  isCreating,
  isSubmitting,
  isValid,
  refetchEditData,
  submitForm,
  submissionResult,
  submissionError,
  formikErrorStatus,
  headerNavButton,
  assetDescription,
  siteCustomerName,
  dataChannelTypeText,
  handleChangeActiveTab,
}: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const theme = useTheme();
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  const [saveType, setSaveType] = useState<SaveType>();

  const assetDescriptionAndCustomerName = [siteCustomerName, assetDescription]
    .filter(Boolean)
    .join(' ');
  const assetTitleSubtext = [
    assetDescriptionAndCustomerName,
    dataChannelTypeText,
  ]
    .filter(Boolean)
    .join(' - ');

  const cancel = () => {
    refetchEditData();
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
      const editRoutePath = generatePath(routes.dataChannelManagerLegacy.edit, {
        [DataChannelId]:
          submissionResult.response.dataChannelGeneralInfo?.dataChannelId,
      });
      history.replace(editRoutePath);
    } else if (saveType === SaveType.SaveAndExit) {
      history.push(routes.dataChannelManager.list);
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
              <PageSubHeader dense>
                {isCreating
                  ? t('ui.asset.adddatachannel', 'Add Data Channel')
                  : t('ui.datachannel.editdatachannel', 'Edit Data Channel')}
              </PageSubHeader>
              <Typography>{assetTitleSubtext}</Typography>
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
        <Fade in={!!formikErrorStatus} unmountOnExit>
          <Grid item xs={12}>
            {formikErrorStatus && (
              <ErrorAlertLinks
                errors={formikErrorStatus}
                handleChangeActiveTab={handleChangeActiveTab}
              />
            )}
          </Grid>
        </Fade>
        <Fade in={!!submissionError} unmountOnExit>
          <Grid item xs={12}>
            <Alert severity="error" variant="filled">
              {t('ui.common.unableToSave', 'Unable to save')}
            </Alert>
          </Grid>
        </Fade>
      </Grid>
    </Box>
  );
};

export default PageIntro;
