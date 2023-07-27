import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import DownloadButton from 'components/DownloadButton';
import PageHeader from 'components/PageHeader';
import RefreshButton from 'components/RefreshButton';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  refetchRecords: () => void;
}

const PageIntro = ({ refetchRecords }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  // const hasPermission = useSelector(selectHasPermission);
  // const canCreate = hasPermission(
  //   UserPermissionType.DataChannelGlobal,
  //   AccessType.Create
  // );

  return (
    <Grid container spacing={2} alignItems="center" justify="space-between">
      <Grid item xs={12} md="auto">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PageHeader dense>
              {t('ui.datachannel.datachannelmanager', 'Data Channel Manager')}
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
            {/* TODO: Uncomment once data channel creation (api) is implemented */}
            {/* {canCreate && (
              <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
                <Button variant="contained" fullWidth>
                  {t('ui.asset.adddatachannel', 'Add Data Channel')}
                </Button>
              </Grid>
            )} */}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default PageIntro;
