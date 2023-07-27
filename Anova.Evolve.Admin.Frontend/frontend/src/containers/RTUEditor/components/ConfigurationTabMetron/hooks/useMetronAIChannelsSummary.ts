import { useQuery } from 'react-query';
import { ApiService } from 'api/admin/ApiService';

const useMetronAIChannelsSummary = (deviceId: string) => {
  return useQuery(['metronRtu_RetrieveMetronAIChannelsSummary', deviceId], () =>
    ApiService.MetronRtuService.metronRtu_RetrieveMetronAiChannelSummaryList(
      deviceId
    )
  );
};
export default useMetronAIChannelsSummary;
