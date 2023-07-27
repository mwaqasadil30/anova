import useGeneralInformation from './useGeneralInformation';
import useRtuNotes from './useRtuNotes';
import useHornerRtuTimeCorrection from './useHornerRtuTimeCorrection';
import useCommunicationConfigs from './useCommunicationConfigs';
import useHornerRtuAnalogInputChannels from './useHornerRtuAnalogInputChannels';
import useHornerRtuTransactionChannels from './useHornerRtuTransactionChannels';
import useCarriers from './useCarriers';

const useConfigurationTabData = (rtuDeviceId: string) => {
  const generalInfo = useGeneralInformation(rtuDeviceId);

  const rtuNotes = useRtuNotes(rtuDeviceId);

  const rtuTimeCorrection = useHornerRtuTimeCorrection(rtuDeviceId);

  const communicationConfigs = useCommunicationConfigs(rtuDeviceId);

  const rtuAnalogInputChannels = useHornerRtuAnalogInputChannels(rtuDeviceId);

  const rtuTransactionChannels = useHornerRtuTransactionChannels({
    deviceId: rtuDeviceId,
  });

  const rtuCarriers = useCarriers();

  return {
    isLoading:
      generalInfo.isLoading ||
      rtuNotes.isLoading ||
      rtuTimeCorrection.isLoading ||
      communicationConfigs.isLoading ||
      rtuAnalogInputChannels.isLoading ||
      rtuTransactionChannels.isLoading ||
      rtuCarriers.isLoading,
    isError:
      generalInfo.isError ||
      rtuNotes.isError ||
      rtuTimeCorrection.isError ||
      communicationConfigs.isError ||
      rtuAnalogInputChannels.isError ||
      rtuTransactionChannels.isError ||
      rtuCarriers.isError,
    data: {
      generalInfo: generalInfo.data,
      rtuNotes: rtuNotes.data,
      rtuTimeCorrection: rtuTimeCorrection.data,
      communicationConfigs: communicationConfigs.data,
      rtuAnalogInputChannels: rtuAnalogInputChannels.data,
      rtuTransactionChannels: rtuTransactionChannels.data,
      rtuCarriers: rtuCarriers.data,
    },
  };
};
export default useConfigurationTabData;
