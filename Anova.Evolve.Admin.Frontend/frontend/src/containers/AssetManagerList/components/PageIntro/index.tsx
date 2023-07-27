import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { UserPermissionType } from 'api/admin/api';
import routes from 'apps/admin/routes';
import { ReactComponent as CaretIcon } from 'assets/icons/caret.svg';
import { ReactComponent as AddIcon } from 'assets/icons/icon-add.svg';
import Button from 'components/Button';
import Menu from 'components/Menu';
import PageHeader from 'components/PageHeader';
import DownloadButton from 'components/DownloadButton';
import RefreshButton from 'components/RefreshButton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectActiveDomainHasIsoContainers } from 'redux-app/modules/app/selectors';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { AccessType } from 'types';

const StyledMenuItem = styled(MenuItem)`
  width: 250px;
`;

interface Props {
  refetchAssetManagerRecords: () => void;
}

const PageIntro = ({ refetchAssetManagerRecords }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  const domainHasIsoContainers = useSelector(
    selectActiveDomainHasIsoContainers
  );
  const hasPermission = useSelector(selectHasPermission);
  const canCreateAsset = hasPermission(
    UserPermissionType.AssetGlobal,
    AccessType.Create
  );

  const [
    addButtonAnchorEl,
    setAddButtonAnchorEl,
  ] = React.useState<null | HTMLElement>(null);
  const handleAddButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAddButtonAnchorEl(event.currentTarget);
  };
  const handleAddButtonClose = () => {
    setAddButtonAnchorEl(null);
  };

  return (
    <Grid container spacing={2} alignItems="center" justify="space-between">
      <Grid item xs={12} md="auto">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PageHeader dense>
              {t(
                'ui.asset.assetConfigurationManager',
                'Asset Configuration Manager'
              )}
            </PageHeader>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md="auto">
        <Grid container spacing={2} alignItems="center" justify="flex-end">
          <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
            <RefreshButton onClick={refetchAssetManagerRecords} fullWidth />
          </Grid>
          <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
            <DownloadButton fullWidth />
          </Grid>
          {canCreateAsset && (
            <>
              <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
                <Button
                  variant="text"
                  startIcon={<AddIcon />}
                  component={Link}
                  to={routes.assetManager.create}
                  fullWidth
                  useDomainColorForIcon
                >
                  {t('ui.common.add', 'Add')}
                </Button>
              </Grid>
              <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
                <Button
                  variant="contained"
                  endIcon={<CaretIcon />}
                  fullWidth
                  onClick={handleAddButtonClick}
                >
                  {t('ui.asset.quickadd', 'Quick Add')}
                </Button>
                <Menu
                  id="add-button-menu"
                  anchorEl={addButtonAnchorEl}
                  getContentAnchorEl={null}
                  keepMounted
                  open={Boolean(addButtonAnchorEl)}
                  onClose={handleAddButtonClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <StyledMenuItem
                    button
                    // @ts-ignore
                    component={Link}
                    to={routes.assetManager.quickTankCreate}
                  >
                    {t('enum.assettype.tank', 'Tank')}
                  </StyledMenuItem>
                  {domainHasIsoContainers && (
                    <StyledMenuItem
                      button
                      // @ts-ignore
                      component={Link}
                      to={routes.assetManager.heliumIsoContainerCreate}
                    >
                      {t(
                        'enum.assettype.heliumisocontainer',
                        'Helium ISO Container'
                      )}
                    </StyledMenuItem>
                  )}
                </Menu>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PageIntro;
