import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectTopOffset } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import { useTranslation } from 'react-i18next';
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import RtuNotesDrawer from 'apps/ops/containers/AssetDetail/components/DataChannelsLayout/RtuNotesDrawer';
import { HornerRtuMode, RtuDeviceType } from 'api/admin/api';
import { useQueryClient } from 'react-query';
import { generatePath } from 'react-router-dom';
import routes from 'apps/admin/routes';
import InformationContainer from '../common/InformationContainer';
import HornerGeneralInformation from '../common/HornerGeneralInformation';
import AiChannels from './components/AiChannels';
import TransactionChannels from './components/TransactionChannels';
import RtuNotes from '../common/RtuNotes';
import HornerRtuTimeCorrection from './components/HornerRtuTimeCorrection';
import CommunicationConfigs from './components/CommunicationConfigs';
import useConfigurationTabData from './hooks/useConfigurationTabData';
import HornerGeneralInformationDrawer from './components/HornerGeneralInformationDrawer';
import RecordModificationInfoBox from './components/RecordModificationInfoBox';
import CommunicationDrawer from './components/CommunicationDrawer';

const Wrapper = styled(({ topOffset, ...props }) => <div {...props} />)`
  ${(props) =>
    props.topOffset &&
    `
    display: flex;
    flex-direction: column;
    height: 100%
  `};
`;

interface ConfigurationTabProps {
  rtuDeviceId: string;
  canUpdateRtu?: boolean;
}

const ConfigurationTab = ({
  rtuDeviceId,
  canUpdateRtu,
}: ConfigurationTabProps) => {
  const { t } = useTranslation();
  const topOffset = useSelector(selectTopOffset);
  const queryClient = useQueryClient();
  const {
    isLoading,
    isError,
    data: {
      generalInfo,
      rtuNotes,
      rtuTimeCorrection,
      communicationConfigs,
      rtuAnalogInputChannels,
      rtuTransactionChannels,
      rtuCarriers,
    },
  } = useConfigurationTabData(rtuDeviceId);

  const [isRtuNotesDrawerOpen, setIsRtuNotesDrawerOpen] = useState(false);
  const [
    isHornerGeneralInformationDrawerOpen,
    setIsHornerGeneralInformationDrawerOpen,
  ] = useState(false);
  const [isCommunicationDrawerOpen, setIsCommunicationDrawerOpen] = useState(
    false
  );

  const closeRtuNotesDrawer = () => {
    setIsRtuNotesDrawerOpen(false);
  };

  const isHornerRtuTypeDispenser =
    generalInfo?.hornerRTUType === HornerRtuMode.Dispenser;

  if (isLoading)
    return (
      <Wrapper topOffset={topOffset}>
        <Box mt={3} style={{ height: '300px' }}>
          <TransitionLoadingSpinner in />
        </Box>
      </Wrapper>
    );

  if (isError)
    return (
      <Wrapper topOffset={topOffset}>
        <Box mt={3} style={{ height: '300px' }}>
          <TransitionErrorMessage in />
        </Box>
      </Wrapper>
    );
  return (
    <>
      <Drawer
        anchor="right"
        open={isRtuNotesDrawerOpen}
        onClose={closeRtuNotesDrawer}
        variant="temporary"
      >
        <DrawerContent>
          <RtuNotesDrawer
            rtuType={RtuDeviceType.Horner}
            rtuDeviceId={rtuDeviceId}
            closeDrawer={closeRtuNotesDrawer}
            fetchRecords={() => {
              queryClient.invalidateQueries([
                'rtu_RetrieveRtuNotes',
                rtuDeviceId,
              ]);
            }}
          />
        </DrawerContent>
      </Drawer>
      <HornerGeneralInformationDrawer
        deviceId={rtuDeviceId}
        isOpen={isHornerGeneralInformationDrawerOpen}
        setIsOpen={setIsHornerGeneralInformationDrawerOpen}
        onClose={() => setIsHornerGeneralInformationDrawerOpen(false)}
        data={generalInfo}
      />
      <CommunicationDrawer
        deviceId={rtuDeviceId}
        isOpen={isCommunicationDrawerOpen}
        setIsOpen={setIsCommunicationDrawerOpen}
        onClose={() => setIsCommunicationDrawerOpen(false)}
        data={communicationConfigs}
      />
      <Wrapper topOffset={topOffset}>
        <Box pt={2} pb={1}>
          <InformationContainer
            title={t('ui.common.generalinfo', 'General Information')}
            canUpdate={canUpdateRtu}
            content={<HornerGeneralInformation information={generalInfo} />}
            onClick={() => setIsHornerGeneralInformationDrawerOpen(true)}
          />
        </Box>
        <Box pt={2} pb={1}>
          <InformationContainer
            title={t('ui.common.notes', 'Notes')}
            canUpdate={canUpdateRtu}
            content={<RtuNotes information={rtuNotes} />}
            onClick={() => {
              setIsRtuNotesDrawerOpen(true);
            }}
          />
        </Box>
        <Box pt={2} pb={1}>
          <InformationContainer
            title={t('ui.rtu.rtutimecorrection', 'RTU Time Correction')}
            canUpdate={false}
            content={
              <HornerRtuTimeCorrection information={rtuTimeCorrection} />
            }
          />
        </Box>
        <Box pt={2} pb={1}>
          <InformationContainer
            title={t('ui.common.communication', 'Communication')}
            canUpdate={false}
            content={
              <CommunicationConfigs
                information={communicationConfigs}
                carriers={rtuCarriers}
              />
            }
            onClick={() => setIsCommunicationDrawerOpen(true)}
          />
        </Box>
        <Box pt={2} pb={1}>
          <InformationContainer
            title={t('ui.rtu.aichannels', 'AI Channels')}
            canUpdate={canUpdateRtu}
            content={<AiChannels information={rtuAnalogInputChannels} />}
            iconText={t('ui.rtu.openaichanneleditor', 'Open AI Channel Editor')}
            url={generatePath(routes.rtuManager.aiChannelsEdit, {
              rtuDeviceId,
            })}
          />
        </Box>
        {isHornerRtuTypeDispenser && (
          <Box pt={2} pb={1}>
            <InformationContainer
              title={t('ui.rtu.transactionchannels', 'Transaction Channels')}
              canUpdate={canUpdateRtu}
              content={
                <TransactionChannels information={rtuTransactionChannels} />
              }
              iconText={t(
                'ui.rtu.opentchanneleditor',
                'Open Transaction Channel Editor'
              )}
              url={generatePath(routes.rtuManager.tChannelsEdit, {
                rtuDeviceId,
              })}
            />
          </Box>
        )}
        <Box pt={2} pb={1}>
          <RecordModificationInfoBox modificationData={generalInfo} />
        </Box>
      </Wrapper>
    </>
  );
};
export default ConfigurationTab;
