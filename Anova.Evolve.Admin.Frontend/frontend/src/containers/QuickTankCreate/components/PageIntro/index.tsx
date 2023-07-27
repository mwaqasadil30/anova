import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import BackIconButton from 'components/buttons/BackIconButton';
import CancelButton from 'components/buttons/CancelButton';
import SaveAndExitButton from 'components/buttons/SaveAndExitButton';
import PageHeader from 'components/PageHeader';
import React from 'react';
import { useHistory } from 'react-router-dom';

interface Props {
  submitForm?: any;
  refetchEditData?: any;
  isSubmitting: boolean;
  title: string;
}

const PageIntro = ({
  title,
  isSubmitting,
  refetchEditData,
  submitForm,
}: Props) => {
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
              <PageHeader dense>{title}</PageHeader>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            clone
            justifyContent={['space-between', 'space-between', 'flex-end']}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item {...(isBelowSmBreakpoint && { xs: 6 })}>
                <CancelButton
                  onClick={cancel}
                  fullWidth
                  disabled={isSubmitting}
                />
              </Grid>
              <Grid item {...(isBelowSmBreakpoint && { xs: 6 })}>
                <SaveAndExitButton
                  fullWidth
                  onClick={submit}
                  disabled={isSubmitting}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PageIntro;
