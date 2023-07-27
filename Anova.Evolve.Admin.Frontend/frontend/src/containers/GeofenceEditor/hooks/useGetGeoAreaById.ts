import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';
import { isNumber } from 'utils/format/numbers';

const getGeoAreaById = (id: number) => {
  return ApiService.GeoAreaService.geoArea_Get(id);
};

export const useGetGeoAreaById = (id: number) => {
  return useQuery([APIQueryKey.getGeoAreaById, id], () => getGeoAreaById(id), {
    enabled: isNumber(id),
  });
};
