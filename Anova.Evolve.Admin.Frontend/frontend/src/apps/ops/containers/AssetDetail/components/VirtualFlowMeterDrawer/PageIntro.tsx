import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from 'components/Button';
import PageHeader from 'components/PageHeader';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  title?: React.ReactNode;
  closeCallback: VoidFunction;
}

const PageIntro = ({ title, closeCallback }: Props) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Grid container spacing={2} alignItems="center" justify="space-between">
        <Grid item xs="auto">
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <PageHeader dense>{title}</PageHeader>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs="auto">
          <Button variant="contained" onClick={closeCallback}>
            {t('ui.common.close', 'Close')}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PageIntro;
