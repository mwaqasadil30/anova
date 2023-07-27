/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import {
  DataChannelCategory,
  DataChannelDataSource,
  DataChannelDTO,
  RtuChannelSensor,
  RtuPollStatusEnum,
  UserPermissionType,
} from 'api/admin/api';
import adminRoutes from 'apps/admin/routes';
import opsRoutes from 'apps/ops/routes';
import CircularProgress from 'components/CircularProgress';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import { IS_NEW_DATA_CHANNEL_EDITOR_FEATURE_ENABLED } from 'env';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath, useHistory } from 'react-router';
import { selectIsActiveDomainApciEnabled } from 'redux-app/modules/app/selectors';
import {
  selectCanAccessAdminDataChannelEditor,
  selectHasPermission,
} from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { AccessType } from 'types';
import { canAccessDataChannelEditorByDataChannelType } from 'utils/api/helpers';
import { usePollRtuForHistoricalReadings } from '../../hooks/usePollRtuForHistoricalReadings';
import { ReadingsHookData } from '../../types';
import ManualReadingEntryDialog from '../DataChannelsLayout/ManualReadingEntryDialog';
import SetCounterValueDialog from '../DataChannelsLayout/SetCounterValueDialog';

const StyledRtuPollDialogText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  font-weight: 500;
  text-align: center;
