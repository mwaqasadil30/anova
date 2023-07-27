import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectTopOffset } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import { useTranslation } from 'react-i18next';
import InformationContainer from '../common/InformationContainer';
import RtuNotes from '../common/RtuNotes';
import Configuration from './components/Configuration';
import CommunicationConfigs from './components/CommunicationConfigs';
import useConfigurationTabData from './hooks/useConfigurationTabData';
import MetronGeneralInformation from './components/MetronGeneralInformation';
import MetronGeneralInformationDrawer from './components/MetronGeneralInformationDrawer';
import AIChannels from './components/AiChannels';

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
  const {
    isLoading,
    isError,
    data: {
      generalInfo,
      rtuNotes,
      configuration,
      communicationConfigs,
      aiChannels,
    },
  } = useConfigurationTabData(rtuDeviceId);

  const [
    isMetronGeneralInformationDrawerOpen,
    setIsMetronGeneralInformationDrawerOpen,
  ] = useState(false);

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
      <MetronGeneralInformationDrawer
        deviceId={rtuDeviceId}
        isOpen={isMetronGeneralInformationDrawerOpen}
        setIsOpen={setIsMetronGeneralInformationDrawerOpen}
        onClose={() => setIsMetronGeneralInformationDrawerOpen(false)}
        data={generalInfo}
      />
      <Wrapper topOffset={topOffset}>
        <Box pt={2} pb={1}>
          <InformationContainer
            title={t('ui.common.generalinfo', 'General Information')}
            canUpdate={canUpdateRtu}
            onClick={() => setIsMetronGeneralInformationDrawerOpen(true)}
            content={<MetronGeneralInformation information={generalInfo} />}
          />
        </Box>
        <Box pt={2} pb={1}>
          <InformationContainer
            title={t('ui.common.notes', 'Notes')}
            canUpdate={false}
            content={<RtuNotes information={rtuNotes} />}
          />
        </Box>
        <Box pt={2} pb={1}>
          <InformationContainer
            title={t('ui.common.configuration', 'Configuration')}
            canUpdate={false}
            content={<Configuration configuration={configuration} />}
          />
        </Box>
        <Box pt={2} pb={1}>
          <InformationContainer
            title={t('ui.common.communication', 'Communication')}
            canUpdate={false}
            content={
              <CommunicationConfigs information={communicationConfigs} />
            }
          />
        </Box>
        <Box pt={2} pb={1}>
          <InformationContainer
            title={t('ui.common.aichannels', 'AI Channels')}
            canUpdate={canUpdateRtu}
            content={
              <AIChannels deviceId={rtuDeviceId} channels={aiChannels} />
            }
            noPaddings
          />
        </Box>
      </Wrapper>
    </>
  );
};
export default ConfigurationTab;
