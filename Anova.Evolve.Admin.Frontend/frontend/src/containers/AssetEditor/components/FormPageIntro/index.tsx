/* eslint-disable indent */
import React from 'react';
import Box from '@material-ui/core/Box';
import CancelButton from 'components/buttons/CancelButton';
import Button from 'components/Button';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import PageHeader from 'components/PageHeader';
import { DataChannelFormPageIntroProps } from 'containers/AssetEditor/components/types';
import { useTranslation } from 'react-i18next';

const PageIntro = ({
  title,
  isSubmitting,
  headerNavButton,
  handleSave,
  handleCancel,
}: DataChannelFormPageIntroProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box clone justifyContent={{ md: 'space-between' }}>
      <Grid container spacing={2}>
        <Grid item {...(isBelowSmBreakpoint && { xs: 12 })}>
          <Grid container spacing={1} alignItems="center">
            {headerNavButton && <Grid item>{headerNavButton}</Grid>}
            <Grid item>
              <PageHeader dense>{title}</PageHeader>
            </Grid>
          </Grid>
        </Grid>
        <Grid item {...(isBelowSmBreakpoint && { xs: 12 })}>
          <Box
            clone
            justifyContent={['space-between', 'space-between', 'flex-end']}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item {...(isBelowSmBreakpoint && { xs: 6 })}>
                <CancelButton
                  onClick={handleCancel}
                  fullWidth={isBelowSmBreakpoint}
                />
              </Grid>
              <Grid item {...(isBelowSmBreakpoint && { xs: 6 })}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSave}
                  disabled={isSubmitting}
                >
                  {t('ui.common.saveandclose', 'Save & Close')}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PageIntro;
