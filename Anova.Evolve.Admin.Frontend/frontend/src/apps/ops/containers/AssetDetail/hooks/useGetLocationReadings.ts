import { GpsLocationReadingsDTO } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery, UseQueryOptions } from 'react-query';

type Response = GpsLocationReadingsDTO | null;

interface GetLocationReadingsRequest {
  dataChannelId?: string;
  startDate?: Date | undefined | null;
  endDate?: Date | undefined | null;
  movementResolutionInMeters?: number | undefined;
}

const getLocationReadings = ({
  dataChannelId,
  startDate,
  endDate,
  movementResolutionInMeters,
}: GetLocationReadingsRequest) => {
  if (dataChannelId && startDate && endDate) {
    return ApiService.LocationReadingService.locationReading_GetLocationReadings(
      dataChannelId,
      startDate,
      endDate,
      movementResolutionInMeters
    );
  }
  return null;
};

export const useGetLocationReadings = (
  request: GetLocationReadingsRequest,
  options?: UseQueryOptions<Response>
) => {
  return useQuery(
    [APIQueryKey.getLocationReadings, request],
    () => getLocationReadings(request),
    {
      enabled: !!request.dataChannelId,
      ...options,
    }
  );
};
