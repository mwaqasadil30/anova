import { useQuery } from 'react-query';
import { ApiService } from 'api/admin/ApiService';

const useMetronAIChannelConfig = (deviceId: string, channelNumber: string) => {
  return useQuery(
    ['metronRtu_RetrieveMetronAIChannel', deviceId, channelNumber],
    () =>
      ApiService.MetronRtuService.metronRtu_RetrieveMetronAiChannelConfigs(
        deviceId,
        channelNumber
      )
  );
};
export default useMetronAIChannelConfig;
