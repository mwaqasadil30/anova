import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { UserPermissionType } from 'api/admin/api';
import routes from 'apps/admin/routes';
import Button from 'components/Button';
import PageHeader from 'components/PageHeader';
import DownloadButton from 'components/DownloadButton';
import RefreshButton from 'components/RefreshButton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import { AccessType } from 'types';

interface Props {
  refetchRecords: () => void;
}

const PageIntro = ({ refetchRecords }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  const hasPermission = useSelector(selectHasPermission);
  const canAddTankDimension = hasPermission(
    UserPermissionType.TankDimensionAccess,
    AccessType.Create
  );

  return (
    <Grid container spacing={2} alignItems="center" justify="space-between">
      <Grid item xs={12} md="auto">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PageHeader dense>
              {t(
                'ui.tankdimension.tankdimensionsmanager',
                'Tank Dimensions Manager'
              )}
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
              <RefreshButton onClick={refetchRecords} fullWidth />
            </Grid>
            <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
              <DownloadButton fullWidth />
            </Grid>
            {canAddTankDimension && (
              <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
                <Button
                  variant="contained"
                  fullWidth
                  component={Link}
                  to={routes.tankDimensionManager.create}
                >
                  {t('ui.asset.addtank', 'Add Tank')}
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default PageIntro;
