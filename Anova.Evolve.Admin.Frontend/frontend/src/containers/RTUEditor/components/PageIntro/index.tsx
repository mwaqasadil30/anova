/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { RtuDeviceCategory } from 'api/admin/api';
import CircularProgress from 'components/CircularProgress';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import Tab from 'components/Tab';
import Tabs from 'components/Tabs';
import { useAbortRtu } from 'containers/RTUEditor/hooks/useAbortRtu';
import { useCallRtu } from 'containers/RTUEditor/hooks/useCallRtu';
import { useCommissionRtu } from 'containers/RTUEditor/hooks/useCommissionRtu';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { selectCanAccessRtuHistoryTab } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { RTUEditorTab } from '../../types';
import RtuActionsButton from './components/RtuActionsButton';

const StyledRtuActionDialogText = styled(Typography)`
  text-align: center;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

const StyledBox = styled(Box)`
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
`;

const StyledPageHeaderText = styled(Typography)`
  font-size: 18px;
  font-weight: 600;
`;

interface Props {
  activeTab: RTUEditorTab;
  rtuDeviceId: string;
  headerNavButton?: React.ReactNode;
  rtuTypeId?: RtuDeviceCategory;
  handleTabChange: (event: React.ChangeEvent<{}>, newValue: unknown) => void;
}

const PageIntro = ({
  activeTab,
  rtuDeviceId,
  headerNavButton,
  rtuTypeId,
  handleTabChange,
}: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const isModbusRtu = rtuTypeId === RtuDeviceCategory.Modbus;
  const isMetron2Rtu = rtuTypeId === RtuDeviceCategory.Metron2;
  const isHornerRtu = rtuTypeId === RtuDeviceCategory.Horner;
  const is400SeriesRtu = rtuTypeId === RtuDeviceCategory.FourHundredSeries;
  const isFileRtu = rtuTypeId === RtuDeviceCategory.File;
  const isSmsRtu = rtuTypeId === RtuDeviceCategory.SMS;

  const canAccessPacketsAndCallHistoryTab =
    is400SeriesRtu ||
    isFileRtu ||
    isSmsRtu ||
    isMetron2Rtu ||
    isHornerRtu ||
    isModbusRtu;

  const canAccessRtuHistoryTab = useSelector(selectCanAccessRtuHistoryTab);

  const canAccessConfigurationTab = isHornerRtu || isMetron2Rtu;
  const canAccessTransactionDetailsTab = isHornerRtu;

  const formattedPageIntroText = `${t(
    'ui.common.rtu',
    'RTU'
  )} - ${rtuDeviceId}`;

  const changeUrl = (event: any, tabName: string) => {
    history.push(
      generatePath('/admin/rtu-manager/:rtuDeviceId/edit/:tabName', {
        rtuDeviceId,
        tabName,
      })
    );
    event.preventDefault();
  };
  // Actions Menu
  const [
    actionsMenuAnchorEl,
    setActionsMenuAnchorEl,
  ] = useState<HTMLElement | null>(null);
  const handleOpenActionsMenu = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setActionsMenuAnchorEl(event.currentTarget);
  };
  const closeActionsMenu = () => {
    setActionsMenuAnchorEl(null);
  };

  const abortRtuApi = useAbortRtu();
  const commissionRtuApi = useCommissionRtu();
  const callRtuApi = useCallRtu();

  const [isRtuActionDialogOpen, setIsRtuActionDialogOpen] = useState(false);

  const initiateAbortRtuApi = () => {
    abortRtuApi.mutate(rtuDeviceId);
    setIsRtuActionDialogOpen(true);
  };
  // Call is also referred to as "Poll".
  const initiateCallRtuApi = () => {
    callRtuApi.mutate(rtuDeviceId);
    setIsRtuActionDialogOpen(true);
  };
  const initiateCommissionRtuApi = () => {
    commissionRtuApi.mutate(rtuDeviceId);
    setIsRtuActionDialogOpen(true);
  };

  const closeRtuActionDialog = () => {
    setIsRtuActionDialogOpen(false);
    // Clear any previous error state.
    abortRtuApi.reset();
    commissionRtuApi.reset();
    callRtuApi.reset();
  };

  const mainTitle = t('ui.rtuEditor.rtuAction', 'RTU Action');

  const formattedSuccessfulRtuActionText = () => {
    if (abortRtuApi.data) {
      return t('ui.rtu.abortSuccessful', 'Abort Call Successful.');
    }
    if (commissionRtuApi.data) {
      return t('ui.rtu.commissionSuccessful', 'Commission Successful.');
    }
    if (callRtuApi.data) {
      return t('ui.rtu.pollSuccessful', 'Poll Successful.');
    }
    return '';
  };

  const formattedFailedRtuActionText = () => {
    if (abortRtuApi.isError) {
      return t('ui.rtu.unableToAbort', 'Unable to Abort.');
    }
    if (commissionRtuApi.isError) {
      return t('ui.rtu.unableToCommission', 'Unable to Commission.');
    }
    if (callRtuApi.isError) {
      return t('ui.rtu.unableToPoll', 'Unable to Poll.');
    }
    return '';
  };

  const isRtuActionApiLoading =
    abortRtuApi.isLoading || commissionRtuApi.isLoading || callRtuApi.isLoading;

  const hasRtuActionApiData =
    !!abortRtuApi.data || !!commissionRtuApi.data || !!callRtuApi.data;

  return (
    <Box>
      <UpdatedConfirmationDialog
        maxWidth="xs"
        mainTitle={mainTitle}
        open={isRtuActionDialogOpen}
        isDisabled={isRtuActionApiLoading}
        onConfirm={closeRtuActionDialog}
        content={
          isRtuActionApiLoading ? (
            <Box textAlign="center">
              <CircularProgress size={24} />
            </Box>
          ) : hasRtuActionApiData ? (
            <StyledRtuActionDialogText>
              {formattedSuccessfulRtuActionText()}
            </StyledRtuActionDialogText>
          ) : (
            <StyledRtuActionDialogText>
              {formattedFailedRtuActionText()}
            </StyledRtuActionDialogText>
          )
        }
        hideCancelButton
      />

      <StyledBox px={3} mx={-3} pt={2}>
        <Grid container spacing={1} alignItems="center" justify="space-between">
          {headerNavButton && <Grid item>{headerNavButton}</Grid>}
          <Grid item xs zeroMinWidth>
            <Grid container direction="column">
              <Grid item xs zeroMinWidth>
                <StyledPageHeaderText title={t('ui.common.rtu', 'RTU')} noWrap>
                  {formattedPageIntroText}
                </StyledPageHeaderText>
              </Grid>
            </Grid>
          </Grid>

          {isHornerRtu && (
            <Grid item>
              <RtuActionsButton
                handleOpenActionsMenu={handleOpenActionsMenu}
                actionsMenuAnchorEl={actionsMenuAnchorEl}
                closeActionsMenu={closeActionsMenu}
                initiateAbortRtuApi={initiateAbortRtuApi}
                initiateCallRtuApi={initiateCallRtuApi}
                initiateCommissionRtuApi={initiateCommissionRtuApi}
              />
            </Grid>
          )}
        </Grid>

        <Tabs
          dense
          value={activeTab}
          // @ts-ignore
          onChange={handleTabChange}
          aria-label="rtu editor tabs"
          borderWidth={0}
        >
          {/* 
            TODO: 
            The configuration tab will slowly add more RtuTypes and so
            those new editable Rtu types should be added here until they are all
            editable with the configuration tab.
          */}
          {canAccessConfigurationTab && (
            <Tab
              label={t('ui.common.configuration', 'Configuration')}
              value={RTUEditorTab.Configuration}
              onClick={(event: any) =>
                changeUrl(event, RTUEditorTab.Configuration)
              }
            />
          )}
          {canAccessTransactionDetailsTab && (
            <Tab
              label={t(
                'ui.rtuhorner.transactiondetails',
                'Transaction Details'
              )}
              value={RTUEditorTab.TransactionDetails}
              onClick={(event: any) =>
                changeUrl(event, RTUEditorTab.TransactionDetails)
              }
            />
          )}

          {canAccessPacketsAndCallHistoryTab && (
            <Tab
              label={
                isMetron2Rtu || isHornerRtu || isModbusRtu
                  ? t('ui.rcmcalljournal.callhistory', 'Call History')
                  : t('ui.packetretrieval.packets', 'Packets')
              }
              value={RTUEditorTab.PacketsAndCallHistory}
              onClick={(event: any) =>
                changeUrl(event, RTUEditorTab.PacketsAndCallHistory)
              }
            />
          )}

          {canAccessRtuHistoryTab && (
            <Tab
              label={t('ui.common.history', 'History')}
              value={RTUEditorTab.History}
              onClick={(event: any) => changeUrl(event, RTUEditorTab.History)}
            />
          )}
        </Tabs>
      </StyledBox>
    </Box>
  );
};

export default PageIntro;
