/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { UserPermissionType } from 'api/admin/api';
import routes from 'apps/admin/routes';
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
  isValid?: boolean;
  submissionResult: any;
  headerNavButton?: React.ReactNode;
}

const PageIntro = ({
  isCreating,
  isSubmitting,
  isValid,
  refetchEditData,
  submitForm,
  submissionResult,
  headerNavButton,
}: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const theme = useTheme();
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  const hasPermission = useSelector(selectHasPermission);
  const canCreatePollSchedule = hasPermission(
    UserPermissionType.RTUPollSchedule,
    AccessType.Create
  );
  const canUpdatePollSchedule = hasPermission(
    UserPermissionType.RTUPollSchedule,
    AccessType.Update
  );
  const showSaveOptions =
    (isCreating && canCreatePollSchedule) ||
    (!isCreating && canUpdatePollSchedule);

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
      const editRoutePath = generatePath(routes.pollScheduleManager.edit, {
        pollScheduleId:
          submissionResult.response.saveRtuPollScheduleGroupResult?.editObject
            ?.rtuPollScheduleGroupId,
      });
      history.replace(editRoutePath);
    } else if (saveType === SaveType.SaveAndExit) {
      history.push(routes.pollScheduleManager.list);
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
                  ? t('ui.rtu.addPollSchedule', 'Add RTU Poll Schedule Group')
                  : t(
                      'ui.rtu.editPollSchedule',
                      'Edit RTU Poll Schedule Group'
                    )}
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
                    disabled={!isValid}
                    useDomainColorForIcon
                  />
                </Grid>
                <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
                  <SaveAndExitButton
                    onClick={submitAndGoToListPage}
                    fullWidth
                    disabled={!isValid}
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
