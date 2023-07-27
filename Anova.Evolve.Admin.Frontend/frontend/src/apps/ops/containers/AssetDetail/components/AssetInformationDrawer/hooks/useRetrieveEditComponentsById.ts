import {
  EvolveRetrieveSiteEditComponentsByIdRequest,
  EditSite,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

interface Request {
  site?: EditSite | null;
}

const retrieveSiteEditComponentsById = ({ site }: Request) => {
  if (site && site.siteId) {
    return ApiService.GeneralService.retrieveSiteEditComponentsById_RetrieveSiteEditComponentsById(
      {
        siteId: site.siteId,

        loadEditComponents: false,
      } as EvolveRetrieveSiteEditComponentsByIdRequest
    );
  }
  return null;
};

export const useRetrieveSiteEditComponentsById = (request: Request) => {
  return useQuery([APIQueryKey.retrieveSiteEditComponentsById, request], () =>
    retrieveSiteEditComponentsById(request)
  );
};
