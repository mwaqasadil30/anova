import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import CancelButton from 'components/buttons/CancelButton';
import Button from 'components/Button';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTranslation } from 'react-i18next';
import PageHeader from 'components/PageHeader';
import routes from 'apps/admin/routes';
import BackIconButton from 'components/buttons/BackIconButton';

interface Props {
  submitForm?: any;
  refetchEditData?: any;
  isSubmitting: boolean;
  showFinishedAction?: boolean;
}

const PageIntro = ({
  isSubmitting,
  refetchEditData,
  submitForm,
  showFinishedAction,
}: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const theme = useTheme();
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  const cancel = () => {
    refetchEditData();
  };

  const submit = () => {
    submitForm?.();
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <BackIconButton onClick={() => history.goBack()} />
            </Grid>
            <Grid item>
              <PageHeader dense>
                {t('ui.assetTransfer.assetTransferHeader', 'Transfer Assets')}
              </PageHeader>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            clone
            justifyContent={['space-between', 'space-between', 'flex-end']}
          >
            <Grid container spacing={2} alignItems="center">
              {showFinishedAction ? (
                <Grid item {...(isBelowSmBreakpoint && { xs: 6 })}>
                  <Button
                    variant="contained"
                    fullWidth
                    component={Link}
                    to={routes.assetManager.list}
                  >
                    {t('ui.common.finished', 'Finished')}
                  </Button>
                </Grid>
              ) : (
                <>
                  <Grid item {...(isBelowSmBreakpoint && { xs: 6 })}>
                    <CancelButton
                      onClick={cancel}
                      fullWidth={isBelowSmBreakpoint}
                      disabled={isSubmitting}
                    />
                  </Grid>
                  <Grid item {...(isBelowSmBreakpoint && { xs: 6 })}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={submit}
                      disabled={isSubmitting}
                    >
                      {t('ui.common.transfer', 'Transfer')}
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PageIntro;
