import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import routes, { AssetGroupId } from 'apps/admin/routes';
import BackIconButton from 'components/buttons/BackIconButton';
import CancelButton from 'components/buttons/CancelButton';
import SaveAndExitButton from 'components/buttons/SaveAndExitButton';
import SaveButton from 'components/buttons/SaveButton';
import PageHeader from 'components/PageHeader';
import { FormikProps } from 'formik';
import { TFunction } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath, useHistory } from 'react-router-dom';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import { AccessType } from 'types';
import {
  EditAssetGroup,
  EvolveSaveAssetGroupResponse,
  UserPermissionType,
} from '../../../api/admin/api';

const EDIT_PATH = routes.assetGroupManager.edit;
export const ITEM_ID = AssetGroupId;
const LIST_PATH = routes.assetGroupManager.list;
export interface SubmissionError {
  errors?: Record<string, string | null | undefined>;
}
type SubmissionResult = { response?: EvolveSaveAssetGroupResponse };
export type Submission = SubmissionResult & SubmissionError;
function getCopy(t: TFunction) {
  return {
    add: t('ui.assetgroup.addAssetGroup', 'Add Asset Group'),
    edit: t('ui.assetgroup.editAssetGroup', 'Edit Asset Group'),
  };
}

enum SaveType {
  Save = 'save',
  SaveAndExit = 'save-and-exit',
}

interface Props {
  submitForm?: FormikProps<EditAssetGroup>['submitForm'];
  refetchEditData?: any;
  isCreating: boolean;
  isSubmitting: boolean;
  submissionResult: Submission | undefined;
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

  const hasPermission = useSelector(selectHasPermission);
  const canCreate = hasPermission(
    UserPermissionType.AssetGroupAccess,
    AccessType.Create
  );
  const canUpdate = hasPermission(
    UserPermissionType.AssetGroupAccess,
    AccessType.Update
  );

  const showSaveOptions =
    (isCreating && canCreate) || (!isCreating && canUpdate);

  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));
  const { add, edit } = getCopy(t);
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

    switch (saveType) {
      case SaveType.Save: {
        const editRoutePath = generatePath(EDIT_PATH, {
          [ITEM_ID]:
            submissionResult.response.saveAssetGroupResult?.editObject
              ?.assetGroupId,
        });
        history.replace(editRoutePath);
        break;
      }
      case SaveType.SaveAndExit:
        history.push(LIST_PATH);
        break;
      default:
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
              <PageHeader dense>{isCreating ? add : edit}</PageHeader>
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
