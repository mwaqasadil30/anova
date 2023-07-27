import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const retrieveGeoAreaList = () => {
  return ApiService.GeoAreaService.geoArea_GetList();
};

export const useRetrieveGeoAreaList = () => {
  return useQuery([APIQueryKey.retrieveGeoAreaList], () =>
    retrieveGeoAreaList()
  );
};
