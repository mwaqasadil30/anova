import { useQuery } from 'react-query';
import { ApiService } from 'api/admin/ApiService';

const useOutgoingSmsInterface = () => {
  return useQuery('hornerRtu_RetrieveOutgoingSmsInterface', () =>
    ApiService.HornerRtuService.hornerRtu_RetrieveOutgoingSmsInterface()
  );
};
export default useOutgoingSmsInterface;
