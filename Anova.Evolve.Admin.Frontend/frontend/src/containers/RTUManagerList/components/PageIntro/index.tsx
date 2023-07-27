import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { UserPermissionType } from 'api/admin/api';
import { ReactComponent as CaretIcon } from 'assets/icons/caret.svg';
import Button from 'components/Button';
import DownloadButton from 'components/DownloadButton';
import Menu from 'components/Menu';
import PageHeader from 'components/PageHeader';
import RefreshButton from 'components/RefreshButton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectIsActiveDomainApciEnabled } from 'redux-app/modules/app/selectors';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import { AccessType } from 'types';

interface Props {
  refetchRecords: () => void;
}

const PageIntro = ({ refetchRecords }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const hasPermission = useSelector(selectHasPermission);

  const isAirProductsEnabledDomain = useSelector(
    selectIsActiveDomainApciEnabled
  );

  const canCreateRTUFile = hasPermission(
    UserPermissionType.RTUFileEditor,
    AccessType.Create
  );

  const canCreateRTUHorner = hasPermission(
    UserPermissionType.RTUHornerEditor,
    AccessType.Create
  );

  const canCreateRTUClover = hasPermission(
    UserPermissionType.RTUCloverEditor,
    AccessType.Create
  );

  const canCreateRTUMetron2 = hasPermission(
    UserPermissionType.RTUMetron2Editor,
    AccessType.Create
  );

  const canCreateRTUWired = hasPermission(
    UserPermissionType.RTUWiredEditor, // MODBUS Rtu
    AccessType.Create
  );

  const canCreateRtuWireless = hasPermission(
    UserPermissionType.RtuWirelessEditor, // SMS Rtu
    AccessType.Create
  );

  const showAddRtuButton =
    canCreateRTUFile ||
    canCreateRTUHorner ||
    canCreateRTUClover ||
    canCreateRTUMetron2 ||
    canCreateRTUWired ||
    canCreateRtuWireless;

  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));
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
              {t('ui.rtu.rtumanager', 'RTU Manager')}
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

            <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
              {showAddRtuButton && (
                <Button
                  variant="contained"
                  endIcon={<CaretIcon />}
                  disabled
                  fullWidth
                  onClick={handleAddButtonClick}
                >
                  {t('ui.rtu.addRTU', 'Add RTU')}
                </Button>
              )}
              <Menu
                id="add-button-menu"
                anchorEl={addButtonAnchorEl}
                getContentAnchorEl={null}
                keepMounted
                open={Boolean(addButtonAnchorEl)}
                onClose={handleAddButtonClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                {canCreateRtuWireless && (
                  <MenuItem>{t('ui.rtu.addsmsrtu', 'Add SMS RTU')}</MenuItem>
                )}

                {canCreateRTUWired && (
                  <MenuItem>
                    {t('ui.rtu.addmodbusrtu', 'Add Modbus RTU')}
                  </MenuItem>
                )}

                {canCreateRTUClover && (
                  <MenuItem>
                    {t('ui.rtu.addcloverrtu', 'Add Clover RTU')}
                  </MenuItem>
                )}

                {canCreateRTUFile && (
                  <MenuItem>{t('ui.rtu.addfilertu', 'Add File RTU')}</MenuItem>
                )}

                {isAirProductsEnabledDomain && (
                  <>
                    {canCreateRTUMetron2 && (
                      <MenuItem>
                        {t('ui.rtu.addmetron2rtu', 'Add Metron 2 RTU')}
                      </MenuItem>
                    )}
                    {canCreateRTUHorner && (
                      <MenuItem>
                        {t('ui.rtu.addhornerrtu', 'Add Horner RTU')}
                      </MenuItem>
                    )}
                  </>
                )}
              </Menu>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default PageIntro;
