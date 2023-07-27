import { GeoAreaDto } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = GeoAreaDto;
type ResponseObj = GeoAreaDto;

const saveGeoArea = (request: RequestObj) => {
  return ApiService.GeoAreaService.geoArea_Save(request);
};

export const useSaveGeoArea = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (request: RequestObj) => saveGeoArea(request),
    mutationOptions
  );
};
