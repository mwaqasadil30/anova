import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { UserPermissionType } from 'api/admin/api';
import routes from 'apps/admin/routes';
import BackIconButton from 'components/buttons/BackIconButton';
import CancelButton from 'components/buttons/CancelButton';
import SaveAndExitButton from 'components/buttons/SaveAndExitButton';
import SaveButton from 'components/buttons/SaveButton';
import PageHeader from 'components/PageHeader';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath, useHistory } from 'react-router-dom';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import { AccessType } from 'types';

enum SaveType {
  Save = 'save',
  SaveAndExit = 'save-and-exit',
}

interface Props {
  submitForm?: any;
  refetchEditData?: any;
  isCreating: boolean;
  isSubmitting: boolean;
  submissionResult: any;
}

const PageIntro = ({
  isCreating,
  isSubmitting,
  refetchEditData,
  submitForm,
  submissionResult,
}: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const theme = useTheme();
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  const hasPermission = useSelector(selectHasPermission);
  const canCreate = hasPermission(
    UserPermissionType.AssetTreeAccess,
    AccessType.Create
  );
  const canUpdate = hasPermission(
    UserPermissionType.AssetTreeAccess,
    AccessType.Update
  );
  const showSaveOptions =
    (isCreating && canCreate) || (!isCreating && canUpdate);

  const [saveType, setSaveType] = useState<SaveType>();

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
      const editAssetTreeRoutePath = generatePath(
        routes.assetTreeManager.edit,
        {
          assetTreeId: submissionResult.response.saveTreeResult?.editObject?.id,
        }
      );
      history.replace(editAssetTreeRoutePath);
    } else if (saveType === SaveType.SaveAndExit) {
      history.push(routes.assetTreeManager.list);
    }
  }, [submissionResult, saveType, history, isSubmitting]);

  return (
    <Box>
      <Grid container spacing={2} alignItems="center" justify="space-between">
        <Grid item xs={12} md="auto">
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <BackIconButton onClick={() => history.goBack()} />
            </Grid>
            <Grid item>
              <PageHeader dense>
                {isCreating
                  ? t('ui.assetTree.addTree', 'Add Tree')
                  : t('ui.assetTree.editTree', 'Edit Tree')}
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
                    fullWidth={isBelowSmBreakpoint}
                    useDomainColorForIcon
                  />
                </Grid>
                <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
                  <SaveButton
                    onClick={submit}
                    fullWidth
                    useDomainColorForIcon
                  />
                </Grid>
                <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
                  <SaveAndExitButton
                    onClick={submitAndGoToListPage}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default PageIntro;
