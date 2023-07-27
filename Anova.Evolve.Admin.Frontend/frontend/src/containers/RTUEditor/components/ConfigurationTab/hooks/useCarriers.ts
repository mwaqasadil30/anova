import { useQuery } from 'react-query';
import { ApiService } from 'api/admin/ApiService';

const useCarriers = () => {
  return useQuery('hornerRtu_RetrieveCarriers', () =>
    ApiService.HornerRtuService.hornerRtu_RetrieveCarriers()
  );
};
export default useCarriers;
