/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { UserPermissionType } from 'api/admin/api';
import CancelButton from 'components/buttons/CancelButton';
import SaveAndExitButton from 'components/buttons/SaveAndExitButton';
import SaveButton from 'components/buttons/SaveButton';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import { AccessType } from 'types';

interface Props {
  submitForm?: any;
  isCreating: boolean;
  headerNavButton?: React.ReactNode;
  isInlineForm?: boolean;
  onPreviousEventSwitch: () => void;
  onNextEventSwitch: () => void;
  cancelCallback?: () => void;
  saveCallback?: (response: any) => void;
  saveAndExitCallback?: (response: any) => void;
}

const PageIntro = ({
  isCreating,
  submitForm,
  headerNavButton,
  isInlineForm,
  cancelCallback,
}: Props) => {
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

  const cancel = () => {
    cancelCallback?.();
  };

  const submit = () => {
    submitForm?.();
  };

  const submitAndGoToListPage = () => {
    submitForm?.();
  };

  return (
    <Box py={2}>
      <Grid container spacing={2} alignItems="center" justify="space-between">
        <Grid item>
          <Grid container spacing={1} alignItems="center">
            {headerNavButton && <Grid item>{headerNavButton}</Grid>}
          </Grid>
        </Grid>
        {showSaveOptions && (
          <Grid item>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <CancelButton onClick={cancel} fullWidth />
              </Grid>
              {!isInlineForm && (
                <Grid item>
                  <SaveButton fullWidth onClick={submit} />
                </Grid>
              )}
              <Grid item>
                <SaveAndExitButton
                  variant="contained"
                  fullWidth
                  onClick={submitAndGoToListPage}
                />
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default PageIntro;