`;

interface Props {
  children: React.ReactElement<any>;
  record: DataChannelDTO; // The current, single Data Channel
  isPublishedAsset?: boolean;
  dataChannels?: DataChannelDTO[];
  readingsData?: ReadingsHookData;
  selectedDataChannels?: DataChannelDTO[];
  openUpdateDisplayPriorityDialog: () => void;
  setDataChannelsResult?: (dataChannels: DataChannelDTO[]) => void;
  fetchRecords?: () => void;
}

function DataChannelsActionsMenu(props: Props) {
  const {
    children,
    record,
    isPublishedAsset,
    dataChannels,
    readingsData,
    selectedDataChannels,
    openUpdateDisplayPriorityDialog,
    setDataChannelsResult,
    fetchRecords,
  } = props;

  const { t } = useTranslation();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const isAirProductsEnabledDomain = useSelector(
    selectIsActiveDomainApciEnabled
  );

  const hasPermission = useSelector(selectHasPermission);

  const canCreateManualDataEntry = hasPermission(
    UserPermissionType.DataChannelManualDataEntry,
    AccessType.Create
  );
  const canPollRtu = hasPermission(
    UserPermissionType.MiscellaneousFeaturePollRTU
  );

  const canAccessProblemReportEditor = hasPermission(
    UserPermissionType.ProblemReportEditorAccess,
    AccessType.Create
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const canAccessDataChannelEditor = useSelector(
    selectCanAccessAdminDataChannelEditor
  );
  const goToDataChannelEditor = () => {
    if (record.dataChannelId) {
      const pathname = generatePath(adminRoutes.dataChannelManager.edit, {
        dataChannelId: record.dataChannelId,
      });

      history.push(pathname);
      handleClose();
    }
  };

  const canEditDataChannel =
    canAccessDataChannelEditor &&
    !isPublishedAsset &&
    canAccessDataChannelEditorByDataChannelType(record.dataChannelTypeId) &&
    IS_NEW_DATA_CHANNEL_EDITOR_FEATURE_ENABLED;

  // NOTE: the code below will clean up / simplify whether we show/hide dropdown options.
  // It needs to be re-factored slightly to work, though.
  // const editDataChannelActions =
  //   canAccessDataChannelEditor &&
  //   !isPublishedAsset &&
  //   canAccessDataChannelEditorByDataChannelType(record.dataChannelTypeId) &&
  //   IS_NEW_DATA_CHANNEL_EDITOR_FEATURE_ENABLED
  //     ? [
  //         {
  //           label: t('ui.common.edit', 'Edit'),
  //           // onClick: goToDataChannelEditor,
  //           onClick: goToDataChannelEditor,
  //         },
  //       ]
  //     : [];

  // // Keep until / if we need permissions to be added
  // const hasOtherActions = true;
  // const otherDataChannelActions = hasOtherActions
  //   ? [
  //       {
  //         label: t(
  //           'ui.assetdetail.updatedisplaypriority',
  //           'Update Display Priority'
  //         ),
  //         // onClick: openUpdateDisplayPriorityDialog,
  //         onClick: () => {},
  //       },
  //       // Add more list options here, example below
  //       // {
  //       //   label: t('ui.assetDetail.tankSetup', 'Tank Setup'),
  //       //   onClick: openTankSetupDrawer,
  //       // },
  //     ]
  //   : [];

  // const dataChannelActions: AssetDetailDataChannelAction[] = editDataChannelActions.concat(
  //   otherDataChannelActions
  // );

  // #region Manual Reading Entry dialog
  const [
    isSetCounterValueDialogOpen,
    setIsSetCounterValueDialogOpen,
  ] = useState(false);
  const closeSetCounterValueDialog = () => {
    setIsSetCounterValueDialogOpen(false);
  };

  const openSetCounterValueDialog = () => {
    setIsSetCounterValueDialogOpen(true);
  };

  const isCounterRtuChannelType =
    record.rtuChannelType === RtuChannelSensor.CounterInput;

  // #endregion Manual Reading Entry dialog

  // #region Manual Reading Entry dialog
  const [
    isManualReadingEntryDialogOpen,
    setIsManualReadingEntryDialogOpen,
  ] = useState(false);
  const closeManualReadingEntryDialog = () => {
    setIsManualReadingEntryDialogOpen(false);
  };

  const openManualReadingEntryDialog = () => {
    setIsManualReadingEntryDialogOpen(true);
  };

  // #endregion Manual Reading Entry dialog

  // #region Poll confirmation dialog/modal
  const pollRtuForHistoricalReadings = usePollRtuForHistoricalReadings();

  const [
    isHistoricalPollConfirmationDialogOpen,
    setIsHistoricalPollConfirmationDialogOpen,
  ] = useState(false);
  const openHistoricalPollConfirmationDialog = (deviceId: string) => {
    pollRtuForHistoricalReadings.mutate(deviceId);
    setIsHistoricalPollConfirmationDialogOpen(true);
  };
  const closeHistoricalPollConfirmationDialog = () => {
    setIsHistoricalPollConfirmationDialogOpen(false);
  };

  const isRtuDataChannelType =
    record.dataChannelTypeId === DataChannelCategory.Rtu;

  const canShowPollReadingsMenuItem =
    record.rtuPollStatus ===
      RtuPollStatusEnum.InstantaneousAndHistoricalReadings ||
    record.rtuPollStatus === RtuPollStatusEnum.PollingDisabled ||
    record.rtuPollStatus === RtuPollStatusEnum.NotPollableBatteryLow;

  const isPollMenuItemDisabled =
    record.rtuPollStatus === RtuPollStatusEnum.NotPollableBatteryLow ||
    record.rtuPollStatus === RtuPollStatusEnum.PollingDisabled;

  // #endregion Poll confirmation dialog/modal

  // Show the 'Create Problem Report' dropdown option if the current record
  // IS a published data channel - regardless of rtuDeviceId.
  const isPublishedDataChannel =
    record.dataSource === DataChannelDataSource.PublishedDataChannel;

  // Do not show the 'Create Problem Report' dropdown option if the current
  // record (Data Channel) has no rtuDeviceId AND it is not a published data channel.
  const inaccessibleDataChannelsForProblemReports =
    !record.rtuDeviceId && !isPublishedDataChannel;

  const showCreateProblemReportOption =
    canAccessProblemReportEditor &&
    isAirProductsEnabledDomain &&
    !isPublishedAsset &&
    !inaccessibleDataChannelsForProblemReports;

  const goToProblemReportCreate = () => {
    if (record.dataChannelId) {
      const pathname = generatePath(opsRoutes.problemReports.create, {
        dataChannelId: record.dataChannelId,
      });

      history.push(pathname);
      handleClose();
    }
  };

  return (
    <>
      <ManualReadingEntryDialog
        dataChannel={record}
        isDialogOpen={isManualReadingEntryDialogOpen}
        dataChannels={dataChannels}
        readingsData={readingsData}
        selectedDataChannels={selectedDataChannels}
        closeDialog={closeManualReadingEntryDialog}
        setDataChannelsResult={setDataChannelsResult}
        fetchRecords={fetchRecords}
      />

      <SetCounterValueDialog
        dataChannel={record}
        isDialogOpen={isSetCounterValueDialogOpen}
        dataChannels={dataChannels}
        readingsData={readingsData}
        selectedDataChannels={selectedDataChannels}
        closeDialog={closeSetCounterValueDialog}
        setDataChannelsResult={setDataChannelsResult}
        fetchRecords={fetchRecords}
      />

      <UpdatedConfirmationDialog
        maxWidth="xs"
        open={isHistoricalPollConfirmationDialogOpen}
        isDisabled={pollRtuForHistoricalReadings.isLoading}
        onConfirm={closeHistoricalPollConfirmationDialog}
        mainTitle={t('enum.packettype.pollrequest', 'Poll Request')}
        content={
          pollRtuForHistoricalReadings.isLoading ? (
            <Box textAlign="center">
              <CircularProgress size={24} />
            </Box>
          ) : pollRtuForHistoricalReadings.data ? (
            <StyledRtuPollDialogText>
              {t(
                'ui.rtu.pollRequestWasAccepted',
                'Poll Request for {{rtuDeviceId}} was accepted.',
                { rtuDeviceId: record.rtuDeviceId }
              )}
            </StyledRtuPollDialogText>
          ) : (
            <StyledRtuPollDialogText>
              {t('ui.rtu.errorpollingrtuchannel', 'Error polling RTU Channel.')}
            </StyledRtuPollDialogText>
          )
        }
        hideCancelButton
      />

      {/*
        Allow the parent component to customize the element used to open the
        menu
      */}
      {React.cloneElement(children, { onClick: handleClick })}
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {canEditDataChannel && (
          <MenuItem onClick={goToDataChannelEditor}>
            {t('ui.datachannel.editdatachannel', 'Edit Data Channel')}
          </MenuItem>
        )}

        {canPollRtu && isRtuDataChannelType && canShowPollReadingsMenuItem && (
          <MenuItem
            onClick={() => {
              if (record.rtuDeviceId) {
                openHistoricalPollConfirmationDialog(record?.rtuDeviceId);
              }
              handleClose();
            }}
            disabled={isPollMenuItemDisabled}
          >
            {t(
              'ui.assetDetail.pollHistoricalReadings',
              'Poll Historical Readings'
            )}
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            openUpdateDisplayPriorityDialog();
            handleClose();
          }}
        >
          {t('ui.assetdetail.updatedisplaypriority', 'Update Display Priority')}
        </MenuItem>

        {canCreateManualDataEntry && (
          <MenuItem
            onClick={() => {
              openManualReadingEntryDialog();
              handleClose();
            }}
          >
            {t('ui.manualreading.manualReadingEntry', 'Manual Reading Entry')}
          </MenuItem>
        )}

        {canCreateManualDataEntry && isCounterRtuChannelType && (
          <MenuItem
            onClick={() => {
              openSetCounterValueDialog();
              handleClose();
            }}
          >
            {t('ui.assetdetail.setcountervalue', 'Set Counter Value')}
          </MenuItem>
        )}

        {showCreateProblemReportOption && (
          <MenuItem
            onClick={() => {
              goToProblemReportCreate();
            }}
          >
            {t('ui.assetdetail.createproblemreport', 'Create Problem Report')}
          </MenuItem>
        )}
      </Menu>
    </>
  );
}

export default DataChannelsActionsMenu;
