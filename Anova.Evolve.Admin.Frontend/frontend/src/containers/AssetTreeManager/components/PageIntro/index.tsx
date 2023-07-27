import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { UserPermissionType } from 'api/admin/api';
import routes from 'apps/admin/routes';
import Button from 'components/Button';
import PageHeader from 'components/PageHeader';
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
  const canAdd = hasPermission(
    UserPermissionType.AssetTreeAccess,
    AccessType.Create
  );

  return (
    <Grid container spacing={2} alignItems="center" justify="space-between">
      <Grid item xs={12} md="auto">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PageHeader dense>
              {t('ui.assetTree.assetTreeManager', 'Asset Tree Manager')}
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
            {canAdd && (
              <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
                <Button
                  variant="contained"
                  fullWidth
                  component={Link}
                  to={routes.assetTreeManager.create}
                >
                  {t('ui.assetTree.addAssetTree', 'Add Asset Tree')}
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
