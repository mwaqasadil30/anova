import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

interface GetLastKnownLocationRequest {
  dataChannelId?: string;
}

const getLastKnownLocationRequest = ({
  dataChannelId,
}: GetLastKnownLocationRequest) => {
  if (dataChannelId) {
    return ApiService.LocationReadingService.locationReading_GetLastKnownLocation(
      dataChannelId
    );
  }
  return null;
};

export const useGetLastKnownLocation = (
  request: GetLastKnownLocationRequest
) => {
  return useQuery([APIQueryKey.getLastKnownLocation, request], () =>
    getLastKnownLocationRequest(request)
  );
};
