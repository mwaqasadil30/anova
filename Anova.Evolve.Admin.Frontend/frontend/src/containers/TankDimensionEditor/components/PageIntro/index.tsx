/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { UserPermissionType } from 'api/admin/api';
import CancelButton from 'components/buttons/CancelButton';
import SaveAndExitButton from 'components/buttons/SaveAndExitButton';
import SaveButton from 'components/buttons/SaveButton';
import PageHeader from 'components/PageHeader';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
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
  isSubmitting: boolean;
  submissionResult: any;
  headerNavButton?: React.ReactNode;
  isInlineForm?: boolean;
  saveCallback?: (response: any) => void;
  saveAndExitCallback?: (response: any) => void;
}

const PageIntro = ({
  isCreating,
  isSubmitting,
  refetchEditData,
  submitForm,
  submissionResult,
  headerNavButton,
  isInlineForm,
  saveCallback,
  saveAndExitCallback,
}: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const theme = useTheme();
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  const hasPermission = useSelector(selectHasPermission);
  const canCreateTankDimension = hasPermission(
    UserPermissionType.TankDimensionAccess,
    AccessType.Create
  );
  const canUpdateTankDimension = hasPermission(
    UserPermissionType.TankDimensionAccess,
    AccessType.Update
  );
  const showSaveOptions =
    (isCreating && canCreateTankDimension) ||
    (!isCreating && canUpdateTankDimension);

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
      saveCallback?.(submissionResult.response);
    } else if (saveType === SaveType.SaveAndExit) {
      saveAndExitCallback?.(submissionResult.response);
    }
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
                  ? t(
                      'ui.tankdimension.addtankdimensions',
                      'Add Tank Dimensions'
                    )
                  : t(
                      'ui.tankdimension.edittankdimensions',
                      'Edit Tank Dimensions'
                    )}
              </PageHeader>
            </Grid>
          </Grid>
        </Grid>
        {showSaveOptions && (
          <Grid item xs={isInlineForm ? 'auto' : 12} md="auto">
            <Box clone justifyContent={{ xs: 'space-between', md: 'flex-end' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid
                  item
                  {...(isBelowSmBreakpoint && !isInlineForm && { xs: true })}
                >
                  <CancelButton
                    onClick={cancel}
                    fullWidth
                    useDomainColorForIcon
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
