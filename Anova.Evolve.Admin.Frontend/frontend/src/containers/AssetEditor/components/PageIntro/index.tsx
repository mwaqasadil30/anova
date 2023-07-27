import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { EvolveSaveAssetEditResponse } from 'api/admin/api';
import routes from 'apps/admin/routes';
import BackIconButton from 'components/buttons/BackIconButton';
import CancelButton from 'components/buttons/CancelButton';
import SaveAndExitButton from 'components/buttons/SaveAndExitButton';
import SaveButton from 'components/buttons/SaveButton';
import PageHeader from 'components/PageHeader';
import WarnOnUnsavedChangesDialog from 'components/WarnOnUnsavedChangesDialog';
import { SubmissionResult } from 'form-utils/types';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useHistory } from 'react-router-dom';

enum SaveType {
  Save = 'save',
  SaveAndExit = 'save-and-exit',
}

interface Props {
  refetchEditData?: any;
  isCreating: boolean;
  isSubmitting: boolean;
  submissionResult?: SubmissionResult<EvolveSaveAssetEditResponse>;
  isAnyFormDirty: boolean;
  submitForm?: () => Promise<void>;
}

const PageIntro = ({
  isCreating,
  isSubmitting,
  refetchEditData,
  submissionResult,
  isAnyFormDirty,
  submitForm,
}: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const theme = useTheme();
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  const [saveType, setSaveType] = useState<SaveType>();

  const cancel = () => {
    refetchEditData();
  };

  const submit = () => {
    setSaveType(SaveType.Save);
    submitForm?.().then(() => {
      setSaveType(SaveType.Save);
    });
  };

  const submitAndGoToListPage = () => {
    setSaveType(SaveType.SaveAndExit);
    submitForm?.().then(() => {
      setSaveType(SaveType.SaveAndExit);
    });
  };
  //
  useEffect(() => {
    if (!submissionResult?.response || isSubmitting) {
      return;
    }

    if (saveType === SaveType.Save) {
      const editRoutePath = generatePath(routes.assetManager.edit, {
        assetId: submissionResult.response.asset?.assetId,
      });
      history.replace(editRoutePath);
    } else if (saveType === SaveType.SaveAndExit) {
      history.push(routes.assetManager.list);
    }
  }, [submissionResult, saveType, history, isSubmitting]);

  return (
    <Box>
      <WarnOnUnsavedChangesDialog isDirty={isAnyFormDirty} />
      <Grid container spacing={2} alignItems="center" justify="space-between">
        <Grid item xs={12} md="auto">
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <BackIconButton onClick={() => history.goBack()} />
            </Grid>
            <Grid item>
              <PageHeader dense>
                {isCreating
                  ? t('ui.asset.addAsset', 'Add Asset')
                  : t('ui.asset.editAsset', 'Edit Asset')}
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
                  fullWidth={isBelowSmBreakpoint}
                  useDomainColorForIcon
                />
              </Grid>
              <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
                <SaveButton onClick={submit} fullWidth useDomainColorForIcon />
              </Grid>
              <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
                <SaveAndExitButton onClick={submitAndGoToListPage} fullWidth />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PageIntro;
