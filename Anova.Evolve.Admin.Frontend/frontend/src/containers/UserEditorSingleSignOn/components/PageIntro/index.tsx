import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { UserPermissionType } from 'api/admin/api';
import FormErrorAlert from 'components/FormErrorAlert';
import CancelButton from 'components/buttons/CancelButton';
import SaveAndExitButton from 'components/buttons/SaveAndExitButton';
import SaveButton from 'components/buttons/SaveButton';
import PageHeader from 'components/PageHeader';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import DefaultTransition from 'components/common/animations/DefaultTransition';
import { useHistory } from 'react-router-dom';
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
  isSubmitting?: boolean;
  submissionResult?: any;
  submissionError?: any;
  headerNavButton?: React.ReactNode;
  isInlineForm?: boolean;
  resetForm?: () => void;
  saveCallback?: (response: any) => void;
  saveAndExitCallback?: (response: any) => void;
}

const PageIntro = ({
  isCreating,
  isSubmitting,
  refetchEditData,
  submissionResult,
  submissionError,
  headerNavButton,
  isInlineForm,
  resetForm,
  submitForm,
  saveCallback,
  saveAndExitCallback,
}: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const theme = useTheme();
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  const hasPermission = useSelector(selectHasPermission);
  const canCreateUser = hasPermission(
    UserPermissionType.UserGeneral,
    AccessType.Create
  );
  const canUpdateUser = hasPermission(
    UserPermissionType.UserGeneral,
    AccessType.Update
  );
  const showSaveOptions =
    (isCreating && canCreateUser) || (!isCreating && canUpdateUser);

  const [saveType, setSaveType] = useState<SaveType>();

  const cancel = () => {
    resetForm?.();
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
        <Grid item xs={isInlineForm ? 'auto' : 12} md="auto">
          <Grid container spacing={1} alignItems="center">
            {headerNavButton && <Grid item>{headerNavButton}</Grid>}
            <Grid item>
              <PageHeader dense>
                {isCreating
                  ? t('ui.userEditor.addUser', 'Add User')
                  : t('ui.userEditor.editUser', 'Edit User')}
              </PageHeader>
            </Grid>
          </Grid>
        </Grid>
        {showSaveOptions && (
          <Grid item xs={isInlineForm ? 'auto' : 12} md="auto">
            <Box
              clone
              justifyContent={['space-between', 'space-between', 'flex-end']}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid
                  item
                  {...(isBelowSmBreakpoint && !isInlineForm && { xs: true })}
                >
                  <CancelButton
                    onClick={cancel}
                    fullWidth
                    useDomainColorForIcon
                    disabled={isSubmitting}
                  />
                </Grid>
                {!isInlineForm && (
                  <Grid
                    item
                    {...(isBelowSmBreakpoint && !isInlineForm && { xs: true })}
                  >
                    <SaveButton
                      fullWidth
                      onClick={submit}
                      useDomainColorForIcon
                      disabled={isSubmitting}
                    />
                  </Grid>
                )}
                <Grid
                  item
                  {...(isBelowSmBreakpoint && !isInlineForm && { xs: true })}
                >
                  <SaveAndExitButton
                    variant="contained"
                    fullWidth
                    onClick={submitAndGoToListPage}
                    disabled={isSubmitting}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        )}
        <DefaultTransition in={!!submissionError} unmountOnExit>
          <Grid item xs={12}>
            <FormErrorAlert>
              {t('ui.common.unableToSave', 'Unable to save')}
            </FormErrorAlert>
          </Grid>
        </DefaultTransition>
      </Grid>
    </Box>
  );
};

export default PageIntro;
