import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

interface RetrieveSiteDetailsRequest {
  siteId: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

const retrieveSiteDetails = ({
  siteId,
  startDate,
  endDate,
}: RetrieveSiteDetailsRequest) => {
  return ApiService.FreezerSiteService.freezerSite_GetSiteDetailById(
    siteId,
    startDate,
    endDate
  );
};

export const useRetrieveSiteDetails = (request: RetrieveSiteDetailsRequest) => {
  return useQuery([APIQueryKey.retrieveSiteDetails, request], () =>
    retrieveSiteDetails(request)
  );
};
