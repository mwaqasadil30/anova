import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import PageHeader from 'components/PageHeader';
import DownloadButton from 'components/DownloadButton';
import RefreshButton from 'components/RefreshButton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BackIconButton from 'components/buttons/BackIconButton';

interface Props {
  refetchRecords: () => void;
}

const PageIntro = ({ refetchRecords }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid container spacing={2} alignItems="center" justify="space-between">
      <Grid item xs={12} md="auto">
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <BackIconButton />
          </Grid>
          <Grid item>
            <PageHeader dense>
              {t(
                'ui.reports.quickAssetCreatePageTitle',
                'Quick Asset Create Report'
              )}
            </PageHeader>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md="auto">
        <Grid container spacing={2} alignItems="center" justify="flex-end">
          <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
            <RefreshButton onClick={refetchRecords} fullWidth />
          </Grid>
          <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
            <DownloadButton fullWidth />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PageIntro;
