import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import routes from 'apps/freezers/routes';
import AddButton from 'components/buttons/AddButton';
import PageHeader from 'components/PageHeader';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const PageIntro = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid container spacing={2} alignItems="center" justify="space-between">
      <Grid item xs={12} md="auto">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PageHeader dense>
              {t('ui.defaultChartManager.pageHeader', 'Default Chart Manager')}
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
              <AddButton
                variant="contained"
                component={Link}
                to={routes.defaultChartManager.create}
                fullWidth
              >
                {t(
                  'ui.defaultChartManager.addDefaultChart',
                  'New Default Chart'
                )}
              </AddButton>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default PageIntro;
