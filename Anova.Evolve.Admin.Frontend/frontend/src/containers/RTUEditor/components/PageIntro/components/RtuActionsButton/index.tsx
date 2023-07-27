/* eslint-disable indent */
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from 'components/Button';
import Menu from 'components/Menu';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  handleOpenActionsMenu: (event: React.MouseEvent<HTMLButtonElement>) => void;
  actionsMenuAnchorEl: HTMLElement | null;
  closeActionsMenu: () => void;
  initiateAbortRtuApi: () => void;
  initiateCallRtuApi: () => void;
  initiateCommissionRtuApi: () => void;
}

const RtuActionsButton = ({
  handleOpenActionsMenu,
  actionsMenuAnchorEl,
  closeActionsMenu,
  initiateAbortRtuApi,
  initiateCallRtuApi,
  initiateCommissionRtuApi,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Button
          variant="contained"
          endIcon={<ExpandMoreIcon />}
          onClick={handleOpenActionsMenu}
        >
          {t('ui.datachannel.action_plural', 'Actions')}
        </Button>
        <Menu
          id="asset-details-ellipsis-menu"
          anchorEl={actionsMenuAnchorEl}
          getContentAnchorEl={null}
          keepMounted
          open={Boolean(actionsMenuAnchorEl)}
          onClose={closeActionsMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <MenuItem onClick={initiateCallRtuApi}>
            {t('ui.rtuhorner.poll', 'Poll')}
          </MenuItem>

          <MenuItem onClick={initiateCommissionRtuApi}>
            {t('ui.rtu.commission', 'Commission')}
          </MenuItem>
          <MenuItem onClick={initiateAbortRtuApi}>
            {t('ui.rtu.abortcall', 'Abort Call')}
          </MenuItem>
        </Menu>
      </Grid>
    </Grid>
  );
};

export default RtuActionsButton;
