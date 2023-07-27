import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type Request = number;

const deleteGeofence = (id?: Request) => {
  if (id === undefined || id === null) {
    return null;
  }

  return ApiService.GeoAreaService.geoArea_Delete(id);
};

export const useDeleteGeofence = (
  mutationOptions?: UseMutationOptions<unknown, unknown, Request, unknown>
) => {
  return useMutation(
    // TODO: Figure out why this needs ts-ignore
    // @ts-ignore
    (id: Request) => deleteGeofence(id),
    mutationOptions
  );
};
