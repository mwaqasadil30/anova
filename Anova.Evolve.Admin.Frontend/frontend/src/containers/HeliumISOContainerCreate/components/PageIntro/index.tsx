import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from 'components/Button';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import BackIconButton from 'components/buttons/BackIconButton';
import CancelButton from 'components/buttons/CancelButton';
import SaveButton from 'components/buttons/SaveButton';
import PageHeader from 'components/PageHeader';
import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import routes from 'apps/admin/routes';
import { ReactComponent as AddOutlinedIcon } from 'assets/icons/add-outlined.svg';

interface Props {
  submitForm?: any;
  refetchEditData?: any;
  isSubmitting: boolean;
  title: string;
  showFinishedAction?: boolean;
  handleCreateNew: () => void;
}

const PageIntro = ({
  title,
  isSubmitting,
  refetchEditData,
  submitForm,
  showFinishedAction,
  handleCreateNew,
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
    <Grid container spacing={2} alignItems="center" justify="space-between">
      <Grid item xs={12} md="auto">
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <BackIconButton onClick={() => history.goBack()} />
          </Grid>
          <Grid item>
            <PageHeader dense>{title}</PageHeader>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md="auto">
        <Box
          clone
          justifyContent={['space-between', 'space-between', 'flex-end']}
        >
          <Grid container spacing={2} alignItems="center">
            {showFinishedAction ? (
              <>
                <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
                  <Button
                    onClick={handleCreateNew}
                    fullWidth
                    disabled={isSubmitting}
                    startIcon={<AddOutlinedIcon />}
                    useDomainColorForIcon
                  >
                    {t(
                      'ui.quicktankcreate.heliumISOContainer.createNewButton',
                      'Create New Helium ISO Container'
                    )}
                  </Button>
                </Grid>
                <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
                  <Button
                    variant="contained"
                    component={Link}
                    fullWidth
                    onClick={submit}
                    disabled={isSubmitting}
                    to={routes.assetManager.list}
                  >
                    {t('ui.common.exit', 'Exit')}
                  </Button>
                </Grid>
              </>
            ) : (
              <>
                <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
                  <CancelButton
                    onClick={cancel}
                    fullWidth
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
                  <SaveButton
                    variant="contained"
                    fullWidth
                    onClick={submit}
                    disabled={isSubmitting}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default PageIntro;
