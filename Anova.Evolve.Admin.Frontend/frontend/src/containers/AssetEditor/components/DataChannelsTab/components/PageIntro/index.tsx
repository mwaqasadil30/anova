import Drawer from 'components/drawers/Drawer';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import {
  DataChannelType,
  EditAssetDataChannel,
  EventRuleGroupInfo,
  EvolveDataChannelTemplateDetail,
  RetrieveAssetEditComponentsResult,
} from 'api/admin/api';
import { ReactComponent as CaretIcon } from 'assets/icons/caret.svg';
import Button from 'components/Button';
import DrawerContent from 'components/drawers/DrawerContent';
import Menu from 'components/Menu';
import AnalogChannelForm from 'containers/AssetEditor/components/AnalogChannelForm';
import DiagnosticChannelForm from 'containers/AssetEditor/components/DiagnosticChannelForm';
import DigitalChannelForm from 'containers/AssetEditor/components/DigitalChannelForm';
import TotalizerForm from 'containers/AssetEditor/components/TotalizerForm';
import VirtualChannelForm from 'containers/AssetEditor/components/VirtualChannelForm';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  analogChannelTypes,
  CommonDataChannelFormProps,
  digitalChannelTypes,
} from '../../../types';

const StyledPanelTitle = styled(Typography)`
  && {
    font-size: 20px;
    font-weight: 500;
  }
`;

enum ChannelFormType {
  Analog = 'analog',
  Diagnostic = 'diagnostic',
  Digital = 'digital',
  Totalizer = 'totalizer',
  Virtual = 'virtual',
}

const getFormForChannelType = (channelFormType?: ChannelFormType) => {
  switch (channelFormType) {
    case ChannelFormType.Diagnostic:
      return DiagnosticChannelForm;
    case ChannelFormType.Digital:
      return DigitalChannelForm;
    case ChannelFormType.Totalizer:
      return TotalizerForm;
    case ChannelFormType.Virtual:
      return VirtualChannelForm;
    default:
      return AnalogChannelForm;
  }
};

interface Props {
  assetId?: string | null;
  dataChannels?: EditAssetDataChannel[] | null;
  dataChannelTemplates?: EvolveDataChannelTemplateDetail[] | null;
  eventRuleGroups?: EventRuleGroupInfo[] | null;
  selectedDataChannels?: EditAssetDataChannel[];
  editComponentsResult?: RetrieveAssetEditComponentsResult | null;
  handleAddDataChannels: (dataChannels: any[]) => void;
}

const PageIntro = ({
  assetId,
  dataChannels,
  dataChannelTemplates,
  eventRuleGroups,
  handleAddDataChannels,
}: Props) => {
  const { t } = useTranslation();

  const [activeFormType, setActiveFormType] = useState<ChannelFormType>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [editorChosen, setEditorChosen] = useState();
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

  const toggleDrawer = (open: boolean, form?: ChannelFormType) => (
    event?: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setIsDrawerOpen(open);

    if (open && form) {
      handleAddButtonClose();
      setActiveFormType(form);
    }
  };

  const handleCloseDrawerAndAddDataChannel = (
    newDataChannels?: any[] | null
  ) => {
    if (newDataChannels && newDataChannels.length > 0) {
      handleAddDataChannels(newDataChannels);
      toggleDrawer(false)();
    }
  };

  const DataChannelForm = getFormForChannelType(activeFormType);

  const levelDataChannels = dataChannels?.filter(
    (channel) => channel.type === DataChannelType.Level
  );

  const validTotalizerLevelDataChannels = levelDataChannels?.filter(
    (channel) =>
      levelDataChannels.filter(
        (channelForProduct) => channelForProduct.productId === channel.productId
      ).length >= 2
  );
  const canCreateTotalizer =
    validTotalizerLevelDataChannels &&
    validTotalizerLevelDataChannels.length > 0;
  const analogDataChannels = dataChannels?.filter((channel) =>
    analogChannelTypes.includes(channel.type!)
  );
  const digitalDataChannels = dataChannels?.filter((channel) =>
    digitalChannelTypes.includes(channel.type!)
  );
  const hasAtLeastOneAnalogChannel =
    analogDataChannels && analogDataChannels.length > 0;
  const hasAtLeastOneDigitalChannel =
    digitalDataChannels && digitalDataChannels.length > 0;

  const commonDataChannelFormProps: CommonDataChannelFormProps = {
    assetId,
    dataChannelTemplates,
    dataChannels,
    eventRuleGroups,
    levelDataChannels,
    validTotalizerLevelDataChannels,
    handleCancel: toggleDrawer(false),
    addDataChannels: handleCloseDrawerAndAddDataChannel,
  };

  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      spacing={2}
    >
      <Grid item>
        <Grid container alignItems="center">
          <StyledPanelTitle>
            {t('ui.common.datachannels', 'Data Channels')}
          </StyledPanelTitle>
        </Grid>
      </Grid>

      <Grid item>
        <Grid container alignItems="center">
          <Grid item>
            <Button
              variant="contained"
              endIcon={<CaretIcon />}
              fullWidth
              onClick={handleAddButtonClick}
            >
              {t('ui.common.add', 'Add')}
            </Button>
            <Menu
              id="add-datachannel-button-menu"
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
              <MenuItem onClick={toggleDrawer(true, ChannelFormType.Analog)}>
                {t('ui.asset.addAnalogChannel', 'Add Analog Channel')}
              </MenuItem>
              <MenuItem onClick={toggleDrawer(true, ChannelFormType.Digital)}>
                {t('ui.asset.addDigitalChannel', 'Add Digital Channel')}
              </MenuItem>
              {(hasAtLeastOneAnalogChannel || hasAtLeastOneDigitalChannel) && (
                <MenuItem
                  onClick={toggleDrawer(true, ChannelFormType.Diagnostic)}
                >
                  {t('ui.asset.addDiagnosticChannel', 'Add Diagnostic Channel')}
                </MenuItem>
              )}
              {canCreateTotalizer && (
                <MenuItem
                  onClick={toggleDrawer(true, ChannelFormType.Totalizer)}
                >
                  {t('ui.asset.addtotalizer', 'Add Totalizer')}
                </MenuItem>
              )}
              {/*
                NOTE: The virtual channel form was de-prioritized. Some of the
                functionality is there, but what's left or what's changed will
                need to be adjusted/completed.
              */}
              {/* <MenuItem onClick={toggleDrawer(true, ChannelFormType.Virtual)}>
                {t('ui.asset.addvirtualchannel', 'Add Virtual Channel')}
              </MenuItem> */}
            </Menu>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12}>
          <Drawer
            anchor="right"
            open={isDrawerOpen}
            // @ts-ignore
            onClose={toggleDrawer(false)}
            variant="temporary"
            disableBackdropClick
          >
            <DrawerContent style={{ width: 700, maxWidth: 700 }}>
              <DataChannelForm {...commonDataChannelFormProps} />
            </DrawerContent>
          </Drawer>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PageIntro;
