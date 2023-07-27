import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import Tab from 'components/VerticalTab';
import Tabs from 'components/Tabs';
import Box from '@material-ui/core/Box';
import { useTranslation } from 'react-i18next';
import { MetronAiChannelSummaryItemDto } from 'api/admin/api';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import useMetronAIChannelConfig from '../../hooks/useMetronAIChannelConfig';
import Configuration from './components/ConfigurationConfig';
import ReversePoll from './components/ReversePoll';
// import Points from './components/Points';
import RemoteValueWithSyncMark from '../RemoteValueWithSyncMark';

type AiChannelsProps = {
  deviceId: string;
  channels?: MetronAiChannelSummaryItemDto[];
};

const renderLabelComponent = (tab: MetronAiChannelSummaryItemDto) => {
  return (
    <Grid item>
      <RemoteValueWithSyncMark text={tab.description} status={tab.isInSync} />
    </Grid>
  );
};

const renderChannelTabs = (
  channels: MetronAiChannelSummaryItemDto[] | undefined
) => {
  if (!channels) return [];
  return channels.map((tab: MetronAiChannelSummaryItemDto) => (
    <Tab
      key={`channel-tab-${tab.channelNumber}`}
      label={renderLabelComponent(tab)}
      value={tab.channelNumber}
    />
  ));
};

const getFirstChannelNumber = (
  channels: MetronAiChannelSummaryItemDto[] | undefined
) => {
  if (!channels?.length) return null;

  return channels[0].channelNumber;
};

const AiChannels = ({ channels, deviceId }: AiChannelsProps) => {
  const { t } = useTranslation();
  const [activeChannelValue, setActiveChannelValue] = useState(
    getFirstChannelNumber(channels)
  );

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setActiveChannelValue(newValue);
  };

  const { isLoading, isError, data } = useMetronAIChannelConfig(
    deviceId,
    activeChannelValue || ''
  );

  if (!channels?.length)
    return <>{t('ui.rtumetron.nochannels', 'No channels, please add some.')}</>;

  return (
    <Grid container spacing={2}>
      <Grid item xs={4} md={3} lg={2}>
        <Tabs
          dense
          value={activeChannelValue}
          // @ts-ignore
          onChange={handleTabChange}
          aria-label="metron aichannel tabs"
          borderWidth={0}
          orientation="vertical"
          TabIndicatorProps={{ style: { left: 0 } }}
          style={{ boxShadow: '0px 5px 6px rgba(0, 0, 0, 0.06)' }}
        >
          {renderChannelTabs(channels)}
        </Tabs>
      </Grid>
      <Grid
        item
        xs={8}
        md={9}
        lg={10}
        style={{
          boxShadow: '-7px 0px 6px rgba(0, 0, 0, 0.04)',
          margin: '0 0 8px -8px',
        }}
      >
        <Box padding={2} height="100%" role="tabpanel">
          {isLoading && (
            <Box mt={3} style={{ height: '300px' }}>
              <TransitionLoadingSpinner in />
            </Box>
          )}
          {isError && (
            <Box mt={3} style={{ height: '300px' }}>
              <TransitionErrorMessage in />
            </Box>
          )}
          {data && (
            <Grid item xs={12}>
              <Configuration information={data} />
              <ReversePoll information={data} />
              {/* This component causes Maximum update depth exceeded error
                I will commit it here and try to fix in next commit */}
              {/* <Points information={data} /> */}
            </Grid>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};
export default AiChannels;
