import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { UserPermissionType } from 'api/admin/api';
import opsRoutes from 'apps/ops/routes';
import PermissionDeniedIcon from 'components/icons/PermissionDeniedIcon';
import { useRefreshUserPermissions } from 'hooks/useRefreshUserPermissions';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setShowGlobalPermissionDeniedDialog } from 'redux-app/modules/app/actions';
import {
  selectGlobalPermissionDeniedDialog,
  selectIsUsingAdminApp,
  selectIsUsingFreezersApp,
} from 'redux-app/modules/app/selectors';
import { performLogout } from 'redux-app/modules/user/actions';
import {
  selectCanViewProblemReportsTab,
  selectFirstAccessibleAdminRouteByPermission,
  selectFirstAccessibleFreezerRouteByPermission,
  selectHasPermission,
} from 'redux-app/modules/user/selectors';
import UpdatedConfirmationDialog from '../UpdatedConfirmationDialog';

const PermissionDeniedDialog = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { refetch: refetchPermissions } = useRefreshUserPermissions();

  const firstAccessibleAdminRouteByPermission = useSelector(
    selectFirstAccessibleAdminRouteByPermission
  );
  const firstAccessibleFreezerRouteByPermission = useSelector(
    selectFirstAccessibleFreezerRouteByPermission
  );
  const hasPermission = useSelector(selectHasPermission);
  const canAccessViewTab = hasPermission(UserPermissionType.ViewTabAccess);
  const canAccessAdministrationTab = hasPermission(
    UserPermissionType.AdministrationTabAccess
  );
  const canViewAssetSummaryTab = hasPermission(
    UserPermissionType.ViewTabAssetSummary
  );
  const canViewEventsTab = hasPermission(UserPermissionType.ViewTabEvents);
  const canViewMap = hasPermission(
    UserPermissionType.MiscellaneousFeatureViewMap
  );
  const canViewProblemReportsTab = useSelector(selectCanViewProblemReportsTab);
  const isUsingAdminApp = useSelector(selectIsUsingAdminApp);
  const isUsingFreezersApp = useSelector(selectIsUsingFreezersApp);
  const globalPermissionDeniedDialog = useSelector(
    selectGlobalPermissionDeniedDialog
  );
  const { showDialog, wasTriggeredFromApi } = globalPermissionDeniedDialog;

  const redirectToOpsHomePage = () => {
    if (canViewAssetSummaryTab) {
      history.push(opsRoutes.assetSummary.list);
    } else if (canViewEventsTab) {
      history.push(opsRoutes.events.list);
    } else if (canViewMap) {
      history.push(opsRoutes.assetMap.list);
    } else if (canViewProblemReportsTab) {
      history.push(opsRoutes.problemReports.list);
    }
  };

  const handleClose = () => {
    const canLandOnAdminHome =
      canAccessAdministrationTab && firstAccessibleAdminRouteByPermission;
    const canLandOnOpsHome =
      canAccessViewTab &&
      (canViewAssetSummaryTab ||
        canViewEventsTab ||
        canViewMap ||
        canViewProblemReportsTab);
    const canLandOnFreezersHome = !!firstAccessibleFreezerRouteByPermission;
    if (!canLandOnAdminHome && !canLandOnOpsHome && !canLandOnFreezersHome) {
      dispatch(performLogout());
      return;
    }

    // Redirect based on permissions
    if (isUsingAdminApp && firstAccessibleAdminRouteByPermission) {
      history.push(firstAccessibleAdminRouteByPermission);
    } else if (isUsingFreezersApp && firstAccessibleFreezerRouteByPermission) {
      history.push(firstAccessibleFreezerRouteByPermission);
    } else {
      redirectToOpsHomePage();
    }

    if (showDialog) {
      dispatch(setShowGlobalPermissionDeniedDialog({ showDialog: false }));
    }
  };

  // Only refetch permissions if the dialog was triggered from an API call
  // (example: a 403 response)
  useEffect(() => {
    if (wasTriggeredFromApi) {
      refetchPermissions();
    }
  }, [wasTriggeredFromApi]);

  return (
    <UpdatedConfirmationDialog
      open={showDialog}
      maxWidth="xs"
      disableBackdropClick
      disableEscapeKeyDown
      mainTitle={t('ui.common.permissionDenied', 'Permission Denied')}
      content={
        <>
          <Grid container spacing={3} alignItems="center" justify="center">
            <Grid item>
              <Box textAlign="center">
                <PermissionDeniedIcon />
              </Box>
            </Grid>
            <Grid item>
              <Typography align="center">
                {t(
                  'ui.permissionDeniedDialog.messageText',
                  'The action could not be performed'
                )}
              </Typography>
            </Grid>
          </Grid>
        </>
      }
      onConfirm={handleClose}
      hideCancelButton
    />
  );
};

export default PermissionDeniedDialog;
