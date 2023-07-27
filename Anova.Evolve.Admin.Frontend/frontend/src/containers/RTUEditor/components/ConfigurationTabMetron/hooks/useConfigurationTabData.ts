import useGeneralInformation from './useGeneralInformation';
import useRtuNotes from './useRtuNotes';
import useMetronConfiguration from './useMetronConfiguration';
import useCommunicationConfigs from './useCommunicationConfigs';
import useMetronAIChannelsSummary from './useMetronAIChannelsSummary';

const useConfigurationTabData = (rtuDeviceId: string) => {
  const generalInfo = useGeneralInformation(rtuDeviceId);

  const rtuNotes = useRtuNotes(rtuDeviceId);

  const configuration = useMetronConfiguration(rtuDeviceId);

  const communicationConfigs = useCommunicationConfigs(rtuDeviceId);

  const aiChannels = useMetronAIChannelsSummary(rtuDeviceId);

  return {
    isLoading:
      generalInfo.isLoading ||
      rtuNotes.isLoading ||
      configuration.isLoading ||
      communicationConfigs.isLoading ||
      aiChannels.isLoading,
    isError:
      generalInfo.isError ||
      rtuNotes.isError ||
      configuration.isError ||
      communicationConfigs.isError ||
      aiChannels.isError,
    data: {
      generalInfo: generalInfo.data,
      rtuNotes: rtuNotes.data,
      configuration: configuration.data,
      communicationConfigs: communicationConfigs.data,
      aiChannels: aiChannels.data,
    },
  };
};
export default useConfigurationTabData;
