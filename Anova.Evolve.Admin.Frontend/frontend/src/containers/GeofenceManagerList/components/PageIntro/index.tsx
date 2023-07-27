import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import routes from 'apps/admin/routes';
import AddButton from 'components/buttons/AddButton';
import DownloadButton from 'components/DownloadButton';
import PageHeader from 'components/PageHeader';
import RefreshButton from 'components/RefreshButton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCanCreateGeofences } from 'redux-app/modules/user/selectors';

interface Props {
  refetchRecords: () => void;
}

const PageIntro = ({ refetchRecords }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const canCreateGeofence = useSelector(selectCanCreateGeofences);

  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid container spacing={2} alignItems="center" justify="space-between">
      <Grid item xs={12} md="auto">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PageHeader dense>
              {t('ui.main.geofenceManager', 'Geofence Manager')}
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
              <RefreshButton
                onClick={refetchRecords}
                fullWidth
                useDomainColorForIcon
              />
            </Grid>
            <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
              <DownloadButton fullWidth useDomainColorForIcon />
            </Grid>
            {canCreateGeofence && (
              <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
                <AddButton
                  variant="contained"
                  component={Link}
                  to={routes.geofenceManager.create}
                  fullWidth
                >
                  {t('ui.geofenceManager.addGeofence', 'Add Geofence')}
                </AddButton>
              </Grid>
            )}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default PageIntro;
