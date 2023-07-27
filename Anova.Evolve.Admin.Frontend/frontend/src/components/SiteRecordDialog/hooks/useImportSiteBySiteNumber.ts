import { SiteInfoDto } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type Request = string;

type Response = SiteInfoDto;

const importSiteBySiteNumber = (request: Request) => {
  return ApiService.SiteService.site_Import(request);
};

export const useImportSiteBySiteNumber = (
  mutationOptions?: UseMutationOptions<Response, unknown, Request, unknown>
) => {
  return useMutation(
    (request: Request) => importSiteBySiteNumber(request),
    mutationOptions
  );
};
