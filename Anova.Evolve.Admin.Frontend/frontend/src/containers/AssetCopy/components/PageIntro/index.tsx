import React, { useState, useEffect } from 'react';
import { useHistory, generatePath } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import CancelButton from 'components/buttons/CancelButton';
import Button from 'components/Button';
import Menu from 'components/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTranslation } from 'react-i18next';
import PageHeader from 'components/PageHeader';
import routes from 'apps/admin/routes';
import BackIconButton from 'components/buttons/BackIconButton';
import { ReactComponent as CaretIcon } from 'assets/icons/caret.svg';

enum PageActionType {
  Copy = 'copy',
  CopyAndExit = 'copy-and-exit',
}

interface Props {
  submitForm?: any;
  refetchEditData?: any;
  isSubmitting: boolean;
  submissionResult: any;
}

const PageIntro = ({
  isSubmitting,
  refetchEditData,
  submitForm,
  submissionResult,
}: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const theme = useTheme();
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  const [primaryActionType, setPrimaryActionType] = useState<PageActionType>();
  const [
    primaryActionDropdownAnchorEl,
    setPrimaryActionDropdownAnchorEl,
  ] = React.useState<null | HTMLElement>(null);

  const handlePrimaryActionDropdownClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setPrimaryActionDropdownAnchorEl(event.currentTarget);
  };

  const handlePrimaryActionDropdownClose = () => {
    setPrimaryActionDropdownAnchorEl(null);
  };

  const cancel = () => {
    refetchEditData();
  };

  const submit = () => {
    submitForm?.().then(() => {
      setPrimaryActionType(PageActionType.Copy);
    });
    handlePrimaryActionDropdownClose();
  };

  const submitAndGoToListPage = () => {
    submitForm?.().then(() => {
      setPrimaryActionType(PageActionType.CopyAndExit);
    });
    handlePrimaryActionDropdownClose();
  };

  useEffect(() => {
    if (!submissionResult?.response || isSubmitting) {
      return;
    }

    if (primaryActionType === PageActionType.Copy) {
      const assetId =
        submissionResult.response.saveAssetCopyResult?.editObject?.assetId;
      const editRoutePath = generatePath(routes.assetManager.edit, { assetId });
      history.replace(editRoutePath);
    } else if (primaryActionType === PageActionType.CopyAndExit) {
      history.push(routes.assetManager.list);
    }
  }, [submissionResult, primaryActionType, history, isSubmitting]);

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
                {t('ui.asset.copyAssetHeader', 'Copy Asset')}
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
                  endIcon={<CaretIcon />}
                  fullWidth
                  onClick={handlePrimaryActionDropdownClick}
                  disabled={isSubmitting}
                >
                  {t('ui.common.copy', 'Copy')}
                </Button>
                <Menu
                  id="copy-dropdown-menu"
                  anchorEl={primaryActionDropdownAnchorEl}
                  getContentAnchorEl={null}
                  keepMounted
                  open={Boolean(primaryActionDropdownAnchorEl)}
                  onClose={handlePrimaryActionDropdownClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  <MenuItem onClick={submit}>
                    {t('ui.common.copyAndViewDetail', 'Copy & View Detail')}
                  </MenuItem>
                  <MenuItem onClick={submitAndGoToListPage}>
                    {t('ui.common.copyAndClose', 'Copy & Close')}
                  </MenuItem>
                </Menu>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PageIntro;
